要使用globalProperties

在main.js中

```js
import { createApp } from 'vue'
import App from './App'
const app = createApp(App)

app.config.globalProperties.xxx = xxx
app.mount('#app')
```

组件中访问需要导入getCurrentInstance

```js
import { getCurrentInstance } from "vue"
// setup中获取组件实例 proxy
// const { proxy } = getCurrentInstance()
// proxy.$message({ text: '111' })
```

vue文档

> `getCurrentInstance` 只暴露给高阶使用场景，典型的比如在库中。强烈反对在应用的代码中使用 `getCurrentInstance`。请**不要**把它当作在组合式 API 中获取 `this` 的替代方案来使用。

> 只能在setup()或生命周期钩子中调用
