import { beforeEach, expect, test, vi } from 'vitest'

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}))

vi.mock('@/shared/api/http', () => ({
  request: requestMock,
}))

import {
  createRow,
  deleteRow,
  listRows,
  updateRow,
} from '@/pages/catalog/type/service'

beforeEach(() => {
  requestMock.mockReset()
})

test('type listRows requests /types and filters locally by code and name', async () => {
  requestMock.mockResolvedValue([
    {
      id: 'fire-id',
      code: 'FIRE',
      name: '火',
      description: '火属性',
      icon: 'fire',
      sortingOrder: 10,
      enabled: true,
      version: 0,
    },
    {
      id: 'water-id',
      code: 'WATER',
      name: '水',
      description: '水属性',
      icon: 'water',
      sortingOrder: 20,
      enabled: true,
      version: 0,
    },
  ])

  const rows = await listRows({
    code: 'fir',
    name: '火',
  })

  expect(requestMock).toHaveBeenCalledWith({
    url: '/catalog/types',
    method: 'GET',
  })
  expect(rows).toEqual([
    expect.objectContaining({
      id: 'fire-id',
      code: 'FIRE',
      name: '火',
    }),
  ])
})

test('type write operations use the backend type definition endpoints', async () => {
  requestMock.mockResolvedValue({})

  await createRow({
    code: 'FIRE',
    name: '火',
    description: '火属性',
    icon: 'fire',
    sortingOrder: 10,
    enabled: true,
  })
  await updateRow({
    id: 'fire-id',
    code: 'FIRE',
    name: '火',
    description: '火属性',
    icon: 'fire',
    sortingOrder: 10,
    enabled: true,
  })
  await deleteRow('fire-id')

  expect(requestMock).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      url: '/catalog/types',
      method: 'POST',
    }),
  )
  expect(requestMock).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      url: '/catalog/types/fire-id',
      method: 'PUT',
    }),
  )
  expect(requestMock).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({
      url: '/catalog/types/fire-id',
      method: 'DELETE',
    }),
  )
})
