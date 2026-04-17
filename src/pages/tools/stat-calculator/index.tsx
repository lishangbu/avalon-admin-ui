import { ReloadOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import {
  App,
  Alert,
  Button,
  Card,
  Col,
  Empty,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
} from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getPage as getCreaturePage,
  type CreatureRecord,
} from '@/pages/catalog/creature/service'
import {
  listRows as listNatureRows,
  type NatureRecord,
} from '@/pages/catalog/nature/service'
import type { StatRecord } from '@/pages/catalog/stat/service'
import {
  calculateStats,
  getCreaturePreset,
  listCoreStats,
  type StatCalculatorCreaturePreset,
  type StatCalculatorEntryResultView,
  type StatCalculatorRequest,
  type StatCalculatorResultView,
} from './service'

type StatEditorInput = {
  baseStat: number | null
  iv: number | null
  ev: number | null
}

type StatDefinition = {
  id: string
  numericId: number
  internalName: string
  label: string
  shortLabel: string
}

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
  return {
    baseStat: 80,
    iv: 31,
    ev: 0,
  }
}

function getSummaryLabel(value: {
  id?: string | null
  name?: string | null
  internalName?: string | null
}) {
  const name = value.name?.trim()
  if (name) {
    return name
  }

  const internalName = value.internalName?.trim()
  if (internalName) {
    return internalName
  }

  const id = value.id?.trim()
  return id ? `#${id}` : '未命名'
}

function getCreatureDisplayName(creature: CreatureRecord) {
  const creatureName = getSummaryLabel(creature)
  const speciesName = creature.creatureSpecies
    ? getSummaryLabel(creature.creatureSpecies)
    : undefined

  return speciesName && speciesName !== creatureName
    ? `${speciesName} / ${creatureName}`
    : creatureName
}

function buildStatDefinitions(statsCatalog: StatRecord[]) {
  const shortLabelMap: Record<string, string> = {
    hp: 'HP',
    attack: 'Atk',
    defense: 'Def',
    'special-attack': 'SpA',
    'special-defense': 'SpD',
    speed: 'Spe',
  }

  return statsCatalog
    .map((stat) => {
      const numericId = Number(stat.id)
      if (!Number.isFinite(numericId)) {
        return null
      }

      const internalName = stat.internalName?.trim() || `stat-${numericId}`

      return {
        id: String(stat.id),
        numericId,
        internalName,
        label: stat.name?.trim() || internalName,
        shortLabel: shortLabelMap[internalName] ?? `#${numericId}`,
      }
    })
    .filter((item): item is StatDefinition => Boolean(item))
}

function getNatureOptionLabel(
  nature: NatureRecord,
  statDefinitions: StatDefinition[],
) {
  const statLabelMap = new Map(
    statDefinitions.map((item) => [item.id, item.label]),
  )
  const increasedStat = nature.increasedStat
  const decreasedStat = nature.decreasedStat
  const natureName = getSummaryLabel(nature)

  const increasedLabel =
    increasedStat?.name?.trim() ||
    (increasedStat?.id
      ? statLabelMap.get(String(increasedStat.id))
      : undefined) ||
    increasedStat?.internalName?.trim()
  const decreasedLabel =
    decreasedStat?.name?.trim() ||
    (decreasedStat?.id
      ? statLabelMap.get(String(decreasedStat.id))
      : undefined) ||
    decreasedStat?.internalName?.trim()

  const effectLabel =
    increasedStat?.id &&
    decreasedStat?.id &&
    String(increasedStat.id) !== String(decreasedStat.id)
      ? `+${increasedLabel ?? getSummaryLabel(increasedStat)} / -${decreasedLabel ?? getSummaryLabel(decreasedStat)}`
      : '无修正'

  return `${natureName}（${effectLabel}）`
}

