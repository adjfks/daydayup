---
date: 2022.4.3
---

# DAY8 手写js系列（五）

<br/>

[TOC]

## 24. 手写Promise

**类的声明**

通过`new Promise((resolve, reject)=>{})`可以创建一个Promise，因此可以写出如下类声明：

```js
class MyPromise {
  constructor(executor) {
    let resolve = () => {}

    let reject = () => {}

    executor(resolve, reject)
  }
}
```

**状态和值的初始化 && resolve / reject 的功能实现**

```js
class MyPromise {
  constructor(executor) {
    // 状态和值的初始化
    this.status = 'pending'
    this.value = null
    this.reason = null

    // resolve reject
    let resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled'
        this.value = value
      }
    }

    let reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.reason = reason
      }
    }

    // 立即执行
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }
}

```

**then方法的实现**

- Promise有一个叫做then的方法，里面有两个参数：**onFulfilled**,**onRejected**.

- 当状态state为fulfilled，则**执行onFulfilled，传入this.value。**当状态state为rejected，则**执行onRejected，传入this.reason**

```js
class MyPromise {
  constructor(executor) {...}

  then(onFulfilled , onRejected) {
    if (this.status === 'fulfilled') {
      onFulfilled(this.value)
    } else if (this.status === 'rejected') {
      onRejected(this.reason)
    }
  }
}

```

**异步的实现**

调用then方法时如果promise状态未定，要把then的两个参数保存起来，等到状态确定后再拿出来执行。

```js
class MyPromise {
  constructor(executor) {
    // 状态和值的初始化
    ...

    // 存放onFulfilled和onRejected函数调用的数组
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    // resolve reject
    let resolve = (value) => {
      if (this.status === 'pending') {
        ...
        // 状态确定，调用数组里的回调函数
        this.onFulfilledCallbacks.forEach((fn) => fn())
      }
    }

    let reject = (reason) => {
      if (this.status === 'pending') {
        ...
        // 状态确定，调用数组里的回调函数
        this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }

    // 立即执行
    ...
  }

  then(onFulfilled, onRejected) {
    ...
    else if (this.status === 'pending') {
      this.onFulfilledCallbacks.push(() => {
        	onFulfilled(this.value)
      	})
      this.onRejectedCallbacks.push(() => {
        	onRejected(this.reason)
      	})
    }
  }
}
```

**链式调用**

- then里return 一个promise2
- promise2的值传递给下一个then
- onFulfilled和onRejected执行以后返回的值叫做x，需要传入resolvePromise进行判断。
  - x是Promise，则确定它的状态，然后把值作为promise2成功的结果
  - x是普通值，直接作为promise2成功的结果
  - 要比较x和promise2
  - resolvePromise的参数有promise2，x，resolve，reject
  - resolve和reject是promise2的

```js
then(onFulfilled, onRejected) {
    
    let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        let x = onFulfilled(this.value)
        resolvePromise(promise2, x, resolve, reject)
      } else if (this.status === 'rejected') {
        let x = onRejected(this.reason)
        resolvePromise(promise2, x, resolve, reject)
      } else if (this.status === 'pending') {
        this.onFulfilledCallbacks.push(() => {
          let x = onFulfilled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        })
        this.onRejectedCallbacks.push(() => {
          let x = onRejected(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        })
      }
    })

    return promise2
  }
```

**resolvePromise函数**

- 首先解决 `x === promise2`循环引用问题

```
if (x === promise2) {
    return reject(new TypeError('chaining cycyle detected for promise'))
}
```

- x不是null 且x是对象或者函数

  - A+规定，声明then = x的then方法

- x是普通值直接成功

  ```js
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      try {
          let then = x.then
      } catch (err) {
  
      }
  } else {
  	resolve(x)
  }
  ```

