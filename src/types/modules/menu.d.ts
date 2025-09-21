export interface MenuItem {
  id: string;
  parentId: string | null;
  disabled: boolean;
  extra: unknown | null;
  icon: string;
  key: string;
  label: string;
  show: boolean;
  path: string;
  name: string;
  redirect: string | null;
  component: string;
  sortOrder: number;
  children: MenuItem[] | null;
  showTab: boolean;
}
