import type { StatRecord } from '@/pages/dataset/stat/service'
import { request } from '@/shared/api/http'

export type StatCalculatorCreatureStatPreset = {
  statId: string
  statInternalName: string
  statName: string
  baseStat: number
  effortYield: number
}

export type StatCalculatorCreaturePreset = {
  creatureId: string
  creatureInternalName: string
  creatureName: string
  creatureSpeciesId?: string | null
  creatureSpeciesInternalName?: string | null
  creatureSpeciesName?: string | null
  stats: StatCalculatorCreatureStatPreset[]
}

export type StatCalculatorEntryRequest = {
  statId: number
  baseStat: number
  iv: number
  ev: number
}

export type StatCalculatorRequest = {
  level: number
  natureId?: number | null
  stats: StatCalculatorEntryRequest[]
}

export type StatCalculatorNatureView = {
  id: string
  internalName: string
  name: string
  increasedStatId?: string | null
  increasedStatInternalName?: string | null
  increasedStatName?: string | null
  decreasedStatId?: string | null
  decreasedStatInternalName?: string | null
  decreasedStatName?: string | null
}

export type StatCalculatorEntryResultView = {
  statId: string
  statInternalName: string
  statName: string
  baseStat: number
  iv: number
  ev: number
  actualValue: number
  minimumValue: number
  maximumValue: number
  natureModifier: number
}

export type StatCalculatorResultView = {
  level: number
  totalEv: number
  nature?: StatCalculatorNatureView | null
  stats: StatCalculatorEntryResultView[]
}

export async function listCoreStats() {
  return request<StatRecord[]>({
    url: '/stat/core-list',
    method: 'GET',
  })
}

export async function getCreaturePreset(creatureId: string) {
  return request<StatCalculatorCreaturePreset>({
    url: '/stat-calculator/preset',
    method: 'GET',
    params: {
      creatureId,
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
