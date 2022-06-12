# Vue3各种API——结合typescript

## 1. defineComponent定义组件

`defineComponent`类型声明：

`runtime-core.d.ts`

```ts
export declare function defineComponent<
    // props 只读的，props对象必须是只读类型才会触发类型声明
    PropsOptions extends Readonly<ComponentPropsOptions>, 
    // 在setup()中返回的内容可以通过this访问，RawBindings就是绑定后的this类型声明
    RawBindings, 
    D, 
    // computed
    C extends ComputedOptions = {}, 
    M extends MethodOptions = {}, 
    Mixin extends ComponentOptionsMixin = ComponentOptionsMixin, 
    Extends extends ComponentOptionsMixin = ComponentOptionsMixin, 
    E extends EmitsOptions = Record<string, any>, 
    EE extends string = string
>(
options: ComponentOptionsWithObjectProps<PropsOptions, RawBindings, D, C, M, Mixin, Extends, E, EE>): DefineComponent<PropsOptions, RawBindings, D, C, M, Mixin, Extends, E, EE>;
```

声明props，使用`PropType`定义类型    

```ts
import { defineComponent, PropType } from 'vue'

interface Profile {
  username: string
  age: number
}
export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String as PropType<string>,
    },
    profile: {
      type: Object as PropType<Profile>,
      required: true,
    },
  },
})
```

将props对象抽离出来

```ts
import { defineComponent, PropType } from 'vue'

const obj = {
  msg: {
    type: String as PropType<string>,
  },
  age: {
    type: Number,
    required: true,    // 设置required：true，那么age的类型只能为number，不可能为undefined，但
  },
}

export default defineComponent({
  name: 'HelloWorld',
  props: obj,

  mounted() {
    this.age    // 此时类型为number或undefined,required没有生效？
  },
})
```

原因就是最开始`defineComponent`中关于`PropsOptions`是只读的，因此必须将props对象声明为只读类型，`required: true`才会被视作是只读的，而不是视作一个`boolean`，但抽离出去之后就不是只读的了，因此需要添加声明：

```ts
const obj = {
  msg: {
    type: String as PropType<string>,
  },
  age: {
    type: Number,
    required: true,    // 设置required：true，那么age的类型只能为number，不可能为undefined，但
  },
} as const
```

加上`as const`后age就是`number`了。

## 2. h函数详解

`.vue`文件的作用其实是用来降低入门门槛的，因为在里面可以写`html js css`，但事实上vue文件是不能直接运行在浏览器中的，必须经过compiler等的编译，最终还是会编译成`js`，通过`js`去渲染视图。而`template`中写的对于我们来说好像是`html`，但是对于vue来说它们只是一些字符串，经过编译以后会生成一个`h()`函数的调用，h函数会去生成对应的virtual DOM最终渲染视图。所以写`template`中的`html`其实就是在写h函数。

下面以`App.vue`为例，用h函数的形式复现`App.vue`的结构。

首先来看看`App.vue`的`template`

```html
<div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" :age="10" />
  </div>
```

`main.ts`

```ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

```

### 编写h函数

```ts
import { createApp, h } from 'vue'
// import App from './App.vue'
import HelloWorldVue from './components/HelloWorld.vue'

// vue文件中的路径会通过url-loader、file-loader、webpack等的编译转换，所以在h函数中不能直接写路径，而是要导入。
// 由于使用import 会触发typescript类型校验，所以使用require，但是又会触发eslint，所以用注释的方式禁用下面这行的校验
const img = require('./assets/logo.png') // eslint-disable-line

const App = h('div', { id: 'app' }, [
  h('img', { alt: 'Vue logo', src: img }),
  h(HelloWorldVue, { msg: 'Welcome to Your Vue.js + TypeScript App', age: 10 }),
])

createApp(App).mount('#app')
```

ok，除了样式以外，现在通过h函数渲染出来的内容和`App.vue`渲染出来的内容就是一样的了。

可以看到，一个`h`函数第一个参数可以接收字符串（元素html标签）或一个组件实例如`HelloWorldVue`，第二个参数和第三个参数可选，第二个参数传入对应的属性，第三个参数传入子节点内容。

### h函数源码

`runtime-core/h.ts`

```ts
// Actual implementation
export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  const l = arguments.length    // 参数长度
  if (l === 2) { 
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {    // 第二个参数是对象且不是数组
      // single vnode without props
      if (isVNode(propsOrChildren)) {    // 如果第二个参数是一个VNode，说明第二个参数传入的是子节点，调用createVNode
        return createVNode(type, null, [propsOrChildren])
      }
      // props without children
      return createVNode(type, propsOrChildren)
    } else {
      // omit props
      return createVNode(type, null, propsOrChildren)
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    } else if (l === 3 && isVNode(children)) {
      children = [children]
    }
    return createVNode(type, propsOrChildren, children)
  }
}
```

