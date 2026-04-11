import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'

export default function Error404Page() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="页面不存在，或当前账号尚未分配该菜单。"
      extra={
        <Link to="/">
          <Button type="primary" icon={<ArrowLeftOutlined />}>
            返回首页
          </Button>
        </Link>
      }
    />
  )
}
