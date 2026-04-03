<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { tryOnMounted } from '@vueuse/core'
import {
  NButton,
  NDropdown,
  NEmpty,
  NForm,
  NFormItem,
  NInput,
  NModal,
  NPopconfirm,
  NScrollbar,
  NSpin,
  useDialog,
  useMessage,
} from 'naive-ui'
import { computed, nextTick, reactive, ref } from 'vue'

import {
  createEncounterCondition,
  createEncounterConditionValue,
  deleteEncounterCondition,
  deleteEncounterConditionValue,
  listEncounterConditions,
  listEncounterConditionValues,
  updateEncounterCondition,
  updateEncounterConditionValue,
} from '@/api'
import {
  createCrudListConfig,
  createFlatCrudInterfaceSchema,
  createFlatCrudListSchema,
  CrudList,
  hasId,
  pickRelationId,
} from '@/components'

import type { FormInst } from 'naive-ui'
import type { DropdownOption } from 'naive-ui'

defineOptions({ name: 'EncounterConditionPage' })

const message = useMessage()
const dialog = useDialog()

// ============================================================
// Left Panel — Encounter Condition list
// ============================================================

const conditionLoading = ref(false)
const conditionSubmitting = ref(false)
const conditions = ref<EncounterCondition[]>([])
const selectedConditionId = ref<Id | null>(null)
const conditionSearch = ref('')
const showConditionDropdown = ref(false)
const conditionContextMenu = ref<EncounterCondition | null>(null)
const conditionDropdownPosition = reactive({
  x: 0,
  y: 0,
})

const conditionDropdownOptions = computed<DropdownOption[]>(() => [
  {
    key: 'create',
    label: '新增遭遇条件',
  },
  {
    key: 'edit',
    label: '编辑遭遇条件',
    disabled: !conditionContextMenu.value || !hasId(conditionContextMenu.value.id),
  },
  {
    key: 'delete',
    label: '删除遭遇条件',
    disabled: !conditionContextMenu.value || !hasId(conditionContextMenu.value.id),
  },
])

const filteredConditions = computed(() => {
  const q = conditionSearch.value.trim().toLowerCase()
  if (!q) return conditions.value
  return conditions.value.filter(
    (c) => c.name?.toLowerCase().includes(q) || c.internalName?.toLowerCase().includes(q),
  )
})

async function loadConditions() {
  conditionLoading.value = true
  try {
    const res = await listEncounterConditions()
    conditions.value = res.data
  } finally {
    conditionLoading.value = false
  }
}

function isSelected(condition: EncounterCondition) {
  return hasId(condition.id) && String(condition.id) === String(selectedConditionId.value)
}

// Condition modal
const showConditionModal = ref(false)
const conditionModalMode = ref<'create' | 'edit'>('create')
const conditionModalTitle = computed(() =>
  conditionModalMode.value === 'create' ? '新增遭遇条件' : '编辑遭遇条件',
)
const conditionFormRef = ref<FormInst | null>(null)
const conditionForm = ref<EncounterConditionFormModel>({ id: null, name: '', internalName: '' })
const conditionFormRules = {
  name: [{ required: true, message: '请输入遭遇条件名称', trigger: ['input', 'blur'] }],
  internalName: [{ required: true, message: '请输入内部名称', trigger: ['input', 'blur'] }],
}

function openCreateCondition() {
  conditionModalMode.value = 'create'
  conditionForm.value = { id: null, name: '', internalName: '' }
  showConditionModal.value = true
}

function openEditCondition(condition: EncounterCondition, event?: MouseEvent) {
  event?.stopPropagation()
  conditionModalMode.value = 'edit'
  conditionForm.value = {
    id: condition.id ?? null,
    name: condition.name ?? '',
    internalName: condition.internalName ?? '',
  }
  showConditionModal.value = true
}

async function handleConditionSubmit() {
  try {
    await conditionFormRef.value?.validate()
  } catch {
    return
  }
  conditionSubmitting.value = true
  try {
    if (conditionModalMode.value === 'create') {
      const res = await createEncounterCondition({
        name: conditionForm.value.name,
        internalName: conditionForm.value.internalName,
      })
      message.success('遭遇条件新增成功')
      await loadConditions()
      selectedConditionId.value = res.data.id ?? null
    } else {
      await updateEncounterCondition({
        id: String(conditionForm.value.id),
        name: conditionForm.value.name,
        internalName: conditionForm.value.internalName,
      })
      message.success('遭遇条件更新成功')
      await loadConditions()
    }
    showConditionModal.value = false
  } finally {
    conditionSubmitting.value = false
  }
}

async function handleDeleteCondition(condition: EncounterCondition) {
  try {
    await deleteEncounterCondition(condition.id!)
    message.success('遭遇条件删除成功')
    if (isSelected(condition)) {
      selectedConditionId.value = null
    }
    await loadConditions()
  } catch {}
}

