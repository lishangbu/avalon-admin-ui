import { NButton, NPopconfirm, NSpace } from 'naive-ui'
import { h, unref } from 'vue'

import type {
  CrudColumnConfig,
  CrudFieldConfig,
  CrudFieldContext,
  CrudFieldOption,
  CrudIndexColumnConfig,
  CrudModel,
  CrudRecord,
} from './interface'
import type { DataTableColumns } from 'naive-ui'

export interface CrudActionColumnOptions<TRecord extends CrudRecord = CrudRecord> {
  getDeleteConfirmMessage: (record: TRecord) => string
  isDeleteDisabled?: (record: TRecord) => boolean
  onDelete: (record: TRecord) => void | Promise<void>
  onEdit: (record: TRecord) => void
}

function isCrudModel(value: unknown): value is CrudModel {
  return Boolean(value) && typeof value === 'object'
}

export function toCrudModel(value: object): CrudModel {
  return value as CrudModel
}

function resolveFieldMaybeValue<T>(value: unknown, context: CrudFieldContext) {
  if (typeof value === 'function') {
    return (value as (context: CrudFieldContext) => T)(context)
  }

  return unref(value as T | undefined) as T | undefined
}

export function resolveIndexColumnConfig(
  indexColumnConfig?: CrudIndexColumnConfig | boolean,
): CrudIndexColumnConfig | null {
  if (!indexColumnConfig) {
    return null
  }

  if (indexColumnConfig === true) {
    return {}
  }

  return indexColumnConfig
}

export function replaceModel(model: CrudModel, nextValue: object) {
  for (const key of Object.keys(model)) {
    delete model[key]
  }

  Object.assign(model, nextValue)
}

export function getValueByPath(record: CrudRecord, path: string) {
  return path.split('.').reduce<unknown>((value, key) => {
    if (!isCrudModel(value)) {
      return undefined
    }

    return value[key]
  }, record)
}

export function formatCellValue(value: unknown): string | number {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  return String(value)
}

export function toTableColumn<TRecord extends CrudRecord>(
  column: CrudColumnConfig<TRecord>,
): DataTableColumns<TRecord>[number] {
  const { render, valuePath, ...baseColumn } = column

  if (render) {
    return {
      ...baseColumn,
      render: (record: TRecord) => render(record),
    }
  }

  if (valuePath) {
    return {
      ...baseColumn,
      render: (record: TRecord) => formatCellValue(getValueByPath(record, valuePath)),
    }
  }

  return {
    ...baseColumn,
  }
}

export function createIndexColumn<TRecord extends CrudRecord>(
  indexColumnConfig: CrudIndexColumnConfig,
  renderIndex: (rowIndex: number) => number,
): DataTableColumns<TRecord>[number] {
  return {
    key: '__index',
    title: indexColumnConfig.title ?? '序号',
    width: indexColumnConfig.width ?? 72,
    fixed: indexColumnConfig.fixed ?? 'left',
    align: indexColumnConfig.align ?? 'center',
    render: (_record: TRecord, rowIndex: number) => renderIndex(rowIndex),
  }
}

export function createActionColumn<TRecord extends CrudRecord>(
  options: CrudActionColumnOptions<TRecord>,
): DataTableColumns<TRecord>[number] {
  return {
    title: '操作',
    key: 'actions',
    width: 180,
    align: 'right',
    fixed: 'right',
    render: (record: TRecord) =>
      h(NSpace, { justify: 'end', size: 8 }, () => [
        h(
          NButton,
          {
            size: 'small',
            quaternary: true,
            type: 'primary',
            onClick: () => options.onEdit(record),
          },
          () => '编辑',
        ),
        h(
          NPopconfirm,
          {
            disabled: options.isDeleteDisabled?.(record) ?? false,
            onPositiveClick: () => options.onDelete(record),
          },
          {
            trigger: () =>
              h(
                NButton,
                {
                  size: 'small',
                  quaternary: true,
                  type: 'error',
                  disabled: options.isDeleteDisabled?.(record) ?? false,
                },
                () => '删除',
              ),
            default: () => options.getDeleteConfirmMessage(record),
          },
        ),
      ]),
  }
}

export function getFieldOptions(field: CrudFieldConfig, context: CrudFieldContext) {
  return (resolveFieldMaybeValue<CrudFieldOption[]>(field.options, context)?.map(
    (option: CrudFieldOption) => ({
      ...option,
    }),
  ) ?? []) as CrudFieldOption[]
}

export function getFieldLoading(field: CrudFieldConfig, context: CrudFieldContext) {
  return Boolean(resolveFieldMaybeValue<boolean>(field.loading, context))
}

export function getFieldDisabled(
  field: CrudFieldConfig,
  model: CrudModel,
  mode: 'create' | 'edit',
) {
  return Boolean(
    resolveFieldMaybeValue<boolean>(field.disabled, {
      mode,
      model,
    }),
  )
}

export function getFieldProps(field: CrudFieldConfig, model: CrudModel, mode: 'create' | 'edit') {
  return (
    resolveFieldMaybeValue<Record<string, unknown>>(field.props, {
      mode,
      model,
    }) ?? {}
  )
}

export function setModelValue(model: CrudModel, key: string, value: unknown) {
  model[key] = value
}

export function getModelValue(model: CrudModel, key: string) {
  return model[key]
}
