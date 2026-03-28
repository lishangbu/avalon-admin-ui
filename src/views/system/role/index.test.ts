import { mount, flushPromises } from '@vue/test-utils'
import { NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'

import RolePage from './index.vue'

const createRole = vi.fn()
const deleteRole = vi.fn()
const getRolePage = vi.fn()
const listMenus = vi.fn()
const updateRole = vi.fn()

vi.mock('@/api', () => ({
  createRole: (...args: unknown[]) => createRole(...args),
  deleteRole: (...args: unknown[]) => deleteRole(...args),
  getRolePage: (...args: unknown[]) => getRolePage(...args),
  listMenus: (...args: unknown[]) => listMenus(...args),
  updateRole: (...args: unknown[]) => updateRole(...args),
}))

vi.mock('@/utils/icon', () => ({
  isDynamicIconName: () => true,
}))

const menuOptions: Menu[] = [
  {
    id: 2,
    parentId: null,
    key: 'system',
    label: '系统管理',
    name: 'system',
    path: 'system',
    component: 'system',
    redirect: '',
    sortingOrder: 0,
    disabled: false,
    show: true,
    pinned: false,
    showTab: true,
    enableMultiTab: false,
    icon: 'ph:diamonds-four',
  },
  {
    id: 5,
    parentId: 2,
    key: 'menu',
    label: '菜单管理',
    name: 'menu',
    path: 'menu',
    component: 'system/menu/index',
    redirect: '',
    sortingOrder: 0,
    disabled: false,
    show: true,
    pinned: false,
    showTab: true,
    enableMultiTab: false,
    icon: 'ph:function-bold',
  },
]

const roleRows: Page<Role> = {
  rows: [
    {
      id: '1',
      code: 'ROLE_SUPER_ADMIN',
      name: '超级管理员',
      enabled: true,
      menus: [
        {
          id: '5',
          parentId: 2,
          key: 'menu',
          label: '菜单管理',
          name: 'menu',
          path: 'menu',
          component: 'system/menu/index',
          redirect: '',
          sortingOrder: 0,
          disabled: false,
          show: true,
          pinned: false,
          showTab: true,
          enableMultiTab: false,
          icon: 'ph:function-bold',
        },
      ],
    },
  ],
  totalRowCount: 1,
  totalPageCount: 1,
}

const TestHost = defineComponent({
  components: {
    RolePage,
    NConfigProvider,
    NDialogProvider,
    NMessageProvider,
  },
  template: `
    <NConfigProvider>
      <NMessageProvider>
        <NDialogProvider>
          <RolePage />
        </NDialogProvider>
      </NMessageProvider>
    </NConfigProvider>
  `,
})

function findButtonByText(wrapper: ReturnType<typeof mount>, text: string) {
  const button = wrapper
    .findAll('button')
    .find((item) => item.text().replace(/\s+/g, '') === text.replace(/\s+/g, ''))

  if (!button) {
    throw new Error(`Button not found: ${text}`)
  }

  return button
}

describe('SystemRolePage', () => {
  beforeEach(() => {
    createRole.mockReset()
    deleteRole.mockReset()
    getRolePage.mockReset()
    listMenus.mockReset()
    updateRole.mockReset()

    createRole.mockResolvedValue({ data: {} })
    deleteRole.mockResolvedValue(undefined)
    getRolePage.mockResolvedValue({ data: roleRows })
    listMenus.mockResolvedValue({ data: menuOptions })
    updateRole.mockResolvedValue({ data: {} })
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('shows enabled status as radio buttons in create dialog', async () => {
    const wrapper = mount(TestHost, {
      attachTo: document.body,
    })

    await flushPromises()
    await findButtonByText(wrapper, '新增角色').trigger('click')
    await flushPromises()

    expect(document.body.querySelectorAll('.n-radio-button').length).toBeGreaterThanOrEqual(2)
    expect(document.body.textContent).toContain('启用')
    expect(document.body.textContent).toContain('禁用')
  })

  it('uses tree selector for role menus in edit dialog', async () => {
    const wrapper = mount(TestHost, {
      attachTo: document.body,
    })

    await flushPromises()
    await findButtonByText(wrapper, '编辑').trigger('click')
    await flushPromises()

    const modal = document.body.querySelector('.n-modal')

    expect(modal?.querySelector('.n-tree-select')).not.toBeNull()
    expect(modal?.textContent).toContain('菜单管理')
  })
})
