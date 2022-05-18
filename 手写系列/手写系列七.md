---
date: 2022.4.5
---

# DAY10 手写js系列（七）

## 30. 数组some方法

```js
Array.prototype.my_some = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      return true
    }
  }
  return false
}
```



## 31. 数组reduce方法

```js
Array.prototype.my_reduce = function (callback, ...args) {
  let startIndex = 0
  let pre
  if (args.length) {
    pre = args[0]
  } else {
    pre = this[0]
    startIndex = 1
  }
  for (let i = startIndex; i < this.length; i++) {
    pre = callback(pre, this[i], i, this)
  }
  return pre
}

```



## 32. 数组findIndex方法

```js
Array.prototype.my_findIndex = function (callback) {
  for (let i = 0; i < this.length; i++){
    if (callback(this[i], i, this)) return i
  }
  return -1
}

```



## 33. 数组find方法

```js
Array.prototype.my_find = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) return this[i]
  }
  return undefined
}
```



## 34. 数组fill方法

用于填充数组，左闭右开，end默认为length

```js
Array.prototype.my_fill = function (value, start = 0, end = this.length) {
  for (let i = start; i < end; i++) {
    this[i] = value
  }
  return this
}
```





## 35. 数组includes方法

注意NaN在比较时，NaN永远不等于NaN

```js
Array.prototype.my_includes = function (value, start) {
  if (start < 0) start = this.length - start
  const isNaN = Number.isNaN(value)
  for (let i = start; i < this.length; i++) {
    if (this[i] === value || (isNaN && Number.isNaN(this[i]))) return true
  }
  return false
}

```





## 36. 数组join方法

```js
Array.prototype.my_join = function (sep = ',') {
  let str = ''
  for (let i = 0; i < this.length; i++){
    str += i === 0 ? `${this[i]}` : `${sep}${this[i]}`
  }
  return str
}
```





## 37. 数组flat方法

```js
Array.prototype.my_flat = function (level = Infinity) {
  let res = this
  while (res.some((item) => Array.isArray(item))) {
    if (level <= 0) break
    res = [].concat(...res)
    level--
  }
  return res
}
```



## 38. 数组splice方法

**参数校验**

- startIndex 为非法值，直接返回空数组
- startIndex为负数，startIndex += length
  - startIndex超出索引
  - args.length === 0 : 直接返回空数组
  - args.length !== 0: 插入到末尾
- delnum > length - startIndex : delnum = length - startIndex
- delnum < 0 或 非法值 ， delnum = 0 
- delnum > args.length  , 先替换，然后把剩下的删除
- delnum < args.length , 先替换删除的长度，然后再插入剩下的元素

**插入函数**

```js
function insert(arr, start, items, itemsStartIndex) {
  let insLen = items.length - itemsStartIndex
  // i指向原来数组末尾
  let i = arr.length - 1
  // 数组扩容
  arr.length += insLen
  // j指向当前数组末尾
  let j = arr.length - 1
  // 元素向后挪
  while (i >= start) {
    arr[j--] = arr[i--]
  }
  // 插入元素
  for (let i = itemsStartIndex; i < itemsStartIndex + insLen; i++) {
    arr[start++] = items[i]
  }
}
```

**替换函数**

可用于删除

```js
function replace(arr, start, items, itemsStartIndex) {
  let delItems = []
  if (start > arr.length) start = arr.length
  // 替换的数量
  let repLen = items.length - itemsStartIndex
  // 计算得到删除元素的数量
  let count
  if (arr === items) {
    count = itemsStartIndex - start
  } else {
    count = items.length
  }

  let i = start,
    j = itemsStartIndex
  while (j < items.length) {
    if (arr[i] && count !== 0) {
      delItems.push(arr[i])
      --count
    }
    arr[i++] = items[j++]
  }
  return delItems
}
```

**删除函数**

```js
function del(arr, start, count) {
  if (start < 0 || start >= arr.length) return []
  if (count > arr.length) count = arr.length
  let delItems = replace(arr, start, arr, start + count)
  arr.length -= count
  return delItems
}
```

**splice函数**

```js
Array.prototype.my_splice = function (startIndex, delnum, ...args) {
  // startIndex非法，直接结束
  if (typeof startIndex !== 'number' && typeof startIndex !== 'string') return []
  // 获取数组长度
  let len = this.length

  // 处理开始索引,保证索引为正数
  if (typeof startIndex === 'string') startIndex = Number(startIndex)
  if (startIndex < 0) startIndex += len

  // 处理删除数量，保证 0 <= delnum <= len - startIndex
  if (typeof delnum === 'string') delnum = Number(delnum)
  if (delnum < 0 || typeof delnum !== 'number') delnum = 0
  if (delnum > len - startIndex) delnum = len - startIndex

  let res = []
  if (delnum === args.length) {
    res = replace(this, startIndex, args, 0)
  } else if (delnum > args.length) {
    res = replace(this, startIndex, args, 0)
    res.push(...del(this, startIndex + args.length, delnum - args.length))
  } else {
    let args1 = [...args]
    args1.length = delnum
    res = replace(this , startIndex , args1 , 0)
    insert(this , startIndex + delnum , args , delnum)
  }

  return res
}
```

