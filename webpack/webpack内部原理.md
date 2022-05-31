# webpack内部原理

webpack是一个流行的前端打包工具。打包，指处理某些文件将其输出为其他文件的能力。

在webpack打包的输入输出之间，还包括有如下中间部分：

- 模块

- 入口起点

- chunk

- chunk组

- 其他中间部分

## webpack模块

在nodejs模块中有ComminJs规范，可以使用`require`等语句进行模块的导入导出，而webpack的模块不仅能使用`require`，还能使用很多其他方式来表明模块依赖关系，如：

- [ES2015 `import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 语句
- [CommonJS](http://www.commonjs.org/specs/modules/1.0/) `require()` 语句
- [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) `define` 和 `require` 语句
- css/sass/less 文件中的 [`@import` 语句](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)。
- stylesheet `url(...)` 或者 HTML `<img src=...>` 文件中的图片链接。

webpack**天生**（即无需额外配置loader）支持5种模块类型：

- CommonJS模块

- ECMAScript模块

- AMD模块

- Assets资源模块

- WebAssembly模块

而通过引入对应的loader，webpack能够处理更多其他编程语言和预处理器语法编写的模块。loader会告诉webpack如何处理非原生的模块。

## 打包

在打包过程中，模块会被合并成 chunk。 chunk 合并成 chunk 组，并形成一个通过模块互相连接的图(`ModuleGraph`)。

一个入口起点对应一个chunk组，每个chunk组包含一个chunk。

如在`webpack.config.js`中配置：

```js
module.exports = {
  entry: './index.js',
};
```

这会创建出一个名为 `main` 的 chunk 组（`main` 是入口起点的默认名称）。 此 chunk 组包含 `./index.js` 模块。随着 parser 处理 `./index.js` 内部的 import 时， 新模块就会被添加到此 chunk 中。

如果这样配置：

```js
module.exports = {
  entry: {
    home: './home.js',
    about: './about.js',
  },
};
```

这会创建出两个名为 home 和 about 的 chunk 组。 每个 chunk 组都有一个包含一个模块的 chunk：./home.js 对应 home，./about.js 对应 about

## chunk

chunk有两种形式：

- `initial(初始化)` 是入口起点的 main chunk。此 chunk 包含为入口起点指定的所有模块及其依赖项。

- `non-initial` 是可以延迟加载的块。可能会出现在使用动态导入(dynamic imports)或者 SplitChunksPlugin时。

每个 chunk 都有对应的 **asset(资源)**，即文件的打包结果。

看一个例子：`./src/index.js`

```js
import React from 'react';
import ReactDOM from 'react-dom';

import('./app.jsx').then((App) => {
  ReactDOM.render(<App />, root);
});
```

这会创建两个chunk：

- 名为main的initial chunk，包括react、react-dom、./src/index.js及除./app.jsx的所有其他依赖模块

- 为./app.jsx创建的一个non-initial chunk，这个chunk没有名称，因此使用它的唯一id来命名。不过想要给它命名也是可以的，使用魔术注释（Magic Comment）即可，具体做法是在import的括号里。

```js
import(
  /* webpackChunkName: "app" */
  './app.jsx'
).then((App) => {
  ReactDOM.render(<App />, root);
});
```

## 输出

输出文件的名称会受配置中的两个字段的影响：

- `output.filename`- 用于 `initial` chunk 文件
- `output.chunkFilename` - 用于 `non-initial` chunk 文件
