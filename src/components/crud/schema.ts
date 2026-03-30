import type {
  CrudColumnConfig,
  CrudConfig,
  CrudCreateConfig,
  CrudDeleteConfig,
  CrudEditConfig,
  CrudFieldConfig,
  CrudIndexColumnConfig,
  CrudListConfig,
  CrudModel,
  CrudRecord,
} from './interface'
import type { FormRules } from 'naive-ui'

export interface CrudInterfaceSchema<
  TRecord extends CrudRecord = CrudRecord,
  TForm extends object = CrudModel,
> {
  create: CrudCreateConfig<TForm>
  delete: CrudDeleteConfig<TRecord>
  edit: CrudEditConfig<TForm>
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
  TSearch extends object = CrudModel,
  TForm extends object = CrudModel,
  TCreatePayload = unknown,
  TUpdatePayload = TCreatePayload,
> {
  initialize?: () => Promise<void>
  loadRecordForEdit?: (record: TRecord) => Promise<TRecord>
  mapRecordToFormModel: (record: TRecord) => TForm
  createRecord: (payload: TCreatePayload) => Promise<ApiResult<unknown>>
  createFormModel: () => TForm
  createPayload: (form: TForm) => TCreatePayload
  createSearchModel: () => TSearch
  deleteRecord: (record: TRecord) => Promise<ApiResult<unknown>>
  updatePayload: (form: TForm) => TUpdatePayload
  updateRecord: (payload: TUpdatePayload) => Promise<ApiResult<unknown>>
}

export interface CrudPageSchema<
  TRecord extends CrudRecord = CrudRecord,
  TSearch extends object = CrudModel,
  TForm extends object = CrudModel,
  TCreatePayload = unknown,
  TUpdatePayload = TCreatePayload,
> extends CrudBaseSchema<TRecord, TSearch, TForm, TCreatePayload, TUpdatePayload> {
  loadPage: (pageRequest: PageRequest<TSearch>) => Promise<ApiResult<Page<TRecord>>>
}

export interface CrudListSchema<
  TRecord extends CrudRecord = CrudRecord,
  TSearch extends object = CrudModel,
  TForm extends object = CrudModel,
  TCreatePayload = unknown,
  TUpdatePayload = TCreatePayload,
> extends CrudBaseSchema<TRecord, TSearch, TForm, TCreatePayload, TUpdatePayload> {
  loadList: (query: TSearch) => Promise<ApiResult<TRecord[]>>
}

export interface CrudSchema<
  TRecord extends CrudRecord = CrudRecord,
  TSearch extends object = CrudModel,
  TForm extends object = CrudModel,
  TCreatePayload = unknown,
  TUpdatePayload = TCreatePayload,
> {
  interface: CrudInterfaceSchema<TRecord, TForm>
  page: CrudPageSchema<TRecord, TSearch, TForm, TCreatePayload, TUpdatePayload>
}

export interface CrudListConfigSchema<
  TRecord extends CrudRecord = CrudRecord,
  TSearch extends object = CrudModel,
  TForm extends object = CrudModel,
  TCreatePayload = unknown,
  TUpdatePayload = TCreatePayload,
> {
  interface: CrudInterfaceSchema<TRecord, TForm>
  list: CrudListSchema<TRecord, TSearch, TForm, TCreatePayload, TUpdatePayload>
}

export function createCrudConfig<
  TRecord extends CrudRecord,
  TSearch extends object,
  TForm extends object,
  TCreatePayload,
  TUpdatePayload = TCreatePayload,
>(
  schema: CrudSchema<TRecord, TSearch, TForm, TCreatePayload, TUpdatePayload>,
): CrudConfig<TRecord, TSearch, TForm, TCreatePayload, TUpdatePayload> {
  return {
    ...schema.interface,
    ...schema.page,
  }
}

export function createCrudListConfig<
  TRecord extends CrudRecord,
  TSearch extends object,
  TForm extends object,
  TCreatePayload,
  TUpdatePayload = TCreatePayload,
>(
  schema: CrudListConfigSchema<TRecord, TSearch, TForm, TCreatePayload, TUpdatePayload>,
): CrudListConfig<TRecord, TSearch, TForm, TCreatePayload, TUpdatePayload> {
  return {
    ...schema.interface,
    ...schema.list,
  }
}
