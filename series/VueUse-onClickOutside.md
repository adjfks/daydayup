```js
<template>
  <div ref="target">
    Hello world
  </div>
  <div>
    Outside element
  </div>
</template>

<script>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

export default {
  setup() {
    const target = ref(null)
    // 点击target外部可以做一些事情，如关闭弹层
    onClickOutside(target, (event) => console.log(event))

    return { target }
  }
}
</script>
```
