import type {
  CrudColumnConfig,
  CrudFieldConfig,
  CrudFieldContext,
  CrudIndexColumnConfig,
  CrudInterfaceSchema,
  CrudPageSchema,
} from './index'
import type { FormItemRule, FormRules, SelectOption } from 'naive-ui'
import type { MaybeRef } from 'vue'

type CrudFieldType = CrudFieldConfig['type']
type CrudRecordKey<TRecord> = Extract<keyof TRecord, string>

interface FlatCrudFormFieldConfig {
  label: string
  type?: CrudFieldType
  placeholder?: string
  clearable?: boolean
  filterable?: boolean
  props?: Record<string, unknown>
  options?: MaybeRef<SelectOption[]>
  loading?: MaybeRef<boolean>
  disabled?: MaybeRef<boolean> | ((context: CrudFieldContext) => boolean)
  rules?: FormItemRule[]
  defaultValue?: unknown
}

interface FlatCrudSearchFieldConfig {
  label?: string
  type?: CrudFieldType
  placeholder?: string
  clearable?: boolean
  filterable?: boolean
  props?: Record<string, unknown>
  options?: MaybeRef<SelectOption[]>
  loading?: MaybeRef<boolean>
  disabled?: MaybeRef<boolean> | ((context: CrudFieldContext) => boolean)
  defaultValue?: unknown
}

interface FlatCrudTableFieldConfig<TRecord extends object> {
  title?: string
  width?: number
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  render?: (record: TRecord) => ReturnType<NonNullable<CrudColumnConfig<TRecord>['render']>>
  valuePath?: string
}

export interface FlatCrudFieldDefinition<TRecord extends object> {
  key: CrudRecordKey<TRecord>
  trim?: boolean
  form?: FlatCrudFormFieldConfig | false
  search?: FlatCrudSearchFieldConfig | false
  table?: FlatCrudTableFieldConfig<TRecord> | false
}

interface FlatCrudInterfaceOptions<TRecord extends object> {
  createLabel: string
  createDisabled?: MaybeRef<boolean>
  createSuccessMessage: string
  deleteConfirmMessage: string | ((record: TRecord) => string)
  deleteSuccessMessage: string
  editTitle: string
  fields: FlatCrudFieldDefinition<TRecord>[]
  formGridClass?: string
  indexColumn?: CrudIndexColumnConfig | boolean
  modalWidth?: string
  searchGridClass?: string
  updateSuccessMessage: string
}

interface FlatCrudPageOptions<TRecord extends object, TQuery extends object> {
  fields: FlatCrudFieldDefinition<TRecord>[]
  idKey?: CrudRecordKey<TRecord>
  loadPage: (pageRequest: PageRequest<TQuery>) => Promise<ApiResult<Page<TRecord>>>
  createRecord: (payload: TRecord) => Promise<ApiResult<unknown>>
  deleteRecord: (id: Id) => Promise<ApiResult<unknown>>
  updateRecord: (payload: TRecord) => Promise<ApiResult<unknown>>
}

function hasFormField<TRecord extends object>(
  field: FlatCrudFieldDefinition<TRecord>,
): field is FlatCrudFieldDefinition<TRecord> & { form: FlatCrudFormFieldConfig } {
  return Boolean(field.form)
}

function hasSearchField<TRecord extends object>(
  field: FlatCrudFieldDefinition<TRecord>,
): field is FlatCrudFieldDefinition<TRecord> & { search: FlatCrudSearchFieldConfig } {
  return Boolean(field.search)
}

function hasTableField<TRecord extends object>(
  field: FlatCrudFieldDefinition<TRecord>,
): field is FlatCrudFieldDefinition<TRecord> & { table: FlatCrudTableFieldConfig<TRecord> } {
  return Boolean(field.table)
}

function getFieldType(type?: CrudFieldType) {
  return type ?? 'input'
}

function createDefaultValue(type: CrudFieldType) {
  if (type === 'input') {
    return ''
  }

  return null
}

function normalizeValue(value: unknown, trim?: boolean) {
  if (trim && typeof value === 'string') {
    return value.trim()
  }

  return value
}

function createFormField<TRecord extends object>(field: FlatCrudFieldDefinition<TRecord>): CrudFieldConfig | null {
  if (!hasFormField(field)) {
    return null
  }

  return {
    key: field.key,
    label: field.form.label,
    type: getFieldType(field.form.type),
    placeholder: field.form.placeholder,
    clearable: field.form.clearable,
    filterable: field.form.filterable,
    props: field.form.props,
    options: field.form.options,
    loading: field.form.loading,
    disabled: field.form.disabled,
  }
}

