import { useMutation } from '@tanstack/react-query';
import { Alert, Button, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { battleSessionService } from '../../../services/battle-sessions';
import { apiErrorMessage } from '../../battle-rules/shared/battle-rule-page-utils';
import { useBattleRuleOptions } from '../../battle-rules/shared/useBattleRuleOptions';
import { BattleSessionCreateForm } from './BattleSessionCreateForm';
import {
  BattleSessionCapacityError,
  battleSessionErrorKind,
} from '../shared/BattleSessionFeedback';

/**
 * 服务端权威 Session Roster 创建页。
 */
export function BattleSessionCreatePage() {
  const navigate = useNavigate();
  const options = useBattleRuleOptions(['formats', 'creatures', 'skills', 'abilities', 'items']);
  const createMutation = useMutation({
    mutationFn: (values: Parameters<typeof battleSessionService.create>[0]) =>
      battleSessionService.create(values),
    onSuccess: (session) => navigate(`/battle-sessions/${session.sessionId}`),
  });
  const requiredOptionsEmpty =
    !options.loading &&
    !options.error &&
    (options.formatOptions.length === 0 ||
      options.creatureOptions.length === 0 ||
      options.skillOptions.length === 0);
  const optionsUnavailable = options.loading || Boolean(options.error) || requiredOptionsEmpty;

  return (
    <div className="space-y-4">
      <div>
        <Typography.Title level={3} className="!mb-1">
          创建战斗会话
        </Typography.Title>
        <Typography.Text type="secondary">
          配置双方 Session Roster；场内 sideId、actorId 和随机状态由后端生成。
        </Typography.Text>
      </div>

      {createMutation.isError && battleSessionErrorKind(createMutation.error) === 'capacity' ? (
        <BattleSessionCapacityError />
      ) : null}
      {createMutation.isError && battleSessionErrorKind(createMutation.error) !== 'capacity' ? (
        <Alert
          showIcon
          type="error"
          title="战斗会话创建失败"
          description={apiErrorMessage(createMutation.error, '请稍后重试')}
        />
      ) : null}
      {options.error ? (
        <Alert
          showIcon
          type="error"
          title="阵容选项加载失败"
          description={apiErrorMessage(options.error, '无法加载赛制、精灵或技能资料')}
          action={
            <Button size="small" onClick={() => void options.refetch()}>
              重新加载选项
            </Button>
          }
        />
      ) : null}
      {requiredOptionsEmpty ? (
        <Alert
          showIcon
          type="warning"
          title="缺少可用的阵容选项"
          description="至少需要一个启用的赛制、精灵和技能，才能创建战斗会话。"
        />
      ) : null}

      <Card size="small">
        <BattleSessionCreateForm
          disabled={optionsUnavailable}
          options={options}
          loadingOptions={options.loading}
          pending={createMutation.isPending}
          onSubmit={(values) => createMutation.mutate(values)}
        />
      </Card>
    </div>
  );
}
