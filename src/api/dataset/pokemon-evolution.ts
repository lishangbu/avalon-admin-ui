import {
  buildScopedPageParams,
  createApiObjectSchema,
  idFieldSchema,
  nullableBooleanFieldSchema,
  nullableNumberFieldSchema,
  requestParsedEntity,
  requestParsedPage,
} from '@/api/shared'
import request from '@/utils/request'

const evolutionChainEntitySchema = createApiObjectSchema<EvolutionChain>({
  id: idFieldSchema,
})

const pokemonSpeciesEntitySchema = createApiObjectSchema<PokemonSpecies>({
  id: idFieldSchema,
})

const genderEntitySchema = createApiObjectSchema<Gender>({
  id: idFieldSchema,
})

const itemEntitySchema = createApiObjectSchema<Item>({
  id: idFieldSchema,
})

const moveEntitySchema = createApiObjectSchema<Move>({
  id: idFieldSchema,
})

const typeEntitySchema = createApiObjectSchema<Type>({
  id: idFieldSchema,
})

const locationEntitySchema = createApiObjectSchema<Location>({
  id: idFieldSchema,
})

const regionEntitySchema = createApiObjectSchema<Region>({
  id: idFieldSchema,
})

const pokemonFormEntitySchema = createApiObjectSchema<PokemonForm>({
  id: idFieldSchema,
})

const evolutionTriggerEntitySchema = createApiObjectSchema<EvolutionTrigger>({
  id: idFieldSchema,
})

const pokemonEvolutionEntitySchema = createApiObjectSchema<PokemonEvolution>({
  id: idFieldSchema,
  branchSortOrder: nullableNumberFieldSchema,
  detailSortOrder: nullableNumberFieldSchema,
  needsMultiplayer: nullableBooleanFieldSchema,
  needsOverworldRain: nullableBooleanFieldSchema,
  turnUpsideDown: nullableBooleanFieldSchema,
  minAffection: nullableNumberFieldSchema,
  minBeauty: nullableNumberFieldSchema,
  minDamageTaken: nullableNumberFieldSchema,
  minHappiness: nullableNumberFieldSchema,
  minLevel: nullableNumberFieldSchema,
  minMoveCount: nullableNumberFieldSchema,
  minSteps: nullableNumberFieldSchema,
  relativePhysicalStats: nullableNumberFieldSchema,
  evolutionChain: evolutionChainEntitySchema.nullable().optional(),
  fromPokemonSpecies: pokemonSpeciesEntitySchema.nullable().optional(),
  toPokemonSpecies: pokemonSpeciesEntitySchema.nullable().optional(),
  gender: genderEntitySchema.nullable().optional(),
  heldItem: itemEntitySchema.nullable().optional(),
  item: itemEntitySchema.nullable().optional(),
  knownMove: moveEntitySchema.nullable().optional(),
  knownMoveType: typeEntitySchema.nullable().optional(),
  location: locationEntitySchema.nullable().optional(),
  partySpecies: pokemonSpeciesEntitySchema.nullable().optional(),
  partyType: typeEntitySchema.nullable().optional(),
  tradeSpecies: pokemonSpeciesEntitySchema.nullable().optional(),
  trigger: evolutionTriggerEntitySchema.nullable().optional(),
  usedMove: moveEntitySchema.nullable().optional(),
  region: regionEntitySchema.nullable().optional(),
  baseForm: pokemonFormEntitySchema.nullable().optional(),
})

export async function getPokemonEvolutionPage(pageRequest: PageRequest<PokemonEvolutionQuery>) {
  return requestParsedPage(pokemonEvolutionEntitySchema, {
    url: '/pokemon-evolution/page',
    method: 'GET',
    params: buildScopedPageParams('pokemonEvolution', {
      ...pageRequest,
      query: {
        id: pageRequest.query.id,
        branchSortOrder: pageRequest.query.branchSortOrder,
        detailSortOrder: pageRequest.query.detailSortOrder,
        timeOfDay: pageRequest.query.timeOfDay,
        minLevel: pageRequest.query.minLevel,
        evolutionChainId: pageRequest.query.evolutionChainId,
        fromPokemonSpeciesId: pageRequest.query.fromPokemonSpeciesId,
        toPokemonSpeciesId: pageRequest.query.toPokemonSpeciesId,
        triggerId: pageRequest.query.triggerId,
        itemId: pageRequest.query.itemId,
        heldItemId: pageRequest.query.heldItemId,
        locationId: pageRequest.query.locationId,
        genderId: pageRequest.query.genderId,
        baseFormId: pageRequest.query.baseFormId,
        regionId: pageRequest.query.regionId,
      },
    }),
  })
}

export async function createPokemonEvolution(payload: PokemonEvolutionFormModel) {
  return requestParsedEntity(pokemonEvolutionEntitySchema, {
    url: '/pokemon-evolution',
    method: 'POST',
    data: payload,
  })
}

export async function updatePokemonEvolution(payload: PokemonEvolutionFormModel) {
  return requestParsedEntity(pokemonEvolutionEntitySchema, {
    url: '/pokemon-evolution',
    method: 'PUT',
    data: payload,
  })
}

export async function deletePokemonEvolution(id: Id) {
  return request<void>({
    url: `/pokemon-evolution/${id}`,
    method: 'DELETE',
  })
}