function createSearchField<TRecord extends object>(field: FlatCrudFieldDefinition<TRecord>): CrudFieldConfig | null {
  if (!hasSearchField(field)) {
    return null
  }

  const formLabel = hasFormField(field) ? field.form.label : undefined

  return {
    key: field.key,
    label: field.search.label ?? formLabel ?? String(field.key),
    type: getFieldType(field.search.type),
    placeholder: field.search.placeholder,
    clearable: field.search.clearable,
    filterable: field.search.filterable,
    props: field.search.props,
    options: field.search.options,
    loading: field.search.loading,
    disabled: field.search.disabled,
  }
}

function createTableColumn<TRecord extends object>(field: FlatCrudFieldDefinition<TRecord>): CrudColumnConfig<TRecord> | null {
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

export function createFlatCrudInterfaceSchema<TRecord extends object>(
  options: FlatCrudInterfaceOptions<TRecord>,
): CrudInterfaceSchema<TRecord> {
  const formRules = options.fields.reduce<FormRules>((rules, field) => {
    if (hasFormField(field) && field.form.rules?.length) {
      rules[field.key] = field.form.rules
    }

    return rules
  }, {})

  return {
    createLabel: options.createLabel,
    createDisabled: options.createDisabled,
    createTitle: options.createLabel,
    createSuccessMessage: options.createSuccessMessage,
    deleteConfirmMessage: options.deleteConfirmMessage,
    deleteSuccessMessage: options.deleteSuccessMessage,
    editTitle: options.editTitle,
    formFields: options.fields.map(createFormField).filter((field): field is CrudFieldConfig => Boolean(field)),
    formGridClass: options.formGridClass,
    formRules: Object.keys(formRules).length > 0 ? formRules : undefined,
    indexColumn: options.indexColumn,
    modalWidth: options.modalWidth,
    searchFields: options.fields.map(createSearchField).filter((field): field is CrudFieldConfig => Boolean(field)),
    searchGridClass: options.searchGridClass,
    tableColumns: options.fields
      .map(createTableColumn)
      .filter((column): column is CrudColumnConfig<TRecord> => Boolean(column)),
    updateSuccessMessage: options.updateSuccessMessage,
  }
}

export function createFlatCrudPageSchema<
  TRecord extends object,
  TQuery extends object = Record<string, unknown>,
>(options: FlatCrudPageOptions<TRecord, TQuery>): CrudPageSchema<TRecord, TQuery, TRecord, TRecord> {
  return {
    loadPage: options.loadPage,
    mapRecordToFormModel: (record) =>
      Object.fromEntries(
        options.fields
          .filter(hasFormField)
          .map((field) => {
            const value = (record as Record<string, unknown>)[field.key]
            const type = getFieldType(field.form.type)
            const fallback = field.form.defaultValue ?? createDefaultValue(type)
            return [field.key, value ?? fallback]
          }),
      ) as TRecord,
    createRecord: options.createRecord,
    createFormModel: () =>
      Object.fromEntries(
        options.fields
          .filter(hasFormField)
          .map((field) => {
            const type = getFieldType(field.form.type)
            return [field.key, field.form.defaultValue ?? createDefaultValue(type)]
          }),
      ) as TRecord,
    createPayload: (form) =>
      Object.fromEntries(
        options.fields
          .filter(hasFormField)
          .map((field) => [field.key, normalizeValue((form as Record<string, unknown>)[field.key], field.trim)]),
      ) as TRecord,
    createSearchModel: () =>
      Object.fromEntries(
        options.fields
          .filter(hasSearchField)
          .map((field) => {
            const type = getFieldType(field.search.type)
            return [field.key, field.search.defaultValue ?? createDefaultValue(type)]
          }),
      ) as TQuery,
    deleteRecord: (record) => {
      const idKey = options.idKey ?? ('id' as CrudRecordKey<TRecord>)
      const id = (record as Record<string, unknown>)[idKey]

      if (!hasId(id)) {
        return Promise.reject(new Error(`Missing record id: ${idKey}`))
      }

      return options.deleteRecord(id)
    },
    updateRecord: options.updateRecord,
  }
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
        item.name && item.internalName ? `${item.name} (${item.internalName})` : item.name || item.internalName || `#${item.id}`,
    }))
}
