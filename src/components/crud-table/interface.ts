import type { Component } from 'vue'

/**
 * 字段配置类型
 * 用于 CrudTable、SearchForm、ActionModal 等组件的字段配置
 */
export interface FieldConfig {
  /** 字段标签 */
  label: string
  /** 字段键名 */
  key: string
  /** 字段类型（如 text、number、dictionary 等） */
  type?: string
  /** 自定义组件（字符串或 Vue 组件对象） */
  component?: string | Component
  /** 传递给组件的属性 */
  props?: Record<string, any>
  /** 占位符文本 */
  placeholder?: string
  /** 是否可编辑（用于编辑表单） */
  editable?: boolean
  /** 支持其他自定义属性 */
  [x: string]: any
}

