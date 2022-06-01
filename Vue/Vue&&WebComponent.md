# Vue and Web Components

## 一、告诉vue哪些是custom element

vue会优先把非原生html元素当作组件来解析，而不是当作自定义元素。需要进行配置告诉vue哪些种类的html元素是自定义元素。

在vite里配置：

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ]
}
```

## 二、告诉vue把它设置成DOM property

### .prop | .

```js
<my-element :user.prop="{ name: 'jack' }"></my-element>

<!-- shorthand equivalent -->
<my-element .user="{ name: 'jack' }"></my-element>
```

## 三、使用vue创建自定义元素

### Why?

自定义元素可以在任何框架或者不用框架使用。

### How?

- defineCustomElement()

返回一个继承了HTMLElentment 的 custom element constructor

使用`customElments.define('名称',constructor)`生命自定义元素，创建一个自定义元素时`new constructor`

```v
<my-vue-element></my-vue-element>


import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // normal Vue component options here
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement only: CSS to be injected into shadow root
  styles: [`/* inlined css */`]
})

// Register the custom element.
// After registration, all `<my-vue-element>` tags
// on the page will be upgraded.
customElements.define('my-vue-element', MyVueElement)

// You can also programmatically instantiate the element:
// (can only be done after registration)
document.body.appendChild(
  new MyVueElement({
    // initial props (optional)
  })
)
```

声明props时

```js
props: {
  selected: Boolean,
  index: Number
}
```

### slot

```html
<my-element>
  <div slot="named">hello</div>
</my-element>
```

### provide && inject

只能在自定义元素之间使用，不能在自定义元素和vue组件之间使用。

### SFC as custom element

当把SFC当作一个自定义元素时，它的`<style>`还是会在打包构建时被打包进css文件里而不是注入到shadow root.

将文件命名以`.ce.vue`结尾就可以把style注入shadow root.

```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* 内联 css */"]

// 转换为自定义元素构造器
const ExampleElement = defineCustomElement(Example)

// 注册
customElements.define('my-example', ExampleElement)
```

可以使用官方插件指明要开启该模式的文件：

* [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements)
* [vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options)


