import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'

export default function Error403Page() {
  return (
    <Result
      status="403"
      title="403"
      subTitle="你没有权限访问当前页面。"
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
