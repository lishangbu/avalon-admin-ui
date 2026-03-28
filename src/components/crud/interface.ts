import type { FormRules, SelectOption } from 'naive-ui'
import type { Component, MaybeRef, VNodeChild } from 'vue'

export type CrudRecord = object

export type CrudBuiltinComponent = 'input' | 'number' | 'select' | 'radio'

export interface CrudFieldContext {
  mode: 'create' | 'edit'
  model: CrudRecord
}

export interface CrudFieldRenderContext extends CrudFieldContext {
  field: CrudFieldConfig
  value: unknown
  setValue: (value: unknown) => void
}

type CrudFieldMaybeValue<T> = MaybeRef<T> | ((context: CrudFieldContext) => T)

export interface CrudFieldConfig {
  key: string
  label: string
  component?: CrudBuiltinComponent | Component
  placeholder?: string
  clearable?: boolean
  filterable?: boolean
  props?: CrudFieldMaybeValue<Record<string, unknown>>
  options?: CrudFieldMaybeValue<SelectOption[]>
  loading?: CrudFieldMaybeValue<boolean>
  disabled?: CrudFieldMaybeValue<boolean>
  modelProp?: string
  updateEvent?: string
  slots?: (context: CrudFieldRenderContext) => Record<string, () => VNodeChild>
  render?: (context: CrudFieldRenderContext) => VNodeChild
}

export interface CrudColumnConfig<TRecord extends CrudRecord = CrudRecord> {
  key: string
  title: string
  width?: number
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  render?: (record: TRecord) => VNodeChild
  valuePath?: string
}

export interface CrudIndexColumnConfig {
  title?: string
  width?: number
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
}

export interface CrudCreateConfig {
  buttonLabel: string
  dialogTitle: string
  disabled?: MaybeRef<boolean>
  successMessage: string
}

export interface CrudEditConfig {
  dialogTitle: string
  successMessage: string
}

export interface CrudDeleteConfig<TRecord extends CrudRecord = CrudRecord> {
  confirmMessage: string | ((record: TRecord) => string)
  successMessage: string
}

export interface CrudBaseConfig<
  TRecord extends CrudRecord = CrudRecord,
  TSearch extends object = CrudRecord,
  TForm extends CrudRecord = CrudRecord,
  TPayload = unknown,
> {
  create: CrudCreateConfig
  delete: CrudDeleteConfig<TRecord>
  edit: CrudEditConfig
  formFields: CrudFieldConfig[]
  formGridClass?: string
  formRules?: FormRules
  initialize?: () => Promise<void>
  loadRecordForEdit?: (record: TRecord) => Promise<TRecord>
  mapRecordToFormModel: (record: TRecord) => TForm
  modalWidth?: string
  searchFields: CrudFieldConfig[]
  searchGridClass?: string
  indexColumn?: CrudIndexColumnConfig | boolean
  tableColumns: CrudColumnConfig<TRecord>[]
  createRecord: (payload: TPayload) => Promise<ApiResult<unknown>>
  createFormModel: () => TForm
  createPayload: (form: TForm, mode: 'create' | 'edit') => TPayload
  createSearchModel: () => TSearch
  deleteRecord: (record: TRecord) => Promise<ApiResult<unknown>>
  updateRecord: (payload: TPayload) => Promise<ApiResult<unknown>>
}

export interface CrudConfig<
  TRecord extends CrudRecord = CrudRecord,
  TSearch extends object = CrudRecord,
  TForm extends CrudRecord = CrudRecord,
  TPayload = unknown,
> extends CrudBaseConfig<TRecord, TSearch, TForm, TPayload> {
  loadPage: (pageRequest: PageRequest<TSearch>) => Promise<ApiResult<Page<TRecord>>>
}

export interface CrudListConfig<
  TRecord extends CrudRecord = CrudRecord,
  TSearch extends object = CrudRecord,
  TForm extends CrudRecord = CrudRecord,
  TPayload = unknown,
> extends CrudBaseConfig<TRecord, TSearch, TForm, TPayload> {
  loadList: (query: TSearch) => Promise<ApiResult<TRecord[]>>
}
