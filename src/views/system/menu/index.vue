<script setup lang="ts">
import { tryOnMounted } from '@vueuse/core'
import { isAxiosError } from 'axios'
import {
  NButton,
  NCard,
  NDataTable,
  NDropdown,
  NEmpty,
  NForm,
  NFormItem,
  NInput,
  NPopconfirm,
  NSelect,
  NScrollbar,
  NSpace,
  NTag,
  NTree,
  useDialog,
  useMessage,
} from 'naive-ui'
import { computed, h, nextTick, reactive, ref } from 'vue'

import { createMenu, deleteMenu, listMenus, updateMenu } from '@/api'
import { CrudFieldControl, CrudSearchPanel, hasId } from '@/components'
import { useMutation, useQuery } from '@/composables'
import { useMenuStore } from '@/stores'
import { isDynamicIconName } from '@/utils/icon'

import type { CrudFieldConfig } from '@/components'
import type {
  DataTableColumns,
  DropdownOption,
  FormInst,
  FormRules,
  SelectOption,
  TreeOption,
} from 'naive-ui'

defineOptions({
  name: 'SystemMenuPage',
})

type MenuTreeOption = TreeOption & {
  key: Id
  label: string
  children?: MenuTreeOption[]
  menuKey?: string
  routeName?: string
  routePath?: string
}

type EditorMode = 'idle' | 'create-root' | 'create-child' | 'edit'

type SubmitResult = {
  mode: Exclude<EditorMode, 'idle'>
  menu: Menu
}

const message = useMessage()
const dialog = useDialog()
const menuStore = useMenuStore()

const searchExpanded = ref(false)
const treePattern = ref('')
const selectedMenuId = ref<NullableId>(null)
const editorMode = ref<EditorMode>('idle')
const showTreeDropdown = ref(false)
const treeContextMenu = ref<Menu | null>(null)

const formRef = ref<FormInst | null>(null)

const treeDropdownPosition = reactive({
  x: 0,
  y: 0,
})

const searchModel = reactive<MenuQuery>(createSearchModel())
const appliedSearchModel = reactive<MenuQuery>(createSearchModel())
const formModel = reactive<MenuFormModel>(createFormModel())

const DEFAULT_BOOLEAN_FLAG = -1
const ROOT_PARENT_OPTION_VALUE = '__root__'

const ternaryBooleanOptions: SelectOption[] = [
  {
    label: '默认',
    value: DEFAULT_BOOLEAN_FLAG,
  },
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 0,
  },
]

const ROOT_MENU_FLAG_DEFAULTS = {
  disabled: 0,
  show: 1,
  pinned: 0,
  showTab: 1,
  enableMultiTab: 0,
} as const satisfies Pick<
  MenuFormModel,
  'disabled' | 'show' | 'pinned' | 'showTab' | 'enableMultiTab'
>

const formRules: FormRules = {
  key: [{ required: true, message: '请输入菜单标识', trigger: ['input', 'blur'] }],
  label: [{ required: true, message: '请输入菜单标题', trigger: ['input', 'blur'] }],
  icon: [
    {
      validator: (_rule, value: string) => {
        const iconName = value?.trim() ?? ''

        if (!iconName || isDynamicIconName(iconName)) {
          return true
        }

        return new Error('请输入 Iconify 图标名，例如 ph:users')
      },
      trigger: ['input', 'blur'],
    },
  ],
  name: [{ required: true, message: '请输入路由名称', trigger: ['input', 'blur'] }],
  path: [{ required: true, message: '请输入路由路径', trigger: ['input', 'blur'] }],
}

const menusQuery = useQuery<Menu[]>({
  immediate: false,
  initialData: [],
  query: async () => {
    const res = await listMenus()
    return [...res.data].sort(compareMenus)
  },
})

