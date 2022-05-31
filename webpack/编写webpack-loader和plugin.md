# 编写webpack loader 和 plugin

## webpack打包过程

打包过程可以分为3个阶段：初始化阶段、打包阶段、输出阶段。

- 初始化配置：根据配置文件和命令行配置参数得到最终的配置对象。

- 加载插件：根据配置对象初始化compiler对象，加载所有插件，调用compiler实例的run方法执行编译。

- 确定打包入口：根据配置的entry找到入口文件，对文件中的依赖调用对应的loader进行递归转移成可用模块。

- 完成模块编译：根据AST分析出依赖关系，得到模块最终被转译后的内容。

- 输出资源：根据入口和模块的关系，组装成一个个包含多个模块的chunk，再把每个chunk转换成单独的文件传入到输出列表。

- 输出完成：在确定号输出内容之后，根据配置的路径和文件名，把内容写入到产物中。如果是non-initial-chunk，就是动态导入的模块，会使用它唯一的id命名，也可以使用模式注释命名。

## loader和plugin的作用

loader的作用根据文件的不同类型，使用对应的loader将文件转换成可读取的模块。

[plugin](https://webpack.docschina.org/concepts/plugins/#root)可以执行很多loader无法解决的工作，它可以应用在webpack打包的各个生命周期。webpack **插件**是一个具有 [`apply`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) 方法的 JavaScript 对象。

```js
compiler.hooks.someHook.tap('MyPlugin', (params) => {
  /* ... */
});
```

## 准备工作

```js
yarn init
yarn add webpack webpack-cli -D -S
```

基本配置`webpack.config.js`

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
};
```

尝试打包

```js
npx webpack --config webpack.config.js 
```

## 编写loader

[文档](https://webpack.docschina.org/contribute/writing-a-loader/#root)

loader 是导出为一个函数的 node 模块。该函数在 loader 转换资源的时候调用。给定的函数将调用 [Loader API](https://webpack.docschina.org/api/loaders/)，并通过 `this` 上下文访问。

在配置loader时需要注意调用顺序，它是从右向左调用loader的，前一个loader的输出将会作为下一个loader的输入。

比如：

- less-loader: 将.less文件编译为.css文件

- css-loader: 对@import和url()进行处理，转换为commonjs

- style-loader: 用于把css插入到DOM中，即将样式通过<style>插入到head中。

我们实现一个添加作者信息注释和一个取出console.log()的loader.

```js
module.exports = function (source) {
  const message = `
    /**
    *author: ${this.getOptions().author}
    *date: ${this.getOptions().date}
    **/
  `
  return message + source
}
```

```js
module.exports = function (source) {
  source = source.replace(new RegExp(/(console.log\()(.*)(\))/g), "");
  console.log(source);
  return source;
}
```

配置一下：

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: path.resolve(__dirname, './loader/clear-console-loader.js'),
            options: {
              author: 'William',
              data: new Date()
            }
          },
          {
            loader: path.resolve(__dirname , './loader/add-authorinfo-loader.js')
          }
        ]
      }
    ]
  }
};
```

## 编写plugin

通过编写[plugin](https://webpack.docschina.org/contribute/writing-a-plugin)我们可以在 webpack 构建流程中引入自定义的行为。

webpack 插件由以下组成：

- 一个 JavaScript 命名函数或 JavaScript 类。
- 在插件函数的 prototype 上定义一个 `apply` 方法。
- 指定一个绑定到 webpack 自身的[事件钩子](https://webpack.docschina.org/api/compiler-hooks/)。
- 处理 webpack 内部实例的特定数据。
- 功能完成后调用 webpack 提供的回调。

插件是由「具有 `apply` 方法的 prototype 对象」所实例化出来的。这个 `apply` 方法在安装插件时，会被 webpack compiler 调用一次。`apply` 方法可以接收一个 webpack compiler 对象的引用，从而可以在回调函数中访问到 compiler 对象。

通过compiler对象的hooks属性可以访问到各个生命周期钩子。

### tapAsync

当我们用 `tapAsync` 方法来绑定插件时，必须调用函数的最后一个参数 `callback` 指定的回调函数。

### tapPromise

当我们用 `tapPromise` 方法来绑定插件时，_必须_返回一个 pormise ，异步任务完成后 resolve 。

### 简单例子

```js
module.exports = class {
  constructor(options) {
    // 在new的时候可以传入一个配置对象
    this.options = Object.prototype.toString.call(options) === '[object Object]' ? options : {}
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'MyPlugin',
      (compilation, callback) => {
        console.log(compilation)
        console.log(this.options);
        callback()
      }
    )
  }
}
```

### compiler钩子

通过如下方式访问

```js
compiler.hooks.someHook.tap('MyPlugin', (params) => {
  /* ... */
});
```

列举一些钩子：

| 钩子          | 类型              | 何时调用                           | 回调参数           | 调用方式 |
| ----------- | --------------- | ------------------------------ | -------------- | ---- |
| emit        | AsyncSeriesHook | 输出 asset 到 output 目录之前执行。      | compilation    |      |
| environment | SyncHook        | 在编译器准备环境时调用，时机就在配置文件中初始化插件之后。  |                |      |
| entryOption | SyncBailHook    | 在 webpack 选项中的 entry 被处理过之后调用。 | context, entry | tap  |

### 实现一个简单plugin

我们实现一个plugin，它的功能是创建一个Index.html并把main.js的内容嵌入到script中。

```js
module.exports = class {
  constructor(options) {
    // 在new的时候可以传入一个配置对象
    this.options = Object.prototype.toString.call(options) === '[object Object]' ? options : {}
  }

  apply(compiler) {
    // compiler.hooks.entryOption.tap(
    //   'MyPlugin',
    //   (context, entry) => {
    //     console.log(context, entry)
    //   }
    // )
    compiler.hooks.emit.tapAsync(
      'MyPlugin',
      (compilation, callback) => { 
        const source = compilation.assets['main.js'].source()
        compilation.assets['index.html'] = {
          source: function () { 
            return `
            <!DOCTYPE html>
            <html lang="en">

            <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
              <script>
                ${source}
              </script>
            </head>

            <body>

            </body>

            </html>

            `
          }


        }
        callback()
      }
    )
  }
}
```

配置一下

```js
const path = require('path');
const MyPlugin = require('./plugin/my-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: path.resolve(__dirname, './loader/clear-console-loader.js'),
            options: {
              author: 'William',
              data: new Date()
            }
          },
          {
            loader: path.resolve(__dirname , './loader/add-authorinfo-loader.js')
          }
        ]
      }
    ]
  },
  plugins: [new MyPlugin({ a: 1 , b: 2})]
};

```


