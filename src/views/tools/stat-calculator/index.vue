<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { tryOnMounted } from '@vueuse/core'
import {
  NAlert,
  NButton,
  NCard,
  NInputNumber,
  NSelect,
  NSkeleton,
  NSpace,
  NStatistic,
  NTag,
  useMessage,
} from 'naive-ui'
import { computed, reactive, ref, watch } from 'vue'

import { calculateStats, getCreaturePreset, listCoreStats, listCreatures, listNatures } from '@/api'

import type { SelectOption } from 'naive-ui'

defineOptions({
  name: 'ToolStatCalculatorPage',
})

interface StatEditorInput {
  baseStat: number | null
  iv: number | null
  ev: number | null
}

interface StatDefinition {
  id: number
  internalName: string
  label: string
  shortLabel: string
}

const message = useMessage()

const loading = ref(true)
const calculationLoading = ref(false)
const creaturePresetLoading = ref(false)
const level = ref<number | null>(50)
const selectedCreatureValue = ref<string | null>(null)
const selectedNatureValue = ref<string>('neutral')
const creaturesCatalog = ref<Creature[]>([])
const statsCatalog = ref<Stat[]>([])
const naturesCatalog = ref<Nature[]>([])
const statDefinitions = ref<StatDefinition[]>([])
const creatureOptions = ref<SelectOption[]>([])
const natureOptions = ref<SelectOption[]>([])
const creatureMap = ref<Record<string, Creature>>({})
const calculationResult = ref<StatCalculatorResultView | null>(null)
const statInputs = reactive<Record<string, StatEditorInput>>({})

const statToneMap: Record<string, string> = {
  hp: 'from-emerald-500/18 to-emerald-500/4 text-emerald-300 ring-emerald-400/30',
  attack: 'from-rose-500/18 to-rose-500/4 text-rose-300 ring-rose-400/30',
  defense: 'from-amber-500/18 to-amber-500/4 text-amber-300 ring-amber-400/30',
  'special-attack': 'from-fuchsia-500/18 to-fuchsia-500/4 text-fuchsia-300 ring-fuchsia-400/30',
  'special-defense': 'from-cyan-500/18 to-cyan-500/4 text-cyan-300 ring-cyan-400/30',
  speed: 'from-sky-500/18 to-sky-500/4 text-sky-300 ring-sky-400/30',
}

const selectedCreature = computed(() => {
  return selectedCreatureValue.value
    ? (creatureMap.value[selectedCreatureValue.value] ?? null)
    : null
})

const statLabelMap = computed(() => {
  return new Map(statDefinitions.value.map((item) => [String(item.id), item.label]))
})

const calculationResultMap = computed(() => {
  const nextMap = new Map<string, StatCalculatorEntryResultView>()

  for (const entry of calculationResult.value?.stats ?? []) {
    nextMap.set(entry.statId, entry)
  }

  return nextMap
})

const selectedNatureId = computed<number | null>(() => {
  const parsedValue = Number(selectedNatureValue.value)
  return Number.isFinite(parsedValue) ? parsedValue : null
})

const selectedNature = computed(() => {
  const nature = naturesCatalog.value.find(
    (item) => String(item.id ?? item.internalName ?? '') === selectedNatureValue.value,
  )
  return nature ? { label: getNatureLabel(selectedNatureValue.value), nature } : null
})

const calculationPayload = computed<StatCalculatorRequest | null>(() => {
  if (statDefinitions.value.length === 0) {
    return null
  }

  return {
    level: normalizeInteger(level.value, 1, 100, 50),
    natureId: selectedNatureId.value,
    stats: statDefinitions.value.map((definition) => ({
      statId: definition.id,
      baseStat: normalizeInteger(statInputs[String(definition.id)]?.baseStat, 1, 255, 80),
      iv: normalizeInteger(statInputs[String(definition.id)]?.iv, 0, 31, 31),
      ev: normalizeInteger(statInputs[String(definition.id)]?.ev, 0, 252, 0),
    })),
  }
})

const statRows = computed(() => {
  const toneValues = Object.values(statToneMap)

  return statDefinitions.value.map((definition, index) => {
    const result = calculationResultMap.value.get(String(definition.id)) ?? null
    return {
      ...definition,
      toneClass:
        statToneMap[definition.internalName] ?? toneValues[index % toneValues.length] ?? '',
      actualStat: result?.actualValue ?? null,
      minStat: result?.minimumValue ?? null,
      maxStat: result?.maximumValue ?? null,
      natureModifier: result?.natureModifier ?? 100,
    }
  })
})

