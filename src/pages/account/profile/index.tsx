import { PageContainer } from '@ant-design/pro-components'
import { Card, Typography } from 'antd'
import { useAuthStore } from '@/store/auth'

export default function PersonalCenterPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <PageContainer title="个人中心">
      <Card>
        <Typography.Paragraph>
          用户名：{user?.username ?? '未加载'}
        </Typography.Paragraph>
        <Typography.Paragraph>
          角色：{user?.roles?.map((item) => item.name).join(' / ') || '-'}
        </Typography.Paragraph>
      </Card>
    </PageContainer>
  )
}
