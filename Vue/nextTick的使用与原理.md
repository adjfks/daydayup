# nextTick的使用与原理

## What?

`nextTick`是等待下一次DOM更新的工具函数。

## Why?

Vue中采用异步更新策略，也就是说当数据发生更新之后，Vue不会马上更新DOM，而是会开启一个队列，把组件更新函数加入队列，在同一事件循环中发生的数据变更会异步地批量更新。所以这样就会导致我们无法在数据变更后立刻拿到更新后的DOM，如果需要拿到更新后的DOM就需要使用nextTick。

nextTick有两种应用场景和两种用法：

- 两种应用场景
  
  - 在created中获取DOM
  
  - 在数据更新后立刻获取更新后的DOM

- 两种用法
  
  - 向`nextTick`传入回调函数，在回调函数中获取DOM
  
  - `await nextTick()`后获取DOM,原因是`nextTick()`执行返回的是一个Promise，所以可以用await。



## 原理

1. 数据更新后，在`renderer.ts`中会创建一个`ReactiveEffect`响应式副作用，把组件的更新函数用`queueJob`进行排队。

2. `queueJob`把更新函数push到数组中，将刷新队列的方法`flushJobs`放到promise实例的then方法中，也就是放到了微任务队列中。

3. `flushJobs`中遍历所有组件的更新函数

4. `nextTick`可以接收一个函数，将函数放入到微任务队列，当宏任务执行完再执行微任务。


