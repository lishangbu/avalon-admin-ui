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
  'lucide:database': 'icon-[lucide--database]',
  'lucide:boxes': 'icon-[lucide--boxes]',
  'lucide:badge': 'icon-[lucide--badge]',
  'lucide:tags': 'icon-[lucide--tags]',
  'lucide:sparkles': 'icon-[lucide--sparkles]',
  'lucide:badge-check': 'icon-[lucide--badge-check]',
  'lucide:package': 'icon-[lucide--package]',
  'lucide:list-tree': 'icon-[lucide--list-tree]',
  'lucide:flame': 'icon-[lucide--flame]',
  'lucide:chart-no-axes-column': 'icon-[lucide--chart-no-axes-column]',
  'lucide:split': 'icon-[lucide--split]',
  'lucide:folder-tree': 'icon-[lucide--folder-tree]',
  'lucide:palette': 'icon-[lucide--palette]',
  'lucide:shapes': 'icon-[lucide--shapes]',
  'lucide:map': 'icon-[lucide--map]',
  'lucide:layers-3': 'icon-[lucide--layers-3]',
  'lucide:git-branch': 'icon-[lucide--git-branch]',
} as const;

export function resolveMenuIcon(icon?: string): ReactNode {
  const iconClass = icon ? menuIconClasses[icon as keyof typeof menuIconClasses] : undefined;
  if (!iconClass) {
    return undefined;
  }

  return <span aria-hidden="true" className={`${iconClass} text-base`} />;
}
