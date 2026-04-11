import { PageContainer } from '@ant-design/pro-components'
import { Result } from 'antd'

const pageTitle = '属性克制管理'
const pageSubtitle = '属性克制矩阵需要专用页面。'

export default function DatasetTypeEffectivenessPage() {
  return (
    <PageContainer title={pageTitle} subTitle={pageSubtitle}>
      <Result
        status="info"
        title="需要专用页面"
        subTitle="属性克制是矩阵式数据，不适合按普通 CRUD 表格处理。"
      />
    </PageContainer>
  )
}
