# instanceof和typeof的实现原理

## typeof实现原理

typeof是一个操作符也叫运算符，返回一个字符串，表示未经计算的操作数的类型。

typeof可能返回的值如下：

| 类型                                                                                                    | 结果                                                                                                                 |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [Undefined](https://developer.mozilla.org/zh-CN/docs/Glossary/undefined)                              | `"undefined"`                                                                                                      |
| [Null](https://developer.mozilla.org/zh-CN/docs/Glossary/Null)                                        | `"object"` (见[下文](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof#typeof_null)) |
| [Boolean](https://developer.mozilla.org/zh-CN/docs/Glossary/Boolean)                                  | `"boolean"`                                                                                                        |
| [Number](https://developer.mozilla.org/zh-CN/docs/Glossary/Number)                                    | `"number"`                                                                                                         |
| [BigInt](https://developer.mozilla.org/zh-CN/docs/Glossary/BigInt)(ECMAScript 2020 新增)                | `"bigint"`                                                                                                         |
| [String](https://developer.mozilla.org/zh-CN/docs/Glossary/String)                                    | `"string"`                                                                                                         |
| [Symbol](https://developer.mozilla.org/zh-CN/docs/Glossary/Symbol) (ECMAScript 2015 新增)               | `"symbol"`                                                                                                         |
| 宿主对象（由 JS 环境提供）                                                                                       | *取决于具体实现*                                                                                                          |
| [Function](https://developer.mozilla.org/zh-CN/docs/Glossary/Function) 对象 (按照 ECMA-262 规范实现 [[Call]]) | `"function"`                                                                                                       |
| 其他任何对象                                                                                                | `"object"`                                                                                                         |

那么typeof的实现原理是什么呢？这就得先说说js在底层是如何存储变量的数据类型信息的。



其实，js 在底层存储变量的时候，会在变量的机器码的低位1-3位存储其类型信息：

- 000：对象
- 010：浮点数
- 100：字符串
- 110：布尔
- 1：整数

对于null来说就有些特殊了，因为null在大多数平台下其机器码全为0,因此也就有`typeof null`的值是`'object'`了，这也是JavaScript 的历史遗留bug。

```js
null instanceof null
// Uncaught TypeError: Right-hand side of 'instanceof' is not an object
    at <anonymous>:1:6
```

平时使用typeof来判断类型时最好是判断基础类型，避免对判断对象和null的判断。

注意括号：

```js
// 括号有无将决定表达式的类型。
var iData = 99;

typeof iData + ' Wisen'; // 'number Wisen'
typeof (iData + ' Wisen'); // 'string'
```

## Object.prototype.toString()

另外一个用于判断数据类型的好方法就是`Object.prototype.toString()`

可以利用这个方法准确地判断变量类型。

看看MDN上的解释

> 每个对象都有一个 `toString()` 方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。默认情况下，`toString()` 方法被每个 `Object` 对象继承。如果此方法在自定义对象中未被覆盖，`toString()` 返回 "[object *type*]"，其中 `type` 是对象的类型。

用于判断类型时应该用`call`方法改变this指向，否则返回结果都是`'[object Object]'`



```js
Object.prototype.toString.call(1) // "[object Number]"

Object.prototype.toString.call('hi') // "[object String]"

Object.prototype.toString.call({a:'hi'}) // "[object Object]"

Object.prototype.toString.call([1,'a']) // "[object Array]"

Object.prototype.toString.call(true) // "[object Boolean]"

Object.prototype.toString.call(() => {}) // "[object Function]"

Object.prototype.toString.call(null) // "[object Null]"

Object.prototype.toString.call(undefined) // "[object Undefined]"

Object.prototype.toString.call(Symbol(1)) // "[object Symbol]"

Object.prototype.toString.call(Math); // "[object Math]"
```



## instanceof 操作符的实现原理

MDN上的解释

> **`instanceof`** **运算符**用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

```js
let person = function () {
}
let programmer = function () {
}
programmer.prototype = new person()
let nicole = new programmer()
nicole instanceof person // true
nicole instanceof programmer // true
```



其实MDN上的定义已经很好地说明了instanceof的原理，用代码表示如下：

```js
function new_instance_of(leftVaule, rightVaule) { 
    let rightProto = rightVaule.prototype; // 取右表达式的 prototype 值
    leftVaule = leftVaule.__proto__; // 取左表达式的__proto__值
    while (true) {
    	if (leftVaule === null) {
            return false;	
        }
        if (leftVaule === rightProto) {
            return true;	
        } 
        leftVaule = leftVaule.__proto__ 
    }
}
```





## 几个有趣的例子

```js
function Foo() {
}

Object instanceof Object // true
Function instanceof Function // true
Function instanceof Object // true
Foo instanceof Foo // false
Foo instanceof Object // true
Foo instanceof Function // true
```

在判断上面这些表达式的结果时我们需要知道：一个实例对象的__proto__属性指向它的构造函数的prototype，而这个prototype本身也是一个对象，也有自己的__proto__属性，就这样对象之间通过___proto___串成了一条链，所谓原型链。

### Object instanceof Object

```js
leftValue = Object.__pro__ = Function.prototype
rightValue = Object.prototype
// 第一次判断
leftValue !== rightValue
leftValue = Function.prototype.__proto__ = Object.prototype
// 第二次判断
leftValue === rightValue     // 返回true
```



`Function instanceof Function`和`Function instanceof Object`运行过程和上面类似，也都返回`true`



## Foo instanceof Foo

```js
leftValue = Foo.__proto__ = Function.prototype
rightValue = Foo.prototype

//第一次判断
leftValue !== rightValue
leftValue = Function.prototype.__ptoto__ = Object.prototype

//第二次判断
leftValue !== rightValue
leftValue = Object.prototype.__proto__ = null

//第三次判断
leftValue === null
// 返回false
```



## Foo instanceof Function

```js
leftValue = Foo.__proto__ = Fuction.prototype
rightValue = Function.prototype

//第一次判断
leftValue === rightValue

// 返回true
```





## 总结

- typeof的原理是判断机器码前三位。

- instanceof原理是判断右边构造函数的prototype是否在左边实例对象的原型链上。

- typeof可以区分基本数据类型，但是不能判断对象的具体类型或者null，因为它们都返回`'object'`

- 使用`Object.prototype.toString.call()`可以准确判断数据的类型，包括undefined和null。
