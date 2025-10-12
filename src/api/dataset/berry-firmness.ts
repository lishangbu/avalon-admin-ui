import { axiosInstance } from '@/utils/request'

import type { BerryFirmness, BerryFirmnessQuery } from '@/types/modules/dataset/berry-firmness'

/**
 * 获取树果硬度分页数据
 *
 * 发起 GET 请求获取树果硬度（BerryFirmness）的分页数据
 *
 * @param {BerryFirmnessQuery} query - 查询参数，用于分页与筛选
 * @returns {Promise<ApiResult<Page<BerryFirmness>>>} - 后端返回的分页数据包装在 ApiResult 中
 */
export async function getBerryFirmnessPage(query: BerryFirmnessQuery): Promise<ApiResult<Page<BerryFirmness>>> {
  return axiosInstance.request({
    url: '/berry-firmness/page',
    method: 'GET',
    params: query
  })
}

/**
 * 新增树果硬度
 *
 * 发起 POST 请求新增树果硬度（BerryFirmness）
 *
 * @param {Partial<BerryFirmness>} data - 新增的树果硬度数据
 * @returns {Promise<ApiResult<BerryFirmness>>} - 新增后的树果硬度数据包装在 ApiResult 中
 */
export async function createBerryFirmness(data: Partial<BerryFirmness>): Promise<ApiResult<BerryFirmness>> {
  return axiosInstance.request({
    url: '/berry-firmness',
    method: 'POST',
    data
  })
}

/**
 * 修改树果硬度
 *
 * 发起 PUT 请求修改树果硬度（BerryFirmness）
 *
 * @param {Partial<BerryFirmness>} data - 修改的树果硬度数据，需包含主键
 * @returns {Promise<ApiResult<BerryFirmness>>} - 修改后的树果硬度数据包装在 ApiResult 中
 */
export async function updateBerryFirmness(data: Partial<BerryFirmness>): Promise<ApiResult<BerryFirmness>> {
  return axiosInstance.request({
    url: '/berry-firmness',
    method: 'PUT',
    data
  })
}

/**
 * 删除树果硬度
 *
 * 发起 DELETE 请求删除树果硬度（BerryFirmness）
 *
 * @param {string | number} id - 要删除的树果硬度主键
 * @returns {Promise<ApiResult<void>>} - 删除操作结果
 */
export async function removeBerryFirmness(id: string | number): Promise<ApiResult<void>> {
  return axiosInstance.request({
    url: `/berry-firmness/${id}`,
    method: 'DELETE'
  })
}

/**
 * 获取树果硬度列表数据（不分页）
 *
 * 发起 GET 请求获取所有树果硬度（BerryFirmness）列表数据
 *
 * @param {Partial<BerryFirmness>} query - 查询参数，用于筛选
 * @returns {Promise<ApiResult<BerryFirmness[]>>} - 后端返回的树果硬度列表包装在 ApiResult 中
 */
export async function listBerryFirmness(query?: Partial<BerryFirmness>): Promise<ApiResult<BerryFirmness[]>> {
  return axiosInstance.request({
    url: '/berry-firmness/list',
    method: 'GET',
    params: query
  })
}
