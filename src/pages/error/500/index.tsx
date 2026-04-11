import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'

export default function Error500Page() {
  return (
    <Result
      status="500"
      title="500"
      subTitle="服务器异常，请稍后重试。"
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
