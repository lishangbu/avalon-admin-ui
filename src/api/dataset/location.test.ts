import { describe, expect, it, vi } from 'vitest'

import { getLocationPage } from './location'

const request = vi.fn()

vi.mock('@/utils/request', () => ({
  request: (...args: unknown[]) => request(...args),
  default: (...args: unknown[]) => request(...args),
}))

describe('getLocationPage', () => {
  it('parses nested region relation data', async () => {
    request.mockResolvedValueOnce({
      data: {
        rows: [
          {
            id: '1',
            internalName: 'canalave-city',
            name: 'Canalave City',
            region: {
              id: '4',
              internalName: 'sinnoh',
              name: 'Sinnoh',
            },
          },
        ],
        totalRowCount: 1,
        totalPageCount: 1,
      },
    })

    const result = await getLocationPage({ page: 1, size: 10, query: {} })

    expect(result.data.rows).toEqual([
      {
        id: '1',
        internalName: 'canalave-city',
        name: 'Canalave City',
        region: {
          id: '4',
          internalName: 'sinnoh',
          name: 'Sinnoh',
        },
      },
    ])
  })
})
