import { Descriptions, Drawer } from 'antd';
import type { DescriptionsProps } from 'antd';
import type { ReactNode } from 'react';

export interface EntityDrawerProps {
  open: boolean;
  title: ReactNode;
  items: DescriptionsProps['items'];
  loading?: boolean;
  onClose: () => void;
  extra?: ReactNode;
}

/**
 * 资源详情抽屉。
 *
 * 系统管理页的详情展示都属于只读信息，不应该让每个页面重复编排 Drawer 和 Descriptions。
 * 这个组件只负责统一容器、布局和尺寸，具体字段仍由各资源页面提供，避免抽象泄漏业务字段。
 */
export function EntityDrawer({
  open,
  title,
  items,
  loading = false,
  onClose,
  extra,
}: EntityDrawerProps) {
  return (
    <Drawer
      open={open}
      title={title}
      size={640}
      loading={loading}
      extra={extra}
      destroyOnHidden
      onClose={onClose}
    >
      <Descriptions bordered column={1} size="small" items={items} />
    </Drawer>
  );
}
