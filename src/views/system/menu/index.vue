<script setup lang="ts">
import {
  NButton,
  NCard,
  NDataTable,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NModal,
  NPopconfirm,
  NScrollbar,
  NSelect,
  NSpace,
  NTag,
  NTree,
  useMessage,
} from 'naive-ui'
import { computed, h, nextTick, onMounted, reactive, ref, unref } from 'vue'

import {
  createSystemMenu,
  deleteSystemMenu,
  getSystemMenuPage,
  listSystemMenus,
  updateSystemMenu,
} from '@/api'
import { CrudSearchPanel, hasId } from '@/components'

import type { CrudFieldConfig, CrudFieldContext } from '@/components'
import type { DataTableColumns, FormInst, FormRules, SelectOption, TreeOption } from 'naive-ui'

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

const message = useMessage()

const optionLoading = ref(false)
const tableLoading = ref(false)
const submitting = ref(false)
const showModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const searchExpanded = ref(false)
const treePattern = ref('')
const selectedMenuId = ref<NullableId>(null)

const formRef = ref<FormInst | null>(null)

const allMenus = ref<SystemMenu[]>([])
const treeOptions = ref<MenuTreeOption[]>([])
const parentMenuOptions = ref<SelectOption[]>([])
const pageData = ref<Page<SystemMenu>>(createEmptyPage<SystemMenu>())

const searchModel = reactive<SystemMenuQuery>(createSearchModel())
const formModel = reactive<SystemMenuFormModel>(createFormModel())
const pagination = reactive({
  page: 1,
  size: 10,
})

const booleanOptions: SelectOption[] = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 0,
  },
]

const formRules: FormRules = {
  key: [{ required: true, message: '请输入菜单标识', trigger: ['input', 'blur'] }],
  label: [{ required: true, message: '请输入菜单标题', trigger: ['input', 'blur'] }],
  name: [{ required: true, message: '请输入路由名称', trigger: ['input', 'blur'] }],
  path: [{ required: true, message: '请输入路由路径', trigger: ['input', 'blur'] }],
}

const formFields: CrudFieldConfig[] = [
  {
    key: 'parentId',
    label: '父菜单',
    type: 'select',
    placeholder: '选择父菜单（可选）',
    clearable: true,
    filterable: true,
    options: parentMenuOptions,
    loading: optionLoading,
  },
  {
    key: 'key',
    label: '菜单标识',
    type: 'input',
    placeholder: '例如：system-user',
  },
  {
    key: 'label',
    label: '菜单标题',
    type: 'input',
    placeholder: '例如：用户管理',
  },
  {
    key: 'name',
    label: '路由名称',
    type: 'input',
    placeholder: '例如：systemUser',
  },
  {
    key: 'path',
    label: '路由路径',
    type: 'input',
    placeholder: '例如：/system/user',
  },
  {
    key: 'component',
    label: '组件路径',
    type: 'input',
    placeholder: '例如：system/user/index.vue',
  },
  {
    key: 'icon',
    label: '图标类名',
    type: 'input',
    placeholder: '例如：i-lucide-users',
  },
  {
    key: 'redirect',
    label: '重定向路径',
    type: 'input',
    placeholder: '例如：/system/user',
  },
  {
    key: 'sortingOrder',
    label: '排序',
    type: 'number',
    props: {
      style: 'width: 100%',
    },
  },
  {
    key: 'show',
    label: '是否显示',
    type: 'select',
    placeholder: '请选择',
    options: booleanOptions,
  },
  {
    key: 'disabled',
    label: '是否禁用',
    type: 'select',
    placeholder: '请选择',
    options: booleanOptions,
  },
  {
    key: 'pinned',
    label: '固定标签页',
    type: 'select',
    placeholder: '请选择',
    options: booleanOptions,
  },
  {
    key: 'showTab',
    label: '显示标签页',
    type: 'select',
    placeholder: '请选择',
    options: booleanOptions,
  },
  {
    key: 'enableMultiTab',
    label: '启用多标签',
    type: 'select',
    placeholder: '请选择',
    options: booleanOptions,
  },
]

