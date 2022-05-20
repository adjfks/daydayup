@[TOC](javascript中的作用域和执行上下文)

# 前言

> 本文将采用尽量简洁清晰的语言来讲清楚javascript中的作用域和执行上下文，读完本文能够学习到一下知识点：
> 
> - 作用域分为词法作用域和动态作用域，javascript属于哪一种？
> - 词法作用域也叫静态作用域，它和动态作用域有什么区别？
> - 作用域实在哪个阶段确定的？它的作用是什么？
> - 执行上下文分为哪几类？什么时候会创建执行上下文？
> - 如何管理众多的执行上下文？
> 
> <br>
> 带着这些疑问，让我们开始本文的阅读吧！

# 作用域

作用域是指程序源代码中定义变量的区域。

它规定了查找变量的规则以及当前代码对变量的访问权限。

**javascript的作用域是词法作用域，也叫静态作用域。**

<br>

# 词法作用域和动态作用域

词法作用域的英文名称是$Lexical Scope$，$Lexical$的意思就是词法。

为什么叫做**词法**作用域呢？因为该作用域规则是**在编译器进行代码编译时确定的。**

编译器在进行代码编译时主要有三个阶段：

- 词法分析（Tokenizing | Lexing）
- 语法分析生成抽象语法树（Parsing）
- 代码生成（Code Generation）

关于更多编译器原理参考[Anatomy of a Compiler](http://www.cs.man.ac.uk/~pjj/farrell/comp3.html)

💥静态作用域：在代码编译阶段或者说函数定义时确定，javascript的作用域属于这一种。

💥动态作用域：在函数调用时确定。

来看一个例子就能明白它们的区别了。

```javascript
var name = 'William'

function bar(){
    console.log(name)
}

function foo(){
    var name = 'Jane'
    bar()
}

foo()    // 打印结果为'William'
```

解释： `bar`函数执行时，发现`console.log(name)`，首先查找自己函数内部有没有`name`，发现没有，于是再根据书写位置查找上一层，发现`name`，于是就输出了`William`。

那么如果是动态作用域又会是怎样的呢？执行`bar`发现当前作用域没有`name`，于是到调用函数的上一层也就是`foo`里寻找，于是输出`Jane`。

# 执行上下文

学习javascript变量的时候，我们经常都会听到变量提升，那么变量提升发生在什么时候呢？别急，往下看。

javascript引擎在执行一段可执行代码（executable code）时是**一段一段执行**的，而不是一行一行执行。看下面例子：

```javascript
var bar = function () {
    console.log('bar1')
}

bar() // bar1

var bar = function () {
    console.log('bar2')
}

bar() // bar2
```

```javascript
function bar(){
  console.log('bar1');
}

bar() // bar2

function bar(){
  console.log('bar2');
}

bar() // bar2
```

可以看到，如果是代码是一行一行往下执行，那么第二个例子中第一个`bar()`结果应该是`bar1`，然而它却打印出了`bar2`。

那么javascript是如何把代码划分成段的呢？首先我们得清楚Javascript中的可执行代码有哪一些？

# javascript中的可执行代码

分为三类：

- 全局代码
- 函数代码
- eval代码

当执行遇到函数时，就会来划分一段代码，这里的一段具体来说就是我们所说的执行上下文，一个执行上下文的生命周期分为两个阶段：

- 创建阶段
- 执行阶段

在创建阶段会做很多的准备工作，包括变量提升，作用域链的确定，确定this指向等工作，具体的准备工作我们以后再说，这里先记住，**执行上下文是在函数调用时创建的。**

我们先弄清楚执行上下文是如何管理的。

# 执行上下文栈

对于一个源代码程序，没调用一个函数就会创建一个执行上下文，这些执行上下文统一使用一个执行上下文栈来管理，用一个例子来讲一下其运行机制：

```javascript
function foo1() {
    var name = 'William'
    console.log(name)
}

function foo2() {
    foo1()
}

function foo3() {
    foo2()
}

foo3()
```

我们使用一个数组`ContextStack`来模拟栈，执行代码时最先遇到全局上下文`globalContext`，将其入栈

```javascript
ContextStack = [
    globalContext
]
```

然后代码往下执行，遇到函数调用`foo3()`，于是创建了一个`foo3`函数的执行上下文，将其入栈

```javascript
ContextStack.push(<foo3> functionContext)

/*
ContextStack = [
    globalContext,
    <foo3> functionContext
]
*/
```

发现`foo3`还调用了`foo2`：

```javascript
ContextStack.push(<foo2> functionContext)

/*
ContextStack = [
    globalContext,
    <foo3> functionContext
    <foo2> functionContext
]
*/
```

`foo2`居然还调用了`foo1`:

```javascript
ContextStack.push(<foo1> functionContext)

/*
ContextStack = [
    globalContext,
    <foo3> functionContext
    <foo2> functionContext
    <foo1> functionContext
]
*/
```

`foo1`执行，打印`William`，执行完毕，将它的上下文出栈，其他函数紧接着执行完毕，依次出栈：

```javascript
ContextStack.pop()
ContextStack.pop()
ContextStack.pop()

/*
ContextStack = [
    globalContext
]
*/
```

整个应用程序执行完毕时`globalContext`才会出栈，否则会一直作为栈底元素。

# 总结

总结部分就来简短回答一下前言中的问题：

1️⃣作用域分为词法作用域和动态作用域，javascript属于哪一种？
2️⃣词法作用域也叫静态作用域，它和动态作用域有什么区别？
3️⃣作用域实在哪个阶段确定的？它的作用是什么？

> javascript的作用域是词法作用域，它是在代码编译阶段时根据代码位置决定的，它的作用是规定了变量查找的规则和确定当前代码对变量的访问权限。

4️⃣执行上下文分为哪几类？什么时候会创建执行上下文？如何管理众多的执行上下文？

> 执行上下文根据可执行代码的种类可以分为全局、函数、eval三类。在函数进行调用时会创建全局上下文。执行上下文栈用于管理执行上下文，当遇到函数调用时就生成一个对应的上下文并入栈，当函数执行完毕时就把对应的上下文出栈。除非整个程序执行完毕，否则全局上下文会一直待在栈底。

# 思考题

留个思考题，下面两段程序结果是什么？有什么不同吗？

试试用本文的知识使用栈模拟一下其过程！

```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();
```

```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();
```
