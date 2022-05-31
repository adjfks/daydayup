# compiler

Webpack 提供了 Node.js API，可以在 Node.js 运行时下直接使用。主要用于自定义构建或开发流程。

此时所有的报告和错误处理都必须自行实现，webpack 仅仅负责**编译**的部分。

使用时安装webpack后直接导入

```js
import webpack from 'webpack';    // 导入得到的是一个函数
```

## webpack()函数

### 2个参数

- 配置对象 | 包含多个配置对象的数组（这将创建多个compiler实例，并在所有实例编译完执行回调）

- 回调函数

```js
webpack({
  // [配置对象](/configuration/)
}, (err, stats) => { // [Stats Object](#stats-object)
  if (err || stats.hasErrors()) {
    // [在这里处理错误](#error-handling)
  }
  // 处理完成
});

// 传入配置数组，同时执行多个配置对象。
webpack([
  { entry: './index1.js', output: { filename: 'bundle1.js' } },
  { entry: './index2.js', output: { filename: 'bundle2.js' } }
], (err, stats) => { // [Stats Object](#stats-object)
  process.stdout.write(stats.toString() + '\n');
})
```

`err`对象 **不包含** 编译错误，必须使用 `stats.hasErrors()` 单独处理。

`err` 对象只包含 webpack 相关的问题，例如配置错误等。

## compiler实例

如果你不向 `webpack` 传入可执行的回调函数， 它会返回一个 webpack `Compiler` 实例。

`Compiler` 基本上只是执行最低限度的功能，以维持生命周期运行的功能。 **它将所有的加载、打包和写入工作， 都委托到注册过的插件上。**

### 2个方法

都是用来启动编译的方法，不同点是watch检测到文件变更会重新编译，且返回一个watching实例。

- `.run(callback)`

- `.watch(watchOptions, handler)`

使用 `run` 方法启动所有编译工作。 完成之后，执行传入的的 `callback` 函数。 最终记录下来的概括信息（stats）和错误（errors），都应在这个 callback 函数中获取。

```js
const webpack = require('webpack');

const compiler = webpack({
  // [配置对象](/configuration/)
});

compiler.run((err, stats) => { // [Stats Object](#stats-object)
// ...
  // 关闭compiler，这样其他低优先级的工作才有机会执行
  compiler.close((closeErr) => {
    // ...
  });
});


const watching = compiler.watch({
  // [watchOptions](/configuration/watch/#watchoptions) 示例
  aggregateTimeout: 300,
  poll: undefined
}, (err, stats) => { // [Stats Object](#stats-object)
  // 这里打印 watch/build 结果...
  console.log(stats);
});

watching.close((closeErr) => {
  console.log('Watching Ended.');
});
```

### 1个属性

- .hooks

用于将一个插件注册 到 `Compiler` 的生命周期中的所有钩子事件上。

 