const allMenus = computed(() => menusQuery.data.value ?? [])
const optionLoading = computed(() => menusQuery.loading.value)
const selectedTreeKeys = computed(() => (hasId(selectedMenuId.value) ? [selectedMenuId.value] : []))
const selectedMenu = computed(() =>
  hasId(selectedMenuId.value)
    ? (allMenus.value.find((item: Menu) => isSameId(item.id, selectedMenuId.value)) ?? null)
    : null,
)
const treeOptions = computed(() => buildMenuTreeOptions(allMenus.value))
const menuLabelMap = computed(
  () =>
    new Map(
      allMenus.value
        .filter((item: Menu) => hasId(item.id))
        .map((item: Menu) => [String(item.id), getMenuDisplayName(item)]),
    ),
)
const blockedParentKeys = computed(() =>
  collectBlockedParentKeys(allMenus.value, formModel.id ?? null),
)
const parentMenuOptions = computed(() =>
  allMenus.value
    .filter((item: Menu) => hasId(item.id) && !blockedParentKeys.value.has(String(item.id)))
    .map(toParentMenuOption)
    .filter((item: SelectOption | null): item is SelectOption => Boolean(item)),
)
const editableParentMenuOptions = computed<SelectOption[]>(() => [
  {
    label: '顶级菜单',
    value: ROOT_PARENT_OPTION_VALUE,
  },
  ...parentMenuOptions.value,
])
const currentParentMenuLabel = computed(() => getParentMenuDisplayName(formModel.parentId))
const formFields = computed<CrudFieldConfig[]>(() => [
  {
    key: 'parentId',
    label: '父菜单',
    render: () => {
      if (editorMode.value === 'edit') {
        return h(NSelect, {
          value: toParentSelectValue(formModel.parentId),
          clearable: false,
          filterable: true,
          loading: optionLoading.value,
          options: editableParentMenuOptions.value,
          placeholder: '请选择父菜单',
          'onUpdate:value': (value: string | number | null) => {
            formModel.parentId = fromParentSelectValue(value)
          },
        })
      }

      return h(NInput, {
        value: currentParentMenuLabel.value,
        readonly: true,
      })
    },
  },
  {
    key: 'key',
    label: '菜单标识',
    component: 'input',
    placeholder: '例如：system-user',
  },
  {
    key: 'label',
    label: '菜单标题',
    component: 'input',
    placeholder: '例如：用户管理',
  },
  {
    key: 'name',
    label: '路由名称',
    component: 'input',
    placeholder: '例如：systemUser',
  },
  {
    key: 'path',
    label: '路由路径',
    component: 'input',
    placeholder: '例如：/system/user',
  },
  {
    key: 'component',
    label: '组件路径',
    component: 'input',
    placeholder: '例如：system/user/index.vue',
  },
  {
    key: 'icon',
    label: 'Iconify 图标',
    component: 'input',
    placeholder: '例如：ph:users',
  },
  {
    key: 'redirect',
    label: '重定向路径',
    component: 'input',
    placeholder: '例如：/system/user',
  },
  {
    key: 'sortingOrder',
    label: '排序',
    component: 'number',
    props: {
      style: 'width: 100%',
    },
  },
  {
    key: 'show',
    label: '是否显示',
    component: 'radio',
    options: ternaryBooleanOptions,
  },
  {
    key: 'disabled',
    label: '是否禁用',
    component: 'radio',
    options: ternaryBooleanOptions,
  },
  {
    key: 'pinned',
    label: '固定标签页',
    component: 'radio',
    options: ternaryBooleanOptions,
  },
  {
    key: 'showTab',
    label: '显示标签页',
    component: 'radio',
    options: ternaryBooleanOptions,
  },
  {
    key: 'enableMultiTab',
    label: '启用多标签',
    component: 'radio',
    options: ternaryBooleanOptions,
  },
])
const createActionLabel = computed(() => (selectedMenu.value ? '新增子菜单' : '新增顶级菜单'))
const sourceTableRows = computed(() =>
  allMenus.value
    .filter((item: Menu) => matchesParentId(item.parentId, selectedMenuId.value ?? null))
    .sort(compareMenus),
)
const filteredTableRows = computed(() =>
  sourceTableRows.value.filter((item: Menu) => matchesSystemMenuQuery(item, appliedSearchModel)),
)
const editorTitle = computed(() => {
  switch (editorMode.value) {
    case 'create-root':
      return '新增顶级菜单'
    case 'create-child':
      return selectedMenu.value
        ? `新增 ${getMenuDisplayName(selectedMenu.value)} 的子菜单`
        : '新增子菜单'
    case 'edit':
      return selectedMenu.value ? `编辑 ${getMenuDisplayName(selectedMenu.value)}` : '编辑菜单'
    default:
      return '菜单编辑'
  }
})
const editorDescription = computed(() => {
  switch (editorMode.value) {
    case 'create-root':
      return '正在创建顶级菜单，保存后会自动刷新左侧树。'
    case 'create-child':
      return selectedMenu.value
        ? `当前父菜单：${getMenuDisplayName(selectedMenu.value)}。`
        : '请先在左侧选择父菜单。'
    case 'edit':
      return selectedMenu.value
        ? `当前正在编辑：${getMenuDisplayName(selectedMenu.value)}。`
        : '请先在左侧选择菜单节点。'
    default:
      return '选择左侧菜单节点后可直接在右侧编辑，或直接新增顶级菜单。'
  }
})
const tableTitle = computed(() => (selectedMenu.value ? '直属子菜单' : '顶级菜单'))
const tableDescription = computed(() => {
  const sourceCount = sourceTableRows.value.length
  const filteredCount = filteredTableRows.value.length

  if (!selectedMenu.value) {
    return filteredCount === sourceCount
      ? `当前展示顶级菜单，共 ${sourceCount} 项。`
      : `当前展示顶级菜单，已筛选出 ${filteredCount}/${sourceCount} 项。`
  }

  const menuName = getMenuDisplayName(selectedMenu.value)
  return filteredCount === sourceCount
    ? `当前节点：${menuName}，展示其直属子菜单，共 ${sourceCount} 项。`
    : `当前节点：${menuName}，已筛选出 ${filteredCount}/${sourceCount} 个直属子菜单。`
})
const submitButtonLabel = computed(() => (editorMode.value === 'edit' ? '保存修改' : '创建菜单'))
const showForm = computed(() => editorMode.value !== 'idle')
const treeDropdownOptions = computed<DropdownOption[]>(() => [
  {
    key: 'edit',
    label: '编辑菜单',
    disabled: !treeContextMenu.value,
  },
  {
    key: 'create-child',
    label: '新增下级',
    disabled: !treeContextMenu.value || !hasId(treeContextMenu.value.id),
  },
  {
    key: 'delete',
    label: '删除菜单',
    disabled: !treeContextMenu.value || !hasId(treeContextMenu.value.id),
  },
])

