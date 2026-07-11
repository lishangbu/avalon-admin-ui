import { ReloadOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Card, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  battleSessionService,
  type BattleSessionResponse,
  type BattleSessionTerminationRequest,
  type BattleSessionTurnCommandRequest,
  type BattleSessionTurnRecordResponse,
} from '../../../services/battle-sessions';
import { PageErrorState } from '../../../shared/components/PageErrorState';
import { JsonPreview } from '../../../shared/components/JsonPreview';
import {
  BattleSessionConflictState,
  BattleSessionNotFoundState,
  battleSessionErrorKind,
} from '../shared/BattleSessionFeedback';
import { BattleSessionLifecyclePanel } from './BattleSessionLifecyclePanel';
import { BattleSessionTurnRequirements } from './BattleSessionTurnRequirements';

type BattleActionRequest = NonNullable<BattleSessionTurnCommandRequest['actions']>[number];
type SessionParticipant = BattleSessionResponse['sides'][number]['participants'][number];

interface SessionParticipantRow extends SessionParticipant {
  key: string;
  sideId: string;
}

interface RandomTraceRow {
  key: string;
  turnNumber: number;
  sequence: number;
  bound: number;
  reason: string;
  value: number;
}

/** Battle Session 状态、权威行动要求与回合事实页。 */
export function BattleSessionDetailPage() {
  const { sessionId = '' } = useParams();
  const queryClient = useQueryClient();
  const sessionKey = ['battle-sessions', 'detail', sessionId] as const;
  const turnsKey = ['battle-sessions', 'turns', sessionId] as const;
  const [turnPage, setTurnPage] = useState(1);
  const [pendingTurnCommand, setPendingTurnCommand] =
    useState<BattleSessionTurnCommandRequest | null>(null);
  const [pendingTerminationCommand, setPendingTerminationCommand] =
    useState<BattleSessionTerminationRequest | null>(null);

  const sessionQuery = useQuery({
    queryKey: sessionKey,
    queryFn: () => battleSessionService.get(sessionId),
    enabled: Boolean(sessionId),
  });
  const turnsQuery = useQuery({
    queryKey: [...turnsKey, turnPage],
    queryFn: () => battleSessionService.listTurns(sessionId, { page: turnPage - 1, size: 20 }),
    enabled: Boolean(sessionId) && sessionQuery.isSuccess,
  });
  const turnMutation = useMutation({
    mutationFn: (command: BattleSessionTurnCommandRequest) =>
      battleSessionService.submitTurn(sessionId, command),
    onSuccess: (response) => {
      queryClient.setQueryData(sessionKey, response.session);
      setPendingTurnCommand(null);
      void queryClient.invalidateQueries({ queryKey: turnsKey });
    },
  });
  const terminationMutation = useMutation({
    mutationFn: (command: BattleSessionTerminationRequest) =>
      battleSessionService.terminate(sessionId, command),
    onSuccess: (session) => {
      queryClient.setQueryData(sessionKey, session);
      setPendingTerminationCommand(null);
    },
  });

  const session = sessionQuery.data;
  const turnRecords = turnsQuery.data?.rows ?? [];
  const turnsErrorKind = turnsQuery.isError ? battleSessionErrorKind(turnsQuery.error) : 'generic';
  const turnErrorKind = turnMutation.isError
    ? battleSessionErrorKind(turnMutation.error)
    : 'generic';
  const terminationErrorKind = terminationMutation.isError
    ? battleSessionErrorKind(terminationMutation.error)
    : 'generic';
  const sessionWasEvicted =
    (sessionQuery.isError && battleSessionErrorKind(sessionQuery.error) === 'not-found') ||
    (turnsQuery.isError && turnsErrorKind === 'not-found') ||
    (turnMutation.isError && turnErrorKind === 'not-found') ||
    (terminationMutation.isError && terminationErrorKind === 'not-found');

  function submitTurn(actions: BattleActionRequest[]) {
    if (!session || session.status !== 'ACTIVE') {
      return;
    }
    const command: BattleSessionTurnCommandRequest = {
      commandId: crypto.randomUUID(),
      expectedRevision: session.revision,
      actions,
    };
    setPendingTurnCommand(command);
    turnMutation.mutate(command);
  }

  function retryTurn() {
    if (pendingTurnCommand) {
      turnMutation.mutate(pendingTurnCommand);
    }
  }

  function refreshAfterConflict() {
    setPendingTurnCommand(null);
    turnMutation.reset();
    void sessionQuery.refetch();
  }

  function terminateSession() {
    if (!session || session.status !== 'ACTIVE') {
      return;
    }
    const command: BattleSessionTerminationRequest = {
      commandId: crypto.randomUUID(),
      expectedRevision: session.revision,
      reason: '管理员终止',
    };
    setPendingTerminationCommand(command);
    terminationMutation.mutate(command);
  }

  function retryTermination() {
    if (pendingTerminationCommand) {
      terminationMutation.mutate(pendingTerminationCommand);
    }
  }

  function refreshAfterTerminationConflict() {
    setPendingTerminationCommand(null);
    terminationMutation.reset();
    void sessionQuery.refetch();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Typography.Title level={3} className="!mb-1">
            战斗会话详情
          </Typography.Title>
          <Typography.Text type="secondary">{sessionId}</Typography.Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          loading={sessionQuery.isFetching || turnsQuery.isFetching}
          onClick={() => {
            void sessionQuery.refetch();
            void turnsQuery.refetch();
          }}
        >
          刷新
        </Button>
      </div>

      {sessionWasEvicted ? <BattleSessionNotFoundState /> : null}
      {sessionQuery.isError && battleSessionErrorKind(sessionQuery.error) !== 'not-found' ? (
        <PageErrorState
          title="战斗会话加载失败"
          message={sessionQuery.error instanceof Error ? sessionQuery.error.message : undefined}
          onRetry={() => void sessionQuery.refetch()}
        />
      ) : null}

      {session && !sessionWasEvicted ? (
        <>
          <Card size="small" title={<Typography.Title level={4}>当前状态</Typography.Title>}>
            <BattleSessionLifecyclePanel
              status={session.status}
              revision={session.revision}
              turnNumber={session.turnNumber}
              createdAt={session.createdAt}
              updatedAt={session.updatedAt}
              endedAt={session.endedAt}
              expiresAt={session.expiresAt}
              terminating={terminationMutation.isPending}
              onTerminate={terminateSession}
            />
            {session.result ? (
              <Alert
                className="mt-3"
                showIcon
                type="success"
                title="战斗已完成"
                description={`${session.result.winningSideId ?? '平局'} / ${session.result.reason}`}
              />
            ) : null}
            {session.termination ? (
              <Alert
                className="mt-3"
                showIcon
                type="info"
                title="会话已终止"
                description={session.termination.reason}
              />
            ) : null}
            <Table<SessionParticipantRow>
              className="mt-3"
              rowKey="key"
              size="small"
              columns={participantColumns}
              dataSource={participantRows(session)}
              pagination={false}
              scroll={{ x: 900 }}
            />
          </Card>

          {turnMutation.isError && turnErrorKind === 'conflict' ? (
            <BattleSessionConflictState onRefresh={refreshAfterConflict} />
          ) : null}
          {turnMutation.isError && turnErrorKind !== 'conflict' ? (
            <Alert
              showIcon
              type="error"
              title="回合提交失败"
              description={
                turnMutation.error instanceof Error ? turnMutation.error.message : '请稍后重试'
              }
              action={
                pendingTurnCommand ? (
                  <Button size="small" onClick={retryTurn}>
                    使用相同命令重试
                  </Button>
                ) : undefined
              }
            />
          ) : null}
          {terminationMutation.isError && terminationErrorKind === 'conflict' ? (
            <BattleSessionConflictState
              mode="termination"
              onRefresh={refreshAfterTerminationConflict}
            />
          ) : null}
          {terminationMutation.isError && terminationErrorKind === 'generic' ? (
            <Alert
              showIcon
              type="error"
              title="会话终止失败"
              description={
                terminationMutation.error instanceof Error
                  ? terminationMutation.error.message
                  : '请刷新后重试'
              }
              action={
                pendingTerminationCommand ? (
                  <Button size="small" onClick={retryTermination}>
                    使用相同终止命令重试
                  </Button>
                ) : undefined
              }
            />
          ) : null}

          <Card size="small" title={<Typography.Title level={4}>下一回合要求</Typography.Title>}>
            {session.status === 'ACTIVE' ? (
              <BattleSessionTurnRequirements
                revision={session.revision}
                requirements={session.turnRequirements}
                pending={turnMutation.isPending}
                onSubmit={submitTurn}
              />
            ) : (
              <Typography.Text type="secondary">终态会话保持只读。</Typography.Text>
            )}
          </Card>

          <Card size="small" title={<Typography.Title level={4}>回合记录</Typography.Title>}>
            {turnsQuery.isError && turnsErrorKind !== 'not-found' ? (
              <Alert
                className="mb-3"
                showIcon
                type="error"
                title="回合记录加载失败"
                description={
                  turnsQuery.error instanceof Error ? turnsQuery.error.message : '请稍后重试'
                }
                action={
                  <Button size="small" onClick={() => void turnsQuery.refetch()}>
                    重新加载回合记录
                  </Button>
                }
              />
            ) : null}
            <Table<BattleSessionTurnRecordResponse>
              rowKey="commandId"
              size="small"
              columns={turnRecordColumns}
              dataSource={turnRecords}
              loading={turnsQuery.isLoading}
              locale={{ emptyText: '暂无回合记录' }}
              pagination={{
                current: turnPage,
                pageSize: 20,
                total: Number(turnsQuery.data?.totalRowCount ?? 0),
                showSizeChanger: false,
                onChange: setTurnPage,
              }}
              expandable={{
                expandedRowRender: (record) => (
                  <JsonPreview
                    value={{ submittedActions: record.submittedActions, events: record.events }}
                  />
                ),
              }}
            />
          </Card>

          <Card size="small" title={<Typography.Title level={4}>随机轨迹</Typography.Title>}>
            <Table<RandomTraceRow>
              rowKey="key"
              size="small"
              columns={randomTraceColumns}
              dataSource={randomTraceRows(turnRecords)}
              loading={turnsQuery.isLoading}
              locale={{ emptyText: '暂无随机轨迹' }}
              pagination={false}
            />
          </Card>
        </>
      ) : null}
    </div>
  );
}

