import { Descriptions, Tag } from 'antd';
import type { BattleSessionResponse } from '../../../services/battle-sessions';
import { TerminateBattleSessionButton } from '../shared/BattleSessionFeedback';

export interface BattleSessionLifecyclePanelProps {
  status: BattleSessionResponse['status'];
  revision: BattleSessionResponse['revision'];
  turnNumber: BattleSessionResponse['turnNumber'];
  createdAt: BattleSessionResponse['createdAt'];
  updatedAt: BattleSessionResponse['updatedAt'];
  endedAt?: BattleSessionResponse['endedAt'];
  expiresAt?: BattleSessionResponse['expiresAt'];
  terminating?: boolean;
  onTerminate: () => void;
}

/** 展示 Battle Session 生命周期事实，并把所有非 ACTIVE 状态保持为只读。 */
export function BattleSessionLifecyclePanel({
  status,
  revision,
  turnNumber,
  createdAt,
  updatedAt,
  endedAt,
  expiresAt,
  terminating = false,
  onTerminate,
}: BattleSessionLifecyclePanelProps) {
  const active = status === 'ACTIVE';
  const items = [
    { key: 'status', label: '状态', children: <BattleSessionStatusTag status={status} /> },
    { key: 'revision', label: 'Revision', children: revision },
    { key: 'turnNumber', label: '已结算回合', children: turnNumber },
    { key: 'createdAt', label: '创建时间', children: createdAt },
    { key: 'updatedAt', label: '更新时间', children: updatedAt },
    ...(endedAt ? [{ key: 'endedAt', label: '终态时间', children: endedAt }] : []),
    ...(expiresAt ? [{ key: 'expiresAt', label: '缓存到期', children: expiresAt }] : []),
  ];

  return (
    <div className="space-y-3">
      <Descriptions size="small" bordered column={{ xs: 1, sm: 2, lg: 3 }} items={items} />
      {active ? (
        <TerminateBattleSessionButton loading={terminating} onConfirm={onTerminate} />
      ) : (
        <Tag color="default">终态只读</Tag>
      )}
    </div>
  );
}

export function BattleSessionStatusTag({ status }: { status: string }) {
  const labels: Record<string, { color: string; text: string }> = {
    ACTIVE: { color: 'processing', text: '运行中' },
    COMPLETED: { color: 'success', text: '已完成' },
    TERMINATED: { color: 'default', text: '已终止' },
  };
  const display = labels[status] ?? { color: 'default', text: status };
  return <Tag color={display.color}>{display.text}</Tag>;
}
