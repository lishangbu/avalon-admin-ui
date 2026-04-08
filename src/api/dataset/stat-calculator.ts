import request from '@/utils/request'

export async function getCreaturePreset(creatureId: Id) {
  return request<StatCalculatorCreaturePreset>({
    url: '/stat-calculator/preset',
    method: 'GET',
    params: {
      creatureId: String(creatureId),
    },
  })
}

export async function calculateStats(payload: StatCalculatorRequest) {
  return request<StatCalculatorResultView>({
    url: '/stat-calculator/calculate',
    method: 'POST',
    data: payload,
  })
}
