import { PageContainer } from '@ant-design/pro-components'
import {
  App,
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  calculateTypeEffectiveness,
  getTypeEffectivenessChart,
  upsertTypeEffectivenessMatrix,
  type TypeEffectivenessChart,
  type TypeEffectivenessMatrixCellInput,
  type TypeEffectivenessResult,
  type TypeEffectivenessRow,
  type TypeEffectivenessTypeView,
} from './service'

type MatrixDraft = Record<string, number | null>

type MultiplierOption = {
  label: string
  value: number
}

type ChartSelections = {
  nextAttackingType: string | undefined
  nextDefendingTypes: string[]
}

const multiplierOptions: MultiplierOption[] = [
  { label: '0x · 免疫', value: 0 },
  { label: '0.5x · 抵抗', value: 0.5 },
  { label: '1x · 正常', value: 1 },
  { label: '2x · 克制', value: 2 },
]

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
      snapshot[
        pairKey(row.attackingType.internalName, cell.defendingType.internalName)
      ] = cell.multiplier ?? null
    })
  })

  return snapshot
}

function resolveChartSelections(
  nextChart: TypeEffectivenessChart,
  currentAttackingType: string | undefined,
  currentDefendingTypes: string[],
): ChartSelections {
  const supportedInternalNames = nextChart.supportedTypes.map(
    (item) => item.internalName,
  )

  if (supportedInternalNames.length === 0) {
    return {
      nextAttackingType: undefined,
      nextDefendingTypes: [],
    }
  }

  const supportedSet = new Set(supportedInternalNames)
  const nextAttackingType =
    currentAttackingType && supportedSet.has(currentAttackingType)
      ? currentAttackingType
      : (supportedInternalNames[0] ?? undefined)

  const nextDefendingTypes = currentDefendingTypes
    .filter((item) => supportedSet.has(item))
    .filter((item, index, current) => current.indexOf(item) === index)
    .slice(0, 2)

  if (nextDefendingTypes.length === 0) {
    const preferredSecondary =
      supportedInternalNames.find((item) => item !== nextAttackingType) ??
      supportedInternalNames[0]

    if (preferredSecondary) {
      nextDefendingTypes.push(preferredSecondary)
    }
  }

  return {
    nextAttackingType,
    nextDefendingTypes,
  }
}

function resolveEffectivenessMeta(
  effectiveness?: TypeEffectivenessResult['effectiveness'],
) {
  switch (effectiveness) {
    case 'immune':
      return { label: '免疫', color: 'default' as const }
    case 'not-very-effective':
      return { label: '效果不佳', color: 'warning' as const }
    case 'super-effective':
      return { label: '效果拔群', color: 'success' as const }
    case 'normal-effective':
      return { label: '效果正常', color: 'processing' as const }
    default:
      return { label: '待补全', color: 'error' as const }
  }
}

function resolveResultStatusMeta(status?: TypeEffectivenessResult['status']) {
  return status === 'complete'
    ? { label: '配置完整', color: 'success' as const }
    : { label: '存在缺口', color: 'warning' as const }
}

function renderTypeLabel(type: TypeEffectivenessTypeView) {
  return (
    <div>
      <div style={{ fontWeight: 600 }}>{type.name}</div>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        {type.internalName}
      </Typography.Text>
    </div>
  )
}

