# Reactive全家桶

## reactive

用于给复杂数据类型如Object、Array创建响应式。复杂数据类型不推荐用`ref`，因为如果是复杂数据类型，在ref中也是去调用`reactive`。所以复杂数据类型直接使用`reactive`即可。

使用`reactive`包裹的对象访问属性时不需要加`.value`

给reactive对象直接赋值会破坏响应式

```v
<script setup lang="ts">
import { reactive } from 'vue';

let message = reactive<number[]>([])

setTimeout(() => {
  let arr = [1, 2, 3, 4]
  message = arr    // message被覆盖了，失去响应性
  console.log(message);
}, 1000)
</script>

<template>
  <div>
    arr: {{ message }}
  </div>
</template>


```

上面的解决方法：

1. 使用数组方法

```js
setTimeout(() => {
  let arr = [1, 2, 3, 4]
  // message = arr
  message.push(...arr)
  console.log(message);

}, 1000)
```

2. 把数组变为对象的属性

```v
<script setup lang="ts">
import { reactive } from 'vue';

type o = {
  list: number[]
}

let message = reactive<o>({
  list: []
})

setTimeout(() => {
  let arr = [1, 2, 3, 4]
  message.list = arr
  console.log(message);

}, 1000)
</script>

<template>
  <div>
    arr: {{ message.list }}
  </div>
</template>

```

## readonly

readonly用于拷贝一份`reactive`并把它设置为只读的。如果尝试去修改它会报一个警告。

```js
import { reactive, readonly } from 'vue';

let message = reactive({
  name: 'qiuqiu'
})

let copy = readonly(message)
copy.name = 'lenmeng'    // [Vue warn] Set operation on key "name" failed: target is readonly. Proxy?{name: 'qiuqiu'}
```

## shallowReactive

对于shallowReactive包裹的对象，修改深层次的属性，**属性值会被修改，但不会马上触发视图更新**。当之后触发视图更新时（如修改了任何其他会触发视图更新的响应式数据）。

之前都误解了，以为浅层响应是永远不会更新视图，其实会，只是单纯修改它不会触发更新，只要有任何能触发视图更新的操作发生，它对应的视图也是会更新的。见这个[issue]([function中同时改变reactive和shallowReactive中的数据时，shallowReactive的值也会被响应式地更改 · Issue #5740 · vuejs/core · GitHub](https://github.com/vuejs/core/issues/5740))


