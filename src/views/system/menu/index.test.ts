import { mount, flushPromises } from '@vue/test-utils'
import { NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'

import MenuPage from './index.vue'

const listMenus = vi.fn()
const createMenu = vi.fn()
const updateMenu = vi.fn()
const deleteMenu = vi.fn()
const loadMenus = vi.fn()

vi.mock('@/api', () => ({
  createMenu: (...args: unknown[]) => createMenu(...args),
  deleteMenu: (...args: unknown[]) => deleteMenu(...args),
  listMenus: (...args: unknown[]) => listMenus(...args),
  updateMenu: (...args: unknown[]) => updateMenu(...args),
}))

vi.mock('@/stores', () => ({
  useMenuStore: () => ({
    loadMenus,
  }),
}))

vi.mock('@/utils/icon', () => ({
  isDynamicIconName: () => true,
}))

const menus: MenuView[] = [
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

const TestHost = defineComponent({
  components: {
    MenuPage,
    NConfigProvider,
    NDialogProvider,
    NMessageProvider,
  },
  template: `
    <NConfigProvider>
      <NMessageProvider>
        <NDialogProvider>
          <MenuPage />
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

describe('SystemMenuPage', () => {
  beforeEach(() => {
    listMenus.mockReset()
    createMenu.mockReset()
    updateMenu.mockReset()
    deleteMenu.mockReset()
    loadMenus.mockReset()

    listMenus.mockResolvedValue({ data: menus })
    createMenu.mockImplementation(async (payload: SaveMenuInput) => ({
      data: {
        ...payload,
        id: 99,
      },
    }))
    updateMenu.mockImplementation(async (payload: UpdateMenuInput) => ({ data: payload }))
    deleteMenu.mockResolvedValue(undefined)
    loadMenus.mockResolvedValue([])
  })

  it('shows root editor form by default', async () => {
    const wrapper = mount(TestHost)

    await flushPromises()

    expect(wrapper.text()).toContain('新增顶级菜单')
    expect(wrapper.text()).toContain('创建菜单')
    expect(wrapper.text()).toContain('菜单标识')
    expect(wrapper.find('input[value="顶级菜单"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('默认')
  })

  it('shows editor form when selecting a menu tree node', async () => {
    const wrapper = mount(TestHost)

    await flushPromises()

    const treeNode = wrapper
      .findAll('.n-tree-node-content')
      .find((item) => item.text().includes('菜单管理'))

    expect(treeNode).toBeTruthy()

    await treeNode!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('编辑')
    expect(wrapper.text()).toContain('保存修改')
    expect(wrapper.text()).toContain('删除当前菜单')
  })

  it('shows readonly parent label when creating a child menu', async () => {
    const wrapper = mount(TestHost)

    await flushPromises()

    const treeNode = wrapper
      .findAll('.n-tree-node-content')
      .find((item) => item.text().includes('菜单管理'))

    expect(treeNode).toBeTruthy()

    await treeNode!.trigger('click')
    await flushPromises()
    await findButtonByText(wrapper, '新增下级').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('新增 菜单管理 的子菜单')
    expect(wrapper.find('input[value="菜单管理"]').exists()).toBe(true)
  })
})
