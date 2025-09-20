import { ccAPCA, cdh } from '@/utils/chromaHelper'
import twc from '@/utils/tailwindColor'

import type { GlobalThemeOverrides } from 'naive-ui'

export function commonThemeOverrides(primaryColor = ''): GlobalThemeOverrides {
  return {
    common: {
      actionColor: '',

      borderRadius: '4px',

      primaryColor,
      primaryColorHover: cdh(primaryColor, 0.1),
      primaryColorPressed: cdh(primaryColor, 0.2),
      primaryColorSuppl: primaryColor,

      scrollbarBorderRadius: '0',
    },
    Button: {
      textColorPrimary: ccAPCA(primaryColor, twc.neutral[150], twc.neutral[950]),
      textColorHoverPrimary: cdh(ccAPCA(primaryColor, twc.neutral[150], twc.neutral[950]), 0.1),
      textColorPressedPrimary: cdh(ccAPCA(primaryColor, twc.neutral[150], twc.neutral[950]), 0.2),
      textColorSupplPrimary: ccAPCA(primaryColor, twc.neutral[150], twc.neutral[950]),
      textColorFocusPrimary: ccAPCA(primaryColor, twc.neutral[150], twc.neutral[950]),
    },
    Checkbox: {
      checkMarkColor: ccAPCA(primaryColor, twc.neutral[150], twc.neutral[800]),
    },
    Dialog: {
      iconSize: '24px',
      iconMargin: '0 8px 0 0',
    },
    Drawer: {
      borderRadius: 0,
    },
    Dropdown: {
      padding: '6px 2px',
    },
    Menu: {
      peers: {
        Dropdown: {
          padding: '6px 2px',
        },
      },
    },
    Message: {
      iconMargin: '0 6px 0 0',
      padding: '10px 18px',
    },
    Popconfirm: {
      iconSize: '20px',
    },
    Scrollbar: {
      railInsetHorizontalBottom: 'auto 0px 0px 0px',
      railInsetVerticalRight: '0px 0px 0px auto',
    },
  }
}