const columns = computed(
  (): DataTableColumns<Menu> => [
    {
      key: '__index',
      title: '序号',
      width: 72,
      fixed: 'left',
      align: 'center',
      render: (_record: Menu, rowIndex: number) => rowIndex + 1,
    },
    {
      title: '菜单标题',
      key: 'label',
      width: 180,
      fixed: 'left',
    },
    {
      title: '菜单标识',
      key: 'key',
      width: 180,
    },
    {
      title: '路由名称',
      key: 'name',
      width: 180,
    },
    {
      title: '路由路径',
      key: 'path',
      width: 220,
    },
    {
      title: '父菜单',
      key: 'parentId',
      width: 180,
      render: (record: Menu) => {
        if (!hasId(record.parentId)) {
          return '顶级菜单'
        }

        return String(menuLabelMap.value.get(String(record.parentId)) ?? `#${record.parentId}`)
      },
    },
    {
      title: '显示',
      key: 'show',
      width: 90,
      render: (record: Menu) => renderBooleanTag(record.show),
    },
    {
      title: '禁用',
      key: 'disabled',
      width: 90,
      render: (record: Menu) => renderBooleanTag(record.disabled),
    },
    {
      title: '固定标签',
      key: 'pinned',
      width: 100,
      render: (record: Menu) => renderBooleanTag(record.pinned),
    },
    {
      title: '操作',
      key: 'actions',
      width: 260,
      align: 'right',
      fixed: 'right',
      render: (record: Menu) => {
        const actionNodes = [
          h(
            NButton,
            {
              size: 'small',
              quaternary: true,
              type: 'primary',
              onClick: () => handleEditRow(record),
            },
            () => '编辑',
          ),
        ]

        if (hasId(record.id)) {
          actionNodes.push(
            h(
              NButton,
              {
                size: 'small',
                quaternary: true,
                onClick: () => startCreateChildFromRecord(record),
              },
              () => '新增下级',
            ),
          )
        }

        actionNodes.push(
          h(
            NPopconfirm,
            {
              onPositiveClick: () => handleDelete(record),
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
              default: () => '确认删除该菜单吗？',
            },
          ),
        )

        return h(NSpace, { justify: 'end', size: 8 }, () => actionNodes)
      },
    },
  ],
)

const submitMutation = useMutation<SubmitResult, []>({
  mutation: async () => {
    if (editorMode.value === 'idle') {
      throw new Error('请先选择菜单节点或新增菜单')
    }

    await formRef.value?.validate()

    const payload = createPayload(formModel)

    if (editorMode.value === 'edit') {
      const res = await updateMenu(payload)
      return {
        mode: 'edit',
        menu: res.data,
      }
    }

    const res = await createMenu(payload)
    return {
      mode: editorMode.value,
      menu: res.data,
    }
  },
  onError: (error) => {
    message.error(extractErrorMessage(error, '菜单保存失败'))
  },
  onSuccess: async ({ mode, menu }) => {
    message.success(mode === 'edit' ? '菜单更新成功' : '菜单新增成功')

    const menus = await refreshMenus()
    await menuStore.loadMenus(true)

    if (hasId(menu.id)) {
      selectMenuById(menu.id, menus)
      return
    }

    if (mode === 'create-root') {
      startCreateRoot(menus)
      return
    }

    if (mode === 'create-child') {
      startCreateChild(menus)
    }
  },
})

