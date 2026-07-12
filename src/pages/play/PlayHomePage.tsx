import { HistoryOutlined, TeamOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Card,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  List,
  Space,
  Typography,
} from 'antd';
import { useAuth } from '../../app/auth/AuthProvider';
import { trainerService, type Trainer } from '../../services/trainers';
import { trainerSessionService, type TrainerSession } from '../../services/trainer-session';
import { trainerTeamService, type SaveTrainerTeam } from '../../services/trainer-team';
import { publicTrainerService } from '../../services/public-trainers';
import {
  clearTrainerSessionCredential,
  readTrainerSessionCredential,
  saveTrainerSessionCredential,
} from '../../app/auth/trainer-session-storage';
import { ApiError } from '../../shared/api/errors';

const statFields = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
] as const;

interface TeamMemberFormValue {
  creatureId?: string;
  skillIds?: string;
  abilityId?: string;
  itemId?: string;
  natureId?: string;
  individualValues?: Record<string, number>;
  effortValues?: Record<string, number>;
}

interface TeamFormValues {
  members?: TeamMemberFormValue[];
}

interface PublicTrainerSearchValues {
  displayName: string;
}

export function PlayHomePage() {
  const { logout, session } = useAuth();
  const queryClient = useQueryClient();
  const [teamForm] = Form.useForm<TeamFormValues>();
  const [trainerCredential, setTrainerCredential] = useState(readTrainerSessionCredential);
  const trainers = useQuery({ queryKey: ['player', 'trainers'], queryFn: trainerService.list });
  const currentTrainerSession = useQuery({
    queryKey: ['player', 'trainer-session', trainerCredential],
    queryFn: trainerSessionService.current,
    enabled: Boolean(trainerCredential),
    retry: false,
  });
  const presenceHeartbeat = useQuery({
    queryKey: ['player', 'trainer-presence-heartbeat', trainerCredential],
    queryFn: async () => {
      await trainerSessionService.heartbeat();
      return true;
    },
    enabled: Boolean(trainerCredential && currentTrainerSession.data),
    retry: false,
    // 独立心跳只维持 45 秒 Presence，不滑动 30 分钟 Trainer Session。
    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
  });
  const currentTrainerTeam = useQuery({
    queryKey: ['player', 'trainer-team', trainerCredential],
    queryFn: trainerTeamService.get,
    enabled: Boolean(trainerCredential && currentTrainerSession.data),
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
  const saveTrainerTeam = useMutation({
    mutationFn: trainerTeamService.save,
    onSuccess: (team) => {
      queryClient.setQueryData(['player', 'trainer-team', trainerCredential], team);
    },
  });
  const findPublicTrainer = useMutation({ mutationFn: publicTrainerService.find });
  const logoutPlayer = () => {
    if (trainerCredential) void trainerSessionService.leave().catch(() => undefined);
    clearTrainerSessionCredential();
    logout();
  };
  const currentSessionErrorCode =
    currentTrainerSession.error instanceof ApiError ? currentTrainerSession.error.code : undefined;
  const heartbeatErrorCode =
    presenceHeartbeat.error instanceof ApiError ? presenceHeartbeat.error.code : undefined;

  useEffect(() => {
    if (currentSessionErrorCode !== 'trainer-session.invalid' || !trainerCredential) return;
    clearTrainerSessionCredential();
    setTrainerCredential(null);
  }, [currentSessionErrorCode, trainerCredential]);

  useEffect(() => {
    if (heartbeatErrorCode !== 'trainer-session.invalid' || !trainerCredential) return;
    clearTrainerSessionCredential();
    setTrainerCredential(null);
  }, [heartbeatErrorCode, trainerCredential]);

  useEffect(() => {
    teamForm.resetFields();
  }, [trainerCredential, teamForm]);

  useEffect(() => {
    if (!currentTrainerTeam.data) return;
    teamForm.setFieldsValue({
      members: currentTrainerTeam.data.members.map((member) => ({
        ...member,
        skillIds: member.skillIds.join(', '),
      })),
    });
  }, [currentTrainerTeam.data, teamForm]);

  useEffect(() => {
    if (
      !(currentTrainerTeam.error instanceof ApiError) ||
      currentTrainerTeam.error.code !== 'trainer-team.not-found'
    )
      return;
    teamForm.resetFields();
  }, [currentTrainerTeam.error, teamForm]);

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
    const currentTeam = currentTrainerTeam.data;
    const teamErrorCode =
      currentTrainerTeam.error instanceof ApiError ? currentTrainerTeam.error.code : undefined;
    const submitTeam = (values: TeamFormValues) => {
      const command: SaveTrainerTeam = {
        expectedRevision: currentTeam?.revision ?? null,
        members: (values.members ?? []).map((member) => ({
          creatureId: member.creatureId,
          skillIds: member.skillIds
            ?.split(',')
            .map((value) => value.trim())
            .filter(Boolean),
          abilityId: member.abilityId,
          itemId: member.itemId,
          natureId: member.natureId,
          individualValues: compactStats(member.individualValues),
          effortValues: compactStats(member.effortValues),
        })),
      };
      saveTrainerTeam.mutate(command);
    };
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
        <Card title="发现 Trainer">
          <Typography.Paragraph type="secondary">
            输入完整 Trainer 名称精确查找；不会展示候选列表或不可挑战的具体原因。
          </Typography.Paragraph>
          <Form<PublicTrainerSearchValues>
            layout="inline"
            onFinish={({ displayName }) => findPublicTrainer.mutate(displayName)}
          >
            <Form.Item
              name="displayName"
              label="Trainer 名称"
              rules={[{ required: true, message: '请输入完整 Trainer 名称' }]}
            >
              <Input maxLength={32} />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={findPublicTrainer.isPending}>
              精确查找
            </Button>
          </Form>
          {findPublicTrainer.data && (
            <Alert
              type={findPublicTrainer.data.challengeable ? 'success' : 'info'}
              showIcon
              title={findPublicTrainer.data.displayName}
              description={
                findPublicTrainer.data.challengeable ? '当前在线，可以发起挑战' : '当前不可挑战'
              }
            />
          )}
          {findPublicTrainer.isError && <Alert type="warning" showIcon title="未找到该 Trainer" />}
        </Card>
        <Card title="Trainer Team" loading={currentTrainerTeam.isLoading}>
          {currentTrainerTeam.isError && teamErrorCode !== 'trainer-team.not-found' && (
            <Alert type="error" showIcon message="Team 暂时无法读取，请稍后重试" />
          )}
          <Typography.Paragraph type="secondary">
            保存 1–6 名完整成员；真人对战会统一使用 50 级，未填写的 IV/EV 分别按 31/0 保存。
          </Typography.Paragraph>
          <Form
            form={teamForm}
            layout="vertical"
            initialValues={{ members: [] }}
            onFinish={submitTeam}
          >
            <Form.List
              name="members"
              rules={[
                {
                  validator: async (_, members: TeamMemberFormValue[] | undefined) => {
                    if (!members || members.length < 1 || members.length > 6)
                      throw new Error('Team 必须包含 1–6 名成员');
                    if (
                      members.some(
                        (member) =>
                          Object.values(member.effortValues ?? {}).reduce(
                            (sum, value) => sum + (value ?? 0),
                            0,
                          ) > 510,
                      )
                    ) {
                      throw new Error('每名成员的 EV 总和不能超过 510');
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                  {fields.map((field, index) => (
                    <Card
                      key={field.key}
                      size="small"
                      title={`成员 ${index + 1}`}
                      extra={
                        <Button danger onClick={() => remove(field.name)}>
                          移除成员
                        </Button>
                      }
                    >
                      <Flex gap={12} wrap>
                        <Form.Item
                          name={[field.name, 'creatureId']}
                          label="精灵 ID"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name={[field.name, 'skillIds']}
                          label="技能 ID"
                          rules={[
                            { required: true },
                            {
                              validator: async (_, value: string | undefined) => {
                                const ids =
                                  value
                                    ?.split(',')
                                    .map((id) => id.trim())
                                    .filter(Boolean) ?? [];
                                const canonicalIds = ids.map((id) =>
                                  /^[1-9]\d*$/.test(id) ? BigInt(id).toString() : null,
                                );
                                if (
                                  ids.length < 1 ||
                                  ids.length > 4 ||
                                  canonicalIds.includes(null) ||
                                  new Set(canonicalIds).size !== ids.length
                                ) {
                                  throw new Error('请输入 1–4 个不重复的技能 ID');
                                }
                              },
                            },
                          ]}
                        >
                          <Input placeholder="多个 ID 用逗号分隔" />
                        </Form.Item>
                        <Form.Item
                          name={[field.name, 'abilityId']}
                          label="特性 ID"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name={[field.name, 'itemId']}
                          label="道具 ID"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item name={[field.name, 'natureId']} label="性格 ID">
                          <Input placeholder="留空使用中性性格" />
                        </Form.Item>
                      </Flex>
                      <Divider titlePlacement="left">IV / EV</Divider>
                      <Flex gap={12} wrap>
                        {statFields.map((stat) => (
                          <Form.Item
                            key={`iv-${stat}`}
                            name={[field.name, 'individualValues', stat]}
                            label={`IV ${stat}`}
                          >
                            <InputNumber min={0} max={31} placeholder="31" />
                          </Form.Item>
                        ))}
                        {statFields.map((stat) => (
                          <Form.Item
                            key={`ev-${stat}`}
                            name={[field.name, 'effortValues', stat]}
                            label={`EV ${stat}`}
                          >
                            <InputNumber min={0} max={252} placeholder="0" />
                          </Form.Item>
                        ))}
                      </Flex>
                    </Card>
                  ))}
                  <Button disabled={fields.length >= 6} onClick={() => add()}>
                    添加 Team 成员
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Space>
              )}
            </Form.List>
            <Divider />
            <Button type="primary" htmlType="submit" loading={saveTrainerTeam.isPending}>
              保存 Team
            </Button>
          </Form>
          {saveTrainerTeam.isError && (
            <Alert type="error" showIcon message="Team 保存失败，请检查成员资料或版本" />
          )}
          {saveTrainerTeam.data && (
            <Typography.Text type="success">
              Team 已保存，版本 {saveTrainerTeam.data.revision}
            </Typography.Text>
          )}
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

function compactStats(values: Record<string, number> | undefined): Record<string, number> {
  return Object.fromEntries(
    Object.entries(values ?? {}).filter(([, value]) => value !== undefined),
  );
}
