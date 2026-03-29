import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listPokemonColors(query: PokemonColorQuery = {}) {
  return request<PokemonColor[]>({
    url: '/pokemon-color/list',
    method: 'GET',
    params: withScopedQuery('pokemonColor', query),
  })
}

export async function createPokemonColor(payload: PokemonColorFormModel) {
  return request<PokemonColor>({
    url: '/pokemon-color',
    method: 'POST',
    data: payload,
  })
}

export async function updatePokemonColor(payload: PokemonColorFormModel) {
  return request<PokemonColor>({
    url: '/pokemon-color',
    method: 'PUT',
    data: payload,
  })
}

export async function deletePokemonColor(id: Id) {
  return request<void>({
    url: `/pokemon-color/${id}`,
    method: 'DELETE',
  })
}
