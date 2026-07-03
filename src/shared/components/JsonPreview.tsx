import Typography from 'antd/es/typography';

export interface JsonPreviewProps {
  value: unknown;
}

/**
 * JSON 只读预览。
 *
 * 定时任务 payload、执行记录 payloadSnapshot 等字段都可能是嵌套对象。统一格式化输出可以让
 * 表格详情保持可读，同时避免页面把对象直接渲染成 `[object Object]`。
 */
export function JsonPreview({ value }: JsonPreviewProps) {
  const text = JSON.stringify(value ?? {}, null, 2);

  return (
    <Typography.Text code className="block max-h-80 overflow-auto whitespace-pre-wrap break-all">
      {text}
    </Typography.Text>
  );
}
