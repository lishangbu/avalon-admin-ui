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
