import { describe, expect, it, vi } from 'vitest'

import { listStats } from './stat'

const request = vi.fn()

vi.mock('@/utils/request', () => ({
  request: (...args: unknown[]) => request(...args),
  default: (...args: unknown[]) => request(...args),
}))

describe('listStats', () => {
  it('parses nested move damage class relation data', async () => {
    request.mockResolvedValueOnce({
      data: [
        {
          id: '1',
          internalName: 'attack',
          name: '攻击',
          gameIndex: 2,
          battleOnly: false,
          moveDamageClass: {
            id: '2',
            internalName: 'physical',
            name: '物理',
          },
        },
      ],
    })

    const result = await listStats()

    expect(result.data).toEqual([
      {
        id: '1',
        internalName: 'attack',
        name: '攻击',
        gameIndex: 2,
        battleOnly: false,
        moveDamageClass: {
          id: '2',
          internalName: 'physical',
          name: '物理',
        },
      },
    ])
  })
})
