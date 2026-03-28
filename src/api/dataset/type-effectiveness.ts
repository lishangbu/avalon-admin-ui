import {
  createApiObjectSchema,
  nullableNumberFieldSchema,
  numberFieldSchema,
  parseApiEntity,
} from '@/api/shared'
import request from '@/utils/request'
import { z } from 'zod'

const typeEffectivenessTypeSchema = createApiObjectSchema<TypeEffectivenessTypeView>()

const typeEffectivenessMatchupSchema = createApiObjectSchema<TypeEffectivenessMatchup>({
  defendingType: typeEffectivenessTypeSchema,
  multiplier: nullableNumberFieldSchema,
})

const typeEffectivenessCellSchema = createApiObjectSchema<TypeEffectivenessCell>({
  defendingType: typeEffectivenessTypeSchema,
  multiplier: nullableNumberFieldSchema,
})

const typeEffectivenessChartSchema = createApiObjectSchema<TypeEffectivenessChart>({
  supportedTypes: z.array(typeEffectivenessTypeSchema),
  completeness: createApiObjectSchema<TypeEffectivenessChart['completeness']>({
    expectedPairs: numberFieldSchema.transform((value) => value ?? 0),
    configuredPairs: numberFieldSchema.transform((value) => value ?? 0),
    missingPairs: numberFieldSchema.transform((value) => value ?? 0),
  }),
  rows: z.array(
    createApiObjectSchema<TypeEffectivenessChart['rows'][number]>({
      attackingType: typeEffectivenessTypeSchema,
      cells: z.array(typeEffectivenessCellSchema),
    }),
  ),
})

const typeEffectivenessResultSchema = createApiObjectSchema<TypeEffectivenessResult>({
  attackingType: typeEffectivenessTypeSchema,
  defendingTypes: z.array(typeEffectivenessMatchupSchema),
  finalMultiplier: nullableNumberFieldSchema,
})

export async function calculateTypeEffectiveness(attacking: string, defending: string[]) {
  const res = await request<TypeEffectivenessResult>({
    url: '/type-effectiveness',
    method: 'GET',
    params: {
      attacking,
      defending,
    },
    paramsSerializer: {
      indexes: null,
    },
  })

  return {
    ...res,
    data: parseApiEntity(typeEffectivenessResultSchema, res.data),
  }
}

export async function getTypeEffectivenessChart() {
  const res = await request<TypeEffectivenessChart>({
    url: '/type-effectiveness/chart',
    method: 'GET',
  })

  return {
    ...res,
    data: parseApiEntity(typeEffectivenessChartSchema, res.data),
  }
}

export async function upsertTypeEffectivenessMatrix(payload: UpsertTypeEffectivenessMatrixCommand) {
  const res = await request<TypeEffectivenessChart>({
    url: '/type-effectiveness/matrix',
    method: 'PUT',
    data: payload,
  })

  return {
    ...res,
    data: parseApiEntity(typeEffectivenessChartSchema, res.data),
  }
}
