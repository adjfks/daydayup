---
date: 2022.4.6
---





# DAY11 手写js系列（八）

## 39. Object方法entries

用处：将对象转成键值对数组

使用for in 会进行原型链搜索，要使用hasOwnProperty()方法判断是否是只属于自己的属性和方法。

```js
Object.prototype.my_entries = function (obj) {
  var res = []
  for (var key in obj) {
    obj.hasOwnProperty(key) && res.push([key, obj[key]])
  }
  return res
}

//console.log(Object.my_entries(obj)) //[ [ 'name', 'zs' ], [ 'age', 19 ], [ 'score', 59 ] ]
```





## 40. Object方法fromEntries

用处：跟`entries`相反，将键值对数组转成对象

```js
Object.prototype.my_fromEntries = function (arr) {
  var obj = {}
  for (let i = 0; i < arr.length; i++) {
    let k = arr[i][0]
    obj[k] = arr[i][1]
  }
  return obj
}
```





## 41.Object方法keys

用处：将对象的key转成一个数组合集

```js
Object.prototype.my_keys = function (obj) {
  let keys = []
  for (let k in obj) {
    obj.hasOwnProperty(k) && keys.push(k)
  }
  return keys
}

```





## 42.Object方法values

用处：将对象的所有值转成数组合集

```js
Object.prototype.my_values = function (obj) {
  let values = []
  for (let k in obj) {
    obj.hasOwnProperty(k) && values.push(obj[k])
  }
  return values
}
```





## 43.instanceof

用处：A instanceOf B，判断A是否经过B的原型链

```js
function my_instanceof(obj, Fn) {
  if (typeof obj !== 'object' || !obj) return false
  if (obj.__proto__ !== Fn.prototype) {
    return my_instanceof(obj.__proto__, Fn)
  } else {
    return true
  }
}
```





## 44.Object方法is

`Object.is(NaN,NaN) // true`

`Object.is(-0,+0) // false `

`Object.is(null,null) // false `

```js
Object.prototype.my_is = function (a, b) {
  if (a === b) {
    return a !== 0
  }
  // Na结果应该为true
  return a !== a && b !== b
}

```





## 45.Object方法Object.assign

- assign接收多个对象，并将多个对象合成一个对象
- 这些对象如果有重名属性，以后来的对象属性值为准
- assign返回一个对象，`这个对象 === 第一个对象`

```js
Object.prototype.my_assign = function (target, ...args) {
  if (target === null || target === undefined) {
    console.error('Uncaught TypeError: Cannot convert undefined or null to object')
  }
  target = Object(target)
  for (let obj of args) {
    for (let key in obj) {
      obj.hasOwnProperty(key) && (target[key] = obj[key])
    }
  }
  return target
}
```

