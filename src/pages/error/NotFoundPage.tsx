import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Result
      status="404"
      title="页面不存在"
      subTitle="请检查地址是否正确，或返回工作台继续操作。"
      extra={
        <Link to="/">
          <Button type="primary">返回工作台</Button>
        </Link>
      }
    />
  );
}
