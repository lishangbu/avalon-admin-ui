import type { IconProps } from '@iconify/vue'
import type { PopoverProps } from 'naive-ui'
import type { HTMLAttributes, SVGAttributes, VNodeChild } from 'vue'

type HintHelpIconProps = Partial<IconProps> & Omit<SVGAttributes, 'mode'>

export interface HintHelpProps {
  content?: (() => VNodeChild) | string
  iconProps?: HintHelpIconProps
  label?: string
  labelProps?: HTMLAttributes
  popoverProps?: PopoverProps
}
