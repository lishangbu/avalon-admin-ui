import { HistoryOutlined, TeamOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Empty, Flex, Form, Input, List, Typography } from 'antd';
import { useAuth } from '../../app/auth/AuthProvider';
import { trainerService, type Trainer } from '../../services/trainers';
import { trainerSessionService, type TrainerSession } from '../../services/trainer-session';
import {
  clearTrainerSessionCredential,
  readTrainerSessionCredential,
  saveTrainerSessionCredential,
} from '../../app/auth/trainer-session-storage';
import { ApiError } from '../../shared/api/errors';

export function PlayHomePage() {
  const { logout, session } = useAuth();
  const queryClient = useQueryClient();
  const [trainerCredential, setTrainerCredential] = useState(readTrainerSessionCredential);
  const trainers = useQuery({ queryKey: ['player', 'trainers'], queryFn: trainerService.list });
  const currentTrainerSession = useQuery({
    queryKey: ['player', 'trainer-session', trainerCredential],
    queryFn: trainerSessionService.current,
    enabled: Boolean(trainerCredential),
    retry: false,
  });
  const createTrainer = useMutation({
    mutationFn: trainerService.create,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ['player', 'trainers'] }),
  });
  const enterTrainer = useMutation({
    mutationFn: (trainer: Trainer) => trainerSessionService.enter(trainer.id),
    onSuccess: (nextSession) => {
      saveTrainerSessionCredential(nextSession.credential);
      setTrainerCredential(nextSession.credential);
      queryClient.setQueryData(['player', 'trainer-session', nextSession.credential], nextSession);
    },
  });
  const leaveTrainer = useMutation({
    mutationFn: trainerSessionService.leave,
    onSettled: () => {
      clearTrainerSessionCredential();
      setTrainerCredential(null);
      queryClient.removeQueries({ queryKey: ['player', 'trainer-session'] });
    },
  });
  const logoutPlayer = () => {
    if (trainerCredential) void trainerSessionService.leave().catch(() => undefined);
    clearTrainerSessionCredential();
    logout();
  };
  const currentSessionErrorCode =
    currentTrainerSession.error instanceof ApiError ? currentTrainerSession.error.code : undefined;

  useEffect(() => {
    if (currentSessionErrorCode !== 'trainer-session.invalid' || !trainerCredential) return;
    clearTrainerSessionCredential();
    setTrainerCredential(null);
  }, [currentSessionErrorCode, trainerCredential]);

  if (trainerCredential && currentTrainerSession.isLoading) {
    return (
      <main className="play-shell">
        <Card loading title="恢复 Trainer Session" />
      </main>
    );
  }

  if (trainerCredential && currentTrainerSession.isError) {
    return (
      <main className="play-shell">
        <Card title="Trainer Session 暂时无法确认">
          <Typography.Paragraph type="danger">
            网络或服务异常，请保留当前页面并重试。
          </Typography.Paragraph>
          <Button onClick={() => void currentTrainerSession.refetch()}>重新尝试</Button>
        </Card>
      </main>
    );
  }

  const activeTrainerSession: TrainerSession | undefined = currentTrainerSession.data;
  if (activeTrainerSession) {
    return (
      <main className="play-shell">
        <Card title={`当前 Trainer：${activeTrainerSession.trainer.displayName}`}>
          <Typography.Paragraph>
            Trainer Session 已建立，可以继续维护队伍并发起挑战。
          </Typography.Paragraph>
          <Flex gap={12}>
            <Button loading={leaveTrainer.isPending} onClick={() => leaveTrainer.mutate()}>
              退出当前 Trainer
            </Button>
            <Button onClick={logoutPlayer}>退出登录</Button>
          </Flex>
        </Card>
      </main>
    );
  }
  return (
    <main className="play-shell">
      <Flex justify="space-between" align="center" gap={16} wrap>
        <div>
          <Typography.Title level={2}>Avalon 对战中心</Typography.Title>
          <Typography.Text type="secondary">
            {session?.user.displayName ?? session?.user.username}，选择 Trainer 后开始真人对战。
          </Typography.Text>
        </div>
        <Button onClick={logoutPlayer}>退出登录</Button>
      </Flex>
      <Card className="play-trainer-card" title="选择 Trainer" loading={trainers.isLoading}>
        {trainers.data?.length ? (
          <List
            dataSource={trainers.data}
            renderItem={(trainer) => (
              <List.Item
                actions={[
                  <Button
                    key="enter"
                    type="primary"
                    loading={enterTrainer.isPending}
                    onClick={() => enterTrainer.mutate(trainer)}
                  >
                    选择 Trainer
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={trainer.displayName}
                  description={`版本 ${trainer.revision}`}
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="还没有 Trainer，请创建第一个游戏身份" />
        )}
        <Form layout="inline" onFinish={({ displayName }) => createTrainer.mutate(displayName)}>
          <Form.Item
            name="displayName"
            rules={[
              { required: true },
              {
                validator: (_, value: string | undefined) => {
                  if (!value) return Promise.resolve();
                  const length = Array.from(value.trim().normalize('NFKC')).length;
                  return length >= 2 && length <= 16
                    ? Promise.resolve()
                    : Promise.reject(new Error('Trainer 名称需为 2 至 16 个字符'));
                },
              },
            ]}
          >
            <Input placeholder="Trainer 名称" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={createTrainer.isPending}>
              创建 Trainer
            </Button>
          </Form.Item>
        </Form>
        {createTrainer.isError && (
          <Typography.Text type="danger">创建失败，请检查名称或 Trainer 数量。</Typography.Text>
        )}
        {enterTrainer.isError && (
          <Typography.Text type="danger">
            无法进入该 Trainer，请检查其状态或当前对局。
          </Typography.Text>
        )}
      </Card>
      <section className="play-grid" aria-label="玩家功能">
        <Card title="Trainer" extra={<TeamOutlined />}>
          创建或选择 Trainer，并维护唯一的标准单打队伍。
        </Card>
        <Card title="Challenge" extra={<ThunderboltOutlined />}>
          精确查找在线 Trainer，发起或处理私有挑战。
        </Card>
        <Card title="Match History" extra={<HistoryOutlined />}>
          查看当前对局以及按己方视角保存的历史记录。
        </Card>
      </section>
    </main>
  );
}