const searchFields: CrudFieldConfig[] = [
  {
    key: 'label',
    label: '菜单标题',
    type: 'input',
    placeholder: '输入菜单标题',
  },
  {
    key: 'key',
    label: '菜单标识',
    type: 'input',
    placeholder: '输入菜单标识',
  },
  {
    key: 'name',
    label: '路由名称',
    type: 'input',
    placeholder: '输入路由名称',
  },
  {
    key: 'path',
    label: '路由路径',
    type: 'input',
    placeholder: '输入路由路径',
  },
]

const modalTitle = computed(() => (modalMode.value === 'create' ? '新增菜单' : '编辑菜单'))
const selectedTreeKeys = computed(() => (hasId(selectedMenuId.value) ? [selectedMenuId.value] : []))
const parentMenuLabelMap = computed(() =>
  new Map(parentMenuOptions.value.map((option) => [option.value, String(option.label)])),
)
const selectedMenu = computed(() =>
  hasId(selectedMenuId.value)
    ? allMenus.value.find((item) => item.id === selectedMenuId.value) ?? null
    : null,
)
const currentTableDescription = computed(() => {
  if (!selectedMenu.value) {
    return '当前显示全部菜单。点击左侧树节点后，右侧仅展示该节点的直属子菜单。'
  }

  return `当前节点：${getMenuDisplayName(selectedMenu.value)}，右侧展示直属子菜单。`
})
const tablePagination = computed(() => ({
  page: pagination.page,
  pageSize: pagination.size,
  itemCount: Number(pageData.value.totalElements),
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: handlePageChange,
  onUpdatePageSize: handlePageSizeChange,
}))
const columns = computed<DataTableColumns<SystemMenu>>(() => [
  {
    key: '__index',
    title: '序号',
    width: 72,
    fixed: 'left',
    align: 'center',
    render: (_record: SystemMenu, rowIndex: number) => (pagination.page - 1) * pagination.size + rowIndex + 1,
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
    render: (record: SystemMenu) => {
      if (!hasId(record.parentId)) {
        return '顶级菜单'
      }

      return parentMenuLabelMap.value.get(record.parentId) ?? `#${record.parentId}`
    },
  },
  {
    title: '显示',
    key: 'show',
    width: 90,
    render: (record: SystemMenu) => renderBooleanTag(record.show),
  },
  {
    title: '禁用',
    key: 'disabled',
    width: 90,
    render: (record: SystemMenu) => renderBooleanTag(record.disabled),
  },
  {
    title: '固定标签',
    key: 'pinned',
    width: 100,
    render: (record: SystemMenu) => renderBooleanTag(record.pinned),
  },
  {
    title: '操作',
    key: 'actions',
    width: 180,
    align: 'right',
    fixed: 'right',
    render: (record: SystemMenu) =>
      h(NSpace, { justify: 'end', size: 8 }, () => [
        h(
          NButton,
          {
            size: 'small',
            quaternary: true,
            type: 'primary',
            onClick: () => openEditModal(record),
          },
          () => '编辑',
        ),
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
      ]),
  },
])

function createEmptyPage<T>(): Page<T> {
  return {
    content: [],
    totalElements: '0',
  }
}

function createSearchModel(): SystemMenuQuery {
  return {
    key: '',
    label: '',
    name: '',
    path: '',
  }
}

function createFormModel(): SystemMenuFormModel {
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
    disabled: null,
    show: null,
    pinned: null,
    showTab: null,
    enableMultiTab: null,
  }
}

function replaceModel(model: object, nextValue: object) {
  const target = model as Record<string, unknown>

  for (const key of Object.keys(target)) {
    delete target[key]
  }

  Object.assign(target, nextValue)
}

function toParentMenuOption(item: SystemMenu): SelectOption | null {
  if (!hasId(item.id)) {
    return null
  }

  return {
    value: item.id,
    label: getMenuDisplayName(item),
  }
}

function getMenuDisplayName(item: SystemMenu) {
  return item.label || item.name || item.key || (hasId(item.id) ? `#${item.id}` : '未命名菜单')
}

