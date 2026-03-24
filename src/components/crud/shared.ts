import { NButton, NPopconfirm, NSpace } from 'naive-ui'
import { h, unref } from 'vue'

import type {
  CrudColumnConfig,
  CrudFieldConfig,
  CrudIndexColumnConfig,
  CrudRecord,
} from './interface'
import type { DataTableColumns, SelectOption } from 'naive-ui'

export interface CrudActionColumnOptions<TRecord extends CrudRecord = CrudRecord> {
  getDeleteConfirmMessage: (record: TRecord) => string
  onDelete: (record: TRecord) => void | Promise<void>
  onEdit: (record: TRecord) => void
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

export function replaceModel(model: CrudRecord, nextValue: CrudRecord) {
  const target = model as Record<string, unknown>

  for (const key of Object.keys(target)) {
    delete target[key]
  }

  Object.assign(target, nextValue)
}

export function getValueByPath(record: CrudRecord, path: string) {
  return path.split('.').reduce<unknown>((value, key) => {
    if (!value || typeof value !== 'object') {
      return undefined
    }

    return (value as Record<string, unknown>)[key]
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
                },
                () => '删除',
              ),
            default: () => options.getDeleteConfirmMessage(record),
          },
        ),
      ]),
  }
}

export function getFieldOptions(field: CrudFieldConfig) {
  return (unref(field.options) ?? []).map((option) => ({ ...option })) as SelectOption[]
}

export function getFieldLoading(field: CrudFieldConfig) {
  return Boolean(unref(field.loading))
}

export function getFieldDisabled(
  field: CrudFieldConfig,
  model: CrudRecord,
  mode: 'create' | 'edit',
) {
  if (typeof field.disabled === 'function') {
    return field.disabled({
      mode,
      model,
    })
  }

  return Boolean(unref(field.disabled))
}

export function setModelValue(model: CrudRecord, key: string, value: unknown) {
  ;(model as Record<string, unknown>)[key] = value
}

export function getInputValue(model: CrudRecord, key: string) {
  const value = (model as Record<string, unknown>)[key]
  return typeof value === 'string' || value === null || value === undefined ? value : String(value)
}

export function getNumberValue(model: CrudRecord, key: string) {
  const value = (model as Record<string, unknown>)[key]
  return typeof value === 'number' || value === null || value === undefined ? value : null
}

export function getSelectValue(model: CrudRecord, key: string) {
  return (model as Record<string, unknown>)[key] as string | number | null | undefined
}
