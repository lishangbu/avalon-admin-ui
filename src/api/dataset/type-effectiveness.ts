import request from '@/utils/request'

export async function calculateTypeEffectiveness(attacking: string, defending: string[]) {
  return request<TypeEffectivenessResult>({
    url: '/type-effectiveness',
    method: 'GET',
    params: {
      attacking,
      defending,
    },
    paramsSerializer: {
      indexes: null,
    },
  })
}

export async function getTypeEffectivenessChart() {
  return request<TypeEffectivenessChart>({
    url: '/type-effectiveness/chart',
    method: 'GET',
  })
}

export async function upsertTypeEffectivenessMatrix(payload: UpsertTypeEffectivenessMatrixCommand) {
  return request<TypeEffectivenessChart>({
    url: '/type-effectiveness/matrix',
    method: 'PUT',
    data: payload,
  })
}