const totalEv = computed(() => {
  return statDefinitions.value.reduce((sum, definition) => {
    return sum + normalizeInteger(statInputs[String(definition.id)]?.ev, 0, 252, 0)
  }, 0)
})

const remainingEv = computed(() => 510 - totalEv.value)
const isEvOverflow = computed(() => totalEv.value > 510)
const currentLevel = computed(() => normalizeInteger(level.value, 1, 100, 50))

watch(
  creatureOptions,
  (options) => {
    if (
      selectedCreatureValue.value &&
      !options.some((item) => item.value === selectedCreatureValue.value)
    ) {
      selectedCreatureValue.value = null
    }
  },
  { immediate: true },
)

watch(
  natureOptions,
  (options) => {
    selectedNatureValue.value = resolveDefaultNatureValue(options, selectedNatureValue.value)
  },
  { immediate: true },
)

watch(selectedCreature, (creature) => {
  if (!creature) {
    creaturePresetRequestId += 1
    creaturePresetLoading.value = false
    return
  }

  if (!creature.id) {
    message.warning('当前精灵缺少 ID，无法加载六围预设')
    return
  }

  void loadCreaturePreset(String(creature.id))
})

watch(
  calculationPayload,
  (payload) => {
    if (!payload) {
      calculationResult.value = null
      return
    }

    void loadCalculationResult(payload)
  },
  { immediate: true, deep: true },
)

function normalizeInteger(
  value: number | null | undefined,
  min: number,
  max: number,
  fallback: number,
) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback
  }

  return Math.min(max, Math.max(min, Math.trunc(value)))
}

function createDefaultStatInput(): StatEditorInput {
  return { baseStat: 80, iv: 31, ev: 0 }
}

function rebuildStatDefinitions() {
  const shortLabelMap: Record<string, string> = {
    hp: 'HP',
    attack: 'Atk',
    defense: 'Def',
    'special-attack': 'SpA',
    'special-defense': 'SpD',
    speed: 'Spe',
  }

  statDefinitions.value = statsCatalog.value
    .map((stat) => {
      const id = Number(stat.id)
      if (!Number.isFinite(id)) {
        return null
      }

      const internalName = stat.internalName?.trim() || `stat-${id}`

      return {
        id,
        internalName,
        label: stat.name?.trim() || internalName,
        shortLabel: shortLabelMap[internalName] ?? `#${id}`,
      }
    })
    .filter((item): item is StatDefinition => item !== null)

  for (const definition of statDefinitions.value) {
    statInputs[String(definition.id)] ??= createDefaultStatInput()
  }

  for (const statId of Object.keys(statInputs)) {
    if (!statDefinitions.value.some((definition) => String(definition.id) === statId)) {
      delete statInputs[statId]
    }
  }
}

function updateLevel(value: number | null) {
  level.value = normalizeInteger(value, 1, 100, 50)
}

function updateStatField(
  statId: string,
  field: keyof StatEditorInput,
  value: number | null,
  options: {
    fallback: number | null
    min?: number
    max?: number
  },
) {
  const target = statInputs[statId]
  if (!target) {
    return
  }

  const { fallback, min, max } = options

  if (value === null || Number.isNaN(value)) {
    target[field] = fallback
    return
  }

  const normalizedValue = Math.trunc(value)

  if (typeof min === 'number' && normalizedValue < min) {
    target[field] = min
    return
  }

  if (typeof max === 'number' && normalizedValue > max) {
    target[field] = max
    return
  }

  target[field] = normalizedValue
}

function applyLevelPreset(nextLevel: number) {
  updateLevel(nextLevel)
}

function applyIvPreset(nextIv: number) {
  statDefinitions.value.forEach((definition) => {
    statInputs[String(definition.id)].iv = nextIv
  })
}

function clearAllEv() {
  statDefinitions.value.forEach((definition) => {
    statInputs[String(definition.id)].ev = 0
  })
}

