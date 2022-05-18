# DAY6 手写js系列（三）

## 13. 实现JSON.parse

eval会将传入的字符串作为脚本执行

```javascript
function myJsonParse(json) {
  return eval('(' + json + ')')
}
```



## 14. 将DOM转化成树结构对象

```javascript
function domToTree(dom) {
  const obj = {}
  obj.tag = dom.tagName
  obj.children = []
  Array.prototype.forEach.call(dom.children, (child) => {
    obj.children.push(domToTree(child))
  })
  return obj
}
```



## 15. 将树结构转换为DOM

```javascript
// 真正的渲染函数
function _render(vnode) {
  // 如果是数字类型转化为字符串
  if (typeof vnode === "number") {
    vnode = String(vnode);
  }
  // 字符串类型直接就是文本节点
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }
  // 普通DOM
  const dom = document.createElement(vnode.tag);
  if (vnode.attrs) {
    // 遍历属性
    Object.keys(vnode.attrs).forEach((key) => {
      const value = vnode.attrs[key];
      dom.setAttribute(key, value);
    });
  }
  // 子数组进行递归操作
  vnode.children.forEach((child) => dom.appendChild(_render(child)));
  return dom;
}

```





## 16. 判断一个对象有环引用

```javascript
function cycleDetector(obj) {
  let arr = [obj]
  let flag = false

  function cycle(o) {
    for (let key in o) {
      if (typeof o[key] === 'object') {
        if (arr.indexOf(o[key]) >= 0) {
          return (flag = true)
        }
        arr.push(o[key])
        cycle(o[key])
      }
    }
  }

  cycle(obj)
  return flag
}
```



## 17. 计算一个对象的层数

```javascript
function loopGetLevel(obj) {
  let res = 1

  function getLevel(obj, level) {
    for (let k in obj) {
      let temp = obj[k]
      if (typeof temp === 'object') {
        getLevel(temp, level + 1)
      } else {
        res = res >= level ? res : level
      }
    }
  }

  getLevel(obj, 1)
  return res
}
```





## 18. 对象的扁平化

```javascript
function flatten(obj) {
  let isObject = (val) => {
    return typeof val === 'object' && val !== null
  }
  if (!isObject(obj)) return
  let res = {}

  function dfs(cur, prefix) {
    if (isObject(cur)) {
      if (Array.isArray(cur)) {
        cur.forEach((item, index) => {
          dfs(item, `${prefix}[${index}]`)
        })
      } else {
        for (let k in cur) {
          let v = cur[k]
          dfs(v, `${prefix}${prefix ? '.' : ''}${k}`)
        }
      }
    } else {
      res[prefix] = cur
    }
  }

  dfs(obj, '')
  return res
}
```



## 19. 实现(a == 1 && a == 2 && a == 3)为true

```javascript
/* 实现(a == 1 && a == 2 && a == 3)为true */

/* 方法一 */
var a1 = {
  i: 1,
  valueOf: function () {
    return a1.i++
  }
}

/* 方法二 */
var a2 = [1, 2, 3]
a2.i = 0
a2.valueOf = function () {
  return a2[a2.i++]
}

/* 方法三 */
var a3 = [1, 2, 3]
a3.join = a3.shift

/* 方法四 */
var val = 0
Object.defineProperty(window, 'a4', {
  get: function () {
    return ++val
  }
})
```

