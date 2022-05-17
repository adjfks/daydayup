# call和apply的模拟实现

## call

照例给出MDN上的解释

> `call()` 方法使用一个指定的 `this` 值和单独给出的一个或多个参数来调用一个函数。

注意到两点：

- call改变了this指向

- call会使函数执行

### 实现第一步：改变this指向

首先举个例子：

```javascript
var foo = {
    value: 1
}


function bar(){
    console.log(this.value)
}


bar.call(foo)    // 1


// 结果是不是相当于下面这样
var foo = {
    value: 1，
    bar: function(){
        console.log(this.value)
    }
}
foo.bar()    // 1
```

所以我们基于上面的分析来实现，先把调用函数设为对象的属性，然后执行该函数，最后再删除该属性。

第一版代码如下：

```javascript
Function.prototype.call = function(context){
    context.fn = this
    context.fn()
    delete context.fn
}
```

### 实现第二步：处理传入参数

call方法还可以传递若干个参数，参数不定长，所以我们使用arguments来获取

```javascript
var args = []
for(var i = 1 , len = argunments.length ; i < len ; i++){
    args.push('arguments[' + i + ']')
}
// args结果为 ['arguments[1]' , 'arguments[2]' , 'arguments[3]' , ...]
// 每一项都是字符串
```

有小伙伴可能就有疑问了，为什么不直接`args.push(arguments[i])`，而是要拼接字符串呢？因为接下来我们要使用`eval`函数。

接着要把这个参数数组放到要执行的函数的参数里面去。可以使用es6的扩展运算符，但是call是一个es3的方法，所以嘛。这里我们使用`eval()`

```javascript
eval('context.fn(' + args +')')
// 这里 args 会自动调用 Array.toString() 这个方法。
```

现在可以解答上面那个问题了，`eval()`会将传入的字符串当作代码执行，如果我们上面直接`args.push(arguments[i])`，那么变为字符串后（假设传了三个参数）：

```javascript
eval('context.fn(arguments[1] , arguments[2] , arguments[3])')
```

此时呢相当于执行以下代码：

```javascript
context.fn(arguments[1] , arguments[2] , arguments[3])
```

如果直接把值放进去：(假设三个参数分别是字符串'David' , 'hello' 和 数字 1)

```javascript
context.fn(David , hello , 1)
```

可以看到如果是数字那倒是没有上面问题，但如果是字符串，呃，此时就会报`David is not defined`的错误。

第二版代码：

```javascript
// 第二版
Function.prototype.call2 = function(context) {
    context.fn = this;
    var args= [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    eval('context.fn(' + args +')');
    delete context.fn;
}
```

### 实现第三步：处理一些细节

1. this参数可以传入null，**当为 null 的时候，视为指向 window**

2. **函数是可以有返回值的！**

简单，以下是第三版代码：

```javascript
Function.prototype.call = function (context) {
    // 处理context为null情况
    context = context || window
    context.fn = this
    var args = []
    for (var i = 1; i < arguments.length; i++) {
        args.push('arguments[' + i + ']')
    }
    var result = eval('context.fn(' + args + ')')
    delete context.fn
    return result
}
/    age: 18
// }
```

## apply的模拟实现

MDN:

> **`apply()`** 方法调用一个具有给定`this`值的函数，以及以一个数组（或[类数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#working_with_array-like_objects)）的形式提供的参数。

注意以下两点：

- 改变this指向

- 调用函数

- 第二个参数为数组或类数组对象

实现思路和call差不多，直接给出代码：

```javascript
Function.prototype.apply = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
```

## 总结

- call 和 apply 都可以让函数立即执行并改变函数的this指向，区别就是apply的第二个参数是以数组形式传入。
- 实现call和apply首先要解决this指向问题，将调用函数变成context的方法，然后调用该方法，最后删除该方法即可实现。
- 对于参数的处理可以使用es6的扩展运算符，那样很方便，但是考虑到call和apply是es3的方法，所以就是用eval来替代，不过要注意eval的参数是字符串。
