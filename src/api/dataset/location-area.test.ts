import { describe, expect, it, vi } from 'vitest'

import { getLocationAreaPage } from './location-area'

const request = vi.fn()

vi.mock('@/utils/request', () => ({
  request: (...args: unknown[]) => request(...args),
  default: (...args: unknown[]) => request(...args),
}))

describe('getLocationAreaPage', () => {
  it('parses nested location relation data', async () => {
    request.mockResolvedValueOnce({
      data: {
        rows: [
          {
            id: '1',
            gameIndex: 1,
            internalName: 'canalave-city-area',
            name: 'Canalave City',
            location: {
              id: '1',
              internalName: 'canalave-city',
              name: 'Canalave City',
            },
          },
        ],
        totalRowCount: 1,
        totalPageCount: 1,
      },
    })

    const result = await getLocationAreaPage({ page: 1, size: 10, query: {} })

    expect(result.data.rows).toEqual([
      {
        id: '1',
        gameIndex: 1,
        internalName: 'canalave-city-area',
        name: 'Canalave City',
        location: {
          id: '1',
          internalName: 'canalave-city',
          name: 'Canalave City',
        },
      },
    ])
  })
})
