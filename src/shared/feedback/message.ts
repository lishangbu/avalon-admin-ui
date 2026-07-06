import { App as AntApp } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

let message: MessageInstance;

/**
 * 绑定 antd App 上下文中的 message 实例。
 *
 * antd 静态 message 无法消费 ConfigProvider/App 上下文；这里按官方全局场景只保存 `<AntApp>` 内部实例。
 * 不再保留静态 fallback，避免早期调用把动态主题和 locale 又绕回旧入口。
 */
export function AppMessageBinder() {
  message = AntApp.useApp().message;
  return null;
}

export { message };
