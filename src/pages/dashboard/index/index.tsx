import { PageContainer, ProCard } from '@ant-design/pro-components'
import { Card, Col, Row, Statistic } from 'antd'
import { APP_NAME } from '@/config/app'

export default function DashboardHomePage() {
  return (
    <PageContainer title="仪表盘" subTitle={`${APP_NAME} 的首页概览。`}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic title="启用模块" value={42} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="动态菜单节点" value={128} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="待联调接口" value={6} />
          </Card>
        </Col>
      </Row>
      <ProCard split="vertical" gutter={16} style={{ marginTop: 16 }}>
        <ProCard title="当前已完成" colSpan="60%">
          动态菜单、运行时路由、JWT 鉴权、深色模式、标签页和统一请求层已经接入。
        </ProCard>
        <ProCard title="下一步" colSpan="40%">
          接入真实字段配置、字典选项和按钮级权限映射。
        </ProCard>
      </ProCard>
    </PageContainer>
  )
}
