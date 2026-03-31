import { describe, expect, it, vi } from 'vitest'

import { getPokemonPage } from './pokemon'

const request = vi.fn()

vi.mock('@/utils/request', () => ({
  request: (...args: unknown[]) => request(...args),
  default: (...args: unknown[]) => request(...args),
}))

describe('getPokemonPage', () => {
  it('parses nested pokemon species relation data', async () => {
    request.mockResolvedValueOnce({
      data: {
        rows: [
          {
            id: '1',
            internalName: 'bulbasaur',
            name: 'bulbasaur',
            height: 7,
            weight: 69,
            baseExperience: 64,
            sortingOrder: 1,
            pokemonSpecies: {
              id: '1',
              internalName: 'bulbasaur',
              name: '妙蛙种子',
              sortingOrder: 1,
            },
          },
        ],
        totalRowCount: 1,
        totalPageCount: 1,
      },
    })

    const result = await getPokemonPage({ page: 1, size: 10, query: {} })

    expect(result.data.rows).toEqual([
      {
        id: '1',
        internalName: 'bulbasaur',
        name: 'bulbasaur',
        height: 7,
        weight: 69,
        baseExperience: 64,
        sortingOrder: 1,
        pokemonSpecies: {
          id: '1',
          internalName: 'bulbasaur',
          name: '妙蛙种子',
          sortingOrder: 1,
        },
      },
    ])
  })
})
