import type { FormRules, SelectOption } from 'naive-ui'
import type { MaybeRef, VNodeChild } from 'vue'

export type CrudRecord = object

export interface CrudFieldContext {
  mode: 'create' | 'edit'
  model: CrudRecord
}

export interface CrudFieldConfig {
  key: string
  label: string
  type: 'input' | 'number' | 'select'
  placeholder?: string
  clearable?: boolean
  filterable?: boolean
  props?: Record<string, unknown>
  options?: MaybeRef<SelectOption[]>
  loading?: MaybeRef<boolean>
  disabled?: MaybeRef<boolean> | ((context: CrudFieldContext) => boolean)
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

export interface CrudBaseConfig<
  TRecord extends CrudRecord = CrudRecord,
  TSearch extends object = CrudRecord,
  TForm extends CrudRecord = CrudRecord,
  TPayload = unknown,
> {
  createLabel: string
  createDisabled?: MaybeRef<boolean>
  createTitle: string
  createSuccessMessage: string
  deleteConfirmMessage: string | ((record: TRecord) => string)
  deleteSuccessMessage: string
  editTitle: string
  formFields: CrudFieldConfig[]
  formGridClass?: string
  formRules?: FormRules
  initialize?: () => Promise<void>
  mapRecordToFormModel: (record: TRecord) => TForm
  modalWidth?: string
  searchFields: CrudFieldConfig[]
  searchGridClass?: string
  indexColumn?: CrudIndexColumnConfig | boolean
  tableColumns: CrudColumnConfig<TRecord>[]
  updateSuccessMessage: string
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