export default function DatasetTypeEffectivenessPage() {
  const { message } = App.useApp()
  const calculationRequestIdRef = useRef(0)
  const [chart, setChart] = useState<TypeEffectivenessChart>(createEmptyChart())
  const [chartLoading, setChartLoading] = useState(false)
  const [chartError, setChartError] = useState<string>()
  const [saving, setSaving] = useState(false)
  const [attackingType, setAttackingType] = useState<string>()
  const [defendingTypes, setDefendingTypes] = useState<string[]>([])
  const [calculation, setCalculation] =
    useState<TypeEffectivenessResult | null>(null)
  const [calculationLoading, setCalculationLoading] = useState(false)
  const [originalMatrix, setOriginalMatrix] = useState<MatrixDraft>({})
  const [draftMatrix, setDraftMatrix] = useState<MatrixDraft>({})

  const applyChart = useCallback(
    (
      nextChart: TypeEffectivenessChart,
      currentAttackingType: string | undefined,
      currentDefendingTypes: string[],
    ) => {
      const snapshot = buildMatrixSnapshot(nextChart)
      const selections = resolveChartSelections(
        nextChart,
        currentAttackingType,
        currentDefendingTypes,
      )

      setChart(nextChart)
      setOriginalMatrix(snapshot)
      setDraftMatrix({ ...snapshot })
      setAttackingType(selections.nextAttackingType)
      setDefendingTypes(selections.nextDefendingTypes)

      if (
        !selections.nextAttackingType ||
        selections.nextDefendingTypes.length === 0
      ) {
        setCalculation(null)
      }

      return selections
    },
    [],
  )

  const runCalculation = useCallback(
    async (
      nextAttackingType: string | undefined,
      nextDefendingTypes: string[],
    ) => {
      if (!nextAttackingType || nextDefendingTypes.length === 0) {
        setCalculation(null)
        setCalculationLoading(false)
        return
      }

      const requestId = calculationRequestIdRef.current + 1
      calculationRequestIdRef.current = requestId
      setCalculationLoading(true)

      try {
        const result = await calculateTypeEffectiveness(
          nextAttackingType,
          nextDefendingTypes,
        )

        if (requestId !== calculationRequestIdRef.current) {
          return
        }

        setCalculation(result ?? null)
      } finally {
        if (requestId === calculationRequestIdRef.current) {
          setCalculationLoading(false)
        }
      }
    },
    [],
  )

  const loadChart = useCallback(
    async (
      currentAttackingType?: string,
      currentDefendingTypes: string[] = [],
    ) => {
      setChartLoading(true)
      setChartError(undefined)
      try {
        const result = await getTypeEffectivenessChart()
        const selections = applyChart(
          result ?? createEmptyChart(),
          currentAttackingType,
          currentDefendingTypes,
        )
        await runCalculation(
          selections.nextAttackingType,
          selections.nextDefendingTypes,
        )
      } catch {
        setChartError('后端未能返回属性克制矩阵，请检查接口或稍后重试。')
      } finally {
        setChartLoading(false)
      }
    },
    [applyChart, runCalculation],
  )

  useEffect(() => {
    void loadChart()
  }, [loadChart])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void runCalculation(attackingType, defendingTypes)
    }, 280)

    return () => {
      window.clearTimeout(timer)
    }
  }, [attackingType, defendingTypes, runCalculation])

  const typeOptions = chart.supportedTypes.map((item) => ({
    label: `${item.name} · ${item.internalName}`,
    value: item.internalName,
  }))

  const defendingTypeOptions = chart.supportedTypes.map((item) => ({
    label: `${item.name} · ${item.internalName}`,
    value: item.internalName,
    disabled:
      defendingTypes.length >= 2 && !defendingTypes.includes(item.internalName),
  }))

  const progressPercentage =
    chart.completeness.expectedPairs > 0
      ? Math.round(
          (chart.completeness.configuredPairs /
            chart.completeness.expectedPairs) *
            100,
        )
      : 0

  const pendingChanges: TypeEffectivenessMatrixCellInput[] = Object.entries(
    draftMatrix,
  )
    .filter(([key, multiplier]) => (originalMatrix[key] ?? null) !== multiplier)
    .map(([key, multiplier]) => {
      const [nextAttackingType, nextDefendingType] = key.split('::')

      return {
        attackingType: nextAttackingType ?? '',
        defendingType: nextDefendingType ?? '',
        multiplier,
      }
    })
    .filter((item) => item.attackingType && item.defendingType)

  const resultStatusMeta = calculation
    ? resolveResultStatusMeta(calculation.status)
    : null
  const resultEffectivenessMeta = calculation
    ? resolveEffectivenessMeta(calculation.effectiveness)
    : null

  function handleDefendingTypesChange(value: string[]) {
    const nextValue = value
      .filter((item, index, current) => current.indexOf(item) === index)
      .slice(0, 2)

    if (nextValue.length !== value.length) {
      message.warning('防守属性最多选择两个，且不能重复')
    }

    setDefendingTypes(nextValue)
  }

  function handleCellChange(
    nextAttackingType: string,
    nextDefendingType: string,
    value: number | undefined,
  ) {
    const key = pairKey(nextAttackingType, nextDefendingType)

    setDraftMatrix((current) => ({
      ...current,
      [key]: value ?? null,
    }))
  }

  async function handleReloadChart() {
    await loadChart(attackingType, defendingTypes)
  }

  function handleResetMatrix() {
    setDraftMatrix({ ...originalMatrix })
  }

  async function handleSaveMatrix() {
    if (pendingChanges.length === 0) {
      return
    }

    setSaving(true)
    try {
      const result = await upsertTypeEffectivenessMatrix({
        cells: pendingChanges,
      })
      const selections = applyChart(
        result ?? createEmptyChart(),
        attackingType,
        defendingTypes,
      )
      message.success(`已保存 ${pendingChanges.length} 项矩阵变更`)
      await runCalculation(
        selections.nextAttackingType,
        selections.nextDefendingTypes,
      )
    } finally {
      setSaving(false)
    }
  }

  const columns: ColumnsType<TypeEffectivenessRow> = [
    {
      title: '攻击 \\ 防守',
      key: 'attackingType',
      dataIndex: 'attackingType',
      fixed: 'left',
      width: 180,
      render: (value: TypeEffectivenessTypeView) => renderTypeLabel(value),
    },
    ...chart.supportedTypes.map((defendingType) => ({
      title: renderTypeLabel(defendingType),
      key: defendingType.internalName,
      width: 150,
      render: (_: unknown, record: TypeEffectivenessRow) => {
        const key = pairKey(
          record.attackingType.internalName,
          defendingType.internalName,
        )
        const currentValue = draftMatrix[key] ?? null

        return (
          <Select
            allowClear
            placeholder="未配置"
            style={{ width: '100%' }}
            size="small"
            value={currentValue === null ? undefined : currentValue}
            options={multiplierOptions}
            onChange={(value) =>
              handleCellChange(
                record.attackingType.internalName,
                defendingType.internalName,
                value,
              )
            }
          />
        )
      },
    })),
  ]

  return (
    <PageContainer
      title="属性克制管理"
      subTitle="支持倍率查询、矩阵补全与按单元格批量保存。"
    >
      {chartError ? (
        <Alert
          style={{ marginBottom: 16 }}
          type="error"
          message="矩阵加载失败"
          description={chartError}
          showIcon
        />
      ) : null}

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} xl={14}>
          <Card title="倍率查询">
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <div style={{ marginBottom: 8 }}>攻击属性</div>
                  <Select
                    showSearch
                    optionFilterProp="label"
                    placeholder="选择攻击属性"
                    options={typeOptions}
                    loading={chartLoading}
                    disabled={chartLoading || typeOptions.length === 0}
                    value={attackingType}
                    onChange={setAttackingType}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <div style={{ marginBottom: 8 }}>防守属性，最多 2 个</div>
                  <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    placeholder="选择 1 到 2 个防守属性"
                    options={defendingTypeOptions}
                    loading={chartLoading}
                    disabled={chartLoading || defendingTypeOptions.length === 0}
                    value={defendingTypes}
                    onChange={handleDefendingTypesChange}
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>

              <Spin spinning={calculationLoading}>
                {calculation ? (
                  <Space
                    direction="vertical"
                    size={16}
                    style={{ width: '100%' }}
                  >
                    <Space size={[8, 8]} wrap>
                      {resultStatusMeta ? (
                        <Tag color={resultStatusMeta.color}>
                          {resultStatusMeta.label}
                        </Tag>
                      ) : null}
                      {resultEffectivenessMeta ? (
                        <Tag color={resultEffectivenessMeta.color}>
                          {resultEffectivenessMeta.label}
                        </Tag>
                      ) : null}
                    </Space>

                    <Statistic
                      title="最终倍率"
                      value={formatMultiplier(calculation.finalMultiplier)}
                    />

                    <Row gutter={[12, 12]}>
                      {calculation.defendingTypes.map((item) => (
                        <Col
                          xs={24}
                          md={12}
                          key={item.defendingType.internalName}
                        >
                          <Card size="small">
                            <Space
                              direction="vertical"
                              size={8}
                              style={{ width: '100%' }}
                            >
                              {renderTypeLabel(item.defendingType)}
                              <Typography.Text strong>
                                {formatMultiplier(item.multiplier)}
                              </Typography.Text>
                              <Tag
                                color={
                                  item.status === 'configured'
                                    ? 'success'
                                    : 'warning'
                                }
                              >
                                {item.status === 'configured'
                                  ? '已配置'
                                  : '缺失'}
                              </Tag>
                            </Space>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Space>
                ) : (
                  <Empty description="选择攻击属性和 1 到 2 个防守属性后自动计算" />
                )}
              </Spin>
            </Space>
          </Card>
        </Col>

        <Col xs={24} xl={10}>
          <Card title="矩阵概览">
            <Row gutter={[12, 12]}>
              <Col span={8}>
                <Statistic
                  title="理论格子数"
                  value={chart.completeness.expectedPairs}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="已配置"
                  value={chart.completeness.configuredPairs}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="缺失"
                  value={chart.completeness.missingPairs}
                />
              </Col>
            </Row>

            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <span>矩阵完成度</span>
                <strong>{progressPercentage}%</strong>
              </div>
              <Progress percent={progressPercentage} showInfo={false} />
            </div>

            {chart.completeness.missingPairs > 0 ? (
              <Alert
                style={{ marginTop: 16 }}
                type="warning"
                message="仍有未配置格子"
                description="查询接口遇到未配置格子时会把最终倍率标记为不完整，建议先把矩阵补齐。"
                showIcon
              />
            ) : null}
          </Card>
        </Col>
      </Row>

      <Card
        title="属性相克矩阵"
        extra={
          <Space wrap>
            <Button
              loading={chartLoading}
              onClick={() => void handleReloadChart()}
            >
              重新加载
            </Button>
            <Button
              disabled={pendingChanges.length === 0}
              onClick={handleResetMatrix}
            >
              撤销修改
            </Button>
            <Button
              type="primary"
              loading={saving}
              disabled={pendingChanges.length === 0}
              onClick={() => void handleSaveMatrix()}
            >
              保存 {pendingChanges.length} 项修改
            </Button>
          </Space>
        }
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Alert
            type="info"
            showIcon
            message="直接在格子里切换倍率，清空表示删除该配置。保存时只会提交实际变更过的单元格。"
          />

          <Table<TypeEffectivenessRow>
            rowKey={(record) => record.attackingType.internalName}
            loading={chartLoading || saving}
            columns={columns}
            dataSource={chart.rows}
            pagination={false}
            scroll={{ x: 220 + chart.supportedTypes.length * 150 }}
          />
        </Space>
      </Card>
    </PageContainer>
  )
}
