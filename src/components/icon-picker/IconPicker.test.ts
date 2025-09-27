import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import {IconPicker} from '../index'

describe('IconPicker', () => {
  const icons = ['home', 'account', 'star']
  const prefix = 'mdi'

  it('renders icon list', () => {
    const wrapper = mount(IconPicker, {
      props: { icons, prefix }
    })
    expect(wrapper.findAll('button').length).toBe(icons.length)
    expect(wrapper.findAll('span').some(span => span.classes().includes('iconify-[mdi--home]'))).toBe(true)
    expect(wrapper.findAll('span').some(span => span.classes().includes('iconify-[mdi--account]'))).toBe(true)
    expect(wrapper.findAll('span').some(span => span.classes().includes('iconify-[mdi--star]'))).toBe(true)
  })

  it('filters icons by search', async () => {
    const wrapper = mount(IconPicker, {
      props: { icons, prefix }
    })
    await wrapper.find('input').setValue('acc')
    expect(wrapper.findAll('button').length).toBe(1)
    expect(wrapper.findAll('span').some(span => span.classes().includes('iconify-[mdi--account]'))).toBe(true)
  })

  it('emits selected icon in correct format', async () => {
    const wrapper = mount(IconPicker, {
      props: { icons, prefix }
    })
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(1)
    await buttons[1]?.trigger('click') // 加可选链防止下标越界
    const emitted = wrapper.emitted()['update:modelValue']
    expect(emitted).toBeTruthy()
    expect((emitted as any)[0][0]).toBe('iconify-[mdi--account]') // 类型断言
  })
})
