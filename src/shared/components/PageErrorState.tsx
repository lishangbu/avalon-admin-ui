import Button from 'antd/es/button';
import Result from 'antd/es/result';

export interface PageErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/**
 * 页面级错误状态，用于列表加载失败和后端异常。
 */
export function PageErrorState({ title = '加载失败', message, onRetry }: PageErrorStateProps) {
  return (
    <Result
      status="warning"
      title={title}
      subTitle={message ?? '请稍后重试，或检查后端服务是否可用。'}
      extra={
        onRetry ? (
          <Button type="primary" onClick={onRetry}>
            重新加载
          </Button>
        ) : null
      }
    />
  );
}
