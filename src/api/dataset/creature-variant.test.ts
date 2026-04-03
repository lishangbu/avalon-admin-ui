import { describe, expect, it, vi } from 'vitest'

import { getCreatureVariantPage } from './creature-variant'

const request = vi.fn()

vi.mock('@/utils/request', () => ({
  request: (...args: unknown[]) => request(...args),
  default: (...args: unknown[]) => request(...args),
}))

describe('getCreatureVariantPage', () => {
  it('parses boolean and nested creature data', async () => {
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
            creature: {
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

    const result = await getCreatureVariantPage({ page: 1, size: 10, query: {} })

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
        creature: {
          id: '1',
          internalName: 'bulbasaur',
          name: 'bulbasaur',
        },
      },
    ])
  })
})
