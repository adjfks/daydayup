# 从ECMAScript规范解读this

先奉上 ECMAScript 5.1 规范地址：

英文版：[Annotated ES5](http://es5.github.io/#x15.1)

中文版：[ECMAScript5.1中文版 + ECMAScript3 + ECMAScript（合集）](http://yanhaijing.com/es5/#115)

## Types

ECMAScript 的类型分为**语言类型**和**规范类型**。

ECMAScript 语言类型是开发者直接使用 ECMAScript 可以操作的。其实就是我们常说的Undefined, Null, Boolean, String, Number, 和 Object。

而规范类型相当于 meta-values，是用来用算法描述 ECMAScript **语言结构**和 ECMAScript **语言类型**的。规范类型包括：Reference, List, Completion, Property Descriptor, Property Identifier, Lexical Environment, 和 Environment Record。

## Reference

> The Reference type is used to explain the behaviour of such operators as delete, typeof, and the assignment operators.

所以 Reference 类型就是用来解释诸如 delete、typeof 以及赋值等操作行为的。

抄袭尤雨溪大大的话，就是：

> 这里的 Reference 是一个 Specification Type，也就是 “只存在于规范里的抽象类型”。它们是为了更好地描述语言的底层行为逻辑才存在的，但并不存在于实际的 js 代码中。

> A Reference is a resolved name binding.

> A Reference consists of three components, the base value, the referenced name and the Boolean valued strict reference flag.

> The base value is either undefined, an Object, a Boolean, a String, a Number, or an environment record (10.2.1).

> A base value of undefined indicates that the reference could not be resolved to a binding. The referenced name is a String.

**这段讲述了 Reference 的构成，由三个组成部分，分别是：**

- **base value**
- **referenced name**
- **strict reference**

base value 就是属性所在的对象或者就是 EnvironmentRecord，它的值只可能是 undefined, an Object, a Boolean, a String, a Number, or an environment record 其中的一种。

referenced name 就是属性的名称。

举个例子

```javascript
var foo = 1;

// 对应的Reference是：
var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};
```

再举个例子：

```javascript
var foo = {
    bar: function () {
        return this;
    }
};

foo.bar(); // foo

// bar对应的Reference是：
var BarReference = {
    base: foo,
    propertyName: 'bar',
    strict: false
};
```

**GetBase 和 IsPropertyReference。**

1.GetBase

> GetBase(V). Returns the base value component of the reference V.

返回 reference 的 **base value。**

2.IsPropertyReference

> IsPropertyReference(V). Returns true if either the base value is an object or HasPrimitiveBase(V) is true; otherwise returns false.

简单的理解：**如果 base value 是一个对象，就返回true。**

## GetValue

使用

```javascript
var foo = 1;

var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};

GetValue(fooReference) // 1;
```

**调用 GetValue，返回的将是具体的值，而不再是一个 Reference**

**而GetBase返回的是base的值**

## 如何确定this的值

看规范 11.2.3 Function Calls：

这里讲了当函数调用的时候，如何确定 this 的取值。

只看第一步、第六步、第七步：

> 1.Let *ref* be the result of evaluating MemberExpression.

> 6.If Type(*ref*) is Reference, then

> ```
>   a.If IsPropertyReference(ref) is true, then
> ```

> ```
>       i.Let thisValue be GetBase(ref).
> ```

> ```
>   b.Else, the base of ref is an Environment Record
> ```

> ```
>       i.Let thisValue be the result of calling the ImplicitThisValue concrete method of GetBase(ref).
> ```
> 
> 7.Else, Type(*ref*) is not Reference.

> ```
>   a. Let thisValue be undefined.
> ```

让我们描述一下：

1.计算 MemberExpression 的结果赋值给 ref

2.判断 ref 是不是一个 Reference 类型

```
2.1 如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref)

2.2 如果 ref 是 Reference，并且 base value 值是 Environment Record, 那么this的值为 ImplicitThisValue(ref)

2.3 如果 ref 不是 Reference，那么 this 的值为 undefined
```

## 具体分析

1. **计算 MemberExpression 的结果赋值给 ref**

什么是 MemberExpression？看规范 11.2 Left-Hand-Side Expressions：

MemberExpression :

- PrimaryExpression // 原始表达式 可以参见《JavaScript权威指南第四章》
- FunctionExpression // 函数定义表达式
- MemberExpression [ Expression ] // 属性访问表达式
- MemberExpression . IdentifierName // 属性访问表达式
- new MemberExpression Arguments // 对象创建表达式

```javascript
function foo() {
    console.log(this)
}

foo(); // MemberExpression 是 foo

function foo() {
    return function() {
        console.log(this)
    }
}

foo()(); // MemberExpression 是 foo()

var foo = {
    bar: function () {
        return this;
    }
}

foo.bar(); // MemberExpression 是 foo.bar
```

**所以简单理解 MemberExpression 其实就是()左边的部分。**

**2.判断 ref 是不是一个 Reference 类型。**

```javascript
var value = 1;

var foo = {
  value: 2,
  bar: function () {
    return this.value;
  }
}

//示例1
console.log(foo.bar());     // 2  this为foo
//示例2
console.log((foo.bar)());    // 2  和1一样
//示例3
console.log((foo.bar = foo.bar)());    // 1  this为undefined
//示例4
console.log((false || foo.bar)());    // 1  this为undefined
//示例5
console.log((foo.bar, foo.bar)());    // 1  this为undefined
```

注意：以上是在非严格模式下的结果，严格模式下因为 this 返回 undefined，所以示例 3 会报错。

### (foo.bar = foo.bar)()

看示例3，有赋值操作符，查看规范 11.13.1 Simple Assignment ( = ):

计算的第三步：

> 3.Let rval be GetValue(rref).

因为使用了 GetValue，所以返回的值不是 Reference 类型，

按照之前讲的判断逻辑：

> 2.3 如果 ref 不是Reference，那么 this 的值为 undefined

this 为 undefined，**非严格模式下，this 的值为 undefined 的时候，其值会被隐式转换为全局对象。**

### 补充

最最后，忘记了一个最最普通的情况：

```js
function foo() {
    console.log(this)
}

foo(); 
```

MemberExpression 是 foo，解析标识符，查看规范 10.3.1 Identifier Resolution，会返回一个 Reference 类型的值：

```js
var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};
```

接下来进行判断：

> 2.1 如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref)

**因为 base value 是 EnvironmentRecord，并不是一个 Object 类型**，还记得前面讲过的 base value 的取值可能吗？ 只可能是 undefined, an Object, a Boolean, a String, a Number, 和 an environment record 中的一种。

IsPropertyReference(ref) 的结果为 false，进入下个判断：

> 2.2 如果 ref 是 Reference，并且 base value 值是 Environment Record, 那么this的值为 ImplicitThisValue(ref)

base value 正是 Environment Record，所以会调用 ImplicitThisValue(ref)

查看规范 10.2.1.1.6，ImplicitThisValue 方法的介绍：该函数始终返回 undefined。

所以最后 this 的值就是 undefined。

## 一个例子

尽管我们可以简单的理解 this 为**调用函数的对象**，如果是这样的话，如何解释下面这个例子呢？

```js
var value = 1;

var foo = {
  value: 2,
  bar: function () {
    return this.value;
  }
}
console.log((false || foo.bar)()); // 1
```

## 总结

说得太多，很容易乱，那么就来简单总结一下：

- MemberExpression包含5种：
  
  - PrimaryExpression // 原始表达式 可以参见《JavaScript权威指南第四章
  
  - FunctionExpression // 函数定义表达式
  
  - MemberExpression [ Expression ] // 属性访问表达式
  
  - MemberExpression . IdentifierName // 属性访问表达式
  
  - new MemberExpression Arguments // 对象创建表达式

- 确定this的关键是先计算 MemberExpression 得到ref，然后判断ref是否为一个Reference。

- **属性访问表达式**返回Reference,例如`foo.bar`

- 括号并不会调用括号内的reference的GetVlue，如`(foo.bar)`

- **赋值（“=”）操作符**、**二元逻辑运算符（“||”）**、**逗号操作符**计算算得到的ref是调用GetValue得到的值，所以结果不是Reference，如`(foo.bar = foo.bar)`

- getBase得到的值只可能是 undefined, an Object, a Boolean, a String, a Number, 和 an environment record 中的一种。

**只有当ref既是Reference又是一个对象的时候，this的值是调用getBase得到的结果，否则this都为undefined,只不过在非严格模式下，undefined会被隐式转换为全局对象。最常见的计算结果为Reference的MemberExpression就是属性访问表达式了。这也就是为什么我们常说this就是调用函数的对象。**
