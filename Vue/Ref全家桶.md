# Ref全家桶

|            | 描述                   |
| ---------- | -------------------- |
| ref        | 包装响应式数据              |
| isRef      | 判断是否为Ref对象           |
| Ref        | 接口类型                 |
| shallowRef | 浅层响应式                |
| triggerRef | 和shallowRef搭配使用，触发更新 |
| customRef  | 自定义Ref               |

## 1. ref

ref返回的是一个响应式对象，看看源码：

直接调用了`createRef`把值传入并传入false

```js
export function ref(value?: unknown) {
  return createRef(value, false)
}
```

看看`createRef()`，先判断是不是Ref对象，是的话直接返回，不是就实例化一个RefImpl对象。

```js
function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}
```

看看RefImpl:

```js
class RefImpl<T> {
  private _value: T
  private _rawValue: T

  public dep?: Dep = undefined
  public readonly __v_isRef = true

  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = __v_isShallow ? value : toRaw(value)
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    newVal = this.__v_isShallow ? newVal : toRaw(newVal)
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = this.__v_isShallow ? newVal : toReactive(newVal)
      triggerRefValue(this, newVal)
    }
  }
}
```

`toReactive`，判断值是否为对象，如数组，Object，如果是就用reactive包装一下，不是就直接返回原值。

```js
export const toReactive = <T extends unknown>(value: T): T =>
  isObject(value) ? reactive(value) : value
```

## 2. isRef

## 3. Ref

## 4. shallowRef

## 5. triggerRef

```js
function triggerRef(ref: ShallowRef): void
```

和`shallowRef`搭配使用

```js
const shallow = shallowRef({
  greet: 'Hello, world'
})

// Logs "Hello, world" once for the first run-through
watchEffect(() => {
  console.log(shallow.value.greet)
})

// This won't trigger the effect because the ref is shallow
shallow.value.greet = 'Hello, universe'

// Logs "Hello, universe"
triggerRef(shallow)
```

## 6. customRef

这个函数接收一个工厂函数，该工厂函数必须返回一个拥有getter和setter的对象，工厂函数有两个函数参数，第一个函数用于搜集依赖，第二个函数用于触发更新。

```js
function MyRef<T>(value: T) {
  return customRef((trank, trigger) => {
    return {
      get() {
        trank()
        return value
      },
      set(newValue: T) {
        console.log('set');
        value = newValue
        trigger() // 触发更新
      }
    }
  })
}

const message = MyRef<string>('hhh')
```

例子：定义一个防抖Ref

```js
import { customRef } from 'vue'

export function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}
```

使用

```v
<script setup>
import { useDebouncedRef } from './debouncedRef'
const text = useDebouncedRef('hello')
</script>

<template>
  <input v-model="text" />
</template>
```

## shallowRef与ref一起使用造成的问题

### 发生场景

正常情况下更改一个shallowRef对象的属性时，值会更改，但是由于它的浅层响应特性，视图并不会更改，要想更改视图必须调用`triggerRef`如：

```v
<script setup lang="ts">
import { shallowRef, triggerRef } from 'vue'

const message = shallowRef({
  foo: '球球',
  bar: '闰土'
})

const changeMsg = () => {
  console.log(message);
  triggerRef(message)    // trigger必须传入一个参数
  message.value.foo = 'qiuqiu'
  // triggerRef(message)放在这里效果一样，视图都能更新
}

</script>


<template>
  <div>
    {{ message }}
    <button @click="changeMsg">change shallow</button>
  </div>
</template>


```

但是如果遇上`ref`，不用`trigger`视图也更新了

```v
<script setup lang="ts">
import { shallowRef, ref } from 'vue'

const a = ref('hahaha')


const message = shallowRef({
  foo: '球球',
  bar: '闰土'
})

const changeMsg = () => {
  console.log(message);
  message.value.foo = 'qiuqiu'    // 没有调用trigger视图也更新
  a.value = 'mogutou'    // 这里修改了ref的值，ref的视图更新
}

const changeTwice = () => {
  console.log(message);
  message.value.foo = 'lenmeng'
}

</script>


<template>
  <div>
    {{ a }}
    {{ message }}
    <button @click="changeMsg">change shallow</button>
    <button @click="changeTwice">changeTwice</button>
  </div>
</template>


```

### 问题原因（源码）

在`RefImpl`类的setter中调用了`triggerRefValue`，导致shallowRef也更新了。

```js
set value(newVal) {
    newVal = this.__v_isShallow ? newVal : toRaw(newVal)
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = this.__v_isShallow ? newVal : toReactive(newVal)
      triggerRefValue(this, newVal)
    }
  }
```