function resetCalculator() {
  creaturePresetRequestId += 1
  calculationRequestId += 1
  calculationLoading.value = false
  creaturePresetLoading.value = false
  calculationResult.value = null
  level.value = 50
  selectedCreatureValue.value = null
  selectedNatureValue.value = resolveDefaultNatureValue(natureOptions.value)

  statDefinitions.value.forEach((definition) => {
    statInputs[String(definition.id)] = createDefaultStatInput()
  })
}

function applyPerStatEvPreset(statId: string, nextEv: number) {
  statInputs[statId].ev = nextEv
}

function applyPerStatIvPreset(statId: string, nextIv: number) {
  statInputs[statId].iv = nextIv
}

function getCreatureDisplayName(creature: Creature) {
  const name = creature.name?.trim() || creature.internalName?.trim() || '未命名精灵'
  const speciesName =
    creature.creatureSpecies?.name?.trim() || creature.creatureSpecies?.internalName?.trim()
  return speciesName && speciesName !== name ? `${speciesName} / ${name}` : name
}

function getNatureLabel(value: string) {
  return String(natureOptions.value.find((item) => item.value === value)?.label ?? '认真（无修正）')
}

function rebuildCreatureOptions() {
  const nextCreatureMap: Record<string, Creature> = {}
  creatureOptions.value = creaturesCatalog.value
    .map((creature) => {
      const value = creature.id ? String(creature.id) : ''
      if (value !== '') {
        nextCreatureMap[value] = creature
      }
      return {
        label: getCreatureDisplayName(creature),
        value,
      }
    })
    .filter((item) => item.value !== '')
  creatureMap.value = nextCreatureMap
}

function rebuildNatureOptions() {
  if (naturesCatalog.value.length === 0) {
    natureOptions.value = [{ label: '认真（无修正）', value: 'neutral' }]
    return
  }

  natureOptions.value = naturesCatalog.value.map((nature) => {
    const increaseLabel =
      nature.increasedStat?.name?.trim() ||
      (nature.increasedStat?.id ? statLabelMap.value.get(String(nature.increasedStat.id)) : null)
    const decreaseLabel =
      nature.decreasedStat?.name?.trim() ||
      (nature.decreasedStat?.id ? statLabelMap.value.get(String(nature.decreasedStat.id)) : null)
    const natureName = nature.name?.trim() || nature.internalName?.trim() || '未命名性格'
    const effectLabel =
      nature.increasedStat?.id &&
      nature.decreasedStat?.id &&
      nature.increasedStat.id !== nature.decreasedStat.id
        ? `+${increaseLabel ?? nature.increasedStat.internalName ?? nature.increasedStat.id} / -${decreaseLabel ?? nature.decreasedStat.internalName ?? nature.decreasedStat.id}`
        : '无修正'

    return {
      label: `${natureName}（${effectLabel}）`,
      value: String(nature.id ?? nature.internalName ?? natureName),
    }
  })
}

function applyCreaturePreset(preset: StatCalculatorCreaturePreset) {
  let applied = 0

  preset.stats.forEach((entry) => {
    const input = statInputs[entry.statId]
    if (!input) {
      return
    }

    input.baseStat = normalizeInteger(entry.baseStat, 1, 255, 80)
    applied += 1
  })

  if (applied === 0) {
    message.warning('所选精灵预设未返回六围数据，当前仍可手动输入基础值')
  }
}

let creaturePresetRequestId = 0
let calculationRequestId = 0

async function loadCreaturePreset(creatureId: string) {
  creaturePresetRequestId += 1
  const currentRequestId = creaturePresetRequestId
  creaturePresetLoading.value = true

  try {
    const result = await getCreaturePreset(creatureId)
    if (currentRequestId !== creaturePresetRequestId) {
      return
    }

    applyCreaturePreset(result.data)
  } catch {
    if (currentRequestId !== creaturePresetRequestId) {
      return
    }

    message.warning('精灵预设加载失败，当前仍可手动输入基础值')
  } finally {
    if (currentRequestId === creaturePresetRequestId) {
      creaturePresetLoading.value = false
    }
  }
}

async function loadCalculationResult(payload: StatCalculatorRequest) {
  calculationRequestId += 1
  const currentRequestId = calculationRequestId
  calculationLoading.value = true

  try {
    const result = await calculateStats(payload)
    if (currentRequestId !== calculationRequestId) {
      return
    }

    calculationResult.value = result.data
  } catch {
    if (currentRequestId !== calculationRequestId) {
      return
    }

    calculationResult.value = null
    message.warning('能力值计算失败，请检查输入或稍后重试')
  } finally {
    if (currentRequestId === calculationRequestId) {
      calculationLoading.value = false
    }
  }
}