function handleDeleteConditionWithConfirm(condition: EncounterCondition) {
  dialog.warning({
    title: '删除遭遇条件',
    content: `确认删除「${condition.name || condition.internalName || '未命名条件'}」吗？若该遭遇条件下已存在条件值数据，则不允许删除。`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: () => handleDeleteCondition(condition),
  })
}

function closeConditionDropdown() {
  showConditionDropdown.value = false
  conditionContextMenu.value = null
}

function handleConditionContextMenu(event: MouseEvent, condition?: EncounterCondition) {
  event.preventDefault()
  event.stopPropagation()

  if (condition?.id) {
    selectedConditionId.value = condition.id
  }

  conditionContextMenu.value = condition ?? null
  showConditionDropdown.value = false

  nextTick(() => {
    conditionDropdownPosition.x = event.clientX
    conditionDropdownPosition.y = event.clientY
    showConditionDropdown.value = true
  })
}

function handleConditionDropdownSelect(key: string | number) {
  const action = String(key)
  const target = conditionContextMenu.value

  closeConditionDropdown()

  switch (action) {
    case 'create':
      openCreateCondition()
      break
    case 'edit':
      if (target) {
        openEditCondition(target)
      }
      break
    case 'delete':
      if (target) {
        handleDeleteConditionWithConfirm(target)
      }
      break
    default:
      break
  }
}

// ============================================================
// Right Panel — Encounter Condition Value CrudList
// ============================================================