function compareMenus(a: SystemMenu, b: SystemMenu) {
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

function buildMenuTreeOptions(items: SystemMenu[]): MenuTreeOption[] {
  const nodeMap = new Map<Id, MenuTreeOption>()
  const roots: MenuTreeOption[] = []

  items.forEach((item) => {
    if (!hasId(item.id)) {
      return
    }

    nodeMap.set(item.id, {
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

    const currentNode = nodeMap.get(item.id)

    if (!currentNode) {
      return
    }

    if (hasId(item.parentId) && nodeMap.has(item.parentId)) {
      nodeMap.get(item.parentId)?.children?.push(currentNode)
      return
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

function toFlag(value: boolean | null | undefined) {
  if (value === true) {
    return 1
  }

  if (value === false) {
    return 0
  }

  return null
}

function toBoolean(value: number | null) {
  if (value === null) {
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

function getFieldOptions(field: CrudFieldConfig) {
  return (unref(field.options) ?? []).map((option) => ({ ...option })) as SelectOption[]
}

function getFieldLoading(field: CrudFieldConfig) {
  return Boolean(unref(field.loading))
}

function getFieldDisabled(field: CrudFieldConfig, model: object, mode: 'create' | 'edit') {
  if (typeof field.disabled === 'function') {
    return field.disabled({
      mode,
      model: model as CrudFieldContext['model'],
    })
  }

  return Boolean(unref(field.disabled))
}

function setModelValue(model: object, key: string, value: unknown) {
  ;(model as Record<string, unknown>)[key] = value
}

function getInputValue(model: object, key: string) {
  const value = (model as Record<string, unknown>)[key]
  return typeof value === 'string' || value === null || value === undefined ? value : String(value)
}

function getNumberValue(model: object, key: string) {
  const value = (model as Record<string, unknown>)[key]
  return typeof value === 'number' || value === null || value === undefined ? value : null
}

function getSelectValue(model: object, key: string) {
  return (model as Record<string, unknown>)[key] as string | number | null | undefined
}

function getTableRowKey(record: SystemMenu) {
  if (hasId(record.id)) {
    return record.id
  }

  return `${record.key ?? 'menu'}-${record.path ?? 'path'}`
}

function createSearchQuery(): SystemMenuQuery {
  return {
    ...(hasId(selectedMenuId.value) ? { parentId: selectedMenuId.value } : {}),
    ...(searchModel.label?.trim() ? { label: searchModel.label.trim() } : {}),
    ...(searchModel.key?.trim() ? { key: searchModel.key.trim() } : {}),
    ...(searchModel.name?.trim() ? { name: searchModel.name.trim() } : {}),
    ...(searchModel.path?.trim() ? { path: searchModel.path.trim() } : {}),
  }
}

function createPayload(form: SystemMenuFormModel): SystemMenu {
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

async function loadMenuTree() {
  optionLoading.value = true

  try {
    const menuRes = await listSystemMenus()
    const menus = [...menuRes.data].sort(compareMenus)

    allMenus.value = menus
    treeOptions.value = buildMenuTreeOptions(menus)
    parentMenuOptions.value = menus
      .map(toParentMenuOption)
      .filter((item): item is SelectOption => Boolean(item))

    if (hasId(selectedMenuId.value) && !menus.some((item) => item.id === selectedMenuId.value)) {
      selectedMenuId.value = null
    }
  } finally {
    optionLoading.value = false
  }
}

async function loadPageData() {
  tableLoading.value = true

  try {
    const response = await getSystemMenuPage({
      page: pagination.page,
      size: pagination.size,
      query: createSearchQuery(),
    })

    pageData.value = response.data
  } finally {
    tableLoading.value = false
  }
}

async function refreshPageState() {
  await loadMenuTree()
  await loadPageData()
}

function handleSearch() {
  pagination.page = 1
  void loadPageData()
}

function handleReset() {
  replaceModel(searchModel, createSearchModel())
  pagination.page = 1
  void loadPageData()
}

function handlePageChange(page: number) {
  pagination.page = page
  void loadPageData()
}

function handlePageSizeChange(pageSize: number) {
  pagination.size = pageSize
  pagination.page = 1
  void loadPageData()
}

function handleSelectAllMenus() {
  if (!hasId(selectedMenuId.value)) {
    return
  }

  selectedMenuId.value = null
  pagination.page = 1
  void loadPageData()
}

function handleTreeSelect(keys: Array<string | number>) {
  const [firstKey] = keys
  const nextSelected = hasId(firstKey) ? firstKey : null

  if (selectedMenuId.value === nextSelected) {
    return
  }

  selectedMenuId.value = nextSelected
  pagination.page = 1
  void loadPageData()
}

function openCreateModal() {
  modalMode.value = 'create'
  replaceModel(formModel, {
    ...createFormModel(),
    parentId: hasId(selectedMenuId.value) ? selectedMenuId.value : null,
  })
  showModal.value = true
  void nextTick(() => formRef.value?.restoreValidation())
}

function openEditModal(record: SystemMenu) {
  modalMode.value = 'edit'
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
  showModal.value = true
  void nextTick(() => formRef.value?.restoreValidation())
}

function openEditSelectedMenu() {
  if (!selectedMenu.value) {
    return
  }

  openEditModal(selectedMenu.value)
}

async function handleSubmit() {
  await formRef.value?.validate()

  submitting.value = true

  try {
    const payload = createPayload(formModel)

    if (modalMode.value === 'create') {
      await createSystemMenu(payload)
      message.success('菜单新增成功')
      pagination.page = 1
    } else {
      await updateSystemMenu(payload)
      message.success('菜单更新成功')
    }

    showModal.value = false
    await refreshPageState()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(record: SystemMenu) {
  if (!hasId(record.id)) {
    throw new Error('Missing menu id')
  }

  await deleteSystemMenu(record.id)
  message.success('菜单删除成功')

  if (pageData.value.content.length === 1 && pagination.page > 1) {
    pagination.page -= 1
  }

  await refreshPageState()
}

async function handleDeleteSelectedMenu() {
  if (!selectedMenu.value) {
    return
  }

  await handleDelete(selectedMenu.value)
}

async function handleRefresh() {
  await refreshPageState()
}

onMounted(() => {
  void refreshPageState()
})
</script>

<template>
  <div class="flex h-full min-h-0 gap-4 p-4 max-lg:flex-col max-sm:p-2">
    <NCard
      :bordered="false"
      class="menu-tree-panel flex min-h-0 w-80 shrink-0 flex-col max-lg:w-full"
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
              quaternary
              @click="handleRefresh"
            >
              刷新
            </NButton>
          </NSpace>

          <NSpace
            v-if="selectedMenu"
            :size="8"
          >
            <NButton
              size="small"
              type="primary"
              secondary
              @click="openCreateModal"
            >
              新增
            </NButton>
            <NButton
              size="small"
              quaternary
              type="primary"
              @click="openEditSelectedMenu"
            >
              编辑
            </NButton>
            <NPopconfirm @positive-click="handleDeleteSelectedMenu">
              <template #trigger>
                <NButton
                  size="small"
                  quaternary
                  type="error"
                >
                  删除
                </NButton>
              </template>
              确认删除该菜单吗？
            </NPopconfirm>
          </NSpace>
        </div>

        <NInput
          v-model:value="treePattern"
          clearable
          placeholder="搜索菜单树"
        />

        <div class="flex items-center justify-between text-xs text-[var(--color-naive-text3)]">
          <span>{{ selectedMenu ? '已按父菜单筛选' : '当前显示全部菜单' }}</span>
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
      </div>
    </NCard>

    <div class="flex min-h-0 flex-1 flex-col gap-4">
      <CrudSearchPanel
        v-model:expanded="searchExpanded"
        create-label="新增菜单"
        :create-disabled="optionLoading"
        @create="openCreateModal"
      >
        <NForm
          :model="searchModel"
          label-placement="top"
          class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <NFormItem
            v-for="field in searchFields"
            :key="field.key"
            :label="field.label"
            :path="field.key"
          >
            <NInput
              v-if="field.type === 'input'"
              :value="getInputValue(searchModel, field.key)"
              :clearable="field.clearable ?? true"
              :disabled="getFieldDisabled(field, searchModel, 'create')"
              :placeholder="field.placeholder"
              v-bind="field.props"
              @keyup.enter="handleSearch"
              @update:value="setModelValue(searchModel, field.key, $event)"
            />
            <NInputNumber
              v-else-if="field.type === 'number'"
              :value="getNumberValue(searchModel, field.key)"
              :disabled="getFieldDisabled(field, searchModel, 'create')"
              :placeholder="field.placeholder"
              v-bind="field.props"
              @update:value="setModelValue(searchModel, field.key, $event)"
            />
            <NSelect
              v-else
              :value="getSelectValue(searchModel, field.key)"
              :clearable="field.clearable ?? true"
              :disabled="getFieldDisabled(field, searchModel, 'create')"
              :filterable="field.filterable ?? true"
              :loading="getFieldLoading(field)"
              :options="getFieldOptions(field)"
              :placeholder="field.placeholder"
              v-bind="field.props"
              @update:value="setModelValue(searchModel, field.key, $event)"
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
        class="flex min-h-0 flex-1 flex-col"
        content-class="flex min-h-0 flex-1 flex-col gap-4"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="text-base font-medium">菜单列表</div>
            <div class="mt-1 text-sm text-[var(--color-naive-text3)]">
              {{ currentTableDescription }}
            </div>
          </div>

          <NSpace :size="8">
            <NButton
              v-if="selectedMenu"
              type="primary"
              secondary
              @click="openCreateModal"
            >
              新增子菜单
            </NButton>
            <NButton
              v-if="selectedMenu"
              quaternary
              type="primary"
              @click="openEditSelectedMenu"
            >
              编辑当前菜单
            </NButton>
            <NPopconfirm
              v-if="selectedMenu"
              @positive-click="handleDeleteSelectedMenu"
            >
              <template #trigger>
                <NButton
                  quaternary
                  type="error"
                >
                  删除当前菜单
                </NButton>
              </template>
              确认删除该菜单吗？
            </NPopconfirm>
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
          :data="pageData.content"
          :loading="tableLoading"
          :pagination="tablePagination"
          :row-key="getTableRowKey"
          class="min-h-0 flex-1"
          flex-height
          remote
        />
      </NCard>
    </div>

    <NModal
      v-model:show="showModal"
      preset="card"
      :auto-focus="false"
      :mask-closable="false"
      :style="{ width: 'min(96vw, 1000px)' }"
      :title="modalTitle"
    >
      <NForm
        ref="formRef"
        :model="formModel"
        :rules="formRules"
        label-placement="top"
        class="grid gap-4 md:grid-cols-2"
      >
        <NFormItem
          v-for="field in formFields"
          :key="field.key"
          :label="field.label"
          :path="field.key"
        >
          <NInput
            v-if="field.type === 'input'"
            :value="getInputValue(formModel, field.key)"
            :clearable="field.clearable ?? false"
            :disabled="getFieldDisabled(field, formModel, modalMode)"
            :placeholder="field.placeholder"
            v-bind="field.props"
            @update:value="setModelValue(formModel, field.key, $event)"
          />
          <NInputNumber
            v-else-if="field.type === 'number'"
            :value="getNumberValue(formModel, field.key)"
            :disabled="getFieldDisabled(field, formModel, modalMode)"
            :placeholder="field.placeholder"
            v-bind="field.props"
            @update:value="setModelValue(formModel, field.key, $event)"
          />
          <NSelect
            v-else
            :value="getSelectValue(formModel, field.key)"
            :clearable="field.clearable ?? false"
            :disabled="getFieldDisabled(field, formModel, modalMode)"
            :filterable="field.filterable ?? true"
            :loading="getFieldLoading(field)"
            :options="getFieldOptions(field)"
            :placeholder="field.placeholder"
            v-bind="field.props"
            @update:value="setModelValue(formModel, field.key, $event)"
          />
        </NFormItem>
      </NForm>

      <template #action>
        <div class="flex justify-end gap-2">
          <NButton @click="showModal = false">取消</NButton>
          <NButton
            type="primary"
            :loading="submitting"
            @click="handleSubmit"
          >
            保存
          </NButton>
        </div>
      </template>
    </NModal>
  </div>
</template>

<style scoped>
.menu-search-actions :deep(.n-form-item-label__text) {
  visibility: hidden;
}
</style>
