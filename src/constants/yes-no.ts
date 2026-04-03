export const YesNo = {
  Yes: 1,
  No: 0,
} as const

export type YesNo = (typeof YesNo)[keyof typeof YesNo]
export type NullableYesNo = YesNo | null
