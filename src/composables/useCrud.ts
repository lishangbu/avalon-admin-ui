import { type PaginationProps } from 'naive-ui'
import { reactive, ref, watch } from 'vue'

import { useDiscreteApi } from '@/composables/useDiscreteApi'

const { message } = useDiscreteApi()

/**
 * 通用 CRUD 组合式函数
 * @template T 实体类型
 * @param options 配置项
 * @returns CRUD 相关响应式数据和方法
 */
export function useCrud<T>(options: {
  /** 分页请求方法，返回 Page<T> */
  page?: (params: PageRequest) => Promise<ApiResult<Page<T>>>
  /** 新增方法 */
  create?: (data: Partial<T>) => Promise<any>
  /** 更新方法 */
  update?: (data: Partial<T>) => Promise<any>
  /** 删除方法 */
  remove?: (id: string | number) => Promise<any>
  /** 默认分页大小 */
  defaultPageSize?: number
  /** 默认查询参数 */
  defaultQuery?: Record<string, any>
}) {
  /** 表格数据 */
  const data = ref<T[]>([])
  /** 总条数 */
  const total = ref(0)
  /** 加载状态 */
  const loading = ref(false)
  /** 查询参数 */
  const query = reactive({ ...(options.defaultQuery || {}) })

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    page: 1,
    pageSize: options.defaultPageSize || 10,
    showSizePicker: true,
    pageSizes: [10, 20, 50, 100, 200, 500],
    showQuickJumper: false,
    showQuickJumpDropdown: true,
    pageCount: 1,
    itemCount: undefined,
    prefix({ itemCount }) {
      return `共 ${itemCount} 条`
    },
    onUpdatePage: (page: number) => {
      pagination.page = page
      void fetchPage()
    },
    onUpdatePageSize: (pageSize: number) => {
      pagination.pageSize = pageSize
      pagination.page = 1
      void fetchPage()
    },
  })

  // 保证 itemCount 响应 total
  watch(total, (val) => {
    pagination.itemCount = val
  })

  // 监听查询参数变化，自动重新获取数据
  watch(
    () => ({ ...query }),
    () => {
      pagination.page = 1
      void fetchPage()
    },
    { deep: true },
  )

  /**
   * 获取分页数据
   */
  async function fetchPage() {
    if (!options.page) return
    loading.value = true
    try {
      const page = (pagination.page ?? 1) - 1
      const size = pagination.pageSize ?? 10
      const res = await options.page({
        page,
        size,
        ...query,
      })
      data.value = res?.data?.content ?? []
      pagination.pageCount = Number(res?.data?.totalPages ?? 0)
      total.value = Number(res?.data?.totalElements ?? 0)
    } finally {
      loading.value = false
    }
  }

  // 当外部分页组件通过 v-model 修改 page 或 pageSize 时，确保触发数据请求
  watch(
    () => [pagination.page, pagination.pageSize],
    () => {
      void fetchPage()
    },
  )

  /**
   * 新增
   * @param item 新增项
   */
  async function create(item: Partial<T>) {
    if (!options.create) return
    await options.create(item)
    message.success('新增成功')
  }

  /**
   * 更新
   * @param item 更新项
   */
  async function update(item: Partial<T>) {
    if (!options.update) return
    await options.update(item)
    message.success('更新成功')
  }

  /**
   * 删除
   * @param id 主键
   */
  async function remove(id: string | number) {
    if (!options.remove) return
    await options.remove(id)
    message.success('删除成功')
  }

  // 初始化加载
  void fetchPage()

  return {
    data,
    total,
    loading,
    query,
    pagination,
    fetchPage,
    create,
    update,
    remove,
  }
}
