import { describe, expect, it, vi } from 'vitest'

import { getPokemonEvolutionPage } from './pokemon-evolution'

const request = vi.fn()

vi.mock('@/utils/request', () => ({
  request: (...args: unknown[]) => request(...args),
  default: (...args: unknown[]) => request(...args),
}))

describe('getPokemonEvolutionPage', () => {
  it('parses nested evolution relations and scalar fields', async () => {
    request.mockResolvedValueOnce({
      data: {
        rows: [
          {
            id: '1',
            branchSortOrder: 1,
            detailSortOrder: 1,
            needsMultiplayer: false,
            needsOverworldRain: false,
            turnUpsideDown: false,
            timeOfDay: null,
            minLevel: 16,
            evolutionChain: {
              id: '1',
            },
            fromPokemonSpecies: {
              id: '1',
              internalName: 'bulbasaur',
              name: '妙蛙种子',
            },
            toPokemonSpecies: {
              id: '2',
              internalName: 'ivysaur',
              name: '妙蛙草',
            },
            trigger: {
              id: '1',
              internalName: 'level-up',
              name: 'Level up',
            },
          },
        ],
        totalRowCount: 1,
        totalPageCount: 1,
      },
    })

    const result = await getPokemonEvolutionPage({ page: 1, size: 10, query: {} })

    expect(result.data.rows).toEqual([
      {
        id: '1',
        branchSortOrder: 1,
        detailSortOrder: 1,
        needsMultiplayer: false,
        needsOverworldRain: false,
        turnUpsideDown: false,
        timeOfDay: null,
        minLevel: 16,
        evolutionChain: {
          id: '1',
        },
        fromPokemonSpecies: {
          id: '1',
          internalName: 'bulbasaur',
          name: '妙蛙种子',
        },
        toPokemonSpecies: {
          id: '2',
          internalName: 'ivysaur',
          name: '妙蛙草',
        },
        trigger: {
          id: '1',
          internalName: 'level-up',
          name: 'Level up',
        },
      },
    ])
  })
})