const deleteMutation = useMutation<void, [Menu]>({
  mutation: async (record) => {
    if (!hasId(record.id)) {
      throw new Error('缺少菜单 ID，无法删除')
    }

    await deleteMenu(record.id)
  },
  onError: (error) => {
    message.error(extractErrorMessage(error, '菜单删除失败'))
  },
  onSuccess: async (_result, record) => {
    message.success('菜单删除成功')

    const deletedId = record.id
    const currentSelectedId = selectedMenuId.value
    const nextSelectedId =
      hasId(deletedId) && isSameId(deletedId, currentSelectedId)
        ? (record.parentId ?? null)
        : currentSelectedId

    const menus = await refreshMenus()
    await menuStore.loadMenus(true)

    if (hasId(nextSelectedId) && menus.some((item) => isSameId(item.id, nextSelectedId))) {
      selectMenuById(nextSelectedId, menus)
      return
    }

    startCreateRoot(menus)
  },
})

function createSearchModel(): MenuQuery {
  return {
    key: '',
    label: '',
    name: '',
    path: '',
  }
}

function createFormModel(): MenuFormModel {
  return {
    id: null,
    parentId: null,
    key: '',
    label: '',
    icon: '',
    path: '',
    name: '',
    component: '',
    redirect: '',
    sortingOrder: null,
    disabled: DEFAULT_BOOLEAN_FLAG,
    show: DEFAULT_BOOLEAN_FLAG,
    pinned: DEFAULT_BOOLEAN_FLAG,
    showTab: DEFAULT_BOOLEAN_FLAG,
    enableMultiTab: DEFAULT_BOOLEAN_FLAG,
  }
}

function replaceModel(model: object, nextValue: object) {
  const target = model as Record<string, unknown>

  for (const key of Object.keys(target)) {
    delete target[key]
  }

  Object.assign(target, nextValue)
}

function toParentMenuOption(item: Menu): SelectOption | null {
  if (!hasId(item.id)) {
    return null
  }

  return {
    value: item.id,
    label: getMenuDisplayName(item),
  }
}

function getMenuDisplayName(item: Menu) {
  return item.label || item.name || item.key || (hasId(item.id) ? `#${item.id}` : '未命名菜单')
}

function getParentMenuDisplayName(parentId: NullableId | undefined) {
  if (!hasId(parentId)) {
    return '顶级菜单'
  }

  return String(menuLabelMap.value.get(String(parentId)) ?? `#${parentId}`)
}

function compareMenus(a: Menu, b: Menu) {
  const orderA = a.sortingOrder ?? Number.MAX_SAFE_INTEGER
  const orderB = b.sortingOrder ?? Number.MAX_SAFE_INTEGER

  if (orderA !== orderB) {
    return orderA - orderB
  }

  const labelA = getMenuDisplayName(a)
  const labelB = getMenuDisplayName(b)
  const labelResult = labelA.localeCompare(labelB, 'zh-Hans-CN')

  if (labelResult !== 0) {
    return labelResult
  }

  if (hasId(a.id) && hasId(b.id)) {
    return String(a.id).localeCompare(String(b.id), 'en')
  }

  return 0
}

function buildMenuTreeOptions(items: Menu[]): MenuTreeOption[] {
  const nodeMap = new Map<string, MenuTreeOption>()
  const roots: MenuTreeOption[] = []

  items.forEach((item) => {
    if (!hasId(item.id)) {
      return
    }

    nodeMap.set(String(item.id), {
      key: item.id,
      label: getMenuDisplayName(item),
      menuKey: item.key ?? '',
      routeName: item.name ?? '',
      routePath: item.path ?? '',
      children: [],
    })
  })
  ;[...items].sort(compareMenus).forEach((item) => {
    if (!hasId(item.id)) {
      return
    }

    const currentNode = nodeMap.get(String(item.id))

    if (!currentNode) {
      return
    }

    if (hasId(item.parentId)) {
      const parentNode = nodeMap.get(String(item.parentId))

      if (parentNode) {
        parentNode.children?.push(currentNode)
        return
      }
    }

    roots.push(currentNode)
  })

  return normalizeTreeChildren(roots)
}

function normalizeTreeChildren(nodes: MenuTreeOption[]): MenuTreeOption[] {
  return nodes.map((node) => ({
    ...node,
    children: node.children?.length ? normalizeTreeChildren(node.children) : undefined,
  }))
}

function collectBlockedParentKeys(items: Menu[], currentId: NullableId) {
  if (!hasId(currentId)) {
    return new Set<string>()
  }

  const blocked = new Set<string>([String(currentId)])
  const queue = [String(currentId)]

  while (queue.length > 0) {
    const parentKey = queue.shift()

    if (!parentKey) {
      continue
    }

    items.forEach((item) => {
      if (!hasId(item.id) || !hasId(item.parentId)) {
        return
      }

      if (String(item.parentId) !== parentKey) {
        return
      }

      const childKey = String(item.id)

      if (blocked.has(childKey)) {
        return
      }

      blocked.add(childKey)
      queue.push(childKey)
    })
  }

  return blocked
}

