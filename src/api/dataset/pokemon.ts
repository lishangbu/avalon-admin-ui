import {
  buildScopedPageParams,
  createApiObjectSchema,
  idFieldSchema,
  nullableNumberFieldSchema,
  requestParsedEntity,
  requestParsedPage,
} from '@/api/shared'
import request from '@/utils/request'

const pokemonSpeciesEntitySchema = createApiObjectSchema<PokemonSpecies>({
  id: idFieldSchema,
  sortingOrder: nullableNumberFieldSchema,
})

const pokemonEntitySchema = createApiObjectSchema<Pokemon>({
  id: idFieldSchema,
  height: nullableNumberFieldSchema,
  weight: nullableNumberFieldSchema,
  baseExperience: nullableNumberFieldSchema,
  sortingOrder: nullableNumberFieldSchema,
  pokemonSpecies: pokemonSpeciesEntitySchema.nullable().optional(),
})

export async function getPokemonPage(pageRequest: PageRequest<PokemonQuery>) {
  return requestParsedPage(pokemonEntitySchema, {
    url: '/pokemon/page',
    method: 'GET',
    params: buildScopedPageParams('pokemon', {
      ...pageRequest,
      query: {
        id: pageRequest.query.id,
        internalName: pageRequest.query.internalName,
        name: pageRequest.query.name,
        height: pageRequest.query.height,
        weight: pageRequest.query.weight,
        baseExperience: pageRequest.query.baseExperience,
        sortingOrder: pageRequest.query.sortingOrder,
        pokemonSpeciesId: pageRequest.query.pokemonSpeciesId,
      },
    }),
  })
}

export async function createPokemon(payload: PokemonCrudFormModel) {
  return requestParsedEntity(pokemonEntitySchema, {
    url: '/pokemon',
    method: 'POST',
    data: payload,
  })
}

export async function updatePokemon(payload: PokemonCrudFormModel) {
  return requestParsedEntity(pokemonEntitySchema, {
    url: '/pokemon',
    method: 'PUT',
    data: payload,
  })
}

export async function deletePokemon(id: Id) {
  return request<void>({
    url: `/pokemon/${id}`,
    method: 'DELETE',
  })
}
