# Vue渲染函数

一般在Vue中我们都是通过模板来创建html的，但是有时候模板不够灵活。

比如我们要封装一个面包屑组件。它使用起来像下面这样：

```html
<!-- 面包屑 -->
<Bread>
   <BreadItem to="/">首页</BreadItem>
   <BreadItem to="/category/1005000">电器</BreadItem>
   <BreadItem >空调</BreadItem>
</Bread>
```

我们都知道BreadItem之间可以有一些分隔符，比如`>`或`/`，但是如果我们在BreadItem组件里添加的话最后一个BreadItem就会多出一个分隔符。

这个时候就可以使用渲染函数了，因为它相比于模板更接近编译器，因此更灵活。

## Vue文档的例子

需要封装一个锚点标题的组件，像下面这样使用

```html
<anchored-heading :level="1">Hello world!</anchored-heading>
```

用模板实现

```js
const { createApp } = Vue

const app = createApp({})

app.component('anchored-heading', {
  template: `
    <h1 v-if="level === 1">
      <slot></slot>
    </h1>
    <h2 v-else-if="level === 2">
      <slot></slot>
    </h2>
    <h3 v-else-if="level === 3">
      <slot></slot>
    </h3>
    <h4 v-else-if="level === 4">
      <slot></slot>
    </h4>
    <h5 v-else-if="level === 5">
      <slot></slot>
    </h5>
    <h6 v-else-if="level === 6">
      <slot></slot>
    </h6>
  `,
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

用渲染函数实现

```js
const { createApp, h } = Vue

const app = createApp({})

app.component('anchored-heading', {
  render() {
    return h(
      'h' + this.level, // 标签名
      {}, // prop 或 attribute
      this.$slots.default() // 包含其子节点的数组
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

可以看到：

1. 渲染函数的导入`const { h } = Vue`，那么我们在模板里使用时导入则`import { h } from Vue`

2. `app.component('组件名称',组件实例对象或.vue实例)`

可以这样使用

```js
import BreadItem from './BreadItem.vue'
app.component(BreadItem.name , BreadItem)
```

3. h()函数的使用

也可以在.vue文件的script中的render节点中使用

```js
<script>
import { h } from 'vue'
export default {
    name: 'BreadItem',
    render(){
        return h('div' , {} , 内容)
    }
}
</script>
```

## h()函数

h()函数是Vue提供的一个用来创建虚拟节点的函数，它返回的就是一个虚拟节点(VNode)，它有三个参数：

1. 必需的：{String | Object | Function} tag
   一个 HTML 标签名、一个组件、一个异步组件、或一个函数式组件。如`div`

2. 可选的:{Object} props
   与 attribute、prop 和事件相对应的对象。这会在模板中用到。

3. {String | Array | Object} children
   子 VNodes, 使用 `h()` 构建,或使用字符串获取 "文本 VNode" 或者有插槽的对象。如
   
   ```js
   [
    'Some text comes first.',
    h('h1', 'A headline'),
    h(MyComponent, {
      someProp: 'foobar'
    })
   ]
   ```

## Vue文档中实现锚点组件

```js
const { createApp, h } = Vue

const app = createApp({})

/** 递归地从子节点获取文本 */
function getChildrenTextContent(children) {
  return children
    .map(node => {
      // 1. 子节点为字符串就直接返回
      // 2. 子节点为数组就继续递归
      // 3. 其他情况返回空字符串
      return typeof node.children === 'string'
        ? node.children
        : Array.isArray(node.children)
        ? getChildrenTextContent(node.children)
        : ''
    })
    .join('')    // 所有字符串拼接在一起后返回
}

app.component('anchored-heading', {
  render() {
    // 从 children 的文本内容中创建短横线分隔 (kebab-case) id。
    const headingId = getChildrenTextContent(this.$slots.default())
      .toLowerCase()
      .replace(/\W+/g, '-') // 用短横线替换非单词字符
      .replace(/(^-|-$)/g, '') // 删除前后短横线

    return h('h' + this.level, [
      h(
          // 创建一个a标签
        'a',
        // a 标签的name属性和href属性
        {
          name: headingId,
          href: '#' + headingId
        },
        // a标签的子节点为当前组件实例默认插槽里的内容,除了$slots还有很多实例属性API，如
        // $data 组件实例的数据对象
        // $props 组件实例的props对象
        // $el 当前组件实例的根节点，由于Vue3中template中可以使用片段，所以这种情况$el是一个占位元素，推荐使用ref来代替$el
        // $parent 当前组件的父实例
        // $root 当前组件树的根组件实例，比如我们经常用的App.vue
        // $slots 当前组件插槽中接收到的内容,例如名为foo的插槽内容通过this.$slots.foo()访问
        // $refs 持有注册过ref属性的元素和组件实例
        // $attrs 包含了父作用域中不作为组件 props 或自定义事件的 attribute 绑定和事件。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定，并且可以通过 v-bind="$attrs" 传入内部组件——这在创建高阶的组件时会非常有用。
        this.$slots.default()
      )
    ])
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

## 实现面包屑组件

bread-item.vue模板中删去分隔符

```html
<template>
  <div class="xtx-bread-item">
    <Router-link v-if="to" :to="to"><v-slot /></Router-link>
    <span v-else><v-slot /></span>
  </div>
</template>
```

bread.vue中不用template，用render()

```js
<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  render() {
    // 获取默认插槽中的内容,得到的是一个数组
    const items = this.$slots.default()
    // 定义一个数组，用来作为h函数的第三个参数，即包含当前Bread组件所有子节点的数组
    const children = []
    // 遍历数组
    items.forEach((item, idx) => {
      // 将每一项加入数组中
      children.push(item)
      // 当前项不是最后一项就在它后面加一个分隔符，分隔符使用h函数创建
      idx !== items.length && children.push(h('i', { class: 'iconfont icon-angle-right' }))
    })
    // render函数返回当前组件渲染内容
    return h('div', { class: 'xtx-bread' }, children)
  },
  setup() {}
}
</script>
```