function resolveDefaultNatureValue(options: SelectOption[], currentValue?: string | null) {
  if (options.length === 0) {
    return 'neutral'
  }

  if (currentValue && options.some((item) => item.value === currentValue)) {
    return currentValue
  }

  const neutralNature = options.find((item) => {
    const nature = naturesCatalog.value.find(
      (candidate) => String(candidate.id ?? candidate.internalName ?? '') === String(item.value),
    )
    return (
      !nature?.increasedStat?.id ||
      !nature?.decreasedStat?.id ||
      nature.increasedStat.id === nature.decreasedStat.id
    )
  })

  return String(neutralNature?.value ?? options[0]?.value ?? 'neutral')
}

function getNatureTagType(modifier: number) {
  if (modifier > 100) {
    return 'success'
  }

  if (modifier < 100) {
    return 'error'
  }

  return 'default'
}

function getNatureTagText(modifier: number) {
  if (modifier > 100) {
    return '+10%'
  }

  if (modifier < 100) {
    return '-10%'
  }

  return '无修正'
}

async function loadCalculatorOptions() {
  loading.value = true

  const [creaturesResult, statsResult, naturesResult] = await Promise.allSettled([
    listCreatures({
      sort: 'sortingOrder,asc',
    } as CreatureQuery),
    listCoreStats(),
    listNatures(),
  ])

  if (creaturesResult.status === 'fulfilled') {
    creaturesCatalog.value = creaturesResult.value.data
    rebuildCreatureOptions()
  } else {
    creaturesCatalog.value = []
    creatureOptions.value = []
    creatureMap.value = {}
    message.warning('精灵列表加载失败，暂时无法使用预设下拉选择')
  }

  if (statsResult.status === 'fulfilled') {
    statsCatalog.value = statsResult.value.data
    rebuildStatDefinitions()
  } else {
    statsCatalog.value = []
    statDefinitions.value = []
    message.warning('能力数据加载失败，暂时无法完成能力值计算')
  }

  if (naturesResult.status === 'fulfilled') {
    naturesCatalog.value = naturesResult.value.data
    rebuildNatureOptions()
  } else {
    naturesCatalog.value = []
    rebuildNatureOptions()
    message.warning('性格数据加载失败，暂时仅提供无修正性格')
  }

  loading.value = false
}

tryOnMounted(() => {
  void loadCalculatorOptions()
})
</script>

