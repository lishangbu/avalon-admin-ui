import type { ThemeConfig } from 'antd';

/**
 * 管理端主题 token。
 *
 * 主题保持克制、密集和适合扫描；Tailwind 只负责布局工具类，不覆盖 antd 内部 DOM。
 */
export const appTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 6,
    fontSize: 14,
  },
  components: {
    Card: {
      borderRadiusLG: 8,
    },
    Table: {
      cellPaddingBlock: 10,
      cellPaddingInline: 12,
    },
  },
};
