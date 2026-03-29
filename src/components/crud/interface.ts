import type { FormRules, SelectOption } from 'naive-ui'
import type { TreeSelectOption } from 'naive-ui/es/tree-select'
import type { Component, MaybeRef, VNodeChild } from 'vue'

export type CrudRecord = object

export type CrudBuiltinComponent = 'input' | 'number' | 'select' | 'radio' | 'tree-select'
export type CrudFieldOption = SelectOption | TreeSelectOption

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
export type CrudMutationMaybeValue<TForm extends CrudRecord = CrudRecord, TValue = boolean> =
  | MaybeRef<TValue>
  | ((context: { mode: 'create' | 'edit'; model: TForm }) => TValue)
export type CrudDeleteMaybeValue<TRecord extends CrudRecord = CrudRecord, TValue = boolean> =
  | MaybeRef<TValue>
  | ((record: TRecord) => TValue)

export interface CrudFieldConfig {
  key: string
  label: string
  component?: CrudBuiltinComponent | Component
  placeholder?: string
  clearable?: boolean
  filterable?: boolean
  props?: CrudFieldMaybeValue<Record<string, unknown>>
  options?: CrudFieldMaybeValue<CrudFieldOption[]>
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

export interface CrudCreateConfig<TForm extends CrudRecord = CrudRecord> {
  buttonLabel: string
  dialogTitle: string
  disabled?: MaybeRef<boolean>
  submitDisabled?: CrudMutationMaybeValue<TForm>
  successMessage: string
}

export interface CrudEditConfig<TForm extends CrudRecord = CrudRecord> {
  dialogTitle: string
  submitDisabled?: CrudMutationMaybeValue<TForm>
  successMessage: string
}

export interface CrudDeleteConfig<TRecord extends CrudRecord = CrudRecord> {
  confirmMessage: string | ((record: TRecord) => string)
  disabled?: CrudDeleteMaybeValue<TRecord>
  successMessage: string
}

export interface CrudBaseConfig<
  TRecord extends CrudRecord = CrudRecord,
  TSearch extends object = CrudRecord,
  TForm extends CrudRecord = CrudRecord,
  TPayload = unknown,
> {
  create: CrudCreateConfig<TForm>
  delete: CrudDeleteConfig<TRecord>
  edit: CrudEditConfig<TForm>
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
