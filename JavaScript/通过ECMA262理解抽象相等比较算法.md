首先奉上规范地址 [ECMAScript Language Specification - ECMA-262 Edition 5.1](https://262.ecma-international.org/5.1/#sec-11.9.3)

本文讲的其实就是`==`的比较算法——Abstract Equality Comparison Algorithm（抽象相等比较算法）

1. Type(x)和Type(y)相等

```js
// a. 
undefined == undefined // true

// b. 
null == null // true

// c. x y 都是Number，除了NaN其余情况都相等
+0 == -0    // true
NaN == NaN    // false

// d. 都是字符串长度相等且字符顺序和对应字符相等返回true，但是有特殊例子
// 两个字符串包装对象是不相等的
new String('a') == new String('a')    // false
new String('a') == 'a'    // true

// e. 布尔值省略，看相等就好


// f. 对于对象，同一对象的引用才为true
[] == [] // false
{} == {} // false
new Object() == new Object()    // false
```

2. null 和 undefined

```js
null == undefined // true
undefined == null // true
```

3. Number 和 String

将String转为Number比较，转为Number的行为和在该值前面加上一元加类似。

```js
'' == 1                    // false 因为 +''=0
'' == 0                    // true 因为 +''=0
new String('') == 0        // true
new String('2') == 2       // true
'a' == 1                   // false 因为 +'a'=NaN
```

4. 布尔值会被转为数字

5. Object转数字可以理解为先调用toString()方法，再用一元加

null 转 Number为0，规范里是+0

1. 一些例子

```js
[] == 0    // true
{} == 0    // false
[] == true // false
{} == true // false
[] == false // true
```


