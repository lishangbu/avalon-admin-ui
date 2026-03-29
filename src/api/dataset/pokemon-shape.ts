import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listPokemonShapes(query: PokemonShapeQuery = {}) {
  return request<PokemonShape[]>({
    url: '/pokemon-shape/list',
    method: 'GET',
    params: withScopedQuery('pokemonShape', query),
  })
}

export async function createPokemonShape(payload: PokemonShapeFormModel) {
  return request<PokemonShape>({
    url: '/pokemon-shape',
    method: 'POST',
    data: payload,
  })
}

export async function updatePokemonShape(payload: PokemonShapeFormModel) {
  return request<PokemonShape>({
    url: '/pokemon-shape',
    method: 'PUT',
    data: payload,
  })
}

export async function deletePokemonShape(id: Id) {
  return request<void>({
    url: `/pokemon-shape/${id}`,
    method: 'DELETE',
  })
}
