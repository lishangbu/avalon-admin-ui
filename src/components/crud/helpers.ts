import { YesNo } from '@/constants/yes-no'

import type {
  CrudBuiltinComponent,
  CrudColumnConfig,
  CrudDeleteMaybeValue,
  CrudFieldConfig,
  CrudFieldContext,
  CrudFieldOption,
  CrudIndexColumnConfig,
  CrudInterfaceSchema,
  CrudListSchema,
  CrudModel,
  CrudMutationMaybeValue,
  CrudPageSchema,
} from './index'
import type { FormItemRule, FormRules, SelectOption } from 'naive-ui'
import type { Component, MaybeRef } from 'vue'

type CrudRecordKey<TRecord> = Extract<keyof TRecord, string>
type CrudFormKey<TForm extends object> = Extract<keyof TForm, string>
type FlatCrudComponent = CrudBuiltinComponent | Component
type CrudMode = 'create' | 'edit'

function isCrudModel(value: unknown): value is CrudModel {
  return Boolean(value) && typeof value === 'object'
}

function toCrudModel(value: object): CrudModel {
  return value as CrudModel
}

function getValueByPath(record: object, path: string) {
  return path.split('.').reduce<unknown>((value, key) => {
    if (!isCrudModel(value)) {
      return undefined
    }

    return value[key]
  }, record)
}

interface FlatCrudFormFieldConfig<TForm extends object> {
  label: string
  component?: FlatCrudComponent
  placeholder?: string
  clearable?: boolean
  filterable?: boolean
  props?: Record<string, unknown>
  options?: MaybeRef<CrudFieldOption[]>
  loading?: MaybeRef<boolean>
  disabled?: CrudMutationMaybeValue<TForm>
  modelProp?: string
  updateEvent?: string
  rules?: FormItemRule[]
  defaultValue?: unknown
}

interface FlatCrudSearchFieldConfig {
  label?: string
  component?: FlatCrudComponent
  placeholder?: string
  clearable?: boolean
  filterable?: boolean
  props?: Record<string, unknown>
  options?: MaybeRef<CrudFieldOption[]>
  loading?: MaybeRef<boolean>
  disabled?: MaybeRef<boolean> | ((context: CrudFieldContext) => boolean)
  modelProp?: string
  updateEvent?: string
  defaultValue?: unknown
}

interface FlatCrudFormModelConfig<
  TRecord extends object,
  TForm extends object,
  TKey extends CrudFormKey<TForm>,
> {
  defaultValue?: TForm[TKey]
  sourcePath?: string
  fromRecord?: (record: TRecord) => TForm[TKey]
}

interface FlatCrudPayloadContext<TForm extends object> {
  form: TForm
  mode: CrudMode
}

interface FlatCrudPayloadConfig<TForm extends object, TPayload, TKey extends CrudFormKey<TForm>> {
  key?: Extract<keyof TPayload, string> | string
  trim?: boolean
  toValue?: (value: TForm[TKey], context: FlatCrudPayloadContext<TForm>) => unknown
  omitWhen?: (value: unknown, context: FlatCrudPayloadContext<TForm>) => boolean
}

interface FlatCrudTableFieldConfig<TRecord extends object> {
  title?: string
  width?: number
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  render?: (record: TRecord) => ReturnType<NonNullable<CrudColumnConfig<TRecord>['render']>>
  valuePath?: string
}

export interface FlatCrudFieldDefinition<
  TRecord extends object,
  TForm extends object = TRecord,
  TPayload = TForm,
  TKey extends CrudFormKey<TForm> = CrudFormKey<TForm>,
> {
  key: TKey
  trim?: boolean
  formModel?: FlatCrudFormModelConfig<TRecord, TForm, TKey> | false
  payload?: FlatCrudPayloadConfig<TForm, TPayload, TKey> | false
  form?: FlatCrudFormFieldConfig<TForm> | false
  search?: FlatCrudSearchFieldConfig | false
  table?: FlatCrudTableFieldConfig<TRecord> | false
}

