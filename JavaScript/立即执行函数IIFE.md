# 立即执行函数IIFE

**Immediately-Invoked Function Expression**，是立即调用的函数表达式

一般我们调用一个函数都是在函数的引用变量或者其名称后面加上一个小括号，例如`foo()`，但是像下面这样写却会报错。

```js
function(){ /* code */}()    
// Uncaught SyntaxError: Function statements require a function name
```

错误的原因是因为js引擎把这当成一个函数声明，而不是一个表达式。而函数声明需要一个函数名，所以报错。于是像下面这样写却是对的：

```js
var foo = function(){console.log(1)}()
// 1
```

## 函数 圆括号 错误

那么给函数声明表达式一个函数名又会怎样呢？答案是仍然会报错。

```js
function foo(){ /* code */ }();
// Uncaught SyntaxError: Unexpected token ')'
```

这次错误的原因和上面完全不同，此时函数声明语句和圆括号是完全分开的，函数声明语句没有问题，但是圆括号内需要又内容。比如你打开浏览器控制台输入`()`，也会报相同的错误。

```js
//现在，你把一个表达式放在圆括号里，没有抛出错误...,但是函数也并没有执行，因为：

function foo(){/* code */}(1)

//它等同于如下，一个函数声明跟着一个完全没有关系的表达式:

function foo(){/* code */}
(1);
```

## 立即执行函数表达式IIFE

解决上述错误最常见的方式就是给函数声明加一个圆括号，它和直接放在函数声明表达式后面的括号不同：

- 圆括号包裹`function`会将其视为一个函数表达式。

- 在函数声明后面直接加上圆括号则会被当成函数声明。

```js
//这两种模式都可以被用来立即调用一个函数表达式，利用函数的执行来创造私有变量

(function(){/* code */}());//Crockford recommends this one，括号内的表达式代表函数立即调用表达式
(function(){/* code */})();//But this one works just as well，括号内的表达式代表函数表达式
```

## 表达式

注意，只要解析器能够判断圆括号前面的是一个表达式，那么就可以正常执行，看下面代码。

```js
var i = function(){return 10;}();    // i被赋值为10
true && function(){/*code*/}();
0,function(){}();
```

其实上面的赋值操作符，二元逻辑运算符，逗号操作符在我的关于确定this指向的文章里也有提到，圆括号左边都属于文章中说到的`MemberExpression`

## 一些骚操作

如果你并不关心返回值，或者让你的代码尽可能的易读，你可以通过在你的函数前面带上一个一元操作符来执行函数。

```js
!function(){/* code */}();    // 返回true
~function(){/* code */}();    // 返回-1 因为按位非对于undefined结果
-function(){/* code */}();      // NaN
+function(){/* code */}();      // NaN
```

当然，使用new操作符也能够执行函数

```js
new function(){ /* code */ }
new function(){ /* code */ }()
```

## 保存闭包状态

利用立即调用的函数表达式可以保存闭包状态

```js
// 它的运行原理可能并不像你想的那样，因为`i`的值从来没有被锁定。
// 相反的，每个链接，当被点击时（循环已经被很好的执行完毕），因此会弹出所有元素的总数，
// 因为这是 `i` 此时的真实值。

var elems = document.getElementsByTagName('a');
for(var i = 0;i < elems.length; i++ ) {
    elems[i].addEventListener('click',function(e){
        e.preventDefault();
        alert('I am link #' + i)
        },false);
}

// 而像下面这样改写，便可以了，因为在IIFE里，`i`值被锁定在了`lockedInIndex`里。
// 在循环结束执行时，尽管`i`值的数值是所有元素的总和，但每一次函数表达式被调用时，
// IIFE 里的 `lockedInIndex` 值都是`i`传给它的值,所以当链接被点击时，正确的值被弹出。

var elems = document.getElementsByTagName('a');
for(var i = 0;i < elems.length;i++) {
    (function(lockedInIndex){
        elems[i].addEventListener('click',function(e){
            e.preventDefault();
            alert('I am link #' + lockedInIndex);
            },false)
    })(i);
}

//你同样可以像下面这样使用IIFE，仅仅只用括号包括点击处理函数，并不包含整个`addEventListener`。
//无论用哪种方式，这两个例子都可以用IIFE将值锁定，不过我发现前面一个例子更可读

var elems = document.getElementsByTagName( 'a' );

for ( var i = 0; i < elems.length; i++ ) {
    elems[ i ].addEventListener( 'click', (function( lockedInIndex ){
        return function(e){
            e.preventDefault();
            alert( 'I am link #' + lockedInIndex );
        };
        })( i ),false);
    }
```

## 使用模块模式避免全局变量污染

```js
var counter = (function(){
    var i = 0;
    return {
        get: function(){
            return i;
        },
        set: function(val){
            i = val;
        },
        increment: function(){
            return ++i;
        }
    }
    }());
    counter.get();//0
    counter.set(3);
    counter.increment();//4
    counter.increment();//5

    conuter.i;//undefined (`i` is not a property of the returned object)
    i;//ReferenceError: i is not defined (it only exists inside the closure)
```

## 总结

- IIFE就是立即调用的函数表达式。

- 可以像下面这样调用它
  
  - `(function(){})()`
  
  - `(function(){}())`

- 或者是像下面这样，将圆括号左侧变为一个表达式，也可以调用它：
  
  - `var i = function(){}()`
  
  - `!function(){}()`
  
  - `true && function(){}()`

- 立即执行函数的应用：
  
  - 可以保存闭包状态
  
  - 使用模块化的写法避免全局变量的污染


