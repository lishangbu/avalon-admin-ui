import {
  LockOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Alert, App, Button, Card, Form, Input, Space, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { APP_NAME, STORAGE_KEYS } from '@/config/app'
import { useAuthStore } from '@/store/auth'
import { usePreferencesStore } from '@/store/preferences'
import styles from './style.module.css'

export default function LoginPage() {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const signIn = useAuthStore((state) => state.signIn)
  const loading = useAuthStore((state) => state.loading)
  const themeMode = usePreferencesStore((state) => state.themeMode)
  const toggleTheme = usePreferencesStore((state) => state.toggleTheme)
  const rawRedirect = localStorage.getItem(STORAGE_KEYS.redirect)

  return (
    <div className={styles.loginShell}>
      <Card className={styles.loginCard} variant="borderless">
        <div style={{ display: 'grid', gap: 20 }}>
          <Space style={{ justifyContent: 'space-between', width: '100%' }}>
            <div>
              <Typography.Title level={2} style={{ marginBottom: 8 }}>
                {APP_NAME}
              </Typography.Title>
              <Typography.Text type="secondary">后台管理系统</Typography.Text>
            </div>
            <Button
              shape="circle"
              icon={themeMode === 'light' ? <MoonOutlined /> : <SunOutlined />}
              onClick={toggleTheme}
            />
          </Space>

          <Alert type="info" showIcon title="当前默认使用 JWT / Bearer 鉴权" />

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              username: 'admin',
              password: '123456',
              grant_type: 'password',
            }}
            onFinish={async (values) => {
              try {
                await signIn(values.username, values.password)
                message.success('登录成功')
                const redirectPath = rawRedirect
                  ? (JSON.parse(rawRedirect) as string)
                  : '/'
                localStorage.removeItem(STORAGE_KEYS.redirect)
                navigate(redirectPath, { replace: true })
              } catch {
                message.error('登录失败，请检查账号密码或接口配置')
              }
            }}
          >
            <Form.Item
              label="账号"
              name="username"
              rules={[{ required: true, message: '请输入账号' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入账号"
                size="large"
              />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
                size="large"
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 8 }}>
              <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                <Typography.Text type="secondary">
                  登录后会将 Token 保存在本地存储。
                </Typography.Text>
                <Link to="/account/password">修改密码</Link>
              </Space>
            </Form.Item>
            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              登录
            </Button>
          </Form>
        </div>
      </Card>
    </div>
  )
}
