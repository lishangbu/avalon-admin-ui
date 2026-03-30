import type { FormRules, SelectOption } from 'naive-ui'
import type { TreeSelectOption } from 'naive-ui/es/tree-select'
import type { Component, MaybeRef, VNodeChild } from 'vue'

export type CrudRecord = object
export type CrudModel = Record<string, unknown>

export type CrudBuiltinComponent = 'input' | 'number' | 'select' | 'radio' | 'tree-select'
export type CrudFieldOption = SelectOption | TreeSelectOption

export interface CrudFieldContext {
  mode: 'create' | 'edit'
  model: CrudModel
}

export interface CrudFieldRenderContext extends CrudFieldContext {
  field: CrudFieldConfig
  value: unknown
  setValue: (value: unknown) => void
}

type CrudFieldMaybeValue<T> = MaybeRef<T> | ((context: CrudFieldContext) => T)
export type CrudMutationMaybeValue<TForm extends object = CrudModel, TValue = boolean> =
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

export interface CrudCreateConfig<TForm extends object = CrudModel> {
  buttonLabel: string
  dialogTitle: string
  disabled?: MaybeRef<boolean>
  submitDisabled?: CrudMutationMaybeValue<TForm>
  successMessage: string
}

export interface CrudEditConfig<TForm extends object = CrudModel> {
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
  TSearch extends object = CrudModel,
  TForm extends object = CrudModel,
  TCreatePayload = unknown,
  TUpdatePayload = TCreatePayload,
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
  createRecord: (payload: TCreatePayload) => Promise<ApiResult<unknown>>
  createFormModel: () => TForm
  createPayload: (form: TForm) => TCreatePayload
  createSearchModel: () => TSearch
  deleteRecord: (record: TRecord) => Promise<ApiResult<unknown>>
  updatePayload: (form: TForm) => TUpdatePayload
  updateRecord: (payload: TUpdatePayload) => Promise<ApiResult<unknown>>
}

export interface CrudConfig<
  TRecord extends CrudRecord = CrudRecord,
  TSearch extends object = CrudModel,
  TForm extends object = CrudModel,
  TCreatePayload = unknown,
  TUpdatePayload = TCreatePayload,
> extends CrudBaseConfig<TRecord, TSearch, TForm, TCreatePayload, TUpdatePayload> {
  loadPage: (pageRequest: PageRequest<TSearch>) => Promise<ApiResult<Page<TRecord>>>
}

export interface CrudListConfig<
  TRecord extends CrudRecord = CrudRecord,
  TSearch extends object = CrudModel,
  TForm extends object = CrudModel,
  TCreatePayload = unknown,
  TUpdatePayload = TCreatePayload,
> extends CrudBaseConfig<TRecord, TSearch, TForm, TCreatePayload, TUpdatePayload> {
  loadList: (query: TSearch) => Promise<ApiResult<TRecord[]>>
}
