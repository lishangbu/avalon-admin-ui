import { describe, expect, it, vi } from 'vitest'

import { listRegions } from './region'

const request = vi.fn()

vi.mock('@/utils/request', () => ({
  request: (...args: unknown[]) => request(...args),
  default: (...args: unknown[]) => request(...args),
}))

describe('listRegions', () => {
  it('parses region list data', async () => {
    request.mockResolvedValueOnce({
      data: [
        {
          id: '4',
          internalName: 'sinnoh',
          name: 'Sinnoh',
        },
      ],
    })

    const result = await listRegions()

    expect(result.data).toEqual([
      {
        id: '4',
        internalName: 'sinnoh',
        name: 'Sinnoh',
      },
    ])
  })
})