function matchesText(actual: string | null | undefined, expected: string | undefined) {
  const keyword = expected?.trim()

  if (!keyword) {
    return true
  }

  return actual?.toLowerCase().includes(keyword.toLowerCase()) ?? false
}

function matchesParentId(actual: Id | null | undefined, expected: NullableId) {
  if (hasId(expected)) {
    return hasId(actual) && String(actual) === String(expected)
  }

  return !hasId(actual)
}

function matchesSystemMenuQuery(item: Menu, query: MenuQuery) {
  return (
    matchesText(item.key, query.key) &&
    matchesText(item.label, query.label) &&
    matchesText(item.path, query.path) &&
    matchesText(item.name, query.name)
  )
}

function isSameId(left: NullableId | undefined, right: NullableId | undefined) {
  return hasId(left) && hasId(right) && String(left) === String(right)
}

function toFlag(value: boolean | null | undefined) {
  if (value === true) {
    return 1
  }

  if (value === false) {
    return 0
  }

  return DEFAULT_BOOLEAN_FLAG
}

function toBoolean(value: number | null) {
  if (value === null || value === DEFAULT_BOOLEAN_FLAG) {
    return undefined
  }

  return value === 1
}

function renderBooleanTag(value: boolean | null | undefined) {
  if (typeof value !== 'boolean') {
    return '-'
  }

  return h(
    NTag,
    {
      bordered: false,
      size: 'small',
      type: value ? 'success' : 'default',
    },
    () => (value ? '是' : '否'),
  )
}

function renderTreeLabel({ option }: { option: TreeOption }) {
  const node = option as MenuTreeOption

  return h(
    'div',
    {
      class:
        'flex min-w-0 items-center rounded px-1 py-0.5 transition-colors select-none hover:bg-[var(--color-naive-hover)]',
      onContextmenu: (event: MouseEvent) => handleTreeNodeContextMenu(event, node),
    },
    [
      h(
        'span',
        {
          class: 'truncate',
          title: node.label,
        },
        node.label,
      ),
    ],
  )
}

function filterTreeNode(pattern: string, node: TreeOption) {
  const keyword = pattern.trim().toLowerCase()

  if (!keyword) {
    return true
  }

  const fields = [node.label, node.menuKey, node.routeName, node.routePath]
    .filter((item): item is string => typeof item === 'string' && item.length > 0)
    .join(' ')
    .toLowerCase()

  return fields.includes(keyword)
}

function getTableRowKey(record: Menu) {
  if (hasId(record.id)) {
    return record.id
  }

  return `${record.key ?? 'menu'}-${record.path ?? 'path'}`
}

function toParentSelectValue(parentId: NullableId | undefined) {
  return hasId(parentId) ? parentId : ROOT_PARENT_OPTION_VALUE
}

function fromParentSelectValue(value: string | number | null) {
  if (value === null || value === ROOT_PARENT_OPTION_VALUE) {
    return null
  }

  return value
}

function getNextSortingOrder(parentId: NullableId, menus: Menu[] = allMenus.value) {
  const siblingOrders = menus
    .filter((item) => matchesParentId(item.parentId, parentId))
    .map((item) => item.sortingOrder)
    .filter((item): item is number => typeof item === 'number')

  if (siblingOrders.length === 0) {
    return 0
  }

  return Math.max(...siblingOrders) + 1
}

function applyFormFromMenu(record: Menu) {
  replaceModel(formModel, {
    id: record.id ?? null,
    parentId: record.parentId ?? null,
    key: record.key ?? '',
    label: record.label ?? '',
    icon: record.icon ?? '',
    path: record.path ?? '',
    name: record.name ?? '',
    component: record.component ?? '',
    redirect: record.redirect ?? '',
    sortingOrder: record.sortingOrder ?? null,
    disabled: toFlag(record.disabled),
    show: toFlag(record.show),
    pinned: toFlag(record.pinned),
    showTab: toFlag(record.showTab),
    enableMultiTab: toFlag(record.enableMultiTab),
  })
}

function createPayload(form: MenuFormModel): Menu {
  return {
    ...(hasId(form.id) ? { id: form.id } : {}),
    parentId: hasId(form.parentId) ? form.parentId : null,
    key: form.key.trim(),
    label: form.label.trim(),
    icon: form.icon.trim(),
    path: form.path.trim(),
    name: form.name.trim(),
    component: form.component.trim(),
    redirect: form.redirect.trim(),
    sortingOrder: form.sortingOrder,
    ...(toBoolean(form.disabled) !== undefined ? { disabled: toBoolean(form.disabled) } : {}),
    ...(toBoolean(form.show) !== undefined ? { show: toBoolean(form.show) } : {}),
    ...(toBoolean(form.pinned) !== undefined ? { pinned: toBoolean(form.pinned) } : {}),
    ...(toBoolean(form.showTab) !== undefined ? { showTab: toBoolean(form.showTab) } : {}),
    ...(toBoolean(form.enableMultiTab) !== undefined
      ? { enableMultiTab: toBoolean(form.enableMultiTab) }
      : {}),
  }
}

function extractErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const errorMessage = error.response?.data?.errorMessage

    if (typeof errorMessage === 'string' && errorMessage.trim()) {
      return errorMessage
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return fallback
}

function restoreValidation() {
  void nextTick(() => formRef.value?.restoreValidation())
}

function closeTreeDropdown() {
  showTreeDropdown.value = false
  treeContextMenu.value = null
}

function clearEditor() {
  closeTreeDropdown()
  selectedMenuId.value = null
  editorMode.value = 'idle'
  replaceModel(formModel, createFormModel())
  restoreValidation()
}

function loadEditFromRecord(record: Menu) {
  if (!hasId(record.id)) {
    return
  }

  selectedMenuId.value = record.id
  editorMode.value = 'edit'
  applyFormFromMenu(record)
  restoreValidation()
}

function selectMenuById(id: Id, menus: Menu[] = allMenus.value) {
  const targetMenu = menus.find((item) => isSameId(item.id, id))

  if (!targetMenu) {
    return
  }

  loadEditFromRecord(targetMenu)
}

function startCreateRoot(menus: Menu[] = allMenus.value) {
  selectedMenuId.value = null
  editorMode.value = 'create-root'
  replaceModel(formModel, {
    ...createFormModel(),
    ...ROOT_MENU_FLAG_DEFAULTS,
    sortingOrder: getNextSortingOrder(null, menus),
  })
  restoreValidation()
}

function startCreateChild(menus: Menu[] = allMenus.value) {
  if (!selectedMenu.value || !hasId(selectedMenu.value.id)) {
    return
  }

  editorMode.value = 'create-child'
  replaceModel(formModel, {
    ...createFormModel(),
    parentId: selectedMenu.value.id,
    sortingOrder: getNextSortingOrder(selectedMenu.value.id, menus),
  })
  restoreValidation()
}

function startCreateChildFromRecord(record: Menu) {
  if (!hasId(record.id)) {
    return
  }

  selectedMenuId.value = record.id
  editorMode.value = 'create-child'
  replaceModel(formModel, {
    ...createFormModel(),
    parentId: record.id,
    sortingOrder: getNextSortingOrder(record.id),
  })
  restoreValidation()
}

function restoreEditorAfterRefresh(menus: Menu[]) {
  if (editorMode.value === 'edit') {
    if (hasId(selectedMenuId.value)) {
      const nextSelected = menus.find((item) => isSameId(item.id, selectedMenuId.value))

      if (nextSelected) {
        applyFormFromMenu(nextSelected)
        restoreValidation()
        return
      }
    }

    clearEditor()
    return
  }

  if (editorMode.value === 'create-child') {
    if (
      hasId(selectedMenuId.value) &&
      menus.some((item) => isSameId(item.id, selectedMenuId.value))
    ) {
      startCreateChild(menus)
      return
    }

    clearEditor()
    return
  }

  if (editorMode.value === 'create-root') {
    startCreateRoot(menus)
    return
  }

  if (
    hasId(selectedMenuId.value) &&
    !menus.some((item) => isSameId(item.id, selectedMenuId.value))
  ) {
    selectedMenuId.value = null
  }
}

async function refreshMenus() {
  const menus = await menusQuery.refresh()
  restoreEditorAfterRefresh(menus)
  return menus
}

function handleSearch() {
  replaceModel(appliedSearchModel, searchModel)
}

function handleReset() {
  replaceModel(searchModel, createSearchModel())
  replaceModel(appliedSearchModel, createSearchModel())
}

function handleCreateAction() {
  if (selectedMenu.value) {
    startCreateChild()
    return
  }

  startCreateRoot()
}

function handleStartCreateRoot() {
  startCreateRoot()
}

function handleStartCreateChild() {
  startCreateChild()
}

function handleTreeSelect(keys: Array<string | number>) {
  closeTreeDropdown()

  const [firstKey] = keys

  if (!hasId(firstKey)) {
    startCreateRoot()
    return
  }

  selectMenuById(firstKey)
}

function handleSelectAllMenus() {
  startCreateRoot()
}

function handleEditSelectedMenu() {
  if (!selectedMenu.value) {
    return
  }

  loadEditFromRecord(selectedMenu.value)
}

function handleEditRow(record: Menu) {
  if (!hasId(record.id)) {
    return
  }

  selectMenuById(record.id)
}

