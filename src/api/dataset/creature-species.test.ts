import { describe, expect, it, vi } from 'vitest'

import { getCreatureSpeciesPage } from './creature-species'

const request = vi.fn()

vi.mock('@/utils/request', () => ({
  request: (...args: unknown[]) => request(...args),
  default: (...args: unknown[]) => request(...args),
}))

describe('getCreatureSpeciesPage', () => {
  it('parses nested relation and boolean data', async () => {
    request.mockResolvedValueOnce({
      data: {
        rows: [
          {
            id: '1',
            internalName: 'bulbasaur',
            name: '妙蛙种子',
            sortingOrder: 1,
            genderRate: 1,
            captureRate: 45,
            baseHappiness: 70,
            baby: false,
            legendary: false,
            mythical: false,
            hatchCounter: 20,
            hasGenderDifferences: false,
            formsSwitchable: false,
            evolvesFromSpeciesId: null,
            evolutionChainId: '1',
            growthRate: {
              id: '4',
              internalName: 'medium-slow',
              name: '较慢',
            },
            creatureColor: {
              id: '5',
              internalName: 'green',
              name: '绿色',
            },
            creatureHabitat: {
              id: '3',
              internalName: 'grassland',
              name: 'grassland',
            },
            creatureShape: {
              id: '8',
              internalName: 'quadruped',
              name: 'Quadruped',
            },
          },
        ],
        totalRowCount: 1,
        totalPageCount: 1,
      },
    })

    const result = await getCreatureSpeciesPage({ page: 1, size: 10, query: {} })

    expect(result.data.rows).toEqual([
      {
        id: '1',
        internalName: 'bulbasaur',
        name: '妙蛙种子',
        sortingOrder: 1,
        genderRate: 1,
        captureRate: 45,
        baseHappiness: 70,
        baby: false,
        legendary: false,
        mythical: false,
        hatchCounter: 20,
        hasGenderDifferences: false,
        formsSwitchable: false,
        evolvesFromSpeciesId: null,
        evolutionChainId: '1',
        growthRate: {
          id: '4',
          internalName: 'medium-slow',
          name: '较慢',
        },
        creatureColor: {
          id: '5',
          internalName: 'green',
          name: '绿色',
        },
        creatureHabitat: {
          id: '3',
          internalName: 'grassland',
          name: 'grassland',
        },
        creatureShape: {
          id: '8',
          internalName: 'quadruped',
          name: 'Quadruped',
        },
      },
    ])
  })
})
