import { theme as antdTheme } from 'antd';
import type { ThemeConfig } from 'antd';
import type { AvalonLayoutSettings } from './settings/LayoutSettingsProvider';

/**
 * 管理端主题 token。
 *
 * 主题保持克制、密集和适合扫描；Tailwind 只负责布局工具类，不覆盖 antd 内部 DOM。
 */
export function createAppTheme(settings: AvalonLayoutSettings): ThemeConfig {
  return {
    algorithm: settings.navTheme === 'realDark' ? antdTheme.darkAlgorithm : undefined,
    token: {
      colorPrimary: settings.colorPrimary ?? '#1677FF',
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
}