const valueFields = [
  {
    key: 'id',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => record.id ?? null,
    },
    payload: {
      toValue: (value) => String(value),
      omitWhen: (value) => !hasId(value),
    },
  },
  {
    key: 'name',
    trim: true,
    form: {
      label: '条件值名称',
      component: 'input',
      placeholder: '例如：During a swarm',
      rules: [{ required: true, message: '请输入条件值名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '条件值名称',
      component: 'input',
      placeholder: '输入条件值名称',
    },
    table: {
      title: '条件值名称',
      width: 220,
      fixed: 'left',
    },
  },
  {
    key: 'internalName',
    trim: true,
    form: {
      label: '内部名称',
      component: 'input',
      placeholder: '例如：swarm-yes',
      rules: [{ required: true, message: '请输入内部名称', trigger: ['input', 'blur'] }],
    },
    search: {
      label: '内部名称',
      component: 'input',
      placeholder: '输入内部名称',
    },
    table: {
      title: '内部名称',
      width: 220,
    },
  },
  {
    key: 'encounterConditionId',
    formModel: {
      defaultValue: null,
      fromRecord: (record) => pickRelationId(record.encounterCondition),
    },
    payload: {
      toValue: (value) => (hasId(value) ? String(value) : null),
    },
    // hidden in the combined view — injected automatically from the left-panel selection
    form: false,
    search: false,
    table: false,
  },
] as const satisfies Parameters<
  typeof createFlatCrudListSchema<
    EncounterConditionValue,
    EncounterConditionValueQuery,
    EncounterConditionValueFormModel,
    EncounterConditionValueFormModel
  >
>[0]['fields']

const valueInterfaceSchema = createFlatCrudInterfaceSchema<
  EncounterConditionValue,
  EncounterConditionValueFormModel
>({
  create: {
    buttonLabel: '新增条件值',
    successMessage: '条件值新增成功',
  },
  delete: {
    confirmMessage: '确认删除该条件值吗？',
    successMessage: '条件值删除成功',
  },
  edit: {
    dialogTitle: '编辑条件值',
    successMessage: '条件值更新成功',
  },
  fields: valueFields,
  indexColumn: true,
  modalWidth: 'min(92vw, 560px)',
  searchGridClass: 'grid gap-4 md:grid-cols-2',
})

function createValueCrudConfig() {
  const listSchema = createFlatCrudListSchema<
    EncounterConditionValue,
    EncounterConditionValueQuery,
    EncounterConditionValueFormModel,
    EncounterConditionValueFormModel
  >({
    fields: valueFields,
    // reads selectedConditionId.value at call-time — always up to date
    loadList: (query) =>
      listEncounterConditionValues({ ...query, encounterConditionId: selectedConditionId.value }),
    createRecord: createEncounterConditionValue,
    deleteRecord: deleteEncounterConditionValue,
    updateRecord: updateEncounterConditionValue,
  })

  // Inject the currently-selected condition ID when opening the create modal
  const origCreateFormModel = listSchema.createFormModel
  listSchema.createFormModel = () => ({
    ...origCreateFormModel(),
    encounterConditionId: selectedConditionId.value,
  })

  return createCrudListConfig({ interface: valueInterfaceSchema, list: listSchema })
}

const valueCrudConfig = createValueCrudConfig()

// ============================================================
// Init
// ============================================================
tryOnMounted(() => {
  void loadConditions()
})
</script>

<template>
  <div class="flex h-full min-h-0 overflow-hidden">
    <!-- ===== Left Panel ===== -->
    <div
      class="flex h-full w-64 min-w-48 flex-shrink-0 flex-col border-r border-gray-200 dark:border-gray-700"
    >
      <!-- Header -->
      <div class="flex items-center gap-2 px-3 py-2">
        <span class="flex-1 text-sm font-semibold">遭遇条件</span>
      </div>

      <!-- Search -->
      <div class="px-3 pb-2">
        <NInput
          v-model:value="conditionSearch"
          placeholder="搜索条件…"
          size="small"
          clearable
        />
      </div>

      <!-- List -->
      <NSpin
        :show="conditionLoading"
        class="flex min-h-0 flex-1"
      >
        <NScrollbar
          class="h-full"
          @contextmenu="handleConditionContextMenu"
        >
          <div class="space-y-0.5 px-2 pb-3">
            <div
              v-for="condition in filteredConditions"
              :key="condition.id"
              class="group flex cursor-pointer items-center gap-1 rounded px-2 py-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              :class="{
                'bg-blue-50 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300':
                  isSelected(condition),
              }"
              @click="selectedConditionId = condition.id ?? null"
              @contextmenu="handleConditionContextMenu($event, condition)"
            >
              <span class="min-w-0 flex-1 truncate text-sm">
                {{ condition.name || condition.internalName }}
              </span>
              <!-- action buttons, fade-in on hover -->
              <div
                class="flex flex-shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <NButton
                  text
                  size="tiny"
                  @click="openEditCondition(condition, $event)"
                >
                  <template #icon>
                    <Icon icon="mdi:pencil-outline" />
                  </template>
                </NButton>
                <NPopconfirm
                  placement="right"
                  @positive-click="() => handleDeleteCondition(condition)"
                >
                  <template #trigger>
                    <NButton
                      text
                      size="tiny"
                      type="error"
                      @click.stop
                    >
                      <template #icon>
                        <Icon icon="mdi:delete-outline" />
                      </template>
                    </NButton>
                  </template>
                  确认删除该遭遇条件吗？若该遭遇条件下已存在条件值数据，则不允许删除。
                </NPopconfirm>
              </div>
            </div>

            <NEmpty
              v-if="!conditionLoading && filteredConditions.length === 0"
              description="暂无数据"
              size="small"
              class="py-6"
            />
          </div>
        </NScrollbar>
      </NSpin>
      <NDropdown
        placement="bottom-start"
        trigger="manual"
        :x="conditionDropdownPosition.x"
        :y="conditionDropdownPosition.y"
        :options="conditionDropdownOptions"
        :show="showConditionDropdown"
        @clickoutside="closeConditionDropdown"
        @select="handleConditionDropdownSelect"
      />
    </div>

    <!-- ===== Right Panel ===== -->
    <div class="flex min-h-0 min-w-0 flex-1 flex-col">
      <!-- key forces CrudList to remount (and reload) when the selected condition changes -->
      <CrudList
        v-if="selectedConditionId !== null"
        :key="selectedConditionId"
        :config="valueCrudConfig"
      />
      <div
        v-else
        class="flex h-full items-center justify-center"
      >
        <NEmpty description="请在左侧选择一个遭遇条件以查看其条件值" />
      </div>
    </div>
  </div>

  <!-- ===== Condition Add/Edit Modal ===== -->
  <NModal
    v-model:show="showConditionModal"
    preset="card"
    :title="conditionModalTitle"
    :mask-closable="false"
    :auto-focus="false"
    style="width: min(92vw, 480px)"
  >
    <NSpin :show="conditionSubmitting">
      <NForm
        ref="conditionFormRef"
        :model="conditionForm"
        :rules="conditionFormRules"
        label-placement="top"
      >
        <NFormItem
          label="遭遇条件名称"
          path="name"
        >
          <NInput
            v-model:value="conditionForm.name"
            placeholder="例如：Swarm"
          />
        </NFormItem>
        <NFormItem
          label="内部名称"
          path="internalName"
        >
          <NInput
            v-model:value="conditionForm.internalName"
            placeholder="例如：swarm"
          />
        </NFormItem>
      </NForm>
    </NSpin>
    <template #action>
      <div class="flex justify-end gap-2">
        <NButton @click="showConditionModal = false">取消</NButton>
        <NButton
          type="primary"
          :loading="conditionSubmitting"
          @click="handleConditionSubmit"
        >
          保存
        </NButton>
      </div>
    </template>
  </NModal>
</template>
