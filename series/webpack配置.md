### 1. externals

`string` `object` `function` `RegExp` `[string, object, function, RegExp]`

**防止**将某些 `import` 的包(package)**打包**到 bundle 中，而是在运行时(runtime)再去从外部获取这些*扩展依赖(external dependencies)*。

如，从 CDN 引入 jQuery，而不是把它打包：

在webpack.config.js中

```js
module.exports = {
  //...
  externals: {
    jquery: 'jQuery',
  },
};
```

在vue.config.js

```js
moudule.exports = definConfig({
// 会使用webpack-merge将这里面的选项回合进webpack的配置,
    configureWebpack: {    
      externals: {
        qc: 'QC'
      }
    }
})
```


