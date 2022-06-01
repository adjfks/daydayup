# 学习vue3（一）

## 一、API风格

vue组件Vue 的组件可以按两种不同的风格书写：**选项式 API** 和**组合式 API**。

选项式API：选项所定义的属性都会暴露在函数内部的 `this` 上，它会指向当前的组件实例。

组合式API：在单文件组件中，组合式 API 通常会与 `<script setup>`搭配使用。

## 二、Declarative Rendering

使用模板语法来组织html结构，使用js来表示状态，当状态改变时，对应的html结构和其中的数据也会发生相应变化。

使用setup语法糖，我们不必手动将响应式数据return，可以直接在模板中使用，使用时也不需要加上类似.value这样的东西，因为为了方便使用，vue自动对模板里的响应式数据做了处理。

mustaches（emm...文档里把双花括号叫做“胡子”）里的内容也可也是简单的js表达式

### 1. reactive()

```js
import { reactive } from 'vue'

const counter = reactive({
  count: 1
})

console.log(counter.count) // 0
counter.count++
```

**需要注意**

- reactive包裹是幂等的，也就是说无论用reactive对原始对象包裹多少次，得到的都是同一个代理。

- 代理是深层次的，代理的属性如果也是对象，那么这个属性对象也是一个代理

- reactive只作用于对象类型。

- 必须基于reactive返回的proxy进行的操作才具有响应性。把该对象的属性解构出来、赋值给普通变量或者传入函数都会失去响应性。

- 要获得浅层响应性使用`shallowReactive()`

```js
const state = reactive({ count: 0 })

// n 是一个局部变量，同 state.count
// 失去响应性连接
let n = state.count
// 不影响原始的 state
n++

// count 也和 state.count 失去了响应性连接
let { count } = state
// 不会影响原始的 state
count++

// 该函数接收一个普通数字，并且
// 将无法跟踪 state.count 的变化
callSomeFunction(state.count)
```

```js
// TS类型标注
interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 指引' })
```

### 2. ref()

- 可以用于任何值类型。

- 返回一个带.value属性的ref对象。

- TS类型示例：`const year = ref<number | string>('2022')`（不指明会自动推导）

- ref得到的对象可以响应式替换。

- ref传入参数和解构都能保持响应性。

- 在模板中的解包只适用于顶层属性。不过如果该ref是mustache的最终值也会被解包。

### 3. computed

- 类型标注示例`const a = computed<number>(() => {})`

- 返回一个计算属性ref

- 可以定义一个getter和setter，默认是只能get

- 基于依赖缓存

- 只负责计算和返回值，不要有副作用。

### 4. watch

- 监听响应式依赖的变化，对变化作出某些操作，可以是异步操作，也可以操作DOM等等，这是它与computed的区别。

- 监听源可以是ref、computedRef、getter、reactive Object或者包含多个源的数组。getter是形如`() => x.value + y.value`的函数.

- 不能`watch(obj.count , () => {})`，而是`watch(()=>obj.count , () => {})`

- 对象的监听需要注意深度监听的问题。getter得到的对象是值的监听，直接传入对象是深度监听。不过可以使用第三个参数对象`{deep: true}`指明深度监听。

- 深度监听非必要不用，因为遍历属性需要开销。

- 只有源变化才调用，第一次不调用

### 5. watchEffect

- 行为与computed类似，会自动追踪依赖，与computed的区别就是可以进行一些除计算值之外的操作。

- 使用方式`watchEffect(() => {})`

- 需要第一次调用且watch就可以使用它。

- watch只追踪第一个参数，而watchEffect追踪函数内的所有依赖。

- 不过它的缺点就是响应式依赖不明确，因为它全都追踪（我全要.jpg），watch相对来说更专注。

**注意：**

- watch和watchEffect的回调函数默认都是**在DOM更新前执行**，如果你想在回调里操作更新后的DOM，需要在参数对象中指明：

```js
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

- watcher会在组件销毁时自动销毁，因为它隶属于组件实例。但是**如果watcher是在异步回调里创建的，就不属于组件实例，且不会自动销毁！！！**

- 要手动销毁，调用创造watcher时返回的函数即可。

### 6. watchPostEffect

- `watchEffect(callback , { flush: 'post' })`的语法糖。

### 7. ref属性

- 用于obtain子组件实例或DOM元素的引用，会在它们渲染完后获取到。

- 和v-for一起使用时，应该用一个数组来接收DOM引用。`const list = ref([])`

- 获取的引用有`textContet`、`tagName`、`outerHTML`、`outerText`等属性。

- ref属性可以**动态绑定一个函数**，函数的第一个参数就是DOM引用。
  
  ```html
  <input :ref="(el) => { /* assign el to a property or ref */ }">`
  ```