- 判断then是否为函数

  - 是函数，默认x就是promise，调用then方法并传入成功和失败的回调

    ```js
    then.call(
    	x,
    	(val) => {
    		resolvePromise(promise2, val, resolve, reject)
    	},
    	(err) => {
    		reject(err)
    	}
    )
    ```

  - 为了防止成功和失败的回调同时调用，使用一个called变量

    ```js
    let called = false
    if (typeof then === 'function') {
        then.call(
            x,
            (val) => {
                if (called) return
                called = true
                resolvePromise(promise2, val, resolve, reject)
            },
            (err) => {
                if (called) return
                called = true
                reject(err)
            }
        )
    }else{...}
    ```

    

  - 不是函数，x不是promise，直接成功返回x

    ```
    try {
            let then = x.then
            
            if(typeof then === 'function'){
                
            }else{
                resolve(x)
            }
        } catch (err) {
    
        }
    ```

  - catch到错误，直接错误

    ```js
    catch (err) {
    	if (called) return
    	called = true
    	reject(err)
    }
    ```



**解决其他问题**

- onFulfilled / onRejected都是可选的参数，如果它们不是函数，必须被忽略

- 进行参数校验，失败时即调用onRejected时直接抛出错误，这样才不会让错误信息跑到下一个then去。

  ```js
  // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
      onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value
  // onRejected如果不是函数，就忽略onRejected，直接扔出错误
  onRejected = typeof onRejected === 'function' ? onRejected : (err) => { throw err }
  ```

- PromiseA+定onFulfilled或onRejected不能同步被调用，必须**异步调用**。我们就用setTimeout解决异步问题，用setTimeout把所有onFulfilled和onRejected执行包装一下

- 如果onFulfilled或onRejected报错，则直接返回reject()，这一步用try catch包装一下

  ```js
  let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === 'fulfilled') {
          setTimeout(() => {
              try {
                  let x = onFulfilled(this.value)
                  resolvePromise(promise2, x, resolve, reject)
              } catch (err) {
                  reject(err)
              }
          }, 0)
      } else if (this.status === 'rejected') {
          try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
              reject(err)
          }
      } else if (this.status === 'pending') {
          this.onFulfilledCallbacks.push(() => {
              try {
                  let x = onFulfilled(this.value)
                  resolvePromise(promise2, x, resolve, reject)
              } catch (err) {
                  reject(err)
              }
          })
          this.onRejectedCallbacks.push(() => {
              try {
                  let x = onRejected(this.reason)
                  resolvePromise(promise2, x, resolve, reject)
              } catch (err) {
                  reject(err)
              }
          })
      }
  })
  ```



**catch方法**

- 调用then方法并将catch接收的参数传入作为onRejected

```js
catch(fn) {
    this.then(null, fn)
  }
```



**resolve和reject方法**

```js
// resolve
MyPromise.resolve = function (val) {
  return new MyPromise((resolve, reject) => {
    resolve(val)
  })
}

// reject方法
MyPromise.reject = function (err) {
  return new MyPromise((resolve, reject) => {
    reject(err)
  })
}
```



**race方法**

```js
// race方法
MyPromise.race = function (promises) {
  return new MyPromise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject)
    }
  })
}
```



**all方法**

- 传入一个promises数组
- 每一个promise调用then方法，把结果放到结果数组再一起返回

```js
// all方法
MyPromise.all = function (promises) {
  let result = []
  let count = 0
  let processData = function (idx, data) {
    result[idx] = data
    count++
    if (count === promises.length) {
      resolve(result)
    }
  }
  return new MyPromise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then((data) => {
        processData(data)
      }, reject)
    }
  })
}
```



参考： 

- [promiseA+规范](https://promisesaplus.com/)
- [BAT前端经典面试问题：史上最最最详细的手写Promise教程](https://juejin.cn/post/6844903625769091079)
- [看了就会，手写Promise原理，最通俗易懂的版本！！！](https://juejin.cn/post/6994594642280857630#heading-4)

