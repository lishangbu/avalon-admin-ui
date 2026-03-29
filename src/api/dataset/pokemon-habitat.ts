import { withScopedQuery } from '@/api/shared'
import request from '@/utils/request'

export async function listPokemonHabitats(query: PokemonHabitatQuery = {}) {
  return request<PokemonHabitat[]>({
    url: '/pokemon-habitat/list',
    method: 'GET',
    params: withScopedQuery('pokemonHabitat', query),
  })
}

export async function createPokemonHabitat(payload: PokemonHabitatFormModel) {
  return request<PokemonHabitat>({
    url: '/pokemon-habitat',
    method: 'POST',
    data: payload,
  })
}

export async function updatePokemonHabitat(payload: PokemonHabitatFormModel) {
  return request<PokemonHabitat>({
    url: '/pokemon-habitat',
    method: 'PUT',
    data: payload,
  })
}

export async function deletePokemonHabitat(id: Id) {
  return request<void>({
    url: `/pokemon-habitat/${id}`,
    method: 'DELETE',
  })
}