function resolveDefaultNatureValue(
  naturesCatalog: NatureRecord[],
  currentValue?: string,
) {
  if (naturesCatalog.length === 0) {
    return 'neutral'
  }

  const supportedValues = naturesCatalog
    .map((nature) => String(nature.id ?? nature.internalName ?? ''))
    .filter(Boolean)

  if (currentValue && supportedValues.includes(currentValue)) {
    return currentValue
  }

  const neutralNature = naturesCatalog.find((nature) => {
    const increasedId = nature.increasedStat?.id
    const decreasedId = nature.decreasedStat?.id

    return (
      !increasedId ||
      !decreasedId ||
      String(increasedId) === String(decreasedId)
    )
  })

  return String(
    neutralNature?.id ??
      neutralNature?.internalName ??
      supportedValues[0] ??
      'neutral',
  )
}

function getNatureTagColor(modifier: number) {
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

export default function ToolPage() {
  const { message } = App.useApp()
  const creaturePresetRequestIdRef = useRef(0)
  const calculationRequestIdRef = useRef(0)

  const [loading, setLoading] = useState(true)
  const [calculationLoading, setCalculationLoading] = useState(false)
  const [creaturePresetLoading, setCreaturePresetLoading] = useState(false)
  const [level, setLevel] = useState<number | null>(50)
  const [selectedCreatureValue, setSelectedCreatureValue] = useState<string>()
  const [selectedNatureValue, setSelectedNatureValue] = useState('neutral')
  const [creaturesCatalog, setCreaturesCatalog] = useState<CreatureRecord[]>([])
  const [naturesCatalog, setNaturesCatalog] = useState<NatureRecord[]>([])
  const [statDefinitions, setStatDefinitions] = useState<StatDefinition[]>([])
  const [statInputs, setStatInputs] = useState<Record<string, StatEditorInput>>(
    {},
  )
  const [calculationResult, setCalculationResult] =
    useState<StatCalculatorResultView | null>(null)

  const creatureMap = Object.fromEntries(
    creaturesCatalog
      .filter((creature) => creature.id)
      .map((creature) => [String(creature.id), creature]),
  ) as Record<string, CreatureRecord>

  const selectedCreature = selectedCreatureValue
    ? (creatureMap[selectedCreatureValue] ?? null)
    : null

  const creatureOptions = creaturesCatalog
    .filter((creature) => creature.id)
    .map((creature) => ({
      label: getCreatureDisplayName(creature),
      value: String(creature.id),
    }))

  const natureOptions =
    naturesCatalog.length > 0
      ? naturesCatalog
          .filter((nature) => nature.id || nature.internalName)
          .map((nature) => ({
            label: getNatureOptionLabel(nature, statDefinitions),
            value: String(nature.id ?? nature.internalName ?? ''),
          }))
          .filter((option) => option.value)
      : [{ label: '认真（无修正）', value: 'neutral' }]

  const selectedNature = naturesCatalog.find(
    (nature) =>
      String(nature.id ?? nature.internalName ?? '') === selectedNatureValue,
  )

  const selectedNatureId = Number.isFinite(Number(selectedNatureValue))
    ? Number(selectedNatureValue)
    : null

  const currentLevel = normalizeInteger(level, 1, 100, 50)

  const totalEv = statDefinitions.reduce(
    (sum, definition) =>
      sum + normalizeInteger(statInputs[definition.id]?.ev, 0, 252, 0),
    0,
  )
  const remainingEv = 510 - totalEv
  const isEvOverflow = totalEv > 510

  const calculationResultMap = new Map(
    (calculationResult?.stats ?? []).map((entry) => [entry.statId, entry]),
  )

  const statRows = statDefinitions.map((definition) => {
    const result = calculationResultMap.get(definition.id) ?? null

    return {
      ...definition,
      input: statInputs[definition.id] ?? createDefaultStatInput(),
      result,
    }
  })

  const loadCalculatorOptions = useCallback(async () => {
    setLoading(true)

    const [creaturesResult, statsResult, naturesResult] =
      await Promise.allSettled([
        getCreaturePage({
          page: 1,
          size: 5000,
          sort: 'sortingOrder,asc',
          query: {},
        }),
        listCoreStats(),
        listNatureRows(),
      ])

    if (creaturesResult.status === 'fulfilled') {
      const nextCreatures = creaturesResult.value?.items ?? []
      setCreaturesCatalog(nextCreatures)
      setSelectedCreatureValue((current) =>
        current && nextCreatures.some((item) => String(item.id) === current)
          ? current
          : undefined,
      )
    } else {
      setCreaturesCatalog([])
      setSelectedCreatureValue(undefined)
      message.warning('精灵列表加载失败，暂时无法使用预设下拉选择')
    }

    if (statsResult.status === 'fulfilled') {
      const nextDefinitions = buildStatDefinitions(statsResult.value ?? [])
      setStatDefinitions(nextDefinitions)
      setStatInputs((current) => {
        const nextInputs: Record<string, StatEditorInput> = {}

        nextDefinitions.forEach((definition) => {
          nextInputs[definition.id] =
            current[definition.id] ?? createDefaultStatInput()
        })

        return nextInputs
      })
    } else {
      setStatDefinitions([])
      setStatInputs({})
      message.warning('能力数据加载失败，暂时无法完成能力值计算')
    }

    if (naturesResult.status === 'fulfilled') {
      const nextNatures = naturesResult.value ?? []
      setNaturesCatalog(nextNatures)
      setSelectedNatureValue((current) =>
        resolveDefaultNatureValue(nextNatures, current),
      )
    } else {
      setNaturesCatalog([])
      setSelectedNatureValue('neutral')
      message.warning('性格数据加载失败，暂时仅提供无修正性格')
    }

    setLoading(false)
  }, [message])

  function updateLevel(value: number | null) {
    setLevel(normalizeInteger(value, 1, 100, 50))
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
    setStatInputs((current) => {
      const target = current[statId]
      if (!target) {
        return current
      }

      let nextValue = value

      if (nextValue === null || Number.isNaN(nextValue)) {
        nextValue = options.fallback
      } else {
        nextValue = Math.trunc(nextValue)

        if (typeof options.min === 'number' && nextValue < options.min) {
          nextValue = options.min
        }

        if (typeof options.max === 'number' && nextValue > options.max) {
          nextValue = options.max
        }
      }

      return {
        ...current,
        [statId]: {
          ...target,
          [field]: nextValue,
        },
      }
    })
  }

  function applyIvPreset(nextIv: number) {
    setStatInputs((current) =>
      Object.fromEntries(
        Object.entries(current).map(([statId, input]) => [
          statId,
          { ...input, iv: nextIv },
        ]),
      ),
    )
  }

  function clearAllEv() {
    setStatInputs((current) =>
      Object.fromEntries(
        Object.entries(current).map(([statId, input]) => [
          statId,
          { ...input, ev: 0 },
        ]),
      ),
    )
  }

  function applyPerStatIvPreset(statId: string, nextIv: number) {
    setStatInputs((current) => ({
      ...current,
      [statId]: {
        ...(current[statId] ?? createDefaultStatInput()),
        iv: nextIv,
      },
    }))
  }

  function applyPerStatEvPreset(statId: string, nextEv: number) {
    setStatInputs((current) => ({
      ...current,
      [statId]: {
        ...(current[statId] ?? createDefaultStatInput()),
        ev: nextEv,
      },
    }))
  }

  function resetCalculator() {
    creaturePresetRequestIdRef.current += 1
    calculationRequestIdRef.current += 1
    setCreaturePresetLoading(false)
    setCalculationLoading(false)
    setCalculationResult(null)
    setLevel(50)
    setSelectedCreatureValue(undefined)
    setSelectedNatureValue(resolveDefaultNatureValue(naturesCatalog))
    setStatInputs((current) =>
      Object.fromEntries(
        Object.keys(current).map((statId) => [
          statId,
          createDefaultStatInput(),
        ]),
      ),
    )
  }

  const applyCreaturePreset = useCallback(
    (preset: StatCalculatorCreaturePreset) => {
      let appliedCount = 0

      setStatInputs((current) => {
        const next = { ...current }

        preset.stats.forEach((entry) => {
          const target = next[entry.statId]
          if (!target) {
            return
          }

          next[entry.statId] = {
            ...target,
            baseStat: normalizeInteger(entry.baseStat, 1, 255, 80),
          }
          appliedCount += 1
        })

        return next
      })

      if (appliedCount === 0) {
        message.warning('所选精灵预设未返回六围数据，当前仍可手动输入基础值')
      }
    },
    [message],
  )

  const loadCreaturePreset = useCallback(
    async (creatureId: string) => {
      const requestId = creaturePresetRequestIdRef.current + 1
      creaturePresetRequestIdRef.current = requestId
      setCreaturePresetLoading(true)

      try {
        const result = await getCreaturePreset(creatureId)
        if (requestId !== creaturePresetRequestIdRef.current) {
          return
        }

        if (result) {
          applyCreaturePreset(result)
        }
      } catch {
        if (requestId !== creaturePresetRequestIdRef.current) {
          return
        }

        message.warning('精灵预设加载失败，当前仍可手动输入基础值')
      } finally {
        if (requestId === creaturePresetRequestIdRef.current) {
          setCreaturePresetLoading(false)
        }
      }
    },
    [applyCreaturePreset, message],
  )

  const buildCalculationPayload =
    useCallback((): StatCalculatorRequest | null => {
      if (statDefinitions.length === 0) {
        return null
      }

      return {
        level: currentLevel,
        natureId: selectedNatureId,
        stats: statDefinitions.map((definition) => ({
          statId: definition.numericId,
          baseStat: normalizeInteger(
            statInputs[definition.id]?.baseStat,
            1,
            255,
            80,
          ),
          iv: normalizeInteger(statInputs[definition.id]?.iv, 0, 31, 31),
          ev: normalizeInteger(statInputs[definition.id]?.ev, 0, 252, 0),
        })),
      }
    }, [currentLevel, selectedNatureId, statDefinitions, statInputs])

  const loadCalculationResult = useCallback(
    async (payload: StatCalculatorRequest) => {
      const requestId = calculationRequestIdRef.current + 1
      calculationRequestIdRef.current = requestId
      setCalculationLoading(true)

      try {
        const result = await calculateStats(payload)
        if (requestId !== calculationRequestIdRef.current) {
          return
        }

        setCalculationResult(result ?? null)
      } catch {
        if (requestId !== calculationRequestIdRef.current) {
          return
        }

        setCalculationResult(null)
        message.warning('能力值计算失败，请检查输入或稍后重试')
      } finally {
        if (requestId === calculationRequestIdRef.current) {
          setCalculationLoading(false)
        }
      }
    },
    [message],
  )

  useEffect(() => {
    void loadCalculatorOptions()
  }, [loadCalculatorOptions])

  useEffect(() => {
    if (!selectedCreatureValue) {
      creaturePresetRequestIdRef.current += 1
      setCreaturePresetLoading(false)
      return
    }

    void loadCreaturePreset(selectedCreatureValue)
  }, [loadCreaturePreset, selectedCreatureValue])

  useEffect(() => {
    const payload = buildCalculationPayload()
    if (!payload) {
      setCalculationResult(null)
      return
    }

    const timer = window.setTimeout(() => {
      void loadCalculationResult(payload)
    }, 220)

    return () => {
      window.clearTimeout(timer)
    }
  }, [buildCalculationPayload, loadCalculationResult])

  const currentNatureLabel =
    calculationResult?.nature?.name ??
    (selectedNature
      ? getNatureOptionLabel(selectedNature, statDefinitions)
      : '认真（无修正）')

  return (
    <PageContainer
      title="能力值计算器"
      subTitle="基于等级、基础值、个体值、努力值与性格修正，实时计算六项能力值。"
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card
            title="基础设置"
            extra={
              <Space wrap>
                <Button size="small" onClick={() => updateLevel(50)}>
                  Lv 50
                </Button>
                <Button size="small" onClick={() => updateLevel(100)}>
                  Lv 100
                </Button>
                <Button size="small" onClick={() => applyIvPreset(31)}>
                  全 31 IV
                </Button>
                <Button size="small" onClick={clearAllEv}>
                  清空 EV
                </Button>
                <Button size="small" onClick={resetCalculator}>
                  重置
                </Button>
                <Button
                  size="small"
                  icon={<ReloadOutlined />}
                  loading={loading}
                  onClick={() => void loadCalculatorOptions()}
                >
                  重新加载
                </Button>
              </Space>
            }
          >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Row gutter={16}>
                <Col xs={24} md={10}>
                  <div style={{ marginBottom: 8 }}>精灵预设</div>
                  <Select
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    placeholder="选择精灵后自动带入种族值"
                    loading={loading || creaturePresetLoading}
                    value={selectedCreatureValue}
                    options={creatureOptions}
                    onChange={(value) =>
                      setSelectedCreatureValue(
                        typeof value === 'string' ? value : undefined,
                      )
                    }
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col xs={24} md={6}>
                  <div style={{ marginBottom: 8 }}>等级</div>
                  <InputNumber
                    min={1}
                    max={100}
                    precision={0}
                    value={currentLevel}
                    onChange={updateLevel}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <div style={{ marginBottom: 8 }}>性格</div>
                  <Select
                    showSearch
                    optionFilterProp="label"
                    placeholder="选择性格"
                    loading={loading}
                    value={selectedNatureValue}
                    options={natureOptions}
                    onChange={(value) =>
                      setSelectedNatureValue(
                        typeof value === 'string' ? value : 'neutral',
                      )
                    }
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>

              <Alert
                type="info"
                showIcon
                message="计算公式"
                description="HP：floor(((2 * 基础值 + IV + floor(EV / 4)) * 等级) / 100) + 等级 + 10；非 HP：floor((floor(((2 * 基础值 + IV + floor(EV / 4)) * 等级) / 100) + 5) * 性格补正)。"
              />
            </Space>
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card title="概览">
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Statistic title="当前等级" value={currentLevel} />
              </Col>
              <Col span={12}>
                <Statistic title="总努力值" value={totalEv} suffix="/ 510" />
              </Col>
              <Col span={24}>
                <Typography.Text type="secondary">
                  当前精灵：
                  {selectedCreature
                    ? getCreatureDisplayName(selectedCreature)
                    : '未选择'}
                </Typography.Text>
              </Col>
              <Col span={24}>
                <Typography.Text type="secondary">
                  性格效果：{currentNatureLabel}
                </Typography.Text>
              </Col>
              <Col span={24}>
                <Typography.Text type={isEvOverflow ? 'danger' : 'secondary'}>
                  {isEvOverflow
                    ? `已超出 ${Math.abs(remainingEv)} 点`
                    : `剩余 ${remainingEv} 点`}
                </Typography.Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {isEvOverflow ? (
        <Alert
          style={{ marginTop: 16 }}
          type="warning"
          showIcon
          message="总努力值超过 510"
          description={`当前总 EV 为 ${totalEv}，已超过宝可梦标准上限，不符合常规对战规则。`}
        />
      ) : null}

      {statDefinitions.length === 0 && !loading ? (
        <Alert
          style={{ marginTop: 16 }}
          type="error"
          showIcon
          message="缺少核心能力项"
          description="核心六围数据尚未成功加载，当前无法进行能力值计算。"
        />
      ) : null}

      <div style={{ marginTop: 16 }}>
        <Spin spinning={calculationLoading && !calculationResult}>
          {statDefinitions.length > 0 ? (
            <Row gutter={[16, 16]}>
              {statRows.map((row) => {
                const result: StatCalculatorEntryResultView | null =
                  row.result ?? null

                return (
                  <Col xs={24} md={12} xl={8} key={row.id}>
                    <Card
                      title={
                        <Space>
                          <span>{row.label}</span>
                          <Typography.Text type="secondary">
                            {row.shortLabel}
                          </Typography.Text>
                        </Space>
                      }
                      extra={
                        <Tag
                          color={getNatureTagColor(
                            result?.natureModifier ?? 100,
                          )}
                        >
                          {getNatureTagText(result?.natureModifier ?? 100)}
                        </Tag>
                      }
                    >
                      <Space
                        direction="vertical"
                        size={16}
                        style={{ width: '100%' }}
                      >
                        <Row gutter={12}>
                          <Col span={12}>
                            <Statistic
                              title="当前能力值"
                              value={result?.actualValue ?? '--'}
                            />
                          </Col>
                          <Col span={12}>
                            <Typography.Text type="secondary">
                              能力值范围
                            </Typography.Text>
                            <div style={{ marginTop: 6, fontWeight: 600 }}>
                              {result?.minimumValue ?? '--'} -{' '}
                              {result?.maximumValue ?? '--'}
                            </div>
                          </Col>
                        </Row>

                        <div>
                          <div style={{ marginBottom: 8 }}>基础值</div>
                          <InputNumber
                            min={1}
                            max={255}
                            precision={0}
                            value={row.input.baseStat ?? undefined}
                            onChange={(value) =>
                              updateStatField(row.id, 'baseStat', value, {
                                fallback: 80,
                                min: 1,
                                max: 255,
                              })
                            }
                            style={{ width: '100%' }}
                          />
                        </div>

                        <Row gutter={12}>
                          <Col span={12}>
                            <div style={{ marginBottom: 8 }}>个体值 IV</div>
                            <InputNumber
                              min={0}
                              max={31}
                              precision={0}
                              value={row.input.iv ?? undefined}
                              onChange={(value) =>
                                updateStatField(row.id, 'iv', value, {
                                  fallback: 31,
                                  min: 0,
                                  max: 31,
                                })
                              }
                              style={{ width: '100%' }}
                            />
                            <Space size={8} style={{ marginTop: 8 }}>
                              <Button
                                size="small"
                                onClick={() => applyPerStatIvPreset(row.id, 0)}
                              >
                                IV 0
                              </Button>
                              <Button
                                size="small"
                                onClick={() => applyPerStatIvPreset(row.id, 31)}
                              >
                                IV 31
                              </Button>
                            </Space>
                          </Col>

                          <Col span={12}>
                            <div style={{ marginBottom: 8 }}>努力值 EV</div>
                            <InputNumber
                              min={0}
                              max={252}
                              precision={0}
                              value={row.input.ev ?? undefined}
                              onChange={(value) =>
                                updateStatField(row.id, 'ev', value, {
                                  fallback: 0,
                                  min: 0,
                                  max: 252,
                                })
                              }
                              style={{ width: '100%' }}
                            />
                            <Space size={8} style={{ marginTop: 8 }} wrap>
                              <Button
                                size="small"
                                onClick={() => applyPerStatEvPreset(row.id, 0)}
                              >
                                EV 0
                              </Button>
                              <Button
                                size="small"
                                onClick={() => applyPerStatEvPreset(row.id, 4)}
                              >
                                EV 4
                              </Button>
                              <Button
                                size="small"
                                onClick={() =>
                                  applyPerStatEvPreset(row.id, 252)
                                }
                              >
                                EV 252
                              </Button>
                            </Space>
                          </Col>
                        </Row>
                      </Space>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          ) : (
            <Card style={{ marginTop: 16 }}>
              <Empty description="暂无可用的能力项数据" />
            </Card>
          )}
        </Spin>
      </div>
    </PageContainer>
  )
}
