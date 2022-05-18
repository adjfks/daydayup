# new操作符

MDN

> **`new` 运算符**创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。

**`new`** 关键字会进行如下的操作：

> 1. 创建一个空的简单JavaScript对象（即`{}`）；
> 2. 为步骤1新创建的对象添加属性`__proto__`，将该属性链接至构造函数的原型对象 ；
> 3. 将步骤1新创建的对象作为`this`的上下文 ；
> 4. 如果该函数没有返回对象，则返回`this`。

## 模拟实现

```js
function myNew(Fn) {
    // 创建一个空对象
    var obj = {}
    // 将对象的原型指向构造函数的原型对象
    obj.__proto__ = Fn.prototype
    // 得到传入的其他参数
    var args = [].slice.call(arguments, 1)
    // 执行函数得到返回结果
    var result = Fn.apply(obj, args)
    // 返回结果不是对象就返回obj
    return typeof result === 'object' ? result || obj : obj
}

function Person(name, age) {
    this.name = name
    this.age = age
}

var obj = myNew(Person, 'zs', 20)
console.log(obj)
```
