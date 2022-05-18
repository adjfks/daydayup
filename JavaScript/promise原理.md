# promise原理

先看看promise的使用方法：

```js
var p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('1s后成功的结果')
        reject('失败')
    }, 1000)
})

console.log(p)

p.then((data) => {
    console.log(data)
})


// Promise { <pending> }
// 1s后成功的结果
```

注意到pormise的几个要点：

- 参数接收一个函数，函数包含resolve和reject方法

- 返回一个promise

- 可以链式调用

我们还知道promise只有两种状态转换：

- pending -> resolved

- pending -> rejected


