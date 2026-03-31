import { describe, expect, it, vi } from 'vitest'

import { getPokemonFormPage } from './pokemon-form'

const request = vi.fn()

vi.mock('@/utils/request', () => ({
  request: (...args: unknown[]) => request(...args),
  default: (...args: unknown[]) => request(...args),
}))

describe('getPokemonFormPage', () => {
  it('parses boolean and nested pokemon data', async () => {
    request.mockResolvedValueOnce({
      data: {
        rows: [
          {
            id: '1',
            internalName: 'bulbasaur',
            name: 'bulbasaur',
            formName: null,
            formOrder: 1,
            sortingOrder: 1,
            defaultForm: true,
            battleOnly: false,
            mega: false,
            pokemon: {
              id: '1',
              internalName: 'bulbasaur',
              name: 'bulbasaur',
            },
          },
        ],
        totalRowCount: 1,
        totalPageCount: 1,
      },
    })

    const result = await getPokemonFormPage({ page: 1, size: 10, query: {} })

    expect(result.data.rows).toEqual([
      {
        id: '1',
        internalName: 'bulbasaur',
        name: 'bulbasaur',
        formName: null,
        formOrder: 1,
        sortingOrder: 1,
        defaultForm: true,
        battleOnly: false,
        mega: false,
        pokemon: {
          id: '1',
          internalName: 'bulbasaur',
          name: 'bulbasaur',
        },
      },
    ])
  })
})
