import { axiosInstance } from '@/utils/request'

import type { Type, TypeQuery } from '@/types/modules/dataset/type'

/**
 * 获取属性分页数据
 *
 * 发起 GET 请求获取属性（Type）的分页数据
 *
 * @param {TypeQuery} query - 查询参数，用于分页与筛选
 * @returns {Promise<ApiResult<Page<Type>>>} - 后端返回的分页数据包装在 ApiResult 中
 */
export async function getTypePage(query: TypeQuery): Promise<ApiResult<Page<Type>>> {
  return axiosInstance.request({
    url: '/type/page',
    method: 'GET',
    params: query
  })
}

/**
 * 新增属性
 *
 * 发起 POST 请求新增属性（Type）
 *
 * @param {Partial<Type>} data - 新增的属性数据
 * @returns {Promise<ApiResult<Type>>} - 新增后的属性数据包装在 ApiResult 中
 */
export async function createType(data: Partial<Type>): Promise<ApiResult<Type>> {
  return axiosInstance.request({
    url: '/type',
    method: 'POST',
    data
  })
}

/**
 * 修改属性
 *
 * 发起 PUT 请求修改属性（Type）
 *
 * @param {Partial<Type>} data - 修改的属性数据，需包含主键
 * @returns {Promise<ApiResult<Type>>} - 修改后的属性数据包装在 ApiResult 中
 */
export async function updateType(data: Partial<Type>): Promise<ApiResult<Type>> {
  return axiosInstance.request({
    url: '/type',
    method: 'PUT',
    data
  })
}

/**
 * 删除属性
 *
 * 发起 DELETE 请求删除属性（Type）
 *
 * @param {string | number} id - 要删除的属性主键
 * @returns {Promise<ApiResult<void>>} - 删除操作结果
 */
export async function removeType(id: string | number): Promise<ApiResult<void>> {
  return axiosInstance.request({
    url: `/type/${id}`,
    method: 'DELETE'
  })
}
