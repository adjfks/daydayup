# 深入理解Generator

ES6规范中的Generators 允许我们在函数执行过程中暂停、并在将来某一时刻恢复执行。这一特性改变了以往函数必须执行完成才返回的特点，将这一特性应用到异步代码编写中，可以有效的简化异步方法的写法，同时避免陷入回调地狱。

## Generator简要介绍

一个简单的示例：

```js
function* example() {
  yield 1;
  yield 2;
  yield 3;
}
var iter=example();
iter.next();//{value:1，done:false}
iter.next();//{value:2，done:false}
iter.next();//{value:3，done:false}
iter.next();//{value:undefined，done:true}
```

上面的example函数就是一个**生成器函数**，它和普通的函数主要有以下区别：

- 生成器函数使用`function*` 声明

- 生成器函数使用`yield`返回值

- 生成器函数是`run-pause-run`模式，普通函数是`run-to-completion`模式





## 借助Regenerator理解Generator

[【转向 Javascript 系列】深入理解 Generators | AlloyTeam](http://www.alloyteam.com/2016/02/generators-in-depth/)





## 总结

Regenerator 通过工具函数将生成器函数包装，为其添加如 next/return 等方法。同时也对返回的生成器对象进行包装，使得对 next 等方法的调用，最终进入由 switch case 组成的状态机模型中。除此之外，利用闭包技巧，保存生成器函数上下文信息。##



## 参考文章

[Generator 函数的含义与用法 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2015/04/generator.html)


