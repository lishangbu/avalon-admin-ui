import {
  buildScopedPageParams,
  createApiObjectSchema,
  idFieldSchema,
  nullableBooleanFieldSchema,
  nullableIdFieldSchema,
  nullableNumberFieldSchema,
  requestParsedEntity,
  requestParsedPage,
} from '@/api/shared'
import request from '@/utils/request'

const growthRateEntitySchema = createApiObjectSchema<GrowthRate>({
  id: idFieldSchema,
})

const pokemonColorEntitySchema = createApiObjectSchema<PokemonColor>({
  id: idFieldSchema,
})

const pokemonHabitatEntitySchema = createApiObjectSchema<PokemonHabitat>({
  id: idFieldSchema,
})

const pokemonShapeEntitySchema = createApiObjectSchema<PokemonShape>({
  id: idFieldSchema,
})

const pokemonSpeciesEntitySchema = createApiObjectSchema<PokemonSpecies>({
  id: idFieldSchema,
  sortingOrder: nullableNumberFieldSchema,
  genderRate: nullableNumberFieldSchema,
  captureRate: nullableNumberFieldSchema,
  baseHappiness: nullableNumberFieldSchema,
  baby: nullableBooleanFieldSchema,
  legendary: nullableBooleanFieldSchema,
  mythical: nullableBooleanFieldSchema,
  hatchCounter: nullableNumberFieldSchema,
  hasGenderDifferences: nullableBooleanFieldSchema,
  formsSwitchable: nullableBooleanFieldSchema,
  evolvesFromSpeciesId: nullableIdFieldSchema,
  evolutionChainId: nullableIdFieldSchema,
  growthRate: growthRateEntitySchema.nullable().optional(),
  pokemonColor: pokemonColorEntitySchema.nullable().optional(),
  pokemonHabitat: pokemonHabitatEntitySchema.nullable().optional(),
  pokemonShape: pokemonShapeEntitySchema.nullable().optional(),
})

export async function getPokemonSpeciesPage(pageRequest: PageRequest<PokemonSpeciesQuery>) {
  return requestParsedPage(pokemonSpeciesEntitySchema, {
    url: '/pokemon-species/page',
    method: 'GET',
    params: buildScopedPageParams('pokemonSpecies', {
      ...pageRequest,
      query: {
        id: pageRequest.query.id,
        internalName: pageRequest.query.internalName,
        name: pageRequest.query.name,
        sortingOrder: pageRequest.query.sortingOrder,
        genderRate: pageRequest.query.genderRate,
        captureRate: pageRequest.query.captureRate,
        baseHappiness: pageRequest.query.baseHappiness,
        baby: pageRequest.query.baby,
        legendary: pageRequest.query.legendary,
        mythical: pageRequest.query.mythical,
        hatchCounter: pageRequest.query.hatchCounter,
        hasGenderDifferences: pageRequest.query.hasGenderDifferences,
        formsSwitchable: pageRequest.query.formsSwitchable,
        evolvesFromSpeciesId: pageRequest.query.evolvesFromSpeciesId,
        evolutionChainId: pageRequest.query.evolutionChainId,
        growthRateId: pageRequest.query.growthRateId,
        pokemonColorId: pageRequest.query.pokemonColorId,
        pokemonHabitatId: pageRequest.query.pokemonHabitatId,
        pokemonShapeId: pageRequest.query.pokemonShapeId,
      },
    }),
  })
}

export async function createPokemonSpecies(payload: PokemonSpeciesFormModel) {
  return requestParsedEntity(pokemonSpeciesEntitySchema, {
    url: '/pokemon-species',
    method: 'POST',
    data: payload,
  })
}

export async function updatePokemonSpecies(payload: PokemonSpeciesFormModel) {
  return requestParsedEntity(pokemonSpeciesEntitySchema, {
    url: '/pokemon-species',
    method: 'PUT',
    data: payload,
  })
}

export async function deletePokemonSpecies(id: Id) {
  return request<void>({
    url: `/pokemon-species/${id}`,
    method: 'DELETE',
  })
}
