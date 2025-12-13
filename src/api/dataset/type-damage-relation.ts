import { axiosInstance } from '@/utils/request'

import type { TypeDamageRelation, TypeDamageRelationQuery } from '@/types/modules/dataset/type-damage-relation'

/**
 * 获取属性伤害关系分页数据
 */
export async function getTypeDamageRelationPage(query: TypeDamageRelationQuery): Promise<ApiResult<Page<TypeDamageRelation>>> {
  return axiosInstance.request({
    url: '/type-damage-relation/page',
    method: 'GET',
    params: query,
  })
}

/**
 * 新增属性伤害关系
 */
export async function createTypeDamageRelation(data: Partial<TypeDamageRelation>): Promise<ApiResult<TypeDamageRelation>> {
  return axiosInstance.request({
    url: '/type-damage-relation',
    method: 'POST',
    data,
  })
}

/**
 * 修改属性伤害关系
 */
export async function updateTypeDamageRelation(data: Partial<TypeDamageRelation>): Promise<ApiResult<TypeDamageRelation>> {
  return axiosInstance.request({
    url: '/type-damage-relation',
    method: 'PUT',
    data,
  })
}

/**
 * 删除属性伤害关系
 */
export async function removeTypeDamageRelation(id: string | number): Promise<ApiResult<void>> {
  return axiosInstance.request({
    url: `/type-damage-relation/${id}`,
    method: 'DELETE',
  })
}

