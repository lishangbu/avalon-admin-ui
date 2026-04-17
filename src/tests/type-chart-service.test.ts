import { beforeEach, expect, test, vi } from 'vitest'

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}))

vi.mock('@/shared/api/http', () => ({
  request: requestMock,
}))

import {
  buildTypeEffectivenessMatrixPayload,
  calculateTypeEffectiveness,
  getTypeEffectivenessChart,
} from '@/pages/catalog/type-chart/service'

beforeEach(() => {
  requestMock.mockReset()
})

test('type chart is loaded from /type-chart and normalized to the page view model', async () => {
  requestMock.mockResolvedValue({
    types: [
      {
        id: 'fire-id',
        code: 'FIRE',
        name: '火',
        description: '火属性',
        icon: 'fire',
        sortingOrder: 10,
        enabled: true,
        version: 0,
      },
      {
        id: 'water-id',
        code: 'WATER',
        name: '水',
        description: '水属性',
        icon: 'water',
        sortingOrder: 20,
        enabled: true,
        version: 0,
      },
    ],
    entries: [
      {
        attackingType: { id: 'fire-id', code: 'FIRE', name: '火' },
        defendingType: { id: 'fire-id', code: 'FIRE', name: '火' },
        multiplier: 1,
      },
      {
        attackingType: { id: 'fire-id', code: 'FIRE', name: '火' },
        defendingType: { id: 'water-id', code: 'WATER', name: '水' },
        multiplier: 0.5,
      },
      {
        attackingType: { id: 'water-id', code: 'WATER', name: '水' },
        defendingType: { id: 'fire-id', code: 'FIRE', name: '火' },
        multiplier: 2,
      },
      {
        attackingType: { id: 'water-id', code: 'WATER', name: '水' },
        defendingType: { id: 'water-id', code: 'WATER', name: '水' },
        multiplier: 1,
      },
    ],
  })

  const chart = await getTypeEffectivenessChart()

  expect(requestMock).toHaveBeenCalledWith({
    url: '/catalog/type-chart',
    method: 'GET',
  })
  expect(chart.supportedTypes).toEqual([
    expect.objectContaining({
      id: 'fire-id',
      internalName: 'FIRE',
      name: '火',
    }),
    expect.objectContaining({
      id: 'water-id',
      internalName: 'WATER',
      name: '水',
    }),
  ])
  expect(chart.completeness).toEqual({
    expectedPairs: 4,
    configuredPairs: 4,
    missingPairs: 0,
  })
  expect(chart.rows[0]?.cells[1]?.multiplier).toBe(0.5)
})

test('type chart helpers calculate matchups and build the full matrix payload', async () => {
  const chart = {
    supportedTypes: [
      { id: 'fire-id', internalName: 'FIRE', name: '火' },
      { id: 'water-id', internalName: 'WATER', name: '水' },
    ],
    completeness: {
      expectedPairs: 4,
      configuredPairs: 4,
      missingPairs: 0,
    },
    rows: [
      {
        attackingType: { id: 'fire-id', internalName: 'FIRE', name: '火' },
        cells: [
          {
            defendingType: {
              id: 'fire-id',
              internalName: 'FIRE',
              name: '火',
            },
            multiplier: 1,
            status: 'configured' as const,
          },
          {
            defendingType: {
              id: 'water-id',
              internalName: 'WATER',
              name: '水',
            },
            multiplier: 0.5,
            status: 'configured' as const,
          },
        ],
      },
      {
        attackingType: { id: 'water-id', internalName: 'WATER', name: '水' },
        cells: [
          {
            defendingType: {
              id: 'fire-id',
              internalName: 'FIRE',
              name: '火',
            },
            multiplier: 2,
            status: 'configured' as const,
          },
          {
            defendingType: {
              id: 'water-id',
              internalName: 'WATER',
              name: '水',
            },
            multiplier: 1,
            status: 'configured' as const,
          },
        ],
      },
    ],
  }

  const result = calculateTypeEffectiveness(chart, 'WATER', ['FIRE'])
  const payload = buildTypeEffectivenessMatrixPayload(chart, {
    'FIRE::FIRE': 1,
    'FIRE::WATER': 0.5,
    'WATER::FIRE': 2,
    'WATER::WATER': 1,
  })

  expect(result).toEqual(
    expect.objectContaining({
      finalMultiplier: 2,
      status: 'complete',
      effectiveness: 'super-effective',
    }),
  )
  expect(payload).toEqual({
    entries: [
      {
        attackingTypeId: 'fire-id',
        defendingTypeId: 'fire-id',
        multiplier: 1,
      },
      {
        attackingTypeId: 'fire-id',
        defendingTypeId: 'water-id',
        multiplier: 0.5,
      },
      {
        attackingTypeId: 'water-id',
        defendingTypeId: 'fire-id',
        multiplier: 2,
      },
      {
        attackingTypeId: 'water-id',
        defendingTypeId: 'water-id',
        multiplier: 1,
      },
    ],
  })
})
