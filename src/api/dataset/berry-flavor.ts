import { axiosInstance } from '@/utils/request'
import type { BerryFlavor, BerryFlavorQuery } from '@/types/modules/dataset/berry-flavor'

/**
 * 获取树果风味分页数据
 *
 * 发起 GET 请求获取树果风味（BerryFlavor）的分页数据
 *
 * @param {BerryFlavorQuery} query - 查询参数，用于分页与筛选
 * @returns {Promise<ApiResult<Page<BerryFlavor>>>} - 后端返回的分页数据包装在 ApiResult 中
 */
export async function getBerryFlavorPage(query: BerryFlavorQuery): Promise<ApiResult<Page<BerryFlavor>>> {
  return axiosInstance.request({
    url: '/berry-flavor/page',
    method: 'GET',
    params: query
  })
}

/**
 * 新增树果风味
 *
 * 发起 POST 请求新增树果风味（BerryFlavor）
 *
 * @param {Partial<BerryFlavor>} data - 新增的树果风味数据
 * @returns {Promise<ApiResult<BerryFlavor>>} - 新增后的树果风味数据包装在 ApiResult 中
 */
export async function createBerryFlavor(data: Partial<BerryFlavor>): Promise<ApiResult<BerryFlavor>> {
  return axiosInstance.request({
    url: '/berry-flavor',
    method: 'POST',
    data
  })
}

/**
 * 修改树果风味
 *
 * 发起 PUT 请求修改树果风味（BerryFlavor）
 *
 * @param {Partial<BerryFlavor>} data - 修改的树果风味数据，需包含主键
 * @returns {Promise<ApiResult<BerryFlavor>>} - 修改后的树果风味数据包装在 ApiResult 中
 */
export async function updateBerryFlavor(data: Partial<BerryFlavor>): Promise<ApiResult<BerryFlavor>> {
  return axiosInstance.request({
    url: '/berry-flavor',
    method: 'PUT',
    data
  })
}

/**
 * 删除树果风味
 *
 * 发起 DELETE 请求删除树果风味（BerryFlavor）
 *
 * @param {string | number} id - 要删除的树果风味主键
 * @returns {Promise<ApiResult<void>>} - 删除操作结果
 */
export async function removeBerryFlavor(id: string | number): Promise<ApiResult<void>> {
  return axiosInstance.request({
    url: `/berry-flavor/${id}`,
    method: 'DELETE'
  })
}

