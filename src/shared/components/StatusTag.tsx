import Tag from 'antd/es/tag';

export interface BooleanStatusTagProps {
  value: boolean;
  trueText: string;
  falseText: string;
}

export interface TextStatusTagProps {
  value?: string | null;
}

/**
 * 通用布尔状态标签。
 *
 * 用户启用、账号锁定、JWK active、定时任务 enabled 都是布尔状态，但正反文案不同。
 * 共享组件只统一颜色和 Tag 使用方式，具体文案由调用方传入。
 */
export function BooleanStatusTag({ value, trueText, falseText }: BooleanStatusTagProps) {
  return <Tag color={value ? 'green' : 'red'}>{value ? trueText : falseText}</Tag>;
}

/**
 * 通用字符串状态标签。
 *
 * 后端状态枚举可能随业务扩展，这里只根据常见语义选择颜色，不把未知状态当错误处理。
 */
export function TextStatusTag({ value }: TextStatusTagProps) {
  const text = value ?? '-';
  const normalized = text.toLowerCase();
  const color =
    normalized.includes('success') || normalized.includes('normal') || normalized === 'cron'
      ? 'green'
      : normalized.includes('fail') || normalized.includes('error')
        ? 'red'
        : normalized.includes('pause') || normalized.includes('blocked')
          ? 'orange'
          : 'blue';

  return <Tag color={color}>{text}</Tag>;
}
