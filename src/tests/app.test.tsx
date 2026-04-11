import { compactParams, withScopedQuery } from '@/utils/request'

test('request helpers keep scoped params', () => {
  expect(compactParams({ a: 1, b: '', c: null })).toEqual({ a: 1 })
  expect(withScopedQuery('user', { name: 'avalon' })).toEqual({
    name: 'avalon',
    'user.name': 'avalon',
  })
})