const participantColumns: ColumnsType<SessionParticipantRow> = [
  { title: '队伍', dataIndex: 'sideId', width: 120 },
  { title: '成员', dataIndex: 'actorId', width: 150 },
  { title: '精灵 ID', dataIndex: 'creatureId', width: 120 },
  {
    title: '上场',
    dataIndex: 'active',
    width: 80,
    render: (active: boolean) => (active ? '是' : '否'),
  },
  { title: '等级', dataIndex: 'level', width: 80 },
  { title: 'HP', width: 110, render: (_, record) => `${record.currentHp}/${record.maxHp}` },
  { title: '主要状态', dataIndex: 'majorStatus', width: 120, render: renderOptionalText },
  {
    title: '技能槽',
    dataIndex: 'skillSlots',
    render: (slots: SessionParticipant['skillSlots']) =>
      slots.map((slot) => `${slot.name} ${slot.remainingPp}/${slot.maxPp}`).join('、'),
  },
];

const turnRecordColumns: ColumnsType<BattleSessionTurnRecordResponse> = [
  { title: '回合', dataIndex: 'turnNumber', width: 80 },
  { title: 'Revision 前', dataIndex: 'revisionBefore', width: 110 },
  { title: 'Revision 后', dataIndex: 'revisionAfter', width: 110 },
  { title: '命令标识', dataIndex: 'commandId', width: 290 },
  { title: '结算时间', dataIndex: 'resolvedAt', width: 190 },
];

const randomTraceColumns: ColumnsType<RandomTraceRow> = [
  { title: '回合', dataIndex: 'turnNumber', width: 80 },
  { title: '序号', dataIndex: 'sequence', width: 80 },
  { title: '范围', dataIndex: 'bound', width: 100 },
  { title: '原因', dataIndex: 'reason' },
  { title: '结果', dataIndex: 'value', width: 100 },
];

function participantRows(session: BattleSessionResponse): SessionParticipantRow[] {
  return session.sides.flatMap((side) =>
    side.participants.map((participant) => ({
      ...participant,
      key: `${side.sideId}-${participant.actorId}`,
      sideId: side.sideId,
    })),
  );
}

function randomTraceRows(records: BattleSessionTurnRecordResponse[]): RandomTraceRow[] {
  return records.flatMap((record) =>
    record.randomTrace.map((trace) => ({
      ...trace,
      key: `${record.commandId}-${trace.sequence}`,
      turnNumber: record.turnNumber,
    })),
  );
}

function renderOptionalText(value?: string | null): string {
  return value || '-';
}
