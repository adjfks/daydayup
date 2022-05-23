方法一：

实现组件上的v-model绑定

```js
props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },

setup(props, { emit }) {
    const checked = ref(false)
    const changeChecked = () => {
      checked.value = !checked.value
      // 使用emit通知父组件
      emit('update:modelVal', checked.value)
    }

    // 侦听父组件传递数据
    watch(
      () => props.modelValue,
      (newVal) => {
        checked.value = newVal
      },
      { immediate: true }
    )

    return { checked, changeChecked }
  }
```

方法二：

使用@vueuse/core

```js
 props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // 使用useVModel实现双向数据绑定v-model指令
    // 1. 使用props接收modelValue
    // 2. 使用useVModel来包装props中的modelValue属性数据
    // 3. 在使用checked.value就是使用父组件数据
    // 4. 在使用checked.value = '数据' 赋值，触发emit('update:modelvalue', '数据')
    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      const newVal = !checked.value
      // 通知父组件
      checked.value = newVal
      // 让组件支持change事件
      emit('change', newVal)
    }
    return { checked, changeChecked }
  }
```
