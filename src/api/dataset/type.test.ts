import { describe, expect, it, vi } from 'vitest'

import { listTypes } from './type'

const request = vi.fn()

vi.mock('@/utils/request', () => ({
  request: (...args: unknown[]) => request(...args),
  default: (...args: unknown[]) => request(...args),
}))

describe('listTypes', () => {
  it('parses battleOnly flag data', async () => {
    request.mockResolvedValueOnce({
      data: [
        {
          id: '19',
          internalName: 'stellar',
          name: '星晶',
          battleOnly: true,
        },
      ],
    })

    const result = await listTypes()

    expect(result.data).toEqual([
      {
        id: '19',
        internalName: 'stellar',
        name: '星晶',
        battleOnly: true,
      },
    ])
  })
})