function resetEditor() {
  switch (editorMode.value) {
    case 'create-root':
      startCreateRoot()
      break
    case 'create-child':
      startCreateChild()
      break
    case 'edit':
      handleEditSelectedMenu()
      break
    default:
      clearEditor()
  }
}

async function handleSubmit() {
  try {
    await submitMutation.mutate()
  } catch {}
}

async function handleDelete(record: Menu) {
  try {
    await deleteMutation.mutate(record)
  } catch {}
}

function handleDeleteWithConfirm(record: Menu) {
  dialog.warning({
    title: '删除菜单',
    content: `确认删除「${getMenuDisplayName(record)}」吗？`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: () => handleDelete(record),
  })
}

function handleTreeNodeContextMenu(event: MouseEvent, node: MenuTreeOption) {
  event.preventDefault()

  const target = allMenus.value.find((item: Menu) => isSameId(item.id, node.key))

  if (!target || !hasId(target.id)) {
    return
  }

  selectMenuById(target.id)
  treeContextMenu.value = target
  showTreeDropdown.value = false

  nextTick(() => {
    treeDropdownPosition.x = event.clientX
    treeDropdownPosition.y = event.clientY
    showTreeDropdown.value = true
  })
}

function handleTreeDropdownClickOutside() {
  closeTreeDropdown()
}

function handleTreeDropdownSelect(key: string | number) {
  const action = String(key)
  const target = treeContextMenu.value

  closeTreeDropdown()

  if (!target || !hasId(target.id)) {
    return
  }

  switch (action) {
    case 'edit':
      selectMenuById(target.id)
      break
    case 'create-child':
      startCreateChildFromRecord(target)
      break
    case 'delete':
      handleDeleteWithConfirm(target)
      break
    default:
      break
  }
}

function handleDeleteSelectedMenu() {
  if (!selectedMenu.value) {
    return
  }

  handleDeleteWithConfirm(selectedMenu.value)
}

async function handleRefresh() {
  try {
    await refreshMenus()
    await menuStore.loadMenus(true)
    message.success('菜单数据已刷新')
  } catch (error) {
    message.error(extractErrorMessage(error, '菜单数据刷新失败'))
  }
}

tryOnMounted(() => {
  void refreshMenus().then((menus) => {
    if (editorMode.value === 'idle' && !hasId(selectedMenuId.value)) {
      startCreateRoot(menus)
    }
  })
})
</script>

