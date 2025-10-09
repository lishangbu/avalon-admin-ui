import { axiosInstance } from '@/utils/request'
import type { Berry, BerryQuery } from '@/types/modules/dataset/berry'

/**
 * 获取树果分页数据
 *
 * 发起 GET 请求获取树果（Berry）的分页数据
 *
 * @param {BerryQuery} query - 查询参数，用于分页与筛选
 * @returns {Promise<ApiResult<Page<Berry>>>} - 后端返回的分页数据包装在 ApiResult 中
 */
export async function getBerryPage(query: BerryQuery): Promise<ApiResult<Page<Berry>>> {
  return axiosInstance.request({
    url: '/berry/page',
    method: 'GET',
    params: query
  })
}

/**
 * 新增树果
 *
 * 发起 POST 请求新增树果（Berry）
 *
 * @param {Partial<Berry>} data - 新增的树果数据
 * @returns {Promise<ApiResult<Berry>>} - 新增后的树果数据包装在 ApiResult 中
 */
export async function createBerry(data: Partial<Berry>): Promise<ApiResult<Berry>> {
  return axiosInstance.request({
    url: '/berry',
    method: 'POST',
    data
  })
}

/**
 * 修改树果
 *
 * 发起 PUT 请求修改树果（Berry）
 *
 * @param {Partial<Berry>} data - 修改的树果数据，需包含主键
 * @returns {Promise<ApiResult<Berry>>} - 修改后的树果数据包装在 ApiResult 中
 */
export async function updateBerry(data: Partial<Berry>): Promise<ApiResult<Berry>> {
  return axiosInstance.request({
    url: '/berry',
    method: 'PUT',
    data
  })
}

/**
 * 删除树果
 *
 * 发起 DELETE 请求删除树果（Berry）
 *
 * @param {string | number} id - 要删除的树果主键
 * @returns {Promise<ApiResult<void>>} - 删除操作结果
 */
export async function removeBerry(id: string | number): Promise<ApiResult<void>> {
  return axiosInstance.request({
    url: `/berry/${id}`,
    method: 'DELETE'
  })
}

