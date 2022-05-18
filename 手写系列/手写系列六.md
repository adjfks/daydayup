---
date: 2022.4.4
---

# DAY9 手写js系列（六）

## 26. 数组forEach方法

注意别用箭头函数，箭头函数没有自己的this

```js
Array.prototype.my_forEach = function (callback) {
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this)
  }
}
```



## 27. 数组map方法

```js
Array.prototype.my_map = function (callback) {
  let newArr = []
  for (let i = 0; i < this.length; i++) {
    newArr.push(callback(this[i], i, this))
  }
  return newArr
}

```



## 28. 数组filter方法

```js
Array.prototype.my_filter = function (callback) {
  const newArr = []
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      newArr.push(this[i])
    }
  }
  return newArr
}
```



## 29. 数组every方法

```js
Array.prototype.my_every = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (!callback(this[i], i, this)) {
      return false
    }
  }
  return true
}

```

