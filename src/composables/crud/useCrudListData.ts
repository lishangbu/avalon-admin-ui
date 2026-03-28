import { tryOnMounted } from '@vueuse/core'
import { computed, reactive, ref } from 'vue'

import { replaceModel } from '@/components/crud/shared'
import { useQuery } from '@/composables/request/useQuery'

export interface UseCrudListDataOptions<TRecord extends object, TSearch extends object> {
  createSearchModel: () => TSearch
  initialize?: () => Promise<void>
  loadList: (query: TSearch) => Promise<ApiResult<TRecord[]>>
}

export function useCrudListData<TRecord extends object, TSearch extends object>(
  options: UseCrudListDataOptions<TRecord, TSearch>,
) {
  const searchExpanded = ref(false)
  const searchModel = reactive(options.createSearchModel()) as TSearch

  const listQuery = useQuery<TRecord[]>({
    immediate: false,
    initialData: [],
    query: async () => {
      const response = await options.loadList(searchModel as TSearch)
      return response.data
    },
  })

  async function initialize() {
    await Promise.all([options.initialize?.() ?? Promise.resolve(), listQuery.refresh()])
  }

  function refreshData() {
    return listQuery.refresh()
  }

  function handleSearch() {
    void refreshData()
  }

  function handleReset() {
    replaceModel(searchModel as object, options.createSearchModel())
    void refreshData()
  }

  tryOnMounted(() => {
    void initialize()
  })

  return {
    handleReset,
    handleSearch,
    listData: computed(() => listQuery.data.value ?? []),
    loading: listQuery.loading,
    refreshData,
    searchExpanded,
    searchModel,
  }
}
