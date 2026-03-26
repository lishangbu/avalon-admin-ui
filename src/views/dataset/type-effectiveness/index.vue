<script setup lang="ts">
import { useAsyncState, useDebounceFn } from '@vueuse/core'
import {
  NAlert,
  NButton,
  NCard,
  NDataTable,
  NEmpty,
  NProgress,
  NSelect,
  NSpin,
  NTag,
  useMessage,
} from 'naive-ui'
import { computed, h, ref, watch } from 'vue'

import {
  calculateTypeEffectiveness,
  getTypeEffectivenessChart,
  upsertTypeEffectivenessMatrix,
} from '@/api'
import { ScrollContainer } from '@/components'

import type { DataTableColumns, SelectOption } from 'naive-ui'

defineOptions({
  name: 'TypeEffectivenessPage',
})

type MatrixDraft = Record<string, number | null>
type MetricTone = 'sky' | 'slate' | 'amber'
type MatrixSelectStatus = 'success' | 'warning' | 'error' | undefined

const message = useMessage()

const multiplierOptions: SelectOption[] = [
  { label: '0x · 免疫', value: 0 },
  { label: '0.5x · 抵抗', value: 0.5 },
  { label: '1x · 正常', value: 1 },
  { label: '2x · 克制', value: 2 },
]

const attackingType = ref<string | null>(null)
const defendingTypes = ref<string[]>([])
const calculation = ref<TypeEffectivenessResult | null>(null)
const calculationLoading = ref(false)
const calculationReady = ref(false)
const saving = ref(false)
const originalMatrix = ref<MatrixDraft>({})
const draftMatrix = ref<MatrixDraft>({})

let calculationRequestId = 0

function createEmptyChart(): TypeEffectivenessChart {
  return {
    supportedTypes: [],
    completeness: {
      expectedPairs: 0,
      configuredPairs: 0,
      missingPairs: 0,
    },
    rows: [],
  }
}

function pairKey(attacking: string, defending: string) {
  return `${attacking}::${defending}`
}

function formatMultiplier(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return '未配置'
  }

  return `${value}x`
}

function buildMatrixSnapshot(chart: TypeEffectivenessChart): MatrixDraft {
  const snapshot: MatrixDraft = {}

  chart.rows.forEach((row) => {
    row.cells.forEach((cell) => {
      snapshot[pairKey(row.attackingType.internalName, cell.defendingType.internalName)] =
        cell.multiplier ?? null
    })
  })

  return snapshot
}

function resolveMatrixSelectStatus(multiplier: number | null | undefined): MatrixSelectStatus {
  if (multiplier === null || multiplier === undefined || multiplier === 1) {
    return undefined
  }

  if (multiplier === 0) {
    return 'error'
  }

  if (multiplier < 1) {
    return 'warning'
  }

  if (multiplier > 1) {
    return 'success'
  }

  return 'warning'
}

function resolveMultiplierLabelClass(value: number | undefined) {
  switch (value) {
    case 0:
      return 'font-semibold text-rose-600'
    case 0.5:
      return 'font-semibold text-amber-600'
    case 1:
      return 'font-semibold text-sky-600'
    case 2:
      return 'font-semibold text-emerald-600'
    default:
      return 'font-medium text-slate-500'
  }
}

function renderMultiplierLabel(option: SelectOption) {
  return h(
    'span',
    {
      class: resolveMultiplierLabelClass(typeof option.value === 'number' ? option.value : undefined),
    },
    typeof option.label === 'string' ? option.label : '',
  )
}

function resolveEffectivenessMeta(effectiveness?: TypeEffectivenessResult['effectiveness']) {
  switch (effectiveness) {
    case 'immune':
      return { label: '免疫', type: 'default' as const }
    case 'not-very-effective':
      return { label: '效果不佳', type: 'warning' as const }
    case 'super-effective':
      return { label: '效果拔群', type: 'success' as const }
    case 'normal-effective':
      return { label: '效果正常', type: 'info' as const }
    default:
      return { label: '待补全', type: 'error' as const }
  }
}

