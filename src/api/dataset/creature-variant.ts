import { buildScopedPageParams } from '@/api/shared'
import request from '@/utils/request'

export async function getCreatureVariantPage(pageRequest: PageRequest<CreatureVariantQuery>) {
  return request<Page<CreatureVariant>>({
    url: '/creature-variants/page',
    method: 'GET',
    params: buildScopedPageParams('creatureVariant', pageRequest),
  })
}

export async function createCreatureVariant(payload: CreatureVariantFormModel) {
  return request<CreatureVariant>({
    url: '/creature-variants',
    method: 'POST',
    data: payload,
  })
}

export async function updateCreatureVariant(payload: CreatureVariantFormModel) {
  return request<CreatureVariant>({
    url: '/creature-variants',
    method: 'PUT',
    data: payload,
  })
}

export async function deleteCreatureVariant(id: Id) {
  return request<void>({
    url: `/creature-variants/${id}`,
    method: 'DELETE',
  })
}
