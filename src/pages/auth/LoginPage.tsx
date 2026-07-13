import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../app/auth/AuthProvider';
import { message } from '../../shared/feedback/message';

interface LoginFormValues {
  username: string;
  password: string;
}

/**
 * 登录页直接对接后端自定义 password grant。
 *
 * 这里不展示 OAuth2 细节给用户，只保留用户名和密码；clientId、clientSecret 和 scope
 * 来自环境变量，便于开发和部署环境分别配置。
 */
export function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const from = (location.search as { redirect?: string }).redirect ?? '/';

  useEffect(() => {
    if (auth.status === 'authenticated' && location.pathname === '/login') {
      void navigate({ to: '/', replace: true });
    }
  }, [auth.status, location.pathname, navigate]);

  if (auth.status === 'authenticated') {
    return null;
  }

  const handleFinish = async (values: LoginFormValues) => {
    setSubmitting(true);
    try {
      await auth.login(values);
      message.success('登录成功');
      await navigate({ to: from, replace: true });
    } catch (error) {
      message.error(error instanceof Error ? error.message : '登录失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-sm" title="Avalon Admin">
        <Typography.Paragraph className="text-slate-500">
          使用 Avalon 后端账号登录管理端。
        </Typography.Paragraph>
        <Form<LoginFormValues> layout="vertical" onFinish={handleFinish} requiredMark={false}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} autoComplete="username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={submitting}>
            登录
          </Button>
        </Form>
      </Card>
    </main>
  );
}
