import type { Settings } from '@ant-design/pro-components'
import { create } from 'zustand'
import { STORAGE_KEYS } from '@/config/app'
import { DEFAULT_COLOR_PRIMARY, type ThemeMode } from '@/config/theme'
import { readStorage, writeStorage } from '@/utils/storage'

type LayoutMode = 'side' | 'top' | 'mix'
type ContentWidth = 'Fluid' | 'Fixed'
type SiderMenuType = 'sub' | 'group'

type PreferenceSnapshot = {
  themeMode: ThemeMode
  layoutMode: LayoutMode
  colorPrimary: string
  contentWidth: ContentWidth
  fixedHeader: boolean
  fixSiderbar: boolean
  splitMenus: boolean
  siderMenuType: SiderMenuType
}

type SettingDrawerSettings = Partial<Settings> & {
  colorPrimary?: string
}

const defaultPreferences: PreferenceSnapshot = {
  themeMode: 'light',
  layoutMode: 'side',
  colorPrimary: DEFAULT_COLOR_PRIMARY,
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  splitMenus: false,
  siderMenuType: 'group',
}

function getDefaultSiderMenuType(layoutMode: LayoutMode): SiderMenuType {
  return layoutMode === 'mix' ? 'sub' : 'group'
}

function buildSnapshot(state: Partial<PreferencesState>): PreferenceSnapshot {
  const layoutMode = state.layoutMode ?? defaultPreferences.layoutMode

  return {
    themeMode: state.themeMode ?? defaultPreferences.themeMode,
    layoutMode,
    colorPrimary: state.colorPrimary ?? defaultPreferences.colorPrimary,
    contentWidth: state.contentWidth ?? defaultPreferences.contentWidth,
    fixedHeader: state.fixedHeader ?? defaultPreferences.fixedHeader,
    fixSiderbar: state.fixSiderbar ?? defaultPreferences.fixSiderbar,
    splitMenus: state.splitMenus ?? defaultPreferences.splitMenus,
    siderMenuType: state.siderMenuType ?? getDefaultSiderMenuType(layoutMode),
  }
}

function persistPreferences(snapshot: PreferenceSnapshot) {
  writeStorage(STORAGE_KEYS.preferences, snapshot)
  writeStorage(STORAGE_KEYS.theme, snapshot.themeMode)
  writeStorage(STORAGE_KEYS.layout, snapshot.layoutMode)
}

interface PreferencesState {
  themeMode: ThemeMode
  layoutMode: LayoutMode
  colorPrimary: string
  contentWidth: ContentWidth
  fixedHeader: boolean
  fixSiderbar: boolean
  splitMenus: boolean
  siderMenuType: SiderMenuType
  collapsed: boolean
  setThemeMode: (mode: ThemeMode) => void
  toggleTheme: () => void
  toggleCollapsed: () => void
  setLayoutMode: (mode: LayoutMode) => void
  setColorPrimary: (colorPrimary: string) => void
  applySettingDrawer: (settings: SettingDrawerSettings) => void
}

const storedPreferences = readStorage<Partial<PreferenceSnapshot>>(
  STORAGE_KEYS.preferences,
  {},
)

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  themeMode:
    storedPreferences.themeMode ??
    readStorage<ThemeMode>(STORAGE_KEYS.theme, defaultPreferences.themeMode),
  layoutMode:
    storedPreferences.layoutMode ??
    readStorage<LayoutMode>(STORAGE_KEYS.layout, defaultPreferences.layoutMode),
  colorPrimary:
    storedPreferences.colorPrimary ?? defaultPreferences.colorPrimary,
  contentWidth:
    storedPreferences.contentWidth ?? defaultPreferences.contentWidth,
  fixedHeader: storedPreferences.fixedHeader ?? defaultPreferences.fixedHeader,
  fixSiderbar: storedPreferences.fixSiderbar ?? defaultPreferences.fixSiderbar,
  splitMenus: storedPreferences.splitMenus ?? defaultPreferences.splitMenus,
  siderMenuType:
    storedPreferences.siderMenuType ??
    getDefaultSiderMenuType(
      storedPreferences.layoutMode ??
        readStorage<LayoutMode>(
          STORAGE_KEYS.layout,
          defaultPreferences.layoutMode,
        ),
    ),
  collapsed: false,
  setThemeMode(themeMode) {
    const snapshot = buildSnapshot({ ...get(), themeMode })
    persistPreferences(snapshot)
    set({ themeMode })
  },
  toggleTheme() {
    get().setThemeMode(get().themeMode === 'light' ? 'dark' : 'light')
  },
  toggleCollapsed() {
    set((state) => ({ collapsed: !state.collapsed }))
  },
  setLayoutMode(layoutMode) {
    const snapshot = buildSnapshot({ ...get(), layoutMode })
    persistPreferences(snapshot)
    set({ layoutMode })
  },
  setColorPrimary(colorPrimary) {
    const snapshot = buildSnapshot({ ...get(), colorPrimary })
    persistPreferences(snapshot)
    set({ colorPrimary })
  },
  applySettingDrawer(settings) {
    const themeMode =
      settings.navTheme === 'realDark'
        ? 'dark'
        : settings.navTheme === 'light'
          ? 'light'
          : get().themeMode

    const snapshot = buildSnapshot({
      ...get(),
      themeMode,
      layoutMode: settings.layout ?? get().layoutMode,
      colorPrimary: settings.colorPrimary ?? get().colorPrimary,
      contentWidth: settings.contentWidth ?? get().contentWidth,
      fixedHeader: settings.fixedHeader ?? get().fixedHeader,
      fixSiderbar: settings.fixSiderbar ?? get().fixSiderbar,
      splitMenus: settings.splitMenus ?? get().splitMenus,
      siderMenuType: settings.siderMenuType ?? get().siderMenuType,
    })

    persistPreferences(snapshot)
    set(snapshot)
  },
}))
