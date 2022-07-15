# 跟着antfu做一个time-zone

## 初始化

```shell
npm create vue@3


// 仅选择typescript配置


git init 
pnpm install
```

整理一下目录结构：

- 删除README

- 移除`tsconfig.config.json`

- src文件夹只留下App.vue和main.ts

清理一下tsconfig.json

```ts
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": [
        "./src/*"
      ]
    }
  },
}
```

先提交一下：`chore: init`

`App.vue`

```v
<script setup lang="ts">
</script>

<template>
  <div>Hello</div>
</template>

<style>
html {
  background: #222;
  color: white;
  color-scheme: dark;    // 该属性会让操作系统对界面的配色方案进行调整 normal | light | dark | light dark
}
</style>
```

再次提交`chore: clean up`

清理vite.config.ts的一下内容

```ts
 resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
```

添加插件

安装`pnpm install unplugin-vue-components -D`

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'    // unplugin-vue-components中有像webpack、vite、rollup等的包，我们用的是vite所以导入vite
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    Components()    // Components是一个函数直接调用即可
  ],
})


```
