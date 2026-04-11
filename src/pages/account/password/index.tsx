import { PageContainer } from '@ant-design/pro-components'
import { Button, Card, Form, Input } from 'antd'

export default function ChangePasswordPage() {
  return (
    <PageContainer title="修改密码">
      <Card>
        <Form layout="vertical">
          <Form.Item label="当前密码">
            <Input.Password />
          </Form.Item>
          <Form.Item label="新密码">
            <Input.Password />
          </Form.Item>
          <Form.Item label="确认密码">
            <Input.Password />
          </Form.Item>
          <Button type="primary">提交</Button>
        </Form>
      </Card>
    </PageContainer>
  )
}