function resolveStatusMeta(status?: TypeEffectivenessResult['status']) {
  return status === 'complete'
    ? { label: '配置完整', type: 'success' as const }
    : { label: '存在缺口', type: 'warning' as const }
}

function resolveMetricToneClass(tone: MetricTone) {
  switch (tone) {
    case 'sky':
      return 'border-sky-200/70 bg-white/80'
    case 'amber':
      return 'border-amber-200/80 bg-amber-50/90'
    default:
      return 'border-slate-200/70 bg-white/76'
  }
}

async function loadChart() {
  const response = await getTypeEffectivenessChart()
  return response.data
}

const {
  state: chart,
  error: chartError,
  isLoading: chartLoading,
  execute: executeLoadChart,
} = useAsyncState(loadChart, createEmptyChart(), {
  immediate: true,
  resetOnExecute: false,
})

const typeOptions = computed<SelectOption[]>(() =>
  chart.value.supportedTypes.map((item) => ({
    label: `${item.name} · ${item.internalName}`,
    value: item.internalName,
  })),
)

const defendingTypeOptions = computed<SelectOption[]>(() =>
  chart.value.supportedTypes.map((item) => ({
    label: `${item.name} · ${item.internalName}`,
    value: item.internalName,
    disabled:
      defendingTypes.value.length >= 2 && !defendingTypes.value.includes(item.internalName),
  })),
)

const progressPercentage = computed(() => {
  const { expectedPairs, configuredPairs } = chart.value.completeness

  if (expectedPairs <= 0) {
    return 0
  }

  return Math.round((configuredPairs / expectedPairs) * 100)
})

const matrixRows = computed(() => chart.value.rows)
const matrixScrollX = computed(() => 220 + chart.value.supportedTypes.length * 144)

const pendingChanges = computed<TypeEffectivenessMatrixCellInput[]>(() => {
  const cells: TypeEffectivenessMatrixCellInput[] = []

  Object.entries(draftMatrix.value).forEach(([key, multiplier]) => {
    const originalMultiplier = originalMatrix.value[key] ?? null

    if (originalMultiplier === multiplier) {
      return
    }

    const [attacking, defending] = key.split('::')

    if (!attacking || !defending) {
      return
    }

    cells.push({
      attackingType: attacking,
      defendingType: defending,
      multiplier,
    })
  })

  return cells
})

const pendingChangesCount = computed(() => pendingChanges.value.length)
const canSaveMatrix = computed(() => pendingChangesCount.value > 0)
const overviewMetrics = computed(() => [
  {
    label: '理论格子数',
    value: String(chart.value.completeness.expectedPairs),
    tone: 'slate' as MetricTone,
  },
  {
    label: '已配置',
    value: String(chart.value.completeness.configuredPairs),
    tone: 'sky' as MetricTone,
  },
  {
    label: '缺失',
    value: String(chart.value.completeness.missingPairs),
    tone: chart.value.completeness.missingPairs > 0 ? ('amber' as MetricTone) : ('slate' as MetricTone),
  },
])
const calculationStatusMeta = computed(() =>
  calculation.value ? resolveStatusMeta(calculation.value.status) : null,
)
const calculationEffectivenessMeta = computed(() =>
  calculation.value ? resolveEffectivenessMeta(calculation.value.effectiveness) : null,
)

