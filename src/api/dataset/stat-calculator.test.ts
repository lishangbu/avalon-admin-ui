import { describe, expect, it, vi } from 'vitest'

import { calculateStats, getCreaturePreset } from './stat-calculator'

const request = vi.fn()

vi.mock('@/utils/request', () => ({
  request: (...args: unknown[]) => request(...args),
  default: (...args: unknown[]) => request(...args),
}))

describe('getCreaturePreset', () => {
  it('requests creature preset by creature id', async () => {
    request.mockResolvedValueOnce({
      data: {
        creatureId: '1',
        creatureInternalName: 'bulbasaur',
        creatureName: '妙蛙种子',
        stats: [
          {
            statId: '1',
            statInternalName: 'hp',
            statName: 'HP',
            baseStat: 45,
            effortYield: 0,
          },
        ],
      },
    })

    const result = await getCreaturePreset('1')

    expect(request).toHaveBeenCalledWith({
      url: '/stat-calculator/preset',
      method: 'GET',
      params: {
        creatureId: '1',
      },
    })
    expect(result.data.stats[0]?.baseStat).toBe(45)
  })
})

describe('calculateStats', () => {
  it('posts stat calculator payload', async () => {
    request.mockResolvedValueOnce({
      data: {
        level: 50,
        totalEv: 252,
        nature: null,
        stats: [],
      },
    })

    await calculateStats({
      level: 50,
      natureId: 1,
      stats: [
        {
          statId: 2,
          baseStat: 49,
          iv: 31,
          ev: 252,
        },
      ],
    })

    expect(request).toHaveBeenCalledWith({
      url: '/stat-calculator/calculate',
      method: 'POST',
      data: {
        level: 50,
        natureId: 1,
        stats: [
          {
            statId: 2,
            baseStat: 49,
            iv: 31,
            ev: 252,
          },
        ],
      },
    })
  })
})
