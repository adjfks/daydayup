# DAY4 手写js系列（一）

## 1. 手写原生ajax

```javascript
const ajax = {
  get: function (url, fn) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true) //第三个参数异步与否
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        fn(xhr.responseText)
      }
    }
    xhr.send()
  },
  post: function (url, data, fn) {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        fn(xhr.responseText)
      }
    }
    xhr.send(data)
  }
}
```



## 2. 手写new过程

```javascript
function mynew(fn, ...args) {
  const obj = {}

  obj.__proto__ = fn.prototype

  fn.apply(obj, args)

  return obj
}

module.exports = {
  mynew
}

```





## 3. 手写instanceOf()

```
function instanceOf(father, child) {
  const fp = father.prototype

  var pro = child.__proto__

  while (pro) {
    if (pro === fp) {
      return true
    }
    pro = pro.__proto__
  }

  return false
}
```





## 4. 实现防抖函数

```javascript
/* 
  防抖函数，默认500ms内不再次触发则调用函数
*/

function debounce(fn, delay = 500) {
  let timer
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      let args = arguments
      fn.apply(this, args)
    }, delay)
  }
}

```



## 5. 实现数组去重

```javascript
/* 方法一：利用Set */
function unique1(arr) {
  return [...new Set(arr)]
}

/* 方法二：利用数组的reduce方法+Map */
function unique2(arr) {
  var newArr = []
  arr.reduce(function (pre, cur) {
    if (!pre.has(cur)) {
      newArr.push(cur)
      pre.set(cur, 1)
    }
    return pre
  }, new Map())

  return newArr
}

/* 方法三：使用indexOf方法 */
function unique3(arr) {
  var newArr = []
  for (let i = 0; i < arr.length; i++) {
    if (newArr.indexOf(arr[i]) === -1) {
      newArr.push(arr[i])
    }
  }
  return newArr
}

/* 方法四：利用filter和indexOf检测数组元素第一次出现位置与当前位置是否相等 */
function unique4(arr) {
  return arr.filter(function (item, index) {
    return arr.indexOf(item) === index
  })
}

```

