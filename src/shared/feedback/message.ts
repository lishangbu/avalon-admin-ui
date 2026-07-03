import { App as AntApp, message as fallbackMessage } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

let message: MessageInstance = fallbackMessage;

/**
 * 绑定 antd App 上下文中的 message 实例。
 *
 * antd 静态 message 无法消费 ConfigProvider/App 上下文；这里按官方全局场景把实例保存成模块级 live binding，
 * 让页面代码继续使用 `message.success/error`，但实际调用来自 `<AntApp>` 内部的上下文实例。
 */
export function AppMessageBinder() {
  message = AntApp.useApp().message;
  return null;
}

export { message };
