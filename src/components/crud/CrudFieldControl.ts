import { NInput, NInputNumber, NRadioButton, NRadioGroup, NSelect } from 'naive-ui'
import { defineComponent, h, toHandlerKey, type VNode } from 'vue'

import {
  getFieldDisabled,
  getFieldLoading,
  getFieldOptions,
  getFieldProps,
  getModelValue,
  setModelValue,
} from './shared'

import type {
  CrudBuiltinComponent,
  CrudFieldConfig,
  CrudFieldRenderContext,
  CrudRecord,
} from './interface'
import type { Component } from 'vue'

const builtinComponentMap: Record<CrudBuiltinComponent, Component> = {
  input: NInput,
  number: NInputNumber,
  radio: NRadioGroup,
  select: NSelect,
}

function resolveComponent(component?: CrudFieldConfig['component']) {
  if (!component || typeof component === 'string') {
    return builtinComponentMap[component ?? 'input']
  }

  return component
}

function createRenderContext(
  field: CrudFieldConfig,
  model: CrudRecord,
  mode: 'create' | 'edit',
): CrudFieldRenderContext {
  return {
    field,
    mode,
    model,
    value: getModelValue(model, field.key),
    setValue: (value) => setModelValue(model, field.key, value),
  }
}

export default defineComponent({
  name: 'CrudFieldControl',
  props: {
    field: {
      type: Object as () => CrudFieldConfig,
      required: true,
    },
    model: {
      type: Object as () => CrudRecord,
      required: true,
    },
    mode: {
      type: String as () => 'create' | 'edit',
      required: true,
    },
  },
  setup(props) {
    return () => {
      const renderContext = createRenderContext(props.field, props.model, props.mode)

      if (props.field.render) {
        return props.field.render(renderContext)
      }

      const component = resolveComponent(props.field.component)
      const modelProp = props.field.modelProp ?? 'value'
      const updateEvent = props.field.updateEvent ?? `update:${modelProp}`
      const options = getFieldOptions(props.field, {
        mode: props.mode,
        model: props.model,
      })
      const componentProps = {
        placeholder: props.field.placeholder,
        clearable: props.field.clearable,
        filterable: props.field.filterable,
        loading: getFieldLoading(props.field, {
          mode: props.mode,
          model: props.model,
        }),
        disabled: getFieldDisabled(props.field, props.model, props.mode),
        ...getFieldProps(props.field, props.model, props.mode),
        [modelProp]: renderContext.value,
        [toHandlerKey(updateEvent)]: (value: unknown) => renderContext.setValue(value),
      }

      if (props.field.component === 'radio') {
        return h(NRadioGroup, componentProps, {
          default: () =>
            options.map((option) =>
              h(
                NRadioButton,
                {
                  key: String(option.value),
                  value: option.value,
                },
                () => option.label,
              ),
            ),
        })
      }

      const slots = props.field.slots?.(renderContext)

      return h(component, componentProps, slots as Record<string, () => VNode> | undefined)
    }
  },
})
