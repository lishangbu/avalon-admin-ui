import { tryOnMounted } from '@vueuse/core'
import { computed, reactive, ref } from 'vue'

import { replaceModel, toCrudModel } from '@/components/crud/shared'
import { useQuery } from '@/composables/request/useQuery'

import type { CrudRecord } from '@/components/crud'

export interface UseCrudPageDataOptions<TRecord extends CrudRecord, TSearch extends object> {
  createSearchModel: () => TSearch
  initialize?: () => Promise<void>
  loadPage: (pageRequest: PageRequest<TSearch>) => Promise<ApiResult<Page<TRecord>>>
}

function createEmptyPage<T>(): Page<T> {
  return {
    rows: [],
    totalPageCount: 0,
    totalRowCount: 0,
  }
}

export function useCrudPageData<TRecord extends CrudRecord, TSearch extends object>(
  options: UseCrudPageDataOptions<TRecord, TSearch>,
) {
  const searchExpanded = ref(false)
  const searchModel = reactive(options.createSearchModel()) as TSearch
  const pagination = reactive({
    page: 1,
    size: 10,
  })
  const emptyPage = createEmptyPage<TRecord>()

  const pageQuery = useQuery<Page<TRecord>>({
    immediate: false,
    initialData: emptyPage,
    query: async () => {
      const response = await options.loadPage({
        page: pagination.page,
        query: searchModel as TSearch,
        size: pagination.size,
      })

      return response.data
    },
  })

  async function initialize() {
    await Promise.all([options.initialize?.() ?? Promise.resolve(), pageQuery.refresh()])
  }

  function refreshData() {
    return pageQuery.refresh()
  }

  function handleSearch() {
    pagination.page = 1
    void refreshData()
  }

  function handleReset() {
    replaceModel(toCrudModel(searchModel), options.createSearchModel())
    pagination.page = 1
    void refreshData()
  }

  function handlePageChange(page: number) {
    pagination.page = page
    void refreshData()
  }

  function handlePageSizeChange(pageSize: number) {
    pagination.page = 1
    pagination.size = pageSize
    void refreshData()
  }

  tryOnMounted(() => {
    void initialize()
  })

  return {
    handlePageChange,
    handlePageSizeChange,
    handleReset,
    handleSearch,
    loading: pageQuery.loading,
    pageData: computed(() => pageQuery.data.value ?? emptyPage),
    pagination,
    refreshData,
    searchExpanded,
    searchModel,
  }
}
