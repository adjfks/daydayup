# taro学习

## 创建taro项目

使用taro-cli创建

```js
taro init 项目名称
```

之后会有一些列选项，如框架（支持vue/react），组件库（nutui等）,css预编译（less/scss等）。

我这里使用了vue3 + nutui + less + typescript的组合。

## 入口组件

每一个 Taro 项目都有一个入口组件和一个入口配置，我们可以在入口组件中设置全局状态/全局生命周期。

入口文件其实就是一个ts文件，在`src/app.ts`，它有一个对应的配置文件`src/app.config.ts`，它也是全局配置文件。

我们可以在全局配置文件中设置页面组件的路径、全局窗口、路由等信息。

```ts
export default {
  pages: [
    'pages/index/index'
  ]
}
```

编译时taro会把这里导出的对象序列化为json文件。

## 页面组件

页面组件是每一项路由将会渲染的页面，Taro 的页面默认放在 `src/pages` 中，每一个 Taro 项目至少有一个页面组件。

上面的全局配置文件`src/app.config.ts`中的pages数组就对应了所有的页面组件。

对于vue一个页面组件就是一个`.vue`文件。如

```vue
<template>
  <view>
    {{ msg }}
  </view>
</template>

<script>

export default {
  data() {
    return {
      msg: 'Hello World!'
    };
  },
  onReady () {
    console.log('onReady')
  }
};
</script>
```

在组件里我们可以使用vue的生命周期钩子。Taro 在运行时将大部分小程序规范页面生命周期注入到了页面组件中，所以也可以使用小程序的页面生命周期钩子。

每一个页面组件都会有一个对应`xxx.config.ts`的配置文件，可以配置页面的导航栏、背景颜色等。

```ts
export default {
  navigationBarTitleText: 'xxx'
}
```

### view组件

来源于 `@tarojs/components` 的跨平台组件。相对于我们熟悉的 `div`、`span` 元素而言，在 Taro 中我们要全部使用这样的跨平台组件进行开发。[taro跨平台组件库文档](https://taro-docs.jd.com/taro/docs/components-desc/)

不过，通过安装插件`@tarojs/plugin-html`，我们也可以使用html标签来进行开发。

一些[注意点](https://taro-docs.jd.com/taro/docs/use-h5)：

- `<span>` 默认表现为块级样式

- 小程序中不支持部分css选择器如通配符(*)、媒体查询、属性选择器。

- 不支持rem

- 在小程序中，获取元素尺寸的 API 是**异步**的

## 路由

taro路由使用十分简单，首先需要在全局配置好页面组件，在`app.config.ts`例如：

```ts
export default {
  pages: [
    'pages/index/index',
    'pages/thread_detail/thread_detail'
  ]
}
```

在`.vue`文件里

```v
import Taro from '@tarojs/taro'
Taro.navigateTo({
    url: '/pages/thread_detail/thread_detail'
})
```

### 路由跳转接口

```js
Taro.navigateTo({
    url: '', // 必填
    compelete: (res) => {} ,   // 接口调用结束的回调
    eventes:   {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function(data) {
              console.log(data)
        },
        someEvent: function(data) {
              console.log(data)
        }
        ...
      }, 
    fail: (res) => {},     // 失败回调
    success: (res) => {}    // 成功的回调
})
```

## tabbar

`tabBar` 是 Taro 内置的导航栏，可以在 `app.config.js` 配置，配置完成之后处于的 `tabBar` 位置的页面会显示一个导航栏。最终我们的 `app.config.js` 会是这样：

```js
export default {
  pages: [
    'pages/index/index',
    'pages/nodes/nodes',
    'pages/hot/hot',
    'pages/node_detail/node_detail',
    'pages/thread_detail/thread_detail'
  ],
  tabBar: {
    list: [{
      'iconPath': 'resource/latest.png',
      'selectedIconPath': 'resource/lastest_on.png',
      pagePath: 'pages/index/index',
      text: '最新'
    }, {
      'iconPath': 'resource/hotest.png',
      'selectedIconPath': 'resource/hotest_on.png',
      pagePath: 'pages/hot/hot',
      text: '热门'
    }, {
      'iconPath': 'resource/node.png',
      'selectedIconPath': 'resource/node_on.png',
      pagePath: 'pages/nodes/nodes',
      text: '节点'
    }],
    'color': '#000',
    'selectedColor': '#56abe4',
    'backgroundColor': '#fff',
    'borderStyle': 'white'
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'V2EX',
    navigationBarTextStyle: 'black'
  }
}
```

## 性能优化

### 虚拟列表组件

当列表数据量很大时，我们可以只渲染可视区内的数据，这样可以避免不必要的性能开销。

taro提供的`ThreadList`组件可以帮助我们轻松做到这一点。[文档](https://taro-docs.jd.com/taro/docs/virtual-list/#vue)

```js
// app.ts
// 在入口文件新增使用插件
import VirtualList from '@tarojs/components/virtual-list'
Vue.use(VirtualList)
```

组件中使用

```v
<template>
    <virtual-list></virtual-list>
</template>
```

该组件的5个属性是必填项

```v
<template>
  <virtual-list
    wclass="List"
    :height="500"
    :item-data="list"
    :item-count="list.length"
    :item-size="100"
    :item="Row"    // item指定列表的每一项，是一个vue文件
    width="100%"
  />
</template>

<script>
import Row from './row.vue'

function buildData (offset = 0) {
  return Array(100).fill(0).map((_, i) => i + offset)
}

export default {
  data() {
    return {
      Row,
      list: buildData(0)
    }
  },
}
</script>
```