interface FlatCrudInterfaceOptions<TRecord extends object, TForm extends object> {
  create: {
    buttonLabel: string
    dialogTitle?: string
    disabled?: MaybeRef<boolean>
    submitDisabled?: CrudMutationMaybeValue<TForm>
    successMessage: string
  }
  delete: {
    confirmMessage: string | ((record: TRecord) => string)
    disabled?: CrudDeleteMaybeValue<TRecord>
    successMessage: string
  }
  edit: {
    dialogTitle: string
    submitDisabled?: CrudMutationMaybeValue<TForm>
    successMessage: string
  }
  fields: FlatCrudFieldDefinition<TRecord, TForm>[]
  formGridClass?: string
  indexColumn?: CrudIndexColumnConfig | boolean
  modalWidth?: string
  searchGridClass?: string
}

interface FlatCrudPageOptions<
  TRecord extends object,
  TQuery extends object,
  TForm extends object,
  TCreatePayload,
  TUpdatePayload = TCreatePayload,
> {
  fields: FlatCrudFieldDefinition<TRecord, TForm, TCreatePayload & TUpdatePayload>[]
  idKey?: CrudRecordKey<TRecord>
  loadPage: (pageRequest: PageRequest<TQuery>) => Promise<ApiResult<Page<TRecord>>>
  createRecord: (payload: TCreatePayload) => Promise<ApiResult<unknown>>
  deleteRecord: (id: Id) => Promise<ApiResult<unknown>>
  updateRecord: (payload: TUpdatePayload) => Promise<ApiResult<unknown>>
}

interface FlatCrudListOptions<
  TRecord extends object,
  TQuery extends object,
  TForm extends object,
  TCreatePayload,
  TUpdatePayload = TCreatePayload,
> {
  fields: FlatCrudFieldDefinition<TRecord, TForm, TCreatePayload & TUpdatePayload>[]
  idKey?: CrudRecordKey<TRecord>
  loadList: (query: TQuery) => Promise<ApiResult<TRecord[]>>
  createRecord: (payload: TCreatePayload) => Promise<ApiResult<unknown>>
  deleteRecord: (id: Id) => Promise<ApiResult<unknown>>
  updateRecord: (payload: TUpdatePayload) => Promise<ApiResult<unknown>>
}

function hasFormField<TRecord extends object, TForm extends object, TPayload>(
  field: FlatCrudFieldDefinition<TRecord, TForm, TPayload>,
): field is FlatCrudFieldDefinition<TRecord, TForm, TPayload> & {
  form: FlatCrudFormFieldConfig<TForm>
} {
  return Boolean(field.form)
}

function hasSearchField<TRecord extends object, TForm extends object, TPayload>(
  field: FlatCrudFieldDefinition<TRecord, TForm, TPayload>,
): field is FlatCrudFieldDefinition<TRecord, TForm, TPayload> & {
  search: FlatCrudSearchFieldConfig
} {
  return Boolean(field.search)
}

function hasTableField<TRecord extends object, TForm extends object, TPayload>(
  field: FlatCrudFieldDefinition<TRecord, TForm, TPayload>,
): field is FlatCrudFieldDefinition<TRecord, TForm, TPayload> & {
  table: FlatCrudTableFieldConfig<TRecord>
} {
  return Boolean(field.table)
}

function hasFormModelField<TRecord extends object, TForm extends object, TPayload>(
  field: FlatCrudFieldDefinition<TRecord, TForm, TPayload>,
): boolean {
  return field.formModel !== false && (Boolean(field.form) || Boolean(field.formModel))
}

function getFieldComponent(component?: FlatCrudComponent) {
  return component ?? 'input'
}

function createDefaultValue(component?: FlatCrudComponent) {
  return component === 'input' || component === undefined ? '' : null
}

function normalizeValue(value: unknown, trim?: boolean) {
  if (trim && typeof value === 'string') {
    return value.trim()
  }

  return value
}

