import { Result } from 'antd';

/**
 * 权限不足状态。
 *
 * 页面路由和操作按钮共用这个组件，保证缺权限时给出明确反馈，而不是静默隐藏整页。
 */
export function AccessDenied() {
  return <Result status="403" title="访问受限" subTitle="当前账号没有访问该功能的权限。" />;
}