const matrixColumns = computed<DataTableColumns<TypeEffectivenessRow>>(() => {
  const columns: DataTableColumns<TypeEffectivenessRow> = [
    {
      key: 'attackingType',
      title: '攻击 \\ 防守',
      fixed: 'left',
      width: 188,
      render: (row) =>
        h('div', { class: 'grid gap-0.5' }, [
          h('strong', { class: 'text-sm font-extrabold text-slate-900' }, row.attackingType.name),
          h(
            'span',
            { class: 'text-[0.72rem] font-semibold tracking-[0.08em] text-slate-500 uppercase' },
            row.attackingType.internalName,
          ),
        ]),
    },
  ]

  chart.value.supportedTypes.forEach((defendingType) => {
    columns.push({
      key: defendingType.internalName,
      width: 144,
      title: () =>
        h('div', { class: 'grid gap-0.5' }, [
          h('strong', { class: 'text-sm font-extrabold text-slate-900' }, defendingType.name),
          h(
            'span',
            { class: 'text-[0.72rem] font-semibold tracking-[0.08em] text-slate-500 uppercase' },
            defendingType.internalName,
          ),
        ]),
      render: (row) => {
        const key = pairKey(row.attackingType.internalName, defendingType.internalName)
        const currentValue = draftMatrix.value[key] ?? null

        return h(NSelect, {
          value: currentValue,
          options: multiplierOptions,
          status: resolveMatrixSelectStatus(currentValue),
          renderLabel: renderMultiplierLabel,
          clearable: true,
          size: 'small',
          consistentMenuWidth: false,
          placeholder: '未配置',
          'onUpdate:value': (value: number | string | null) => {
            draftMatrix.value[key] = typeof value === 'number' ? value : null
          },
        })
      },
    })
  })

  return columns
})

const debouncedCalculate = useDebounceFn(async () => {
  if (!attackingType.value || defendingTypes.value.length === 0) {
    calculation.value = null
    calculationReady.value = false
    calculationLoading.value = false
    return
  }

  const requestId = ++calculationRequestId
  calculationLoading.value = true

  try {
    const response = await calculateTypeEffectiveness(attackingType.value, defendingTypes.value)

    if (requestId !== calculationRequestId) {
      return
    }

    calculation.value = response.data
    calculationReady.value = true
  } finally {
    if (requestId === calculationRequestId) {
      calculationLoading.value = false
    }
  }
}, 280)

function syncSelections(chartData: TypeEffectivenessChart) {
  const supportedInternalNames = chartData.supportedTypes.map((item) => item.internalName)

  if (supportedInternalNames.length === 0) {
    attackingType.value = null
    defendingTypes.value = []
    calculation.value = null
    calculationReady.value = false
    return
  }

  const supportedSet = new Set(supportedInternalNames)

  if (!attackingType.value || !supportedSet.has(attackingType.value)) {
    attackingType.value = supportedInternalNames[0] ?? null
  }

  const nextDefendingTypes = defendingTypes.value
    .filter((item) => supportedSet.has(item))
    .filter((item, index, current) => current.indexOf(item) === index)
    .slice(0, 2)

  if (nextDefendingTypes.length === 0) {
    const preferredSecondary =
      supportedInternalNames.find((item) => item !== attackingType.value) ?? supportedInternalNames[0]

    if (preferredSecondary) {
      nextDefendingTypes.push(preferredSecondary)
    }
  }

  defendingTypes.value = nextDefendingTypes
}

function handleDefendingTypesUpdate(value: string[]) {
  const nextValue = value
    .filter((item, index, current) => current.indexOf(item) === index)
    .slice(0, 2)

  if (nextValue.length !== value.length) {
    message.warning('防守属性最多选择两个，且不能重复')
  }

  defendingTypes.value = nextValue
}

async function handleReloadChart() {
  await executeLoadChart()
  await debouncedCalculate()
}

async function handleSaveMatrix() {
  const cells = pendingChanges.value

  if (cells.length === 0) {
    return
  }

  saving.value = true

  try {
    const response = await upsertTypeEffectivenessMatrix({ cells })
    chart.value = response.data
    message.success(`已保存 ${cells.length} 项矩阵变更`)
    await debouncedCalculate()
  } finally {
    saving.value = false
  }
}

function handleResetMatrix() {
  draftMatrix.value = { ...originalMatrix.value }
}

watch(
  chart,
  (chartData) => {
    const snapshot = buildMatrixSnapshot(chartData)
    originalMatrix.value = snapshot
    draftMatrix.value = { ...snapshot }
    syncSelections(chartData)
  },
  { immediate: true },
)

