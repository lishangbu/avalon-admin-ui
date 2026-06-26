import type { ReactNode } from 'react';

const menuIconClasses = {
  'lucide:settings': 'icon-[lucide--settings]',
  'lucide:shield-check': 'icon-[lucide--shield-check]',
  'lucide:users': 'icon-[lucide--users]',
  'lucide:shield-user': 'icon-[lucide--shield-user]',
  'lucide:network': 'icon-[lucide--network]',
  'lucide:key-round': 'icon-[lucide--key-round]',
  'lucide:plug': 'icon-[lucide--plug]',
  'lucide:key': 'icon-[lucide--key]',
  'lucide:calendar-clock': 'icon-[lucide--calendar-clock]',
  'lucide:clock': 'icon-[lucide--clock]',
} as const;

export function resolveMenuIcon(icon?: string): ReactNode {
  const iconClass = icon ? menuIconClasses[icon as keyof typeof menuIconClasses] : undefined;
  if (!iconClass) {
    return undefined;
  }

  return <span aria-hidden="true" className={`${iconClass} text-base`} />;
}
