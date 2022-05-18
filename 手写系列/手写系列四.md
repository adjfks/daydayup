# DAY7 手写js系列（四）

## 20. 实现限制并发的Promise调度器

```javascript
class Scheduler {
  constructor(limit) {
    this.limit = limit
    this.cur = 0
    this.queue = []
  }

  add(delay, content) {
    const task = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(content)
          resolve()
        }, delay)
      })
    }
    this.queue.push(task)
  }

  start() {
    for (let i = 0; i < this.limit; i++) {
      this.request()
    }
  }

  request() {
    if (!this.queue.length || this.cur >= 2) return
    this.cur++
    this.queue
      .shift()()
      .then(() => {
        this.cur--
        this.request()
      })
  }
}

const scheduler = new Scheduler(2)
const addTask = (delay, content) => {
  scheduler.add(delay, content)
}



addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
scheduler.start()

/* 
输出顺序是：2 3 1 4

整个的完整执行流程：

一开始1、2两个任务开始执行
500ms时，2任务执行完毕，输出2，任务3开始执行
800ms时，3任务执行完毕，输出3，任务4开始执行
1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行
1200ms时，4任务执行完毕，输出4
*/

```



## 21. 实现lazyMan函数

实现一个LazyMan，可以按照以下方式调用:
LazyMan(“Hank”)输出:
Hi! This is Hank!

LazyMan(“Hank”).sleep(10).eat(“dinner”)输出
Hi! This is Hank!
//等待10秒..
Wake up after 10
Eat dinner~

LazyMan(“Hank”).eat(“dinner”).eat(“supper”)输出
Hi This is Hank!
Eat dinner~
Eat supper~

LazyMan(“Hank”).eat(“supper”).sleepFirst(5)输出
//等待5秒
Wake up after 5
Hi This is Hank!
Eat supper

```javascript
class _LazyMan {
  constructor(name) {
    // 任务队列
    this.tasks = []
    // 默认第一个任务
    const task = () => {
      console.log(`Hi! This is ${name}!`)
      // 执行下一任务
      this.next()
    }
    //将第一个任务添加到任务队列
    this.tasks.push(task)
    // 执行第一个任务
    setTimeout(() => {
      // 取出任务执行
      let task = this.tasks.shift()
      task && task()
    }, 0)
  }

  // 定义next函数，用于执行下一任务
  next() {
    let task = this.tasks.shift()
    task && task()
  }

  // eat
  eat(food) {
    // 定义任务
    let task = () => {
      console.log(`Eat ${food}!`)
      // 执行下一任务
      this.next()
    }
    // 将任务添加到任务队列
    this.tasks.push(task)
    // 链式调用
    return this
  }

  // sleep
  sleep(time) {
    let task = () => {
      setTimeout(() => {
        console.log(`Wake up after ${time}`)
        // 延迟后执行下一任务
        this.next()
      }, time * 1000)
    }
    this.tasks.push(task)
    // 链式调用
    return this
  }

  // sleepFirst
  sleepFirst(time) {
    let task = () => {
      setTimeout(() => {
        console.log(`Wake up after ${time}`)
        // 延迟后执行下一任务
        this.next()
      }, time * 1000)
    }
    this.tasks.unshift(task)
    // 链式调用
    return this
  }
}

let LazyMan = (name) => {
  return new _LazyMan(name)
}
```



## 22. 实现add函数

题目描述：实现一个 add 方法 使计算结果能够满足如下预期：

- add(1)(2)(3)()=6
- add(1,2,3)(4)()=10

```javascript
function add(...args) {
  let allArgs = []

  function fn(...args) {
    if (args.length === 0) {
      if (!allArgs.length) return console.log('没有找到参数！')
      return console.log(
        allArgs.reduce((pre, cur) => {
          return pre + cur
        })
      )
    }

    allArgs.push(...args)
    return fn
  }

  return fn(...args)
}
```



## 23. 实现一个合格的深拷贝

### （1）黄金段位

```javascript
function deepClone1(obj) {
  return JSON.parse(JSON.stringify(obj))
}
```

**缺点**

- 1、对象中有字段值为`undefined`，转换后则会直接字段消失
- 2、对象如果有字段值为`RegExp`对象，转换后则字段值会变成{}
- 3、对象如果有字段值为`NaN、+-Infinity`，转换后则字段值变成null
- 4、对象如果有`环引用`，转换直接报错

### 

### （2）铂金段位

```javascript
function deepClone2(target) {
  const newObj = {}
  if (typeof target !== 'object') return target

  for (let k in target) {
    newObj[k] = deepClone2(target[k])
  }

  return newObj
}
```



### (3)钻石版本

考虑拷贝的是数组

```javascript
function deepClone3(target) {
  const temp = Array.isArray(target) ? [] : {}
  if (typeof target !== 'object') return target

  for (let k in target) {
    temp[k] = deepClone2(target[k])
  }

  return temp
}
```



### （4）星耀段位

解决环引用问题

```javascript
function deepClone4(target, map = new Map()) {
  const temp = Array.isArray(target) ? [] : {}
  if (typeof target !== 'object') return target

  if (map.get(target)) return map.get(target)

  map.set(target, temp)
  for (let k in target) {
    temp[k] = deepClone4(target[k] , map)
  }

  return temp
}

```



### (5)王者段位

其实，引用数据类型可不止只有数组和对象，我们还得解决以下的引用类型的拷贝问题，那怎么判断每个引用数据类型的各自类型呢？可以使用`Object.prototype.toString.call()`

![image-20220402153740676](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220402153740676.png)

```javascript
function deepClone5(target) {
  // 可遍历对象
  const setTag = '[object Set]'
  const mapTag = '[object Map]'
  const arrTag = '[object Array]'
  const objTag = '[object Object]'
  // 不可遍历对象
  const funcTag = '[object Function]'
  const symbolTag = '[object Symbol]'
  const regTag = '[object RegExp]'

  const canForArr = [setTag, mapTag, arrTag, objTag]
  const noForArr = [funcTag, symbolTag, regTag]

  // 返回类型
  function getType(target) {
    return Object.prototype.toString.call(target)
  }

  // 返回相应空结构
  function createTemp(target) {
    const fn = target.constructor
    return new fn()
  }

  // 递归拷贝函数
  function deep(target, map = new Map()) {
    let type = getType(target)
    // 不是对象类型直接返回
    if (!canForArr.concat(noForArr).includes(type)) return target

    // 生成对应空结构
    let temp = createTemp(target)

    // 检查map
    if (map.get(target)) return map.get(target)

    map.set(target, temp)

    // 处理Set类型
    if (type === setTag) {
      target.forEach((v, k) => {
        temp.add(k, v)
      })
      return temp
    }

    // 处理Map类型
    if (type === mapTag) {
      target.forEach((v, k) => {
        temp.set(k, v)
      })
      return temp
    }

    //处理数据和对象
    for (let k in target) {
      temp[k] = deep(target[k], map)
    }

    return temp
  }

  return deep(target)
}
```

