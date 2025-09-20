import { computed } from 'vue'

import { toRefsPreferencesStore } from '@/stores/preferences'
import twc from '@/utils/tailwindColor'

import type { GlobalThemeOverrides } from 'naive-ui'

export function useComponentThemeOverrides() {
  const { isDark } = toRefsPreferencesStore()

  const scrollbarInModal = computed<GlobalThemeOverrides['Scrollbar']>(() =>
    isDark.value
      ? {
          color: twc.neutral[750],
          colorHover: twc.neutral[700],
        }
      : {
          color: twc.neutral[200],
          colorHover: twc.neutral[250],
        },
  )

  const scrollbarInMainLayout = computed<GlobalThemeOverrides['Scrollbar']>(() =>
    isDark.value
      ? {
          color: twc.neutral[800],
          colorHover: twc.neutral[750],
        }
      : {
          color: twc.neutral[350],
          colorHover: twc.neutral[400],
        },
  )

  const selectInPopover = computed<GlobalThemeOverrides['Select']>(() =>
    isDark.value
      ? {
          peers: {
            InternalSelectMenu: {
              color: twc.neutral[700],
              optionColorPending: twc.neutral[600],
            },
          },
        }
      : {
          peers: {
            InternalSelectMenu: {
              color: '#fff',
              optionColorPending: twc.neutral[150],
            },
          },
        },
  )

  const datePickerInPopover = computed<GlobalThemeOverrides['DatePicker']>(() =>
    isDark.value
      ? {
          panelColor: twc.neutral[700],
        }
      : {
          panelColor: '#fff',
        },
  )

  return {
    scrollbarInModal,
    scrollbarInMainLayout,
    selectInPopover,
    datePickerInPopover,
  }
}