function createFormField<TRecord extends object, TForm extends object>(
  field: FlatCrudFieldDefinition<TRecord, TForm>,
): CrudFieldConfig | null {
  if (!hasFormField(field)) {
    return null
  }

  const formDisabled = field.form.disabled
  const disabled =
    typeof formDisabled === 'function'
      ? (context: CrudFieldContext) =>
          formDisabled({
            mode: context.mode,
            model: context.model as unknown as TForm,
          })
      : formDisabled

  return {
    key: field.key,
    label: field.form.label,
    component: getFieldComponent(field.form.component),
    placeholder: field.form.placeholder,
    clearable: field.form.clearable,
    filterable: field.form.filterable,
    props: field.form.props,
    options: field.form.options,
    loading: field.form.loading,
    disabled,
    modelProp: field.form.modelProp,
    updateEvent: field.form.updateEvent,
  }
}

function createSearchField<TRecord extends object, TForm extends object>(
  field: FlatCrudFieldDefinition<TRecord, TForm>,
): CrudFieldConfig | null {
  if (!hasSearchField(field)) {
    return null
  }

  const formLabel = hasFormField(field) ? field.form.label : undefined

  return {
    key: field.key,
    label: field.search.label ?? formLabel ?? String(field.key),
    component: getFieldComponent(field.search.component),
    placeholder: field.search.placeholder,
    clearable: field.search.clearable,
    filterable: field.search.filterable,
    props: field.search.props,
    options: field.search.options,
    loading: field.search.loading,
    disabled: field.search.disabled,
    modelProp: field.search.modelProp,
    updateEvent: field.search.updateEvent,
  }
}

function createTableColumn<TRecord extends object, TForm extends object>(
  field: FlatCrudFieldDefinition<TRecord, TForm>,
): CrudColumnConfig<TRecord> | null {
  if (!hasTableField(field)) {
    return null
  }

  const formLabel = hasFormField(field) ? field.form.label : undefined
  const searchLabel = hasSearchField(field) ? field.search.label : undefined

  return {
    key: field.key,
    title: field.table.title ?? formLabel ?? searchLabel ?? String(field.key),
    width: field.table.width,
    fixed: field.table.fixed,
    align: field.table.align,
    render: field.table.render,
    valuePath: field.table.valuePath,
  }
}

export function hasId(value: unknown): value is Id {
  return (typeof value === 'string' && value.length > 0) || typeof value === 'number'
}

export function createIdRule(label: string): FormItemRule {
  return {
    required: true,
    trigger: ['change'],
    validator: (_rule, value: unknown) => {
      return hasId(value) ? true : new Error(`请选择${label}`)
    },
  }
}

function getModelDefaultValue<TRecord extends object, TForm extends object, TPayload>(
  field: FlatCrudFieldDefinition<TRecord, TForm, TPayload>,
) {
  if (field.formModel && 'defaultValue' in field.formModel) {
    return field.formModel.defaultValue
  }

  if (field.form && 'defaultValue' in field.form) {
    return field.form.defaultValue
  }

  return hasFormField(field) ? createDefaultValue(field.form.component) : null
}

function getFormModelValue<TRecord extends object, TForm extends object, TPayload>(
  field: FlatCrudFieldDefinition<TRecord, TForm, TPayload>,
  record: TRecord,
) {
  if (field.formModel) {
    if (field.formModel.fromRecord) {
      return field.formModel.fromRecord(record)
    }

    if (field.formModel.sourcePath) {
      return getValueByPath(record, field.formModel.sourcePath)
    }
  }

  return toCrudModel(record)[field.key]
}

function getPayloadEntry<
  TRecord extends object,
  TForm extends object,
  TPayload,
  TKey extends CrudFormKey<TForm>,
