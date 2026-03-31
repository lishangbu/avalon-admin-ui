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

const pokemonEntitySchema = createApiObjectSchema<Pokemon>({
  id: idFieldSchema,
})

const pokemonFormEntitySchema = createApiObjectSchema<PokemonForm>({
  id: idFieldSchema,
  battleOnly: nullableBooleanFieldSchema,
  defaultForm: nullableBooleanFieldSchema,
  formOrder: nullableNumberFieldSchema,
  mega: nullableBooleanFieldSchema,
  sortingOrder: nullableNumberFieldSchema,
  pokemon: pokemonEntitySchema.nullable().optional(),
})

export async function getPokemonFormPage(pageRequest: PageRequest<PokemonFormQuery>) {
  return requestParsedPage(pokemonFormEntitySchema, {
    url: '/pokemon-form/page',
    method: 'GET',
    params: buildScopedPageParams('pokemonForm', {
      ...pageRequest,
      query: {
        id: pageRequest.query.id,
        internalName: pageRequest.query.internalName,
        name: pageRequest.query.name,
        formName: pageRequest.query.formName,
        battleOnly: pageRequest.query.battleOnly,
        defaultForm: pageRequest.query.defaultForm,
        mega: pageRequest.query.mega,
        formOrder: pageRequest.query.formOrder,
        sortingOrder: pageRequest.query.sortingOrder,
        pokemonId: pageRequest.query.pokemonId,
      },
    }),
  })
}

export async function createPokemonForm(payload: PokemonFormModel) {
  return requestParsedEntity(pokemonFormEntitySchema, {
    url: '/pokemon-form',
    method: 'POST',
    data: payload,
  })
}

export async function updatePokemonForm(payload: PokemonFormModel) {
  return requestParsedEntity(pokemonFormEntitySchema, {
    url: '/pokemon-form',
    method: 'PUT',
    data: payload,
  })
}

export async function deletePokemonForm(id: Id) {
  return request<void>({
    url: `/pokemon-form/${id}`,
    method: 'DELETE',
  })
}
