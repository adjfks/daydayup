# Vue2与Vue3的区别

Vue3相比于Vue2出现了很多的新特性,也出现了很多与Vue2不兼容的破坏性更改，但主要的一些api还是可以在两个版本中共享，大部分Vue2的功能还是可以在Vue3中使用。

总而言之，Vue3提供了更小的打包产物体积，更好的性能，更大的可扩展性，更好的TypeScript和IDE支持。

一般而言都建议使用Vue3，除非你需要支持IE11，因为Vue3利用了现代js特性。

## 一、更小的打包产物体积

### 1. 全局api的treeshaking

**Vue3通过命名导出尽可能多地公开api，使得能够在运行时进行api的treeshaking。**

它的目的使最小化打包产物体积同时又不影响其功能。如何做到这一点呢？需要依赖于**ES模块的静态分析**。借助ES模块静态分析，我们可以将Vue应用未用到的api进行移除从而减小产物体积。

同时通过全局api的方式也可以增加一些可选功能而不用担心未使用时对产物体积的影响。

在Vue2.x中，全局API全部挂载在默认导出的Vue对象上

```js
import Vue from 'vue'

Vue.nextTick(() => {})

const obj = Vue.observable({})
```

在Vue3.x中只能通过命名导入的方式使用

```js
import Vue, { nextTick, observable } from 'vue'

Vue.nextTick // undefined

nextTick(() => {})

const obj = observable({})
```

除了全局api以外，一些内置的组件和辅助函数也可以使用命名导入，这使得编译器输出的代码中只会导入使用的功能。举个例子：

```v
<transition>
  <div v-show="ok">hello</div>
</transition>
```

上面的模板会被编译成（简化）：

```v
import { h, Transition, applyDirectives, vShow } from 'vue'

export function render() {
  return h(Transition, [
    applyDirectives(h('div', 'hello'), this, [vShow, this.ok])
  ])
}
```

唯一的弊端就是现在我们再也无法直接默认导入Vue对象并使用它上面的全局api。

在插件中使用全局api的变化：

以前：install接收Vue对象作为参数

```js
const plugin = {
  install: Vue => {
    Vue.nextTick(() => {
      // ...
    })
  }
}
```

现在：install接收app实例作为参数

```js
import { nextTick } from 'vue'

const plugin = {
  install: app => {
    nextTick(() => {
      // ...
    })
  }
}
```

所以现在写插件的时候我们需要将Vue排除在外，仅导入我们需要的api。