<template>
  <div class="h-full overflow-auto p-4 max-sm:p-3">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-4">
      <section
        class="relative overflow-hidden rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(17,24,39,0.78))] p-6 text-white shadow-[0_24px_80px_rgba(2,6,23,0.28)] max-sm:p-4"
      >
        <div
          class="pointer-events-none absolute top-0 -right-10 h-32 w-32 rounded-full bg-white/6 blur-3xl"
        />
        <div class="relative flex flex-wrap items-start justify-between gap-4">
          <div class="max-w-3xl">
            <div
              class="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs tracking-[0.22em] text-white/72 uppercase"
            >
              <Icon
                icon="ph:calculator"
                class="size-4"
              />
              Stat Lab
            </div>
            <h1 class="text-3xl font-semibold tracking-[0.06em] max-sm:text-2xl">能力值计算器</h1>
            <p class="mt-3 max-w-2xl text-sm leading-7 text-white/70">
              同时计算六项能力值，基于等级、基础值、个体值、努力值和性格修正实时展示结果。
              支持从精灵列表快速带入种族值，也保留手动微调能力。
            </p>
          </div>

          <NSpace :size="8">
            <NButton
              size="small"
              secondary
              strong
              @click="applyLevelPreset(50)"
            >
              Lv 50
            </NButton>
            <NButton
              size="small"
              secondary
              strong
              @click="applyLevelPreset(100)"
            >
              Lv 100
            </NButton>
            <NButton
              size="small"
              quaternary
              @click="applyIvPreset(31)"
            >
              全 31 IV
            </NButton>
            <NButton
              size="small"
              quaternary
              @click="clearAllEv"
            >
              清空 EV
            </NButton>
            <NButton
              size="small"
              quaternary
              @click="resetCalculator"
            >
              重置
            </NButton>
          </NSpace>
        </div>
      </section>

      <div class="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <NCard
          :bordered="false"
          class="overflow-hidden"
          content-class="flex flex-col gap-4"
        >
          <div class="flex flex-wrap items-end gap-4">
            <div class="min-w-72 flex-[2]">
              <div class="mb-2 text-xs tracking-[0.18em] text-[var(--color-naive-text3)] uppercase">
                精灵
              </div>
              <NSelect
                :loading="loading || creaturePresetLoading"
                :options="creatureOptions"
                :value="selectedCreatureValue"
                clearable
                filterable
                placeholder="选择精灵后自动带入种族值"
                @update:value="selectedCreatureValue = $event === null ? null : String($event)"
              />
            </div>

            <div class="min-w-40 flex-1">
              <div class="mb-2 text-xs tracking-[0.18em] text-[var(--color-naive-text3)] uppercase">
                等级
              </div>
              <NInputNumber
                :value="currentLevel"
                :max="100"
                :min="1"
                :show-button="false"
                class="w-full"
                placeholder="1-100"
                @update:value="updateLevel"
              />
            </div>

            <div class="min-w-60 flex-[2]">
              <div class="mb-2 text-xs tracking-[0.18em] text-[var(--color-naive-text3)] uppercase">
                性格
              </div>
              <NSelect
                :loading="loading"
                :options="natureOptions"
                :value="selectedNatureValue"
                filterable
                placeholder="选择性格"
                @update:value="selectedNatureValue = String($event ?? 'neutral')"
              />
            </div>
          </div>

          <NAlert
            type="info"
            :show-icon="false"
          >
            HP 公式：`floor(((2 * 基础值 + IV + floor(EV / 4)) * 等级) / 100) + 等级 + 10` 非 HP
            公式：`floor((floor(((2 * 基础值 + IV + floor(EV / 4)) * 等级) / 100) + 5) * 性格补正)`
          </NAlert>
        </NCard>

        <div class="grid gap-4 sm:grid-cols-3">
          <NCard
            :bordered="false"
            content-class="h-full flex flex-col justify-between gap-2"
          >
            <div class="text-xs tracking-[0.18em] text-[var(--color-naive-text3)] uppercase">
              当前等级
            </div>
            <NStatistic :value="currentLevel" />
          </NCard>

          <NCard
            :bordered="false"
            content-class="h-full flex flex-col justify-between gap-2"
          >
            <div class="text-xs tracking-[0.18em] text-[var(--color-naive-text3)] uppercase">
              当前精灵
            </div>
            <div class="text-lg font-medium">
              {{ selectedCreature ? getCreatureDisplayName(selectedCreature) : '未选择' }}
            </div>
          </NCard>

          <NCard
            :bordered="false"
            content-class="h-full flex flex-col justify-between gap-2"
          >
            <div class="text-xs tracking-[0.18em] text-[var(--color-naive-text3)] uppercase">
              性格效果
            </div>
            <div class="text-lg font-medium">
              {{ calculationResult?.nature?.name ?? selectedNature?.label ?? '认真（无修正）' }}
            </div>
          </NCard>

          <NCard
            :bordered="false"
            content-class="h-full flex flex-col justify-between gap-2"
          >
            <div class="text-xs tracking-[0.18em] text-[var(--color-naive-text3)] uppercase">
              总努力值
            </div>
            <NStatistic :value="totalEv">
              <template #suffix>/ 510</template>
            </NStatistic>
            <div
              class="text-sm"
              :class="isEvOverflow ? 'text-rose-500' : 'text-[var(--color-naive-text3)]'"
            >
              {{ isEvOverflow ? `已超出 ${Math.abs(remainingEv)} 点` : `剩余 ${remainingEv} 点` }}
            </div>
          </NCard>
        </div>
      </div>

      <NAlert
        v-if="isEvOverflow"
        type="warning"
        title="总努力值超过 510"
      >
        当前总 EV 为 {{ totalEv }}，已超过宝可梦标准上限，不符合常规对战规则。
      </NAlert>

      <div class="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <NCard
          v-for="row in statRows"
          :key="row.id"
          :bordered="false"
          class="overflow-hidden"
          content-class="flex flex-col gap-4"
        >
          <template v-if="loading || (calculationLoading && !calculationResult)">
            <NSkeleton
              text
              :repeat="5"
            />
          </template>

          <template v-else>
            <div
              class="relative overflow-hidden rounded-3xl border border-white/6 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(17,24,39,0.66))] p-4 text-white"
            >
              <div
                class="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(255,255,255,0.15),transparent)]"
              />
              <div
                class="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br blur-3xl"
                :class="row.toneClass"
              />

              <div class="relative flex items-start justify-between gap-3">
                <div>
                  <div class="text-xs tracking-[0.18em] text-white/55 uppercase">
                    {{ row.shortLabel }}
                  </div>
                  <div class="mt-1 text-2xl font-semibold">
                    {{ row.label }}
                  </div>
                </div>

                <NTag
                  round
                  size="small"
                  :type="getNatureTagType(row.natureModifier)"
                >
                  {{ getNatureTagText(row.natureModifier) }}
                </NTag>
              </div>

              <div class="relative mt-6 grid grid-cols-[1fr_auto] items-end gap-3">
                <div>
                  <div class="text-xs text-white/55">当前能力值</div>
                  <div class="mt-2 text-5xl leading-none font-semibold">
                    {{ row.actualStat ?? '--' }}
                  </div>
                </div>

                <div class="text-right text-xs text-white/60">
                  <div>能力值范围</div>
                  <div class="mt-1 text-sm text-white/90">
                    {{ row.minStat ?? '--' }} - {{ row.maxStat ?? '--' }}
                  </div>
                </div>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <label class="flex flex-col gap-2">
                <span class="text-xs tracking-[0.12em] text-[var(--color-naive-text3)] uppercase">
                  基础值
                </span>
                <NInputNumber
                  :value="statInputs[String(row.id)]?.baseStat"
                  :max="255"
                  :min="1"
                  :show-button="false"
                  class="w-full"
                  @update:value="
                    updateStatField(String(row.id), 'baseStat', $event, {
                      fallback: 80,
                      min: 1,
                      max: 255,
                    })
                  "
                />
              </label>

              <label class="flex flex-col gap-2">
                <span class="text-xs tracking-[0.12em] text-[var(--color-naive-text3)] uppercase">
                  个体值 IV
                </span>
                <NInputNumber
                  :value="statInputs[String(row.id)]?.iv"
                  :max="31"
                  :min="0"
                  :show-button="false"
                  class="w-full"
                  @update:value="
                    updateStatField(String(row.id), 'iv', $event, {
                      fallback: 31,
                      min: 0,
                      max: 31,
                    })
                  "
                />
                <div class="flex gap-2">
                  <NButton
                    size="tiny"
                    quaternary
                    @click="applyPerStatIvPreset(String(row.id), 0)"
                  >
                    IV 0
                  </NButton>
                  <NButton
                    size="tiny"
                    quaternary
                    @click="applyPerStatIvPreset(String(row.id), 31)"
                  >
                    IV 31
                  </NButton>
                </div>
              </label>

              <label class="flex flex-col gap-2">
                <span class="text-xs tracking-[0.12em] text-[var(--color-naive-text3)] uppercase">
                  努力值 EV
                </span>
                <NInputNumber
                  :value="statInputs[String(row.id)]?.ev"
                  :max="252"
                  :min="0"
                  :show-button="false"
                  class="w-full"
                  @update:value="
                    updateStatField(String(row.id), 'ev', $event, {
                      fallback: 0,
                      min: 0,
                      max: 252,
                    })
                  "
                />
                <div class="flex flex-wrap gap-2">
                  <NButton
                    size="tiny"
                    quaternary
                    @click="applyPerStatEvPreset(String(row.id), 0)"
                  >
                    EV 0
                  </NButton>
                  <NButton
                    size="tiny"
                    quaternary
                    @click="applyPerStatEvPreset(String(row.id), 4)"
                  >
                    EV 4
                  </NButton>
                  <NButton
                    size="tiny"
                    quaternary
                    @click="applyPerStatEvPreset(String(row.id), 252)"
                  >
                    EV 252
                  </NButton>
                </div>
              </label>
            </div>
          </template>
        </NCard>
      </div>
    </div>
  </div>
</template>