>(field: FlatCrudFieldDefinition<TRecord, TForm, TPayload, TKey>, form: TForm, mode: CrudMode) {
  const payloadContext: FlatCrudPayloadContext<TForm> = {
    form,
    mode,
  }
  const payloadConfig = field.payload || undefined
  const payloadKey = payloadConfig?.key
  const targetKey = payloadKey ?? field.key
  const shouldTrim = payloadConfig ? (payloadConfig.trim ?? field.trim) : field.trim
  const rawValue = normalizeValue(toCrudModel(form)[field.key], shouldTrim)
  const nextValue = payloadConfig?.toValue
    ? payloadConfig.toValue(rawValue as TForm[TKey], payloadContext)
    : rawValue
  const shouldOmit = payloadConfig?.omitWhen
    ? payloadConfig.omitWhen(nextValue, payloadContext)
    : false

  if (shouldOmit) {
    return null
  }

  return [targetKey, nextValue] as const
}

export function createFlatCrudInterfaceSchema<
  TRecord extends object,
  TForm extends object = TRecord,
>(options: FlatCrudInterfaceOptions<TRecord, TForm>): CrudInterfaceSchema<TRecord, TForm> {
  const formRules = options.fields.reduce<FormRules>((rules, field) => {
    if (hasFormField(field) && field.form.rules?.length) {
      rules[field.key] = field.form.rules
    }

    return rules
  }, {})

  return {
    create: {
      buttonLabel: options.create.buttonLabel,
      dialogTitle: options.create.dialogTitle ?? options.create.buttonLabel,
      disabled: options.create.disabled,
      submitDisabled: options.create.submitDisabled,
      successMessage: options.create.successMessage,
    },
    delete: {
      confirmMessage: options.delete.confirmMessage,
      disabled: options.delete.disabled,
      successMessage: options.delete.successMessage,
    },
    edit: {
      dialogTitle: options.edit.dialogTitle,
      submitDisabled: options.edit.submitDisabled,
      successMessage: options.edit.successMessage,
    },
    formFields: options.fields
      .map(createFormField)
      .filter((field): field is CrudFieldConfig => Boolean(field)),
    formGridClass: options.formGridClass,
    formRules: Object.keys(formRules).length > 0 ? formRules : undefined,
    indexColumn: options.indexColumn,
    modalWidth: options.modalWidth,
    searchFields: options.fields
      .map(createSearchField)
      .filter((field): field is CrudFieldConfig => Boolean(field)),
    searchGridClass: options.searchGridClass,
    tableColumns: options.fields
      .map(createTableColumn)
      .filter((column): column is CrudColumnConfig<TRecord> => Boolean(column)),
  }
}

type FlatCrudMutationSchema<
  TRecord extends object,
  TQuery extends object,
  TForm extends object,
  TCreatePayload,
  TUpdatePayload = TCreatePayload,
> = Omit<CrudPageSchema<TRecord, TQuery, TForm, TCreatePayload, TUpdatePayload>, 'loadPage'>

function createFlatCrudMutationSchema<
  TRecord extends object,
  TQuery extends object,
  TForm extends object,
  TCreatePayload,
  TUpdatePayload = TCreatePayload,
