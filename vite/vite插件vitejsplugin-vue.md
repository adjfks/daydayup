# vite插件@vitejs/plugin-vue

```js
import Vue from '@vitejs/plugin-vue'


plugins: [
    Vue({
      reactivityTransform: true,
    })
]
```

#### 作用及常见配置

一个官方的插件，用于在vite中提供单文件vue组件(SFCs)支持。

它会将vue文件中的资源引用转换为ESM，即使用import导入后再引用，这样就可以直接在浏览器中加载。

它还可以配置自动响应式转换，这样就不用再担心忘记写`.value`。

- `customElement: true`：设为true会将所有.vue文件转换为原生的自定义元素，此时style标签不必加上scoped，因为自定义元素默认就是scoped的。

- `reactivityTransform?: boolean | string | RegExp | (string | RegExp)[]`：是否开启Reactivity Transform，它是一个**编译时**的代码转换，允许我们像下面这样写代码：

```v
<script setup>
let count = $ref(0)

console.log(count)

function increment() {
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

在运行前，会先进行编译，上面的代码会被转换成下main这样：

```v
import { ref } from 'vue'    // 自动导入

let count = ref(0)    

console.log(count.value)    // 自动加上.value

function increment() {
  count.value++
}
```

### $()

使用一些组合式API的库的时候可以使用$()来进行自动的响应式转换，如

```v
import { useMouse } from '@vueuse/core'

const { x, y } = $(useMouse())

console.log(x, y)
```

转换为

```v
import { toRef } from 'vue'
import { useMouse } from '@vueuse/core'

const __temp = useMouse(),
  x = toRef(__temp, 'x'),
  y = toRef(__temp, 'y')

console.log(x.value, y.value)
```

**注意**：如果x已经是refs了，那么不会额外创造多一个ref，也就是说无论x是否已经是refs，这都可以放心使用。

函数返回的refs也可以进行转换，不过应该使用$包裹函数，而不是它返回的ref

```v
function myCreateRef() {
  return ref(0)
}

let count = $(myCreateRef())
```

#### 其它响应式API

* [`ref`](https://vuejs.org/api/reactivity-core.html#ref) -> `$ref`
* [`computed`](https://vuejs.org/api/reactivity-core.html#computed) -> `$computed`
* [`shallowRef`](https://vuejs.org/api/reactivity-advanced.html#shallowref) -> `$shallowRef`
* [`customRef`](https://vuejs.org/api/reactivity-advanced.html#customref) -> `$customRef`
* [`toRef`](https://vuejs.org/api/reactivity-utilities.html#toref) -> `$toRef`

#### 使用`defineProps` 解决访问props问题

每次都要`props.xxx`？试试`defineProps`

```v
<script setup lang="ts">
  interface Props {
    msg: string
    count?: number
    foo?: string
  }

  const {
    msg,
    // default value just works
    count = 1,
    // local aliasing also just works
    // here we are aliasing `props.foo` to `bar`
    foo: bar
  } = defineProps<Props>()

  watchEffect(() => {
    // will log whenever the props change
    console.log(msg, count, bar)
  })
</script>
```

上面的代码会被转换成：

```v
export default {
  props: {
    msg: { type: String, required: true },
    count: { type: Number, default: 1 },
    foo: String
  },
  setup(props) {
    watchEffect(() => {
      console.log(props.msg, props.count, props.foo)
    })
  }
}
```

#### $$()解决响应式变量作为函数参数问题

```v
function trackChange(x: Ref<number>) {
  watch(x, (x) => {
    console.log('x changed!')
  })
}

let count = $ref(0)
trackChange(count) // doesn't work!

// 编译成：
let count = ref(0)
trackChange(count.value)
```

上面的代码不会工作，因为传进去的是`count.value`

```v
let count = $ref(0)
- trackChange(count)
+ trackChange($$(count))

// 编译成
import { ref } from 'vue'
let count = ref(0)
trackChange(count)
```

#### $$()解决函数中返回响应式变量问题

```v
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // listen to mousemove...

  // doesn't work!
  return {
    x,
    y
  }
}

// 编译成
return {
  x: x.value,
  y: y.value
}
```

使用$$直接包裹整个返回的对象

```v
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // listen to mousemove...

  // fixed
  return $$({
    x,
    y
  })
}
```

#### 使用$$转换被构建的props

```v
const { count } = defineProps<{ count: number }>()

passAsRef($$(count))

// 转换为
setup(props) {
  const __props_count = toRef(props, 'count')
  passAsRef(__props_count)
}
```
