import { theme } from 'antd'
import type { ThemeConfig } from 'antd'

export const DEFAULT_COLOR_PRIMARY = '#1677ff'
export type ThemeMode = 'light' | 'dark'

export function buildThemeConfig(
  themeMode: ThemeMode,
  colorPrimary = DEFAULT_COLOR_PRIMARY,
): ThemeConfig {
  const isDark = themeMode === 'dark'
  const darkLayoutBg = '#050a13'
  const darkPanelBg = '#0b1220'
  const darkPanelElevatedBg = '#111827'
  const darkPanelMutedBg = '#162033'
  const darkBorder = '#243145'
  const darkTextPrimary = 'rgba(255, 255, 255, 0.92)'
  const darkTextSecondary = 'rgba(226, 232, 240, 0.72)'
  const darkTextPlaceholder = 'rgba(148, 163, 184, 0.72)'
  const darkMask = 'rgba(2, 6, 23, 0.72)'
  const darkSelectedBg = 'rgba(22, 119, 255, 0.22)'
  const darkSelectedHoverBg = 'rgba(22, 119, 255, 0.3)'
  const darkHoverBg = 'rgba(148, 163, 184, 0.12)'
  const darkActiveShadow = `0 0 0 2px rgba(22, 119, 255, 0.24)`

  return {
    token: {
      colorPrimary,
      borderRadius: 10,
      colorBgLayout: isDark ? darkLayoutBg : '#f4f7fb',
      colorBgContainer: isDark ? darkPanelBg : '#ffffff',
      colorBgElevated: isDark ? darkPanelElevatedBg : '#ffffff',
      colorFillAlter: isDark ? darkPanelMutedBg : 'rgba(15, 23, 42, 0.04)',
      colorFillContent: isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.08)',
      colorFillContentHover: isDark ? 'rgba(148, 163, 184, 0.18)' : 'rgba(15, 23, 42, 0.12)',
      colorBorder: isDark ? darkBorder : 'rgba(15, 23, 42, 0.15)',
      colorBorderSecondary: isDark ? darkBorder : 'rgba(15, 23, 42, 0.08)',
      colorText: isDark ? darkTextPrimary : 'rgba(15, 23, 42, 0.88)',
      colorTextSecondary: isDark ? darkTextSecondary : 'rgba(15, 23, 42, 0.72)',
      colorTextDescription: isDark ? darkTextSecondary : 'rgba(15, 23, 42, 0.58)',
      colorTextPlaceholder: isDark ? darkTextPlaceholder : 'rgba(100, 116, 139, 0.72)',
      colorBgMask: isDark ? darkMask : 'rgba(15, 23, 42, 0.45)',
      boxShadow: isDark
        ? '0 18px 40px rgba(2, 6, 23, 0.52)'
        : '0 12px 32px rgba(15, 23, 42, 0.18)',
      boxShadowSecondary: isDark
        ? '0 12px 28px rgba(2, 6, 23, 0.48)'
        : '0 10px 24px rgba(15, 23, 42, 0.14)',
      fontSize: 14,
    },
    components: {
      Layout: {
        headerBg: isDark ? darkPanelElevatedBg : '#ffffff',
        siderBg: isDark ? darkPanelBg : '#0f172a',
        bodyBg: isDark ? darkLayoutBg : '#f4f7fb',
        lightSiderBg: isDark ? darkPanelElevatedBg : '#ffffff',
      },
      Menu: {
        darkItemBg: darkPanelBg,
        darkSubMenuItemBg: isDark ? darkPanelMutedBg : '#111b31',
        darkItemSelectedBg: colorPrimary,
        itemBorderRadius: 8,
      },
      Tabs: {
        cardBg: isDark ? 'rgba(11, 18, 32, 0.92)' : 'rgba(255, 255, 255, 0.9)',
        itemColor: isDark ? darkTextSecondary : 'rgba(15, 23, 42, 0.72)',
        itemSelectedColor: isDark ? '#ffffff' : colorPrimary,
      },
      Card: {
        colorBgContainer: isDark ? darkPanelElevatedBg : '#ffffff',
      },
      Table: {
        headerBg: isDark ? darkPanelMutedBg : '#fafafa',
        headerColor: isDark ? darkTextPrimary : 'rgba(15, 23, 42, 0.88)',
        headerSortActiveBg: isDark ? '#1b2940' : 'rgba(15, 23, 42, 0.06)',
        headerSortHoverBg: isDark ? '#243145' : 'rgba(15, 23, 42, 0.08)',
        bodySortBg: isDark ? '#10192a' : 'rgba(15, 23, 42, 0.04)',
        rowHoverBg: isDark ? darkHoverBg : 'rgba(15, 23, 42, 0.04)',
        rowSelectedBg: isDark ? darkSelectedBg : 'rgba(22, 119, 255, 0.12)',
        rowSelectedHoverBg: isDark ? darkSelectedHoverBg : 'rgba(22, 119, 255, 0.18)',
        rowExpandedBg: isDark ? darkPanelMutedBg : '#fafafa',
        borderColor: isDark ? darkBorder : 'rgba(15, 23, 42, 0.08)',
        headerSplitColor: isDark ? darkBorder : 'rgba(15, 23, 42, 0.08)',
        footerBg: isDark ? darkPanelMutedBg : '#fafafa',
        filterDropdownBg: isDark ? darkPanelElevatedBg : '#ffffff',
        filterDropdownMenuBg: isDark ? darkPanelElevatedBg : '#ffffff',
        expandIconBg: isDark ? darkPanelElevatedBg : '#ffffff',
      },
      Modal: {
        headerBg: isDark ? darkPanelElevatedBg : '#ffffff',
        contentBg: isDark ? darkPanelElevatedBg : '#ffffff',
        footerBg: isDark ? darkPanelElevatedBg : '#ffffff',
        titleColor: isDark ? darkTextPrimary : 'rgba(15, 23, 42, 0.88)',
      },
      Input: {
        addonBg: isDark ? darkPanelMutedBg : '#fafafa',
        hoverBg: isDark ? darkPanelBg : '#ffffff',
        activeBg: isDark ? darkPanelBg : '#ffffff',
        hoverBorderColor: isDark ? '#3b82f6' : colorPrimary,
        activeBorderColor: colorPrimary,
        activeShadow: darkActiveShadow,
      },
      Select: {
        selectorBg: isDark ? darkPanelBg : '#ffffff',
        clearBg: isDark ? darkPanelBg : '#ffffff',
        optionActiveBg: isDark ? darkHoverBg : 'rgba(15, 23, 42, 0.04)',
        optionSelectedBg: isDark ? darkSelectedBg : 'rgba(22, 119, 255, 0.1)',
        optionSelectedColor: isDark ? darkTextPrimary : 'rgba(15, 23, 42, 0.88)',
        hoverBorderColor: isDark ? '#3b82f6' : colorPrimary,
        activeBorderColor: colorPrimary,
        activeOutlineColor: isDark ? 'rgba(22, 119, 255, 0.2)' : 'rgba(22, 119, 255, 0.16)',
        multipleItemBg: isDark ? darkPanelMutedBg : 'rgba(15, 23, 42, 0.06)',
      },
      Dropdown: {
        paddingBlock: 6,
      },
    },
  }
}

export function getThemeAlgorithm(themeMode: ThemeMode) {
  return themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
}
