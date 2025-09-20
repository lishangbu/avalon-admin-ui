import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'

import { CollapseTransition } from '../index'

describe('CollapseTransition Component', () => {
  it('toggle by v-if when display=false', async () => {
    const wrapper = mount(CollapseTransition, {
      props: {
        display: true,
        direction: 'vertical',
        duration: 300,
      },
      slots: { default: '<div class="context">context</div>' },
    })

    expect(wrapper.find('.context').exists()).toBe(true)

    await wrapper.setProps({ display: false })
    await nextTick()
    expect(wrapper.find('.context').exists()).toBe(false)
  })
})
