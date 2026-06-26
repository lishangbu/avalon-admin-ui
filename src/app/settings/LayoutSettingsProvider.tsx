import type { ProSettings } from '@ant-design/pro-components/es/layout';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

const STORAGE_KEY = 'avalon-admin-layout-settings';

export type AvalonLayoutSettings = Partial<ProSettings> & {
  colorPrimary?: string;
  colorWeak?: boolean;
};

interface LayoutSettingsContextValue {
  settings: AvalonLayoutSettings;
  updateSettings: (settings: AvalonLayoutSettings) => void;
  resetSettings: () => void;
}

export const defaultLayoutSettings: AvalonLayoutSettings = {
  navTheme: 'light',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: false,
  splitMenus: false,
  siderMenuType: 'sub',
  colorPrimary: '#1677FF',
  colorWeak: false,
};

const LayoutSettingsContext = createContext<LayoutSettingsContextValue | undefined>(undefined);

export function LayoutSettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<AvalonLayoutSettings>(() =>
    readStoredSettings(defaultLayoutSettings),
  );

  const value = useMemo<LayoutSettingsContextValue>(
    () => ({
      settings,
      updateSettings(nextSettings) {
        setSettings((current) => {
          const merged = normalizeSettings({ ...current, ...nextSettings });
          writeStoredSettings(merged);
          return merged;
        });
      },
      resetSettings() {
        writeStoredSettings(defaultLayoutSettings);
        setSettings(defaultLayoutSettings);
      },
    }),
    [settings],
  );

  useEffect(() => {
    if (settings.colorWeak) {
      if (
        document.body.style.filter !== 'invert(80%)' &&
        document.body.dataset.avalonOriginalFilter === undefined
      ) {
        document.body.dataset.avalonOriginalFilter = document.body.style.filter;
      }
      document.body.style.filter = 'invert(80%)';
      return restoreColorWeakFilter;
    }

    if (document.body.dataset.avalonOriginalFilter !== undefined) {
      restoreColorWeakFilter();
    }
  }, [settings.colorWeak]);

  return <LayoutSettingsContext.Provider value={value}>{children}</LayoutSettingsContext.Provider>;
}

export function useLayoutSettings(): LayoutSettingsContextValue {
  const value = useContext(LayoutSettingsContext);
  if (!value) {
    throw new Error('useLayoutSettings must be used inside LayoutSettingsProvider');
  }
  return value;
}

function readStoredSettings(fallback: AvalonLayoutSettings): AvalonLayoutSettings {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return fallback;
    }
    return normalizeSettings({ ...fallback, ...(JSON.parse(rawValue) as AvalonLayoutSettings) });
  } catch {
    return fallback;
  }
}

function writeStoredSettings(settings: AvalonLayoutSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function restoreColorWeakFilter() {
  if (document.body.dataset.avalonOriginalFilter === undefined) {
    return;
  }

  document.body.style.filter = document.body.dataset.avalonOriginalFilter;
  delete document.body.dataset.avalonOriginalFilter;
}

function normalizeSettings(settings: AvalonLayoutSettings): AvalonLayoutSettings {
  return {
    ...defaultLayoutSettings,
    ...settings,
    menu: undefined,
    title: undefined,
    iconfontUrl: undefined,
  };
}
