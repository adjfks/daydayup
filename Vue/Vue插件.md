# Vue插件

Vue插件通常用于向 Vue 添加全局级功能。它可以是一个对象（包含install()方法），也可以是一个函数。

插件能向全局添加的功能一般有以下5种：

- 方法或者 property：如：[vue-custom-element](https://github.com/karol-f/vue-custom-element)

- 资源：指令/过渡等。如：[vue-touch](https://github.com/vuejs/vue-touch)

- mixin 添加一些组件选项。(如[vue-router](https://github.com/vuejs/vue-router))

- 全局实例方法，添加到 `config.globalProperties` 上实现。

- 1. 一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 [vue-router](https://github.com/vuejs/vue-router)



## 编写插件

插件被添加到应用程序时有两种情况：

- 如果插件是一个对象，则调用`install`方法

- 如果是函数，则调用该函数

- 两种情况下都接收两个参数：
  
  - 使用`creatApp`方法创建的app对象实例
  
  - 用户传入的`options`



下面是一个插件例子，调用`$translatef`方法可以使用`options`翻译（映射）传入的键。

```javascript
// plugins/i18n.jsexport default {
  install: (app, options) => {
    app.config.globalProperties.$translate = key => {
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }

    app.provide('i18n', options)    // 通过inject[i18n]注入接收

    // 还可以使用任何app上的方法，如
    //app.directive()
    // app.mixin()
  }
}
```



## 插件编写实践 —— 自动全局注册插件目录下的所有组件

`require.context()`方法是webpack提供的一个方法，可以方便地引入模块，语法如下：

```javascript
// 1.目录 2. 是否加载子目录 3. 用于匹配的正则
require.context(directory:String, includeSubdirs:Boolean /* 可选的，默认值是 true */, filter:RegExp /* 可选的 */)
```





```javascript
// 导入插件所在目录下的所有vue组件
const importFn = require.context('./', false, /\.vue$/)
```





## 使用插件

通过`Vue.use()`即可使用插件。