<template>
  <div
    class="grid h-full min-h-0 grid-cols-[20rem_minmax(0,1fr)] gap-4 p-4 max-sm:grid-cols-1 max-sm:p-2"
  >
    <NCard
      :bordered="false"
      class="menu-tree-panel flex min-h-0 min-w-0 flex-col"
      content-class="flex min-h-0 flex-1 flex-col"
    >
      <div class="flex min-h-0 flex-1 flex-col gap-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <NSpace :size="8">
            <NButton
              size="small"
              quaternary
              :type="selectedMenu ? 'default' : 'primary'"
              @click="handleSelectAllMenus"
            >
              全部菜单
            </NButton>
            <NButton
              size="small"
              type="primary"
              secondary
              @click="handleStartCreateRoot"
            >
              新增顶级
            </NButton>
            <NButton
              size="small"
              quaternary
              @click="handleRefresh"
            >
              刷新
            </NButton>
          </NSpace>
        </div>

        <NInput
          v-model:value="treePattern"
          clearable
          placeholder="搜索菜单树"
        />

        <div class="flex items-center justify-between text-xs text-[var(--color-naive-text3)]">
          <span>{{
            selectedMenu ? `当前节点：${getMenuDisplayName(selectedMenu)}` : '当前未选择节点'
          }}</span>
          <span>共 {{ allMenus.length }} 项</span>
        </div>

        <NScrollbar class="min-h-0 flex-1 pr-2">
          <NTree
            v-if="treeOptions.length"
            :block-line="true"
            :data="treeOptions"
            :default-expand-all="true"
            :expand-on-click="true"
            :filter="filterTreeNode"
            :pattern="treePattern"
            :render-label="renderTreeLabel"
            :selected-keys="selectedTreeKeys"
            :show-irrelevant-nodes="false"
            class="pb-2"
            @update:selected-keys="handleTreeSelect"
          />

          <div
            v-else
            class="grid min-h-40 place-items-center text-sm text-[var(--color-naive-text3)]"
          >
            暂无菜单数据
          </div>
        </NScrollbar>
        <NDropdown
          placement="bottom-start"
          trigger="manual"
          :x="treeDropdownPosition.x"
          :y="treeDropdownPosition.y"
          :options="treeDropdownOptions"
          :show="showTreeDropdown"
          @clickoutside="handleTreeDropdownClickOutside"
          @select="handleTreeDropdownSelect"
        />
      </div>
    </NCard>

    <div class="flex min-h-0 min-w-0 flex-col gap-4">
      <CrudSearchPanel
        v-model:expanded="searchExpanded"
        :create-button-disabled="optionLoading"
        :create-button-label="createActionLabel"
        @create="handleCreateAction"
      >
        <NForm
          :model="searchModel"
          label-placement="top"
          class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <NFormItem
            label="菜单标题"
            path="label"
          >
            <CrudFieldControl
              :field="{
                key: 'label',
                label: '菜单标题',
                component: 'input',
                placeholder: '输入菜单标题',
              }"
              :model="searchModel"
              mode="create"
            />
          </NFormItem>

          <NFormItem
            label="菜单标识"
            path="key"
          >
            <CrudFieldControl
              :field="{
                key: 'key',
                label: '菜单标识',
                component: 'input',
                placeholder: '输入菜单标识',
              }"
              :model="searchModel"
              mode="create"
            />
          </NFormItem>

          <NFormItem
            label="路由名称"
            path="name"
          >
            <CrudFieldControl
              :field="{
                key: 'name',
                label: '路由名称',
                component: 'input',
                placeholder: '输入路由名称',
              }"
              :model="searchModel"
              mode="create"
            />
          </NFormItem>

          <NFormItem
            label="路由路径"
            path="path"
          >
            <CrudFieldControl
              :field="{
                key: 'path',
                label: '路由路径',
                component: 'input',
                placeholder: '输入路由路径',
              }"
              :model="searchModel"
              mode="create"
            />
          </NFormItem>

          <NFormItem
            label="操作"
            class="menu-search-actions"
          >
            <div class="flex w-full justify-end gap-2">
              <NButton @click="handleReset">重置</NButton>
              <NButton
                type="primary"
                ghost
                @click="handleSearch"
              >
                查询
              </NButton>
            </div>
          </NFormItem>
        </NForm>
      </CrudSearchPanel>

      <NCard
        :bordered="false"
        content-class="flex flex-col gap-4"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="text-base font-medium">{{ editorTitle }}</div>
            <div class="mt-1 text-sm text-[var(--color-naive-text3)]">
              {{ editorDescription }}
            </div>
          </div>

          <NSpace :size="8">
            <NButton
              v-if="selectedMenu"
              type="primary"
              secondary
              @click="handleStartCreateChild"
            >
              新增下级
            </NButton>
            <NButton
              quaternary
              @click="resetEditor"
            >
              重置
            </NButton>
            <NButton
              v-if="selectedMenu && editorMode === 'edit'"
              quaternary
              type="error"
              @click="handleDeleteSelectedMenu"
            >
              删除当前菜单
            </NButton>
          </NSpace>
        </div>

        <template v-if="showForm">
          <NForm
            ref="formRef"
            :model="formModel"
            :rules="formRules"
            label-placement="top"
            class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            <NFormItem
              v-for="field in formFields"
              :key="field.key"
              :label="field.label"
              :path="field.key"
            >
              <CrudFieldControl
                :field="field"
                :model="formModel"
                :mode="editorMode === 'edit' ? 'edit' : 'create'"
              />
            </NFormItem>
          </NForm>

          <div class="flex justify-end gap-2">
            <NButton @click="resetEditor">重置</NButton>
            <NButton
              type="primary"
              :loading="submitMutation.loading.value"
              @click="handleSubmit"
            >
              {{ submitButtonLabel }}
            </NButton>
          </div>
        </template>

        <NEmpty
          v-else
          description="请选择左侧菜单节点，或点击“新增顶级菜单”开始维护"
        />
      </NCard>

      <NCard
        :bordered="false"
        class="flex min-h-0 flex-1 flex-col"
        content-class="flex min-h-0 flex-1 flex-col gap-4"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="text-base font-medium">{{ tableTitle }}</div>
            <div class="mt-1 text-sm text-[var(--color-naive-text3)]">
              {{ tableDescription }}
            </div>
          </div>

          <NSpace :size="8">
            <NButton
              type="primary"
              secondary
              @click="handleCreateAction"
            >
              {{ createActionLabel }}
            </NButton>
            <NButton
              v-if="selectedMenu"
              quaternary
              type="primary"
              @click="handleEditSelectedMenu"
            >
              编辑当前菜单
            </NButton>
            <NButton
              quaternary
              @click="handleRefresh"
            >
              刷新数据
            </NButton>
          </NSpace>
        </div>

        <NDataTable
          :columns="columns"
          :data="filteredTableRows"
          :loading="optionLoading"
          :row-key="getTableRowKey"
          class="min-h-0 flex-1"
          flex-height
        />
      </NCard>
    </div>
  </div>
</template>

<style scoped>
.menu-search-actions :deep(.n-form-item-label__text) {
  visibility: hidden;
}
</style>