watch([attackingType, defendingTypes], () => {
  void debouncedCalculate()
})
</script>

<template>
  <ScrollContainer wrapper-class="grid gap-4">
    <NAlert
      v-if="chartError"
      class="rounded-[1.5rem]"
      type="error"
      title="矩阵加载失败"
      closable
    >
      后端未能返回属性相克矩阵，请检查接口或稍后重试。
    </NAlert>

    <div class="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
      <NCard
        :bordered="false"
        class="rounded-[1.625rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,255,0.94))] shadow-[0_18px_48px_rgba(15,23,42,0.06)]"
      >
        <template #header>
          <div class="grid gap-0.5">
            <span class="text-[0.72rem] font-bold tracking-[0.16em] text-cyan-700 uppercase">
              Battle Calculator
            </span>
            <strong class="text-base font-extrabold text-slate-900">倍率查询</strong>
          </div>
        </template>

        <div class="grid gap-4">
          <div class="grid gap-4 md:grid-cols-2">
            <div class="grid gap-2">
              <span class="text-[0.78rem] font-bold tracking-[0.08em] text-slate-500 uppercase">
                攻击属性
              </span>
              <NSelect
                v-model:value="attackingType"
                :options="typeOptions"
                :loading="chartLoading"
                :disabled="chartLoading || typeOptions.length === 0"
                filterable
                placeholder="选择攻击属性"
              />
            </div>

            <div class="grid gap-2">
              <span class="text-[0.78rem] font-bold tracking-[0.08em] text-slate-500 uppercase">
                防守属性（最多 2 个）
              </span>
              <NSelect
                :value="defendingTypes"
                :options="defendingTypeOptions"
                :loading="chartLoading"
                :disabled="chartLoading || defendingTypeOptions.length === 0"
                filterable
                multiple
                clearable
                placeholder="选择 1 到 2 个防守属性"
                @update:value="handleDefendingTypesUpdate"
              />
            </div>
          </div>

          <NSpin :show="calculationLoading">
            <div
              v-if="calculation && calculationReady"
              class="grid gap-4 rounded-[1.375rem] border border-sky-200/60 bg-white/85 p-5 shadow-sm"
            >
              <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div class="grid gap-1">
                  <span class="text-[0.78rem] font-bold tracking-[0.08em] text-slate-500 uppercase">
                    最终倍率
                  </span>
                  <strong class="text-4xl font-black text-sky-700 md:text-5xl">
                    {{ formatMultiplier(calculation.finalMultiplier) }}
                  </strong>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <NTag
                    v-if="calculationStatusMeta"
                    :type="calculationStatusMeta.type"
                  >
                    {{ calculationStatusMeta.label }}
                  </NTag>
                  <NTag
                    v-if="calculationEffectivenessMeta"
                    :type="calculationEffectivenessMeta.type"
                  >
                    {{ calculationEffectivenessMeta.label }}
                  </NTag>
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <article
                  v-for="matchup in calculation.defendingTypes"
                  :key="matchup.defendingType.internalName"
                  class="grid gap-2 rounded-[1.125rem] border border-slate-200/70 bg-white/85 p-4"
                >
                  <span class="grid gap-1 font-bold text-slate-900">
                    <span>{{ matchup.defendingType.name }}</span>
                    <small class="text-[0.78rem] font-semibold tracking-[0.08em] text-slate-500 uppercase">
                      {{ matchup.defendingType.internalName }}
                    </small>
                  </span>
                  <strong class="text-lg font-black text-slate-950">
                    {{ formatMultiplier(matchup.multiplier) }}
                  </strong>
                  <div class="flex items-center gap-2">
                    <NTag
                      :type="matchup.status === 'configured' ? 'success' : 'warning'"
                      size="small"
                    >
                      {{ matchup.status === 'configured' ? '已配置' : '缺失' }}
                    </NTag>
                  </div>
                </article>
              </div>
            </div>

            <div
              v-else
              class="py-6"
            >
              <NEmpty description="选择攻击属性和 1 到 2 个防守属性后自动计算" />
            </div>
          </NSpin>
        </div>
      </NCard>

      <NCard
        :bordered="false"
        class="rounded-[1.625rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,255,0.94))] shadow-[0_18px_48px_rgba(15,23,42,0.06)]"
      >
        <template #header>
          <div class="grid gap-0.5">
            <span class="text-[0.72rem] font-bold tracking-[0.16em] text-cyan-700 uppercase">
              Matrix Health
            </span>
            <strong class="text-base font-extrabold text-slate-900">矩阵概览</strong>
          </div>
        </template>

        <div class="grid gap-4">
          <div class="grid gap-3 sm:grid-cols-3">
            <article
              v-for="item in overviewMetrics"
              :key="item.label"
              :class="[
                'grid gap-1 rounded-[1.125rem] border p-4 backdrop-blur-sm',
                resolveMetricToneClass(item.tone),
              ]"
            >
              <span class="text-[0.78rem] font-bold tracking-[0.08em] text-slate-500 uppercase">
                {{ item.label }}
              </span>
              <strong class="text-2xl font-black text-slate-950">{{ item.value }}</strong>
            </article>
          </div>

          <div class="grid gap-3 rounded-[1.125rem] border border-slate-200/70 bg-white/85 p-4">
            <div class="flex items-center justify-between gap-3 text-sm font-bold text-slate-700">
              <span>矩阵完成度</span>
              <strong class="text-base font-black text-slate-950">{{ progressPercentage }}%</strong>
            </div>
            <NProgress
              type="line"
              :percentage="progressPercentage"
              :height="12"
              :show-indicator="false"
              processing
              status="success"
            />
          </div>

          <NAlert
            v-if="chart.completeness.missingPairs > 0"
            type="warning"
            title="仍有未配置格子"
          >
            查询接口遇到未配置格子时会把最终倍率标记为不完整，建议先把矩阵补齐。
          </NAlert>

        </div>
      </NCard>
    </div>

    <div class="overflow-x-auto pb-1">
      <NCard
        :bordered="false"
        class="min-w-[80rem] rounded-[1.625rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,255,0.94))] shadow-[0_18px_48px_rgba(15,23,42,0.06)]"
      >
        <template #header>
          <div class="grid gap-0.5">
            <span class="text-[0.72rem] font-bold tracking-[0.16em] text-cyan-700 uppercase">
              Editable Matrix
            </span>
            <strong class="text-base font-extrabold text-slate-900">属性相克矩阵</strong>
          </div>
        </template>

        <template #header-extra>
          <div class="flex flex-wrap items-center gap-2">
            <NButton
              tertiary
              :loading="chartLoading"
              @click="handleReloadChart"
            >
              重新加载
            </NButton>
            <NButton
              tertiary
              :disabled="!canSaveMatrix"
              @click="handleResetMatrix"
            >
              撤销修改
            </NButton>
            <NButton
              type="primary"
              :loading="saving"
              :disabled="!canSaveMatrix"
              @click="handleSaveMatrix"
            >
              保存 {{ pendingChangesCount }} 项修改
            </NButton>
          </div>
        </template>

        <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p class="text-sm leading-6 text-slate-600">
            直接在格子里切换倍率；清空即表示删除该配置。保存时只会提交实际修改过的单元格。
          </p>
          <div class="inline-flex items-center gap-2 self-start rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold tracking-[0.08em] text-white uppercase">
            Pending
            <span class="rounded-full bg-white/20 px-2 py-0.5 text-white">{{ pendingChangesCount }}</span>
          </div>
        </div>

        <NDataTable
          :columns="matrixColumns"
          :data="matrixRows"
        :loading="chartLoading || saving"
        :pagination="false"
        :single-line="false"
        :row-key="(row: TypeEffectivenessRow) => row.attackingType.internalName"
        :scroll-x="matrixScrollX"
        size="small"
      />
    </NCard>
  </div>
</ScrollContainer>
</template>
