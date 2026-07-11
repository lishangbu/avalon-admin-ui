import { Alert, Button, Popconfirm, Result } from 'antd';
import { ApiError } from '../../shared/api/errors';

export type BattleSessionErrorKind = 'not-found' | 'conflict' | 'capacity' | 'generic';

/** 把 Battle Session API 的稳定错误 code 收窄为页面反馈分支。 */
export function battleSessionErrorKind(error: unknown): BattleSessionErrorKind {
  if (!(error instanceof ApiError)) {
    return 'generic';
  }
  if (error.code === 'resource.not_found') {
    return 'not-found';
  }
  if (error.code === 'resource.conflict') {
    return 'conflict';
  }
  if (error.code === 'battle-session.capacity-exhausted') {
    return 'capacity';
  }
  return 'generic';
}

/**
 * 展示 Battle Session 已不存在的终态。
 *
 * 404 既可能表示标识无效，也可能表示终态会话已经离开 Recent Session 缓存；前端不把它误报成
 * 永久历史记录缺失。
 */
export function BattleSessionNotFoundState() {
  return (
    <Result
      status="404"
      title="会话不存在或已淘汰"
      subTitle="该会话可能从未存在，或已经超过 Recent Session 的 expiresAt 并被当前节点淘汰。"
    />
  );
}

/** 展示后端拒绝创建新会话时的节点容量状态。 */
export function BattleSessionCapacityError() {
  return (
    <Alert
      showIcon
      type="warning"
      title="当前节点容量已满"
      description="暂时无法创建新的战斗会话，请稍后重试。"
    />
  );
}

export interface BattleSessionConflictStateProps {
  mode?: 'turn' | 'termination';
  onRefresh: () => void;
}

/** 展示 revision 冲突，并要求从后端重新取得权威会话状态。 */
export function BattleSessionConflictState({
  mode = 'turn',
  onRefresh,
}: BattleSessionConflictStateProps) {
  const isTermination = mode === 'termination';
  return (
    <Alert
      showIcon
      type="warning"
      title="会话状态已更新"
      description={
        isTermination
          ? '终止命令基于旧 revision，不会重试旧命令。刷新后请按当前会话状态重新操作。'
          : '当前选择基于旧 revision，刷新后请按最新 Turn Requirements 重新选择行动。'
      }
      action={
        <Button size="small" onClick={onRefresh}>
          {isTermination ? '刷新会话状态' : '刷新并重新选择'}
        </Button>
      }
    />
  );
}

export interface TerminateBattleSessionButtonProps {
  disabled?: boolean;
  loading?: boolean;
  onConfirm: () => void;
}

/** 只通过明确二次确认终止仍在运行的 Battle Session。 */
export function TerminateBattleSessionButton({
  disabled = false,
  loading = false,
  onConfirm,
}: TerminateBattleSessionButtonProps) {
  return (
    <Popconfirm
      title="确认终止这个战斗会话？"
      description="终止不会生成虚假的战斗结果，且无法恢复为运行中状态。"
      okText="确认终止"
      cancelText="取消"
      okButtonProps={{ danger: true, loading }}
      onConfirm={onConfirm}
    >
      <Button danger disabled={disabled} loading={loading}>
        终止会话
      </Button>
    </Popconfirm>
  );
}