>(
  options: Pick<
    FlatCrudPageOptions<TRecord, TQuery, TForm, TCreatePayload, TUpdatePayload>,
    'fields' | 'idKey' | 'createRecord' | 'deleteRecord' | 'updateRecord'
  >,
): FlatCrudMutationSchema<TRecord, TQuery, TForm, TCreatePayload, TUpdatePayload> {
  return {
    mapRecordToFormModel: (record) =>
      Object.fromEntries(
        options.fields.filter(hasFormModelField).map((field) => {
          const value = getFormModelValue(field, record)
          const fallback = getModelDefaultValue(field)
          return [field.key, value ?? fallback]
        }),
      ) as TForm,
    createRecord: options.createRecord,
    createFormModel: () =>
      Object.fromEntries(
        options.fields
          .filter(hasFormModelField)
          .map((field) => [field.key, getModelDefaultValue(field)]),
      ) as TForm,
    createPayload: (form) =>
      Object.fromEntries(
        options.fields
          .filter(hasFormModelField)
          .filter((field) => field.payload !== false)
          .map((field) => getPayloadEntry(field, form, 'create'))
          .filter((entry): entry is readonly [string, unknown] => Boolean(entry)),
      ) as TCreatePayload,
    createSearchModel: () =>
      Object.fromEntries(
        options.fields
          .filter(hasSearchField)
          .map((field) => [
            field.key,
            field.search.defaultValue ?? createDefaultValue(field.search.component),
          ]),
      ) as TQuery,
    deleteRecord: (record) => {
      const idKey = options.idKey ?? ('id' as CrudRecordKey<TRecord>)
      const id = toCrudModel(record)[idKey]

      if (!hasId(id)) {
        return Promise.reject(new Error(`Missing record id: ${idKey}`))
      }

      return options.deleteRecord(id)
    },
    updatePayload: (form) =>
      Object.fromEntries(
        options.fields
          .filter(hasFormModelField)
          .filter((field) => field.payload !== false)
          .map((field) => getPayloadEntry(field, form, 'edit'))
          .filter((entry): entry is readonly [string, unknown] => Boolean(entry)),
      ) as TUpdatePayload,
    updateRecord: options.updateRecord,
  }
}

export function createFlatCrudPageSchema<
  TRecord extends object,
  TQuery extends object = CrudModel,
  TForm extends object = TRecord,
  TCreatePayload = TForm,
  TUpdatePayload = TCreatePayload,
>(
  options: FlatCrudPageOptions<TRecord, TQuery, TForm, TCreatePayload, TUpdatePayload>,
): CrudPageSchema<TRecord, TQuery, TForm, TCreatePayload, TUpdatePayload> {
  return {
    loadPage: options.loadPage,
    ...createFlatCrudMutationSchema(options),
  }
}

export function createFlatCrudListSchema<
  TRecord extends object,
  TQuery extends object = CrudModel,
  TForm extends object = TRecord,
  TCreatePayload = TForm,
  TUpdatePayload = TCreatePayload,
>(
  options: FlatCrudListOptions<TRecord, TQuery, TForm, TCreatePayload, TUpdatePayload>,
): CrudListSchema<TRecord, TQuery, TForm, TCreatePayload, TUpdatePayload> {
  return {
    loadList: options.loadList,
    ...createFlatCrudMutationSchema(options),
  }
}

export function pickRelationId<T extends { id?: Id }>(item?: T | null): NullableId {
  return hasId(item?.id) ? item.id : null
}

export function collectRelationIds<T extends { id?: Id }>(items?: T[] | null): Id[] {
  return items?.map((item) => item.id).filter((id): id is Id => hasId(id)) ?? []
}

export function createRelation(id: NullableId | undefined) {
  return hasId(id) ? { id } : null
}

export function createRelations(ids: readonly Id[]) {
  return ids.map((id) => ({ id }))
}

export function toFlagValue(
  value: boolean | null | undefined,
  fallback: NullableYesNo = null,
): NullableYesNo {
  if (value === true) {
    return YesNo.Yes
  }

  if (value === false) {
    return YesNo.No
  }

  return fallback
}

export function fromFlagValue(value: NullableYesNo) {
  if (value === null) {
    return undefined
  }

  return value === YesNo.Yes
}

export function splitCommaSeparatedValues(value: string | undefined) {
  return (
    value
      ?.split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0) ?? []
  )
}

export function joinCommaSeparatedValues(values: string[]) {
  return values
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .join(',')
}

export function toSelectOptions<T extends { id?: Id; name?: string; internalName?: string }>(
  items: T[],
): SelectOption[] {
  return items
    .filter(
      (item): item is T & { id: Id } =>
        (typeof item.id === 'string' && item.id.length > 0) || typeof item.id === 'number',
    )
    .map((item) => ({
      value: item.id,
      label:
        item.name && item.internalName
          ? `${item.name} (${item.internalName})`
          : item.name || item.internalName || `#${item.id}`,
    }))
}