可以看到`h`函数其实就是对`createVNode`函数的一层包装，通过h函数我们可以写出更松散的写法，可以传一个参数，两个参数，三个参数，第二个参数可以传属性也可也传子节点内容。

## 3. setup的返回值

setup函数的返回值可以有两种形式：

- 一个对象

- 一个函数（该函数返回一个h函数）

返回对象的写法我们都很熟悉，就是把各种变量和方法暴露出来，这样就可以在模板或`this`上使用。

返回函数的写法：

```ts
import { defineComponent, h, ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
const img = require('./assets/logo.png') // eslint-disable-line

export default defineComponent({
  name: 'App',
  setup() {
    const num = ref(1)
    setInterval(() => {
      num.value += 1
    }, 1000)

    return () => {
      return h('div', { id: 'app' }, [
        h('img', { alt: 'Vue Logo', src: img }),
        h(HelloWorld, {
          msg: 'Welcome to Your Vue.js + TypeScript App by h',
          age: 10,
        }),
        h('h3', num.value),
      ])
    }
  },
})
```

此时页面依然正常渲染，且`template`里的内容被忽略了，而是渲染了返回的h函数的内容，但文件里的样式也保留了。num的值每过1秒加一。

需要注意的是：

**setup函数只会执行一次，而返回的函数会在每次数据变化时都调用**。来看一个例子：

```ts
export default defineComponent({
  name: 'App',
  setup() {
    const num = ref(1)
    setInterval(() => {
      num.value += 1
    }, 1000)

    const numValue = num.value    // 把num.value取出来

    return () => {
      return h('div', { id: 'app' }, [
        h('img', { alt: 'Vue Logo', src: img }),
        h(HelloWorld, {
          msg: 'Welcome to Your Vue.js + TypeScript App by h',
          age: 10,
        }),
        h('h3', numValue),    // 渲染numValue，但是页面上始终为1
      ])
    }
  },
})
```

结果是页面上始终为1而不会每隔一秒加一，因为setup只执行一次，`const numValue = num.value`中numValue被赋值一次之后就再也不变了。解决方法是把`numValue`放到返回的函数里就可以了。

```ts
return () => {
      const numValue = num.value      // 放到函数里，此时就每隔一秒加一了。
      return h('div', { id: 'app' }, [
        h('img', { alt: 'Vue Logo', src: img }),
        h(HelloWorld, {
          msg: 'Welcome to Your Vue.js + TypeScript App by h',
          age: 10,
        }),
        h('h3', numValue),
      ])
    }
```

其实可以发现，返回的这个函数就是一个**闭包**的应用，它引用了setup里的变量。

## 4. 使用JSX开发组件

实时查看JSX编译成h函数结果[jsx playground]([Vue JSX Explorer](https://vue-jsx-explorer.netlify.app/#const%20App%20%3D%20()%20%3D%3E%20%3Cdiv%3EHello%20World%3Ch2%3E123%3C%2Fh2%3E%3C%2Fdiv%3E))

首先需要安装JSX的babel插件

```js
yarn add @vue/babel-plugin-jsx -D
```

在babel配置中：`babel.config.js`

```ts
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: ['@vue/babel-plugin-jsx'],
}
```

写一个简单的JSX，同样是在setup中返回一个函数，但是该函数返回的是jsx片段。

`App.tsx`

```tsx
import { defineComponent, h, ref } from 'vue'
import HelloWorld from './HelloWorld.vue'
const img = require('../assets/logo.png') // eslint-disable-line

export default defineComponent({
  name: 'App',
  setup() {
    const num = ref(1)
    return () => {
      return <h1>hello jsx</h1>
    }
  },
})

```

使用JSX的方式进行开发有许多好处：

- 首先，在jsx中可以使用模板语法中的指令，jsx对模板的功能是没有降级的，模板的功能都支持使用。

- 可以获得编辑器的错误提示等信息，比如有一个组件有一个必传的props，当你忘记传递时编译就会错误并且编辑器会有提示。

- 可以方便地进行函数抽离，逻辑的复用，可以将jsx片段抽离出来，封装成函数返回。



看看编译成什么：

```ts
const App = () => <div>Hello World<h2>123</h2></div>
```

编译结果

```ts

```
