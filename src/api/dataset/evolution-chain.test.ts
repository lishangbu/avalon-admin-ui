import { describe, expect, it, vi } from 'vitest'

import { getEvolutionChainPage } from './evolution-chain'

const request = vi.fn()

vi.mock('@/utils/request', () => ({
  request: (...args: unknown[]) => request(...args),
  default: (...args: unknown[]) => request(...args),
}))

describe('getEvolutionChainPage', () => {
  it('parses nested baby trigger item data', async () => {
    request.mockResolvedValueOnce({
      data: {
        rows: [
          {
            id: '100',
            babyTriggerItem: {
              id: '232',
              internalName: 'lax-incense',
              name: 'Lax Incense',
            },
          },
        ],
        totalRowCount: 1,
        totalPageCount: 1,
      },
    })

    const result = await getEvolutionChainPage({ page: 1, size: 10, query: {} })

    expect(result.data.rows).toEqual([
      {
        id: '100',
        babyTriggerItem: {
          id: '232',
          internalName: 'lax-incense',
          name: 'Lax Incense',
        },
      },
    ])
  })
})
