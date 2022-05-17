# bind的模拟实现

## bind

照例给出MDN上的解释

> `bind()` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

从这段话我们知道bind有两个特点：

- 返回一个函数

- 可以传入参数

## 返回函数的模拟实现

this的指向使用 call 或者 apply 实现，下面写出第一版代码：

```js
Function.prototype.bind1 = function(context){
    var self = this
    return function(){
        // 这里不仅仅要调用，还要return
        return self.call(context)
    }
}
```

之所以要return是考虑到函数有返回值的情况

## 传参的模拟实现

看看下面这个例子，bind的时候可以传参，调用bind返回的函数也可以传参。

```js
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);

}

var bindFoo = bar.bind(foo, 'daisy');
bindFoo('18');
// 1
// daisy
// 18
```

使用arguments实现

```js
Function.prototype.bind2 = function(context){
    var self = this
    // 获取bind2函数从第二个参数到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1);
    return function(){
        // 这个时候的arguments是指bind返回的函数传入的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        // 这里不仅仅要调用，还要return
        return self.call(context,args.concat(bindAfgs)
    }
}
```





## 构造函数效果的模拟实现

> 绑定函数也可以使用 [`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 运算符构造，它会表现为目标函数已经被构建完毕了似的。提供的 `this` 值会被忽略，但前置参数仍会提供给模拟函数。

也就是说当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的其他参数依然生效。

```javascript
var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}

bar.prototype.friend = 'kevin';

var bindFoo = bar.bind(foo, 'daisy');

var obj = new bindFoo('18');
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin
```

注意：尽管在全局和 foo 中都声明了 value 值，最后依然返回了 undefind，说明绑定的 this 失效了，如果大家了解 new 的模拟实现，就会知道这个时候的 this 已经指向了 obj。s

第三版代码

```javascript
Function.prototype.bind3 = function(context){
    var self = this
    // 获取bind2函数从第二个参数到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1);

    var fBound = function(){
        // 这个时候的arguments是指bind返回的函数传入的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        // 需要判断要this要绑定的对象，可能是new得到的对象实例，也可能是传入的context
        return self.call(this instanceof fBound ? this : context ,args.concat(bindAfgs)
    }
    
    // 将返回函数的prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
    fBound.prototype = this.prototype
}
```



## 构造函数效果的优化实现

但是在这个写法中，我们直接将 fBound.prototype = this.prototype，我们直接修改 fBound.prototype 的时候，也会直接修改绑定函数的 prototype。这个时候，我们可以通过一个空函数来进行中转：

```js
// 第四版
Function.prototype.bind4 = function (context) {

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}
```



## 解决一些细节问题

1. 调用bind的不是函数，报错！

```javascript
if (typeof this !== "function") {
  throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
}
```







## 最终代码

```javascript
Function.prototype.bind2 = function (context) {

    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}
```





## 总结

实现bind的步骤主要有以下几步：

- 返回一个新函数。

- 。使用apply的第一个参数改变this的指向，此时要判断返回的这个函数的this是不是自生的实例对象，如果是，那么this就指向this,不是就指向传进来的context。

- 使用apply的第二个参数接收传入的参数，包括外层参数和内层参数。

- 借用空对象使新函数的prototype间接指向调用函数的prototype。

- 调用者不是函数要报错。
