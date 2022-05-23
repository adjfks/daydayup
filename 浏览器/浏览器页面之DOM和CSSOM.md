# 浏览器页面之DOM和CSSOM

### 什么是DOM

渲染引擎无法理解网络传输过来的html文件字节流，需要先将其转换为DOM。DOM 是表述 HTML 的内部数据结构，它会将 Web 页面和 JavaScript 脚本连接起来，并过滤一些不安全的内容。

### DOM树如何生成

首先注意一点：**html文件是边加载边解析的**。具体的流程是网络进程接收到响应头，通过首部字段`text/html`判断是一个html文件后，浏览器会为该文件创建一个渲染进程，网络进程与渲染进程之间建立一个共享数据的管道，将读取的数据提供给**html解析器**解析。

html解析器将html文件解析为DOM有三个步骤：

1. 通过分词器，将字节流转换为一个一个Token。Token的类型有Tag Token和Text Token。

2. 将Token解析为DOM节点。

3. 将DOM节点添加到DOM树中。

其中第2步和第三步是同步进行的，具体的过程如下：

HTML解析器会维护一个Token栈结构，主要用于计算节点之间的父子关系。第1步中生成的Token会被按顺序压入栈中。对于每一个压入的Token类型有以下几种情况：

- StartTag Token ：为该Token创建一个DOM节点并加入到DOM树中，其父节点为其在栈中的相邻节点。

- Text Token:为该Token创建一个文本节点并加入DOM树，Text Token不用入栈，其父节点为栈顶节点。

- EndTag Token: 查看栈顶是否为StartTag Token，是的话将其弹出，表示该元素解析完成。

### JavaScript会阻塞DOM解析

当HTML解析器解析到script标签时。无论是内嵌的JavaScript脚本还是引入的JavaScript文件，此时都会暂停HTML解析去执行js代码。

**预解析**

内嵌的js脚本还好，但是引入的js脚本就可能因为网络和文件大小的因素导致下载时间较长。不过浏览器对此做了优化，那就是**预解析**。当浏览器渲染进程接收到字节流后就会开启一个**预解析线程**，分析html文件中的js、css等相关文件，提前去下载它们。

为什么要这样做呢？因为js脚本可以操作DOM，它有可能去操作已经解析完的DOM。

如果我们能够确定js文件中没有DOM操作，那么我们可以将js脚本设置为异步加载，通过在<script>标签上添加`defer`或`async`来设置。

```html
<script async type="text/javascript" src='foo.js'></script>
<script defer type="text/javascript" src='foo.js'></script>
```

但是两者有差异：

- async: 脚本文件一旦加载完成，会立即执行。

- defer: 需要在 DOMContentLoaded 事件之前执行,执行的时机无法确定。

**js脚本依赖于css文件**

为什么这么说呢？因为在js中也可以去操作样式，所以就需要有CSSDOM，因此无论js脚本是否操作了样式，遇到js脚本都会先去下载css文件并解析，再执行js代码。因此css也会阻塞DOM的解析。

### CSSOM

为什么需要CSSOM？和DOM一样，渲染引擎无法理解CSS文件的内容，所以要解析成其能够理解的CSSOM，它具有2个作用：

1. 供js操作

2. 为布局树的合成提供样式信息

### 合成布局树

当DOM和CSSOM都构建好后，渲染引擎就会构造布局树。分为3步：

1. 复制DOM结构生成基本的布局树结构

2. 样式计算：为对应的DOM元素选择对应的样式信息。

3. 布局计算：计算每个元素对应的位置。

### 缩短白屏时长的策略

针对以上关于DOM、CSSOM、布局树等的分析，想要缩短首屏白屏时长可以有以下策略：

- 通过内联 JavaScript、内联 CSS 来移除这两种类型的文件下载，这样获取到 HTML 文件之后就可以直接开始渲染流程了。
- 但并不是所有的场合都适合内联，那么还可以尽量减少文件大小，比如通过 webpack 等工具移除一些不必要的注释，并压缩 JavaScript 文件。
- 还可以将一些不需要在解析 HTML 阶段使用的 JavaScript 标记上 sync 或者 defer。
- 对于大的 CSS 文件，可以通过媒体查询属性，将其拆分为多个不同用途的 CSS 文件，这样只有在特定的场景下才会加载特定的 CSS 文件。
