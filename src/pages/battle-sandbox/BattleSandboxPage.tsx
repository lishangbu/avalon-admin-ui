import {
  CheckCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Card,
  Flex,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import {
  battleSandboxService,
  type BattleActionViolationResponse,
  type BattleSandboxEvent,
  type BattleSandboxParticipant,
  type BattleSandboxRandomTrace,
  type BattleSandboxReplayValidationResponse,
  type BattleSandboxReplaySummaryResponse,
  type BattleSandboxRuleHitSummary,
  type BattleSandboxStateSnapshot,
  type BattleSandboxTurnResponse,
  type BattleSandboxTurnRecord,
} from '../../services/battle-sandbox';
import { JsonPreview } from '../../shared/components/JsonPreview';
import { message } from '../../shared/feedback/message';
import {
  apiErrorMessage,
  renderActionViolationResourceLabel,
  renderOptionLabel,
  renderOptionalText,
  requiredRule,
  requiredSelectRule,
} from '../battle-rules/shared/battle-rule-page-utils';
import { ParticipantStatConfigFields } from '../battle-rules/shared/participant-stat-config-fields';
import { useBattleRuleOptions } from '../battle-rules/shared/useBattleRuleOptions';
import {
  createDefaultAction,
  createDefaultParticipant,
  createDefaultSide,
  createDefaultValues,
  toSandboxRequest,
  type BattleSandboxFormValues,
  type SandboxParticipantForm,
  type SandboxSideForm,
} from './battle-sandbox-request';

interface ActorOption {
  label: string;
  value: string;
}

type SandboxStateParticipant = BattleSandboxStateSnapshot['sides'][number]['participants'][number];

interface ParticipantRow extends BattleSandboxParticipant {
  key: string;
  sideId: string;
  state?: SandboxStateParticipant;
}

interface EventRow extends BattleSandboxEvent {
  key: string;
  ruleHitFamilyCode?: string;
  ruleHitFamilyName?: string;
}

const requiredArrayRule = [
  { required: true, type: 'array' as const, min: 1, message: '请选择至少一项' },
];

const actionTypeOptions = [
  { label: '使用技能', value: 'USE_SKILL' },
  { label: '替换成员', value: 'SWITCH_PARTICIPANT' },
];

export function BattleSandboxPage() {
  const [form] = Form.useForm<BattleSandboxFormValues>();
  const queryClient = useQueryClient();
  const [result, setResult] = useState<BattleSandboxTurnResponse | null>(null);
  const [lastReplayRequestJson, setLastReplayRequestJson] = useState<string | null>(null);
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [replayTitle, setReplayTitle] = useState('');
  const [replaySearchInput, setReplaySearchInput] = useState('');
  const [replayQueryText, setReplayQueryText] = useState('');
  const [replayPage, setReplayPage] = useState(1);
  const [selectedEventTurnNumber, setSelectedEventTurnNumber] = useState<number | undefined>();
  const [ruleHitFamilyFilter, setRuleHitFamilyFilter] = useState<string | undefined>();
  const [validatingReplayId, setValidatingReplayId] = useState<string | null>(null);
  const [replayValidation, setReplayValidation] =
    useState<BattleSandboxReplayValidationResponse | null>(null);
  // 沙盒结算失败通常不是普通网络抖动，而是后端对客户端携带的战斗状态快照做了强校验。
  // 这类错误需要稳定留在页面上，方便排查是哪一个 state/行动/成员违反了运行时不变量；
  // 只用 message toast 会在几秒后消失，生产环境复盘时很容易丢掉真正的失败原因。
  const [sandboxError, setSandboxError] = useState<string | null>(null);
  const sides = Form.useWatch('sides', form);
  const actorOptions = useMemo(() => createActorOptions(sides), [sides]);
  const options = useBattleRuleOptions(['formats', 'creatures', 'skills', 'abilities', 'items']);
  const initialValues = useMemo(() => createDefaultValues(), []);
  const battleEnded = Boolean(result?.result);
  const replayQuery = useQuery({
    queryKey: ['battle-sandbox', 'replays', replayPage, replayQueryText],
    queryFn: () =>
      battleSandboxService.listReplays({
        page: replayPage - 1,
        size: 8,
        q: replayQueryText || undefined,
      }),
    staleTime: 15_000,
  });
  const ruleHitFamilyOptions = useMemo(
    () => createRuleHitFamilyOptions(result?.ruleHits ?? []),
    [result?.ruleHits],
  );
  const ruleHitsByItemCode = useMemo(
    () => createRuleHitsByItemCode(result?.ruleHits ?? []),
    [result?.ruleHits],
  );
  const displayedRuleHits = useMemo(
    () =>
      (result?.ruleHits ?? []).filter(
        (ruleHit) => !ruleHitFamilyFilter || ruleHit.familyCode === ruleHitFamilyFilter,
      ),
    [result?.ruleHits, ruleHitFamilyFilter],
  );
  const displayedEvents = useMemo(
    () =>
      result
        ? eventRows(result, ruleHitsByItemCode).filter(
            (event) =>
              (selectedEventTurnNumber === undefined ||
                event.turnNumber === selectedEventTurnNumber) &&
              (!ruleHitFamilyFilter || event.ruleHitFamilyCode === ruleHitFamilyFilter),
          )
        : [],
    [result, ruleHitFamilyFilter, ruleHitsByItemCode, selectedEventTurnNumber],
  );
  const eventTurnOptions = useMemo(
    () =>
      result?.state.turns.map((turn) => ({
        label: `第 ${turn.turnNumber} 回合`,
        value: turn.turnNumber,
      })) ?? [],
    [result],
  );

  const formatCodeOptions = useMemo(
    () =>
      options.formatOptions
        .filter((option) => option.code)
        .map((option) => ({ label: option.label, value: option.code })),
    [options.formatOptions],
  );

  const participantColumns = useMemo<ColumnsType<ParticipantRow>>(
    () => [
      { title: '队伍', dataIndex: 'sideId', width: 110 },
      {
        title: '精灵',
        dataIndex: 'creatureId',
        width: 180,
        render: (value) => renderOptionLabel(options.creatureOptions, value),
      },
      { title: '成员编号', dataIndex: 'actorId', width: 160 },
      { title: '上场', dataIndex: 'active', width: 90, render: renderActiveTag },
      { title: '等级', dataIndex: 'level', width: 90 },
      { title: 'HP', width: 120, render: (_, record) => `${record.currentHp}/${record.maxHp}` },
      { title: '主要状态', dataIndex: 'majorStatus', width: 120, render: renderOptionalText },
      {
        title: '临时状态',
        width: 260,
        render: (_, record) => renderParticipantRuntimeTags(record.state),
      },
      {
        title: '技能槽',
        dataIndex: 'skillSlots',
        render: (_, record) =>
          record.skillSlots
            .map((slot) => `${slot.name} ${slot.remainingPp}/${slot.maxPp}`)
            .join('、'),
      },
    ],
    [options.creatureOptions],
  );
  const violationColumns = useMemo<ColumnsType<BattleActionViolationResponse>>(
    () => [
      { title: '违规编码', dataIndex: 'code', width: 200 },
      { title: '行动成员', dataIndex: 'actorId', width: 150, render: renderOptionalText },
      { title: '目标成员', dataIndex: 'targetActorId', width: 150, render: renderOptionalText },
      {
        title: '关联资料',
        dataIndex: 'resourceId',
        width: 180,
        render: (_, record) =>
          renderActionViolationResourceLabel(record.code, record.resourceId, options.skillOptions),
      },
      { title: '说明', dataIndex: 'message', render: renderOptionalText },
    ],
    [options.skillOptions],
  );
  const resolveMutation = useMutation({
    mutationFn: async (values: BattleSandboxFormValues) => {
      const request = toSandboxRequest(values, result?.result ? undefined : result?.state);
      const response = await battleSandboxService.resolveTurn(request);
      return { requestJson: JSON.stringify(request), response };
    },
    onSuccess: ({ requestJson, response }) => {
      setSandboxError(null);
      setResult(response);
      setLastReplayRequestJson(requestJson);
      setSelectedEventTurnNumber(undefined);
      setRuleHitFamilyFilter(undefined);
      setReplayValidation(null);
      message.success(response.resolved ? '回合结算完成' : '行动校验未通过');
    },
    onError: (error) => {
      const errorMessage = apiErrorMessage(error, '沙盒结算失败');
      setSandboxError(errorMessage);
      message.error(errorMessage);
    },
  });
  const saveReplayMutation = useMutation({
    mutationFn: () => {
      if (!result) {
        throw new Error('请先结算或导入一份复盘。');
      }
      if (!lastReplayRequestJson) {
        throw new Error('当前复盘缺少原始请求，请重新结算后保存。');
      }
      const formatCode = form.getFieldValue('formatCode') as string | undefined;
      return battleSandboxService.createReplay({
        title: replayTitle.trim() || `第 ${result.turnNumber} 回合复盘`,
        formatCode: formatCode || 'unknown',
        requestJson: lastReplayRequestJson,
        responseJson: JSON.stringify(result),
      });
    },
    onSuccess: (response) => {
      setReplayTitle('');
      setReplayPage(1);
      setReplayValidation(null);
      void queryClient.invalidateQueries({ queryKey: ['battle-sandbox', 'replays'] });
      message.success(`复盘已保存：${response.title}`);
    },
    onError: (error) => {
      message.error(apiErrorMessage(error, '复盘保存失败'));
    },
  });
  const loadReplayMutation = useMutation({
    mutationFn: (id: string) => battleSandboxService.getReplay(id),
    onSuccess: (response) => {
      const imported = parseSandboxResponse(response.responseJson);
      if (!imported.response) {
        setImportError(imported.error);
        message.error('复盘 JSON 无法导入');
        return;
      }
      form.setFieldValue('formatCode', response.formatCode);
      setResult(imported.response);
      setLastReplayRequestJson(response.requestJson ?? null);
      setImportJson(response.responseJson);
      setImportError(null);
      setSandboxError(null);
      setSelectedEventTurnNumber(undefined);
      setRuleHitFamilyFilter(undefined);
      setReplayValidation(null);
      message.success(`复盘已载入：${response.title}`);
    },
    onError: (error) => {
      message.error(apiErrorMessage(error, '复盘读取失败'));
    },
  });
  const validateReplayMutation = useMutation({
    mutationFn: (id: string) => battleSandboxService.validateReplay(id),
    onMutate: (id) => {
      setValidatingReplayId(id);
      setReplayValidation(null);
    },
    onSuccess: (response) => {
      setReplayValidation(response);
      if (response.valid) {
        message.success(`复盘校验通过：${response.title}`);
      } else {
        message.error(`复盘校验未通过：${response.title}`);
      }
    },
    onError: (error) => {
      message.error(apiErrorMessage(error, '复盘校验失败'));
    },
    onSettled: () => {
      setValidatingReplayId(null);
    },
  });
  const deleteReplayMutation = useMutation({
    mutationFn: (id: string) => battleSandboxService.deleteReplay(id),
    onSuccess: () => {
      setReplayValidation(null);
      void queryClient.invalidateQueries({ queryKey: ['battle-sandbox', 'replays'] });
      message.success('复盘已删除');
    },
    onError: (error) => {
      message.error(apiErrorMessage(error, '复盘删除失败'));
    },
  });
  const replayColumns = useMemo<ColumnsType<BattleSandboxReplaySummaryResponse>>(
    () => [
      { title: '标题', dataIndex: 'title', width: 220 },
      { title: '赛制', dataIndex: 'formatCode', width: 150 },
      { title: '回合', dataIndex: 'turnNumber', width: 80 },
      {
        title: '状态',
        dataIndex: 'resolved',
        width: 90,
        render: (value) => (
          <Tag color={value ? 'green' : 'gold'}>{value ? '已结算' : '需处理'}</Tag>
        ),
      },
      { title: '结果', dataIndex: 'resultSummary', render: renderOptionalText },
      {
        title: '保存时间',
        dataIndex: 'savedAt',
        width: 180,
        render: renderSavedAt,
      },
      {
        title: '操作',
        key: 'actions',
        width: 230,
        render: (_, record) => (
          <Space size="small">
            <Button
              size="small"
              type="link"
              icon={<CheckCircleOutlined />}
              loading={validatingReplayId === record.id}
              onClick={() => validateReplayMutation.mutate(record.id)}
            >
              校验
            </Button>
            <Button
              size="small"
              type="link"
              icon={<UploadOutlined />}
              loading={loadReplayMutation.isPending}
              onClick={() => loadReplayMutation.mutate(record.id)}
            >
              载入
            </Button>
            <Popconfirm
              title="确认删除这条复盘？"
              description="删除后无法从管理端恢复。"
              okText="确定"
              cancelText="取消"
              okButtonProps={{ danger: true, loading: deleteReplayMutation.isPending }}
              onConfirm={() => deleteReplayMutation.mutate(record.id)}
            >
              <Button
                danger
                size="small"
                type="link"
                icon={<DeleteOutlined />}
                loading={deleteReplayMutation.isPending}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [deleteReplayMutation, loadReplayMutation, validateReplayMutation, validatingReplayId],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Typography.Title level={3} className="!mb-1">
            战斗沙盒
          </Typography.Title>
          <Typography.Text type="secondary">
            配置双方队伍和回合行动，按当前规则结算一回合。
          </Typography.Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={resetForm}>
          重置样例
        </Button>
      </div>

      <Card size="small">
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onValuesChange={clearResultWhenSetupChanges}
          onFinish={(values) => resolveMutation.mutate(values)}
        >
          <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(180px,1fr)]">
            <Form.Item name="formatCode" label="战斗赛制" rules={requiredSelectRule}>
              <Select
                showSearch={{ optionFilterProp: 'label' }}
                options={formatCodeOptions}
                loading={options.loading}
                placeholder="选择赛制"
              />
            </Form.Item>
            <Form.Item name="randomSeed" label="随机种子" rules={requiredRule}>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
          </div>

          <SidesEditor sides={sides} options={options} />
          <ActionsEditor actorOptions={actorOptions} options={options} />

          <Space className="mt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={resolveMutation.isPending}
              disabled={battleEnded}
            >
              {battleEnded ? '战斗已结束' : result ? '继续结算' : '结算回合'}
            </Button>
            <Button disabled={!result} onClick={restartBattle}>
              重开战斗
            </Button>
          </Space>
        </Form>
      </Card>

      <Card size="small" title="复盘 JSON">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
          <Input.TextArea
            aria-label="复盘 JSON"
            value={importJson}
            status={importError ? 'error' : undefined}
            onChange={(event) => {
              setImportJson(event.target.value);
              setImportError(null);
            }}
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder="粘贴沙盒响应 JSON 后导入，可继续排查或接着结算。"
          />
          <Space className="self-start">
            <Button icon={<UploadOutlined />} onClick={importSandboxResponse}>
              导入
            </Button>
            <Button
              icon={<CopyOutlined />}
              disabled={!result}
              onClick={() => result && copySandboxResponse(result)}
            >
              复制当前
            </Button>
          </Space>
        </div>
        {importError ? (
          <Alert
            showIcon
            className="mt-3"
            type="error"
            title="复盘 JSON 无法导入"
            description={importError}
          />
        ) : null}
      </Card>

      <Card
        size="small"
        title="已保存复盘"
        extra={
          <Space wrap>
            <Button
              icon={<ReloadOutlined />}
              loading={replayQuery.isFetching}
              onClick={() => void replayQuery.refetch()}
            >
              刷新
            </Button>
            <Input.Search
              allowClear
              aria-label="搜索复盘"
              className="w-56"
              value={replaySearchInput}
              placeholder="搜索标题或赛制"
              onChange={(event) => {
                const value = event.target.value;
                setReplaySearchInput(value);
                if (!value && replayQueryText) {
                  searchReplays('');
                }
              }}
              onSearch={searchReplays}
            />
            <Space.Compact>
              <Input
                aria-label="复盘标题"
                className="w-56"
                value={replayTitle}
                maxLength={120}
                placeholder="复盘标题"
                onChange={(event) => setReplayTitle(event.target.value)}
              />
              <Button
                type="primary"
                disabled={!result || !lastReplayRequestJson}
                loading={saveReplayMutation.isPending}
                onClick={() => saveReplayMutation.mutate()}
              >
                保存当前
              </Button>
            </Space.Compact>
          </Space>
        }
      >
        <Table<BattleSandboxReplaySummaryResponse>
          rowKey="id"
          size="small"
          columns={replayColumns}
          dataSource={replayQuery.data?.rows ?? []}
          loading={replayQuery.isFetching}
          scroll={{ x: 980 }}
          pagination={{
            current: replayPage,
            pageSize: 8,
            total: Number(replayQuery.data?.totalRowCount ?? 0),
            showSizeChanger: false,
            onChange: setReplayPage,
          }}
        />
        {replayValidation ? (
          <Alert
            showIcon
            className="mt-3"
            type={replayValidation.valid ? 'success' : 'error'}
            title={replayValidation.valid ? '复盘校验通过' : '复盘校验未通过'}
            description={renderReplayValidationDescription(replayValidation)}
          />
        ) : null}
      </Card>

      {sandboxError ? (
        <Alert showIcon type="error" title="沙盒结算失败" description={sandboxError} />
      ) : null}

      {result ? (
        <Card size="small">
          <Alert
            showIcon
            className="mb-3"
            type={result.resolved ? 'success' : 'warning'}
            title={result.resolved ? '回合结算完成' : '行动校验未通过'}
            description={renderResultDescription(result)}
          />

          <div className="space-y-4">
            <section>
              <Typography.Title level={5}>双方状态</Typography.Title>
              <Table<ParticipantRow>
                rowKey="key"
                columns={participantColumns}
                dataSource={participantRows(result)}
                pagination={false}
                scroll={{ x: 900 }}
              />
            </section>

            {result.violations.length > 0 ? (
              <section>
                <Typography.Title level={5}>行动违规</Typography.Title>
                <Table<BattleActionViolationResponse>
                  rowKey={violationKey}
                  columns={violationColumns}
                  dataSource={result.violations}
                  pagination={false}
                  scroll={{ x: 760 }}
                />
              </section>
            ) : null}

            <section>
              <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <Typography.Title level={5} className="!mb-0">
                  规则命中
                </Typography.Title>
                <Select
                  allowClear
                  aria-label="规则族筛选"
                  className="min-w-52"
                  placeholder="全部规则族"
                  options={ruleHitFamilyOptions}
                  value={ruleHitFamilyFilter}
                  onChange={setRuleHitFamilyFilter}
                />
              </div>
              <Table<BattleSandboxRuleHitSummary>
                rowKey={ruleHitKey}
                columns={ruleHitColumns}
                dataSource={displayedRuleHits}
                pagination={false}
                scroll={{ x: 720 }}
              />
            </section>

            <section>
              <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <Typography.Title level={5} className="!mb-0">
                  事件流
                </Typography.Title>
                <Space wrap>
                  <Select
                    allowClear
                    aria-label="事件规则族筛选"
                    className="min-w-52"
                    placeholder="全部规则族"
                    options={ruleHitFamilyOptions}
                    value={ruleHitFamilyFilter}
                    onChange={setRuleHitFamilyFilter}
                  />
                  <Select
                    allowClear
                    aria-label="事件回合筛选"
                    className="min-w-40"
                    placeholder="全部事件"
                    options={eventTurnOptions}
                    value={selectedEventTurnNumber}
                    onChange={setSelectedEventTurnNumber}
                  />
                </Space>
              </div>
              <Table<EventRow>
                rowKey="key"
                columns={eventColumns}
                dataSource={displayedEvents}
                pagination={false}
                scroll={{ x: 900 }}
                expandable={{
                  expandedRowRender: (record) => <JsonPreview value={record.payload} />,
                  rowExpandable: (record) => Object.keys(record.payload ?? {}).length > 0,
                }}
              />
            </section>

            <section>
              <Typography.Title level={5}>随机轨迹</Typography.Title>
              <Table<BattleSandboxRandomTrace>
                rowKey={(record) => String(record.sequence)}
                columns={randomTraceColumns}
                dataSource={result.randomTrace}
                pagination={false}
                scroll={{ x: 620 }}
              />
            </section>

            <section>
              <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <Typography.Title level={5} className="!mb-0">
                  已结算回合
                </Typography.Title>
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  disabled={result.state.turns.length === 0}
                  onClick={() => copySandboxResponse(result)}
                >
                  复制沙盒 JSON
                </Button>
              </div>
              <Table<BattleSandboxTurnRecord>
                rowKey={(record) => String(record.turnNumber)}
                columns={createTurnRecordColumns(setSelectedEventTurnNumber)}
                dataSource={result.state.turns}
                pagination={false}
                scroll={{ x: 760 }}
                expandable={{
                  expandedRowRender: (record) => <JsonPreview value={record} />,
                }}
              />
            </section>
          </div>
        </Card>
      ) : null}
    </div>
  );

  function resetForm() {
    form.setFieldsValue(createDefaultValues());
    setResult(null);
    setLastReplayRequestJson(null);
    setImportError(null);
    setSandboxError(null);
    setSelectedEventTurnNumber(undefined);
    setRuleHitFamilyFilter(undefined);
    setReplayValidation(null);
  }

  function clearResultWhenSetupChanges(changedValues: Partial<BattleSandboxFormValues>) {
    if ('formatCode' in changedValues || 'sides' in changedValues) {
      setResult(null);
      setLastReplayRequestJson(null);
      setImportError(null);
      setSandboxError(null);
      setSelectedEventTurnNumber(undefined);
      setRuleHitFamilyFilter(undefined);
      setReplayValidation(null);
    }
  }

  function restartBattle() {
    setResult(null);
    setLastReplayRequestJson(null);
    setImportError(null);
    setSandboxError(null);
    setSelectedEventTurnNumber(undefined);
    setRuleHitFamilyFilter(undefined);
    setReplayValidation(null);
  }

  function importSandboxResponse() {
    const imported = parseSandboxResponse(importJson);
    if (!imported.response) {
      setImportError(imported.error);
      message.error('复盘 JSON 无法导入');
      return;
    }
    setResult(imported.response);
    setLastReplayRequestJson(null);
    setImportError(null);
    setSandboxError(null);
    setSelectedEventTurnNumber(undefined);
    setRuleHitFamilyFilter(undefined);
    setReplayValidation(null);
    message.success('复盘 JSON 已导入');
  }

  function searchReplays(value: string) {
    setReplayQueryText(value.trim());
    setReplayPage(1);
    setReplayValidation(null);
  }
}

function SidesEditor({
  sides,
  options,
}: {
  sides: SandboxSideForm[] | undefined;
  options: ReturnType<typeof useBattleRuleOptions>;
}) {
  return (
    <Form.List name="sides">
      {(sideFields, sideOperations) => (
        <div className="space-y-3">
          {sideFields.map((sideField, sideIndex) => {
            const activeActorOptions = createParticipantActorOptions(
              sides?.[sideIndex]?.participants,
            );

            return (
              <div key={sideField.key} className="rounded border border-solid border-gray-200 p-3">
                <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <Typography.Title level={5} className="!mb-0">
                    队伍 {sideIndex + 1}
                  </Typography.Title>
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    disabled={sideFields.length <= 2}
                    onClick={() => sideOperations.remove(sideField.name)}
                  >
                    删除队伍
                  </Button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Form.Item
                    name={[sideField.name, 'sideId']}
                    label="队伍标识"
                    rules={requiredRule}
                  >
                    <Input placeholder="side-a" />
                  </Form.Item>
                  <Form.Item
                    name={[sideField.name, 'activeActorIds']}
                    label="上场成员"
                    rules={requiredArrayRule}
                  >
                    <Select
                      mode="multiple"
                      maxTagCount="responsive"
                      options={activeActorOptions}
                      placeholder="选择上场成员"
                    />
                  </Form.Item>
                </div>

                <Form.List name={[sideField.name, 'participants']}>
                  {(participantFields, participantOperations) => (
                    <div className="space-y-3">
                      {participantFields.map((participantField, participantIndex) => (
                        <div
                          key={participantField.key}
                          className="rounded border border-dashed border-gray-200 p-3"
                        >
                          <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <Typography.Text strong>成员 {participantIndex + 1}</Typography.Text>
                            <Button
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              disabled={participantFields.length <= 1}
                              onClick={() => participantOperations.remove(participantField.name)}
                            >
                              删除成员
                            </Button>
                          </div>

                          <div className="grid gap-3 md:grid-cols-3">
                            <Form.Item
                              name={[participantField.name, 'actorId']}
                              label="成员标识"
                              rules={requiredRule}
                            >
                              <Input placeholder="side-a-1" />
                            </Form.Item>
                            <Form.Item
                              name={[participantField.name, 'creatureId']}
                              label="精灵"
                              rules={requiredSelectRule}
                            >
                              <Select
                                showSearch={{ optionFilterProp: 'label' }}
                                options={options.creatureOptions}
                                loading={options.loading}
                                placeholder="选择精灵"
                              />
                            </Form.Item>
                            <Form.Item
                              name={[participantField.name, 'level']}
                              label="等级"
                              rules={requiredRule}
                            >
                              <InputNumber min={1} max={100} className="w-full" />
                            </Form.Item>
                          </div>

                          <div className="grid gap-3 md:grid-cols-3">
                            <Form.Item
                              name={[participantField.name, 'skillIds']}
                              label="技能"
                              rules={requiredArrayRule}
                            >
                              <Select
                                mode="multiple"
                                showSearch={{ optionFilterProp: 'label' }}
                                maxTagCount="responsive"
                                options={options.skillOptions}
                                loading={options.loading}
                                placeholder="选择技能"
                              />
                            </Form.Item>
                            <Form.Item name={[participantField.name, 'abilityId']} label="特性">
                              <Select
                                allowClear
                                showSearch={{ optionFilterProp: 'label' }}
                                options={options.abilityOptions}
                                loading={options.loading}
                                placeholder="可选"
                              />
                            </Form.Item>
                            <Form.Item name={[participantField.name, 'itemId']} label="道具">
                              <Select
                                allowClear
                                showSearch={{ optionFilterProp: 'label' }}
                                options={options.itemOptions}
                                loading={options.loading}
                                placeholder="可选"
                              />
                            </Form.Item>
                          </div>
                          <ParticipantStatConfigFields participantName={participantField.name} />
                        </div>
                      ))}

                      <Button
                        icon={<PlusOutlined />}
                        onClick={() =>
                          participantOperations.add(
                            createDefaultParticipant(sideIndex, participantFields.length),
                          )
                        }
                      >
                        添加成员
                      </Button>
                    </div>
                  )}
                </Form.List>
              </div>
            );
          })}

          <Button
            icon={<PlusOutlined />}
            onClick={() => sideOperations.add(createDefaultSide(sideFields.length))}
          >
            添加队伍
          </Button>
        </div>
      )}
    </Form.List>
  );
}

function ActionsEditor({
  actorOptions,
  options,
}: {
  actorOptions: ActorOption[];
  options: ReturnType<typeof useBattleRuleOptions>;
}) {
  return (
    <Form.List name="actions">
      {(actionFields, actionOperations) => (
        <div className="mt-4 space-y-3">
          <Typography.Title level={5} className="!mb-0">
            本回合行动
          </Typography.Title>
          {actionFields.map((actionField, actionIndex) => (
            <div key={actionField.key} className="rounded border border-solid border-gray-200 p-3">
              <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <Typography.Text strong>行动 {actionIndex + 1}</Typography.Text>
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  disabled={actionFields.length <= 1}
                  onClick={() => actionOperations.remove(actionField.name)}
                >
                  删除行动
                </Button>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <Form.Item
                  name={[actionField.name, 'type']}
                  label="行动类型"
                  rules={requiredSelectRule}
                >
                  <Select options={actionTypeOptions} placeholder="选择行动类型" />
                </Form.Item>
                <Form.Item
                  name={[actionField.name, 'actorId']}
                  label="行动成员"
                  rules={requiredSelectRule}
                >
                  <Select
                    showSearch={{ optionFilterProp: 'label' }}
                    options={actorOptions}
                    placeholder="选择行动成员"
                  />
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => {
                    const actionType = getFieldValue(['actions', actionField.name, 'type']);
                    return (
                      <Form.Item
                        name={[actionField.name, 'skillId']}
                        label="技能"
                        rules={actionType === 'USE_SKILL' ? requiredSelectRule : undefined}
                      >
                        <Select
                          allowClear
                          disabled={actionType !== 'USE_SKILL'}
                          showSearch={{ optionFilterProp: 'label' }}
                          options={options.skillOptions}
                          loading={options.loading}
                          placeholder={actionType === 'USE_SKILL' ? '选择技能' : '替换成员无需技能'}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
                <Form.Item
                  name={[actionField.name, 'targetActorId']}
                  label="目标成员"
                  rules={requiredSelectRule}
                >
                  <Select
                    showSearch={{ optionFilterProp: 'label' }}
                    options={actorOptions}
                    placeholder="选择目标成员"
                  />
                </Form.Item>
              </div>
            </div>
          ))}

          <Button
            icon={<PlusOutlined />}
            onClick={() => actionOperations.add(createDefaultAction(actionFields.length))}
          >
            添加行动
          </Button>
        </div>
      )}
    </Form.List>
  );
}

const eventColumns: ColumnsType<EventRow> = [
  { title: '回合', dataIndex: 'turnNumber', width: 90 },
  { title: '事件', dataIndex: 'type', width: 140, render: (_, record) => renderEventType(record) },
  {
    title: '规则族',
    dataIndex: 'ruleHitFamilyName',
    width: 220,
    render: (_, record) => renderRuleHitFamilyTag(record.ruleHitFamilyName),
  },
  { title: '说明', dataIndex: 'message', render: renderOptionalText },
];

const ruleHitColumns: ColumnsType<BattleSandboxRuleHitSummary> = [
  {
    title: '规则族',
    dataIndex: 'familyName',
    width: 240,
    render: renderOptionalText,
    sorter: (left, right) => compareText(left.familyName, right.familyName),
  },
  {
    title: '规则项',
    dataIndex: 'itemName',
    render: renderOptionalText,
    sorter: (left, right) => compareText(left.itemName, right.itemName),
  },
  {
    title: '触发次数',
    dataIndex: 'triggerCount',
    width: 120,
    sorter: (left, right) => left.triggerCount - right.triggerCount,
  },
];

const randomTraceColumns: ColumnsType<BattleSandboxRandomTrace> = [
  { title: '序号', dataIndex: 'sequence', width: 90 },
  { title: '原因', dataIndex: 'reason', width: 180 },
  { title: '上界', dataIndex: 'bound', width: 120 },
  { title: '结果', dataIndex: 'value', width: 120 },
];

function createTurnRecordColumns(
  inspectTurn: (turnNumber: number) => void,
): ColumnsType<BattleSandboxTurnRecord> {
  return [
    { title: '回合', dataIndex: 'turnNumber', width: 90 },
    {
      title: '行动',
      dataIndex: 'actions',
      render: (_, record) => record.actions.map(renderSandboxAction).join('、'),
    },
    {
      title: '随机数',
      dataIndex: 'randomTrace',
      width: 110,
      render: (_, record) => record.randomTrace.length,
    },
    {
      title: '事件数',
      dataIndex: 'events',
      width: 110,
      render: (_, record) => record.events.length,
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => inspectTurn(record.turnNumber)}
        >
          查看事件
        </Button>
      ),
    },
  ];
}

function createActorOptions(sides: SandboxSideForm[] | undefined): ActorOption[] {
  return (sides ?? []).flatMap((side) => {
    const sideId = side.sideId?.trim() || '未命名队伍';
    return (side.participants ?? [])
      .map((participant) => participant.actorId?.trim())
      .filter((actorId): actorId is string => Boolean(actorId))
      .map((actorId) => ({
        label: `${actorId} / ${sideId}`,
        value: actorId,
      }));
  });
}

function createParticipantActorOptions(
  participants: SandboxParticipantForm[] | undefined,
): ActorOption[] {
  return (participants ?? [])
    .map((participant) => participant.actorId?.trim())
    .filter((actorId): actorId is string => Boolean(actorId))
    .map((actorId) => ({ label: actorId, value: actorId }));
}

function renderActiveTag(active?: boolean) {
  return <Tag color={active ? 'blue' : 'default'}>{active ? '上场' : '后备'}</Tag>;
}

function renderEventType(event: EventRow) {
  // 事件编码仍保留在 payload 与回放里，表格展示只读后端统一生成的中文短名，避免前端再维护一份事件字典。
  const label = event.typeLabel || event.type || '-';
  return <Tag color="geekblue">{label}</Tag>;
}

function renderRuleHitFamilyTag(value?: string) {
  return value ? <Tag>{value}</Tag> : '-';
}

function renderResultDescription(result: BattleSandboxTurnResponse) {
  if (result.result) {
    return result.result.winningSideId
      ? `${result.result.winningSideId} 获胜：${result.result.reason}`
      : `战斗结束：${result.result.reason}`;
  }
  return result.resolved ? `第 ${result.turnNumber} 回合已结算。` : '请根据违规项调整行动。';
}

function renderReplayValidationDescription(response: BattleSandboxReplayValidationResponse) {
  const metrics = [
    `回合 ${response.turnNumber}`,
    `事件 ${response.eventCount}`,
    `已结算回合 ${response.turnCount}`,
    `规则命中 ${response.ruleHitCount}`,
  ].join(' / ');
  return (
    <Flex vertical gap={4}>
      <Typography.Text>{metrics}</Typography.Text>
      <Typography.Text type={response.deterministicReplayMatched ? 'success' : 'warning'}>
        确定性重放：{renderDeterministicReplayStatus(response)}
      </Typography.Text>
      {response.ruleHitFamilyCodes.length > 0 ? (
        <Typography.Text type="secondary">
          规则族：{response.ruleHitFamilyCodes.join('、')}
        </Typography.Text>
      ) : null}
      {response.warnings.map((warning) => (
        <Typography.Text key={`warning-${warning}`} type="warning">
          警告：{warning}
        </Typography.Text>
      ))}
      {response.violations.map((violation) => (
        <Typography.Text key={`violation-${violation}`} type="danger">
          问题：{violation}
        </Typography.Text>
      ))}
    </Flex>
  );
}

function renderDeterministicReplayStatus(response: BattleSandboxReplayValidationResponse) {
  if (!response.deterministicReplayChecked) {
    return '未执行';
  }
  return response.deterministicReplayMatched ? '已匹配' : '不匹配';
}

function renderSavedAt(value?: string) {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('zh-CN', { hour12: false });
}

function renderParticipantRuntimeTags(state?: SandboxStateParticipant) {
  const tags = participantRuntimeTags(state);
  if (tags.length === 0) {
    return '-';
  }
  return (
    <Space size={[0, 4]} wrap>
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </Space>
  );
}

function participantRuntimeTags(state?: SandboxStateParticipant): string[] {
  if (!state) {
    return [];
  }
  const tags: string[] = [];
  if (state.accuracyLockTargetActorId && state.accuracyLockTurnsRemaining > 0) {
    tags.push(`命中锁定 ${state.accuracyLockTargetActorId}（${state.accuracyLockTurnsRemaining}）`);
  }
  if (state.lockedMoveSkillId && state.lockedMoveTurnsRemaining > 0) {
    tags.push(`锁招 ${state.lockedMoveSkillId}（${state.lockedMoveTurnsRemaining}）`);
  }
  if (state.choiceLockedSkillId) {
    tags.push(`讲究锁定 ${state.choiceLockedSkillId}`);
  }
  if (state.chargingTurnsRemaining > 0) {
    tags.push(`蓄力 ${state.chargingSkillId ?? '-'}（${state.chargingTurnsRemaining}）`);
  }
  if (state.rechargeTurnsRemaining > 0) {
    tags.push(`休整（${state.rechargeTurnsRemaining}）`);
  }
  if (state.confusionTurnsRemaining > 0) {
    tags.push(`混乱（${state.confusionTurnsRemaining}）`);
  }
  if (state.healBlockTurnsRemaining > 0) {
    tags.push(`回复封锁（${state.healBlockTurnsRemaining}）`);
  }
  if (state.tauntTurnsRemaining > 0) {
    tags.push(`挑衅（${state.tauntTurnsRemaining}）`);
  }
  if (state.disabledSkillId && state.disabledSkillTurnsRemaining > 0) {
    tags.push(`定身 ${state.disabledSkillId}（${state.disabledSkillTurnsRemaining}）`);
  }
  if (state.tormented) {
    tags.push('无理取闹');
  }
  if (state.boundByActorId && state.bindingTurnsRemaining > 0) {
    tags.push(`束缚 ${state.boundByActorId}（${state.bindingTurnsRemaining}）`);
  }
  if (state.substituteHp > 0) {
    tags.push(`替身 ${state.substituteHp}`);
  }
  return tags;
}

async function copySandboxResponse(response: BattleSandboxTurnResponse) {
  try {
    await navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    message.success('复盘 JSON 已复制');
  } catch {
    message.error('复制失败');
  }
}

interface SandboxImportResult {
  response: BattleSandboxTurnResponse | null;
  error: string;
}

function parseSandboxResponse(raw: string): SandboxImportResult {
  if (!raw.trim()) {
    return { response: null, error: '请输入复盘 JSON。' };
  }

  let parsed: Partial<BattleSandboxTurnResponse>;
  try {
    parsed = JSON.parse(raw) as Partial<BattleSandboxTurnResponse>;
  } catch {
    return { response: null, error: 'JSON 语法不正确。' };
  }

  const missingFields: string[] = [];
  if (typeof parsed.resolved !== 'boolean') missingFields.push('resolved');
  if (typeof parsed.turnNumber !== 'number') missingFields.push('turnNumber');
  if (!Array.isArray(parsed.sides)) missingFields.push('sides');
  if (!Array.isArray(parsed.events)) missingFields.push('events');
  if (!Array.isArray(parsed.violations)) missingFields.push('violations');
  if (!Array.isArray(parsed.ruleHits)) missingFields.push('ruleHits');
  if (!Array.isArray(parsed.randomTrace)) missingFields.push('randomTrace');
  if (!parsed.state || typeof parsed.state !== 'object') {
    missingFields.push('state');
  } else {
    // 导入复盘后会把 state 原样发回后端继续结算；这里必须在客户端先挡住明显残缺的快照。
    if (typeof parsed.state.turnNumber !== 'number') missingFields.push('state.turnNumber');
    if (!Array.isArray(parsed.state.turns)) missingFields.push('state.turns');
  }

  if (missingFields.length > 0) {
    return { response: null, error: `缺少字段：${missingFields.join('、')}` };
  }

  return { response: parsed as BattleSandboxTurnResponse, error: '' };
}

function renderSandboxAction(action: BattleSandboxTurnRecord['actions'][number]) {
  if (action.type === 'SWITCH_PARTICIPANT') {
    return `${action.actorId} 替换为 ${action.targetActorId}`;
  }
  return `${action.actorId} 使用 ${action.skillId ?? '-'} -> ${action.targetActorId}`;
}

function participantRows(result: BattleSandboxTurnResponse): ParticipantRow[] {
  const statesByActorId = new Map(
    result.state.sides.flatMap((side) =>
      side.participants.map((participant) => [participant.actorId, participant] as const),
    ),
  );
  return result.sides.flatMap((side) =>
    side.participants.map((participant) => ({
      ...participant,
      sideId: side.sideId,
      state: statesByActorId.get(participant.actorId),
      key: `${side.sideId}-${participant.actorId}`,
    })),
  );
}

function createRuleHitFamilyOptions(ruleHits: BattleSandboxRuleHitSummary[]) {
  const families = new Map<string, string>();
  ruleHits.forEach((ruleHit) => {
    if (!families.has(ruleHit.familyCode)) {
      families.set(ruleHit.familyCode, ruleHit.familyName || ruleHit.familyCode);
    }
  });
  return Array.from(families, ([value, label]) => ({ label, value })).sort((left, right) =>
    compareText(left.label, right.label),
  );
}

function createRuleHitsByItemCode(ruleHits: BattleSandboxRuleHitSummary[]) {
  const ruleHitsByItemCode = new Map<string, BattleSandboxRuleHitSummary>();
  ruleHits.forEach((ruleHit) => {
    // 同一个事件类型只需要知道它属于哪个规则族；触发次数仍以“规则命中”表里的聚合值为准。
    if (!ruleHitsByItemCode.has(ruleHit.itemCode)) {
      ruleHitsByItemCode.set(ruleHit.itemCode, ruleHit);
    }
  });
  return ruleHitsByItemCode;
}

function eventRows(
  result: BattleSandboxTurnResponse,
  ruleHitsByItemCode: Map<string, BattleSandboxRuleHitSummary>,
): EventRow[] {
  return result.events.map((event, index) => ({
    ...event,
    ruleHitFamilyCode: ruleHitsByItemCode.get(event.type)?.familyCode,
    ruleHitFamilyName: ruleHitsByItemCode.get(event.type)?.familyName,
    key: `${event.turnNumber}-${event.type}-${index}`,
  }));
}

function compareText(left?: string, right?: string) {
  return (left || '').localeCompare(right || '', 'zh-CN');
}

function violationKey(record: BattleActionViolationResponse): string {
  return [
    record.code,
    record.actorId,
    record.targetActorId ?? 'none',
    record.resourceId ?? 'none',
    record.message,
  ].join('-');
}

function ruleHitKey(record: BattleSandboxRuleHitSummary): string {
  return [record.familyCode, record.itemCode, record.itemName].join('-');
}

export default BattleSandboxPage;