- 获取子组件时
  
  - 子组件是option api，那么可以获取到子组件实例，即子组件中的this，this的所有东西都可以访问，不过尽量使用props而不是这种访问方式。
  
  - 子组件是setup语法糖形式，那么啥也得不到。除非是子组件使用宏`defineExpose({ ... })`暴露的属性。

## 三、class与style绑定

### 1. class绑定

- 绑定在组件上时，如果是单root组件，就会绑定在根root元素上。如果是多root组件，要使用`$attrs`指定。`<p :class="$attrs.class"></p>`

### 2. style绑定

- 绑定行内样式，样式的属性名可以是驼峰式写法，也可以是单引号或双引号包裹的短横线写法。

- 如果使用了需要加浏览器前缀的属性，Vue会自动加上正确的浏览器前缀。也可以提供多值：

```html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

## 四、条件渲染

### 1. v-if

- 可以配合`<template>`元素使用。

- 真正的条件渲染，会销毁和创建。

### 2. v-else-if

### 3. v-else

### 4. v-show

- 通过切换`display`属性来显示隐藏元素

- 不能配合`<template>`和`v-else`使用。

- 适合频繁切换显示隐藏时使用

## 五、List Rendering

### 1. v-for

- `v-for`中可以解构

- 除了使用`item in list`的方式，还可以使用`item of list`。

- 可以迭代对象的key、value和index，`v-for="(value , key , index) in obj"`

- 遍历对象属性时顺序是和`Object.keys()`一致。

- 可以配合`<template>`使用。

- 不建议和v-if在同一元素上使用。当一起出现时`v-if`的优先级更高（vue2中反过来）。这也意味这在v-if访问不到v-for作用域的变量。

- 可以在组件上使用，不过数据需要手动绑定传递，在组件里用props接收。

### 2. key

- 作为vue虚拟DOM算法的提示，用于比较更新节点。

-  "in-place patch" strategy，建议始终添加一个key属性，key的值期望是一个基础类型，不要是一个对象。  

- 可以单独使用，用于过渡或触发生命周期钩子。
  
  ```html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition> 
  ```

## 六、Array Change Detection

### 1. 修改原数组的方法

* `push()`
* `pop()`
* `shift()`
* `unshift()`
* `splice()`
* `sort()`：！！！
* `reverse()`：！！！

使用sort和reverse如果不想改变原数组，可以使用扩展运算符先拷贝一份。

```js
- return numbers.reverse()
+ return [...numbers].reverse()
```

### 2. 返回新数组的方法

- filter()

- concat()

- slice()

- 下面这种情况，vue会最大程度地重用DOM，而不是直接重新渲染整个列表。

```js
// `items` is a ref with array value
items.value = items.value.filter((item) => item.message.match(/Foo/))
```

## 七、Event Handling

### 1. @ | v-on

- 不传参时第一个参数自动接收the native DOM Event object

- 传参时要传the native DOM Event object需要用`$event`显式传入。

### 2. Event Modifiers

* `.stop`：阻止冒泡
* `.prevent`：阻止默认行为
* `.self`：只有当`event.target`是元素自身时才触发事件。
* `.capture`：使用捕获模式
* `.once`：只触发一次
* `.passive`：主要用于触摸事件，添加后事件处理不会阻止页面滚动，用于改善移动端性能。不要和`.prevent`一起用。
* 可以链式调用
* 注意顺序，如`@click.self.prevent`和`@click.prevent.self`的含义是不同的。

### 3. 按键修饰符

* `.enter`
* `.tab`
* `.delete` (captures both "Delete" and "Backspace" keys)
* `.esc`
* `.space`
* `.up`
* `.down`
* `.left`
* `.right`

按键按下时才触发：

* `.ctrl`
* `.alt`
* `.shift`
* `.meta`

### 4.  `.exact`

指明仅当按下指定按键时触发。

```html
<!-- 当按下 Ctrl 时，即使同时按下 Alt 或 Shift 也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 仅当按下 Ctrl 且未按任何其他键时才会触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 仅当没有按下任何系统按键时触发 -->
<button @click.exact="onClick">A</button>
```

### 5. 鼠标按键符

* `.left`
* `.right`
* `.middle`







## 响应式基础

### 1. DOM更新时机

更改状态之后，DOM并不会同步进行更新，它会缓存发生的更改，直到下一个生命周期才会进行DOM更新。这样在一个生命周期内就只会发生一次更新。

如果你需要在改变状态之后访问更新后的DOM，需要使用`nextTick()`：

```js
import { nextTick } from 'vue'

function increment() {
  state.count++
  nextTick(() => {
    // access updated DOM
  })
}
```
