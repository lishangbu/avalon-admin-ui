import type {
  CrudColumnConfig,
  CrudConfig,
  CrudCreateConfig,
  CrudDeleteConfig,
  CrudEditConfig,
  CrudFieldConfig,
  CrudIndexColumnConfig,
  CrudListConfig,
  CrudRecord,
} from './interface'
import type { FormRules } from 'naive-ui'

export interface CrudInterfaceSchema<TRecord extends CrudRecord = CrudRecord> {
  create: CrudCreateConfig
  delete: CrudDeleteConfig<TRecord>
  edit: CrudEditConfig
  formFields: CrudFieldConfig[]
  formGridClass?: string
  formRules?: FormRules
  modalWidth?: string
  searchFields: CrudFieldConfig[]
  searchGridClass?: string
  indexColumn?: CrudIndexColumnConfig | boolean
  tableColumns: CrudColumnConfig<TRecord>[]
}

export interface CrudBaseSchema<
  TRecord extends CrudRecord = CrudRecord,
  TSearch extends object = CrudRecord,
  TForm extends CrudRecord = CrudRecord,
  TPayload = unknown,
> {
  initialize?: () => Promise<void>
  loadRecordForEdit?: (record: TRecord) => Promise<TRecord>
  mapRecordToFormModel: (record: TRecord) => TForm
  createRecord: (payload: TPayload) => Promise<ApiResult<unknown>>
  createFormModel: () => TForm
  createPayload: (form: TForm, mode: 'create' | 'edit') => TPayload
  createSearchModel: () => TSearch
  deleteRecord: (record: TRecord) => Promise<ApiResult<unknown>>
  updateRecord: (payload: TPayload) => Promise<ApiResult<unknown>>
}

export interface CrudPageSchema<
  TRecord extends CrudRecord = CrudRecord,
  TSearch extends object = CrudRecord,
  TForm extends CrudRecord = CrudRecord,
  TPayload = unknown,
> extends CrudBaseSchema<TRecord, TSearch, TForm, TPayload> {
  loadPage: (pageRequest: PageRequest<TSearch>) => Promise<ApiResult<Page<TRecord>>>
}

export interface CrudListSchema<
  TRecord extends CrudRecord = CrudRecord,
  TSearch extends object = CrudRecord,
  TForm extends CrudRecord = CrudRecord,
  TPayload = unknown,
> extends CrudBaseSchema<TRecord, TSearch, TForm, TPayload> {
  loadList: (query: TSearch) => Promise<ApiResult<TRecord[]>>
}

export interface CrudSchema<
  TRecord extends CrudRecord = CrudRecord,
  TSearch extends object = CrudRecord,
  TForm extends CrudRecord = CrudRecord,
  TPayload = unknown,
> {
  interface: CrudInterfaceSchema<TRecord>
  page: CrudPageSchema<TRecord, TSearch, TForm, TPayload>
}

export interface CrudListConfigSchema<
  TRecord extends CrudRecord = CrudRecord,
  TSearch extends object = CrudRecord,
  TForm extends CrudRecord = CrudRecord,
  TPayload = unknown,
> {
  interface: CrudInterfaceSchema<TRecord>
  list: CrudListSchema<TRecord, TSearch, TForm, TPayload>
}

export function createCrudConfig<
  TRecord extends CrudRecord,
  TSearch extends object,
  TForm extends CrudRecord,
  TPayload,
>(
  schema: CrudSchema<TRecord, TSearch, TForm, TPayload>,
): CrudConfig<TRecord, TSearch, TForm, TPayload> {
  return {
    ...schema.interface,
    ...schema.page,
  }
}

export function createCrudListConfig<
  TRecord extends CrudRecord,
  TSearch extends object,
  TForm extends CrudRecord,
  TPayload,
>(
  schema: CrudListConfigSchema<TRecord, TSearch, TForm, TPayload>,
): CrudListConfig<TRecord, TSearch, TForm, TPayload> {
  return {
    ...schema.interface,
    ...schema.list,
  }
}
