# pinia简单使用

## state

在vue的入口文件`main.ts`中创建pinia实例并使用

```ts
import { createPinia } from 'pinia'

const pinia = createPinia()

app.use(pinia)
```

pinia可以有很多个store，一般一个store放在一个文件里，下面创建并导出一个store

```ts
import { defineStore } from 'pinia'

// 参数： id , options
export const useStore = defineStore('main', {
  // state是一个返回一个对象的函数
  state: () => {
    return {
      username: 'qiuqiu'
    }
  }
})
```

导入并在vue组件中进行使用

```ts
import { useStore } from '@/store'


const store = useStore()
```

修改state可以使用store的`$patch`方法，传入一个对象

```ts
store.$patch({
    username: '球球'
})
```

不能直接从store中解构出数据，不然会失去响应式，应该使用pinia提供的`storeToRefs`方法，此时解构出来的数据是一个ref。

```ts
import { storeToRefs } from 'pinia'


const { username } = storeToRefs(store)


username.value = username.value === 'qiuqiu' ? '球球' : 'qiuqiu'
```

当然也可以直接使用store的数据

```ts
store.username
```

监听数据修改用`$subscribe`

`mutation.type`有三个值`'direct' | 'patch function' | 'patch object'`

```ts
store.$subscribe((mutation, state) => {
  console.log(mutation.type)
  console.log(mutation.storeId)
  if (mutation.type === 'patch object') {
    console.log(mutation.payload);
  }
})
```

## getters

```ts
export const useStore = defineStore('main', {
  state: () => {
    return {
      username: 'qiuqiu',
      counter: 1
    }
  },
  getters: {
    doubleCount: (state) => state.counter * 2,
    // 箭头函数没有this
    // 添加JSDoc可以获得IDE提示
    /**
     * Returns the counter value times two plus one.
     *
     * @returns {number}
     */
    doublePlusOne(): number {
      // 通过this访问整个store，可以访问其他getters
      return this.doubleCount + 1
    }
  }
})
    }
  }
})
```

使用getters

```ts
console.log(store.doublePlusOne);
```

getters可以返回一个函数，函数可以接收参数

```ts
getBook: (state) => {
      return (bookId: number) => state.books.find(book => book.id === bookId)
}

console.log(store.getBook(1));
```

不过上面那样就不会有缓存，也就是每次都要去数据中搜索。

访问其他store的getters

```ts
import { useOtherStore } from './other-store'

export const useStore = defineStore('main', {
  state: () => ({
    // ...
  }),
  getters: {
    otherGetter(state) {
      const otherStore = useOtherStore()
      return state.localData + otherStore.data
    },
  },
})
```

## actions

订阅actions

```ts
const unsubscribe = someStore.$onAction(
  ({
    name, // name of the action
    store, // store instance, same as `someStore`
    args, // array of parameters passed to the action
    after, // hook after the action returns or resolves
    onError, // hook if the action throws or rejects
  }) => {
    // a shared variable for this specific action call
    const startTime = Date.now()
    // this will trigger before an action on `store` is executed
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // this will trigger if the action succeeds and after it has fully run.
    // it waits for any returned promised
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // this will trigger if the action throws or returns a promise that rejects
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)


// manually remove the listener
// 如果在组件setup里使用，在组件unMounted后会自动销毁，如果不想销毁可以给$onActions(fn , true)传第二个参数true
unsubscribe()
```

## plugin

一个pinia的插件就是一个函数，接收一个`context`参数

```ts
export function myPiniaPlugin(context) {
  context.pinia // the pinia created with `createPinia()`
  context.app // the current app created with `createApp()` (Vue 3 only)
  context.store // the store the plugin is augmenting
  context.options // the options object defining the store passed to `defineStore()`
  // ...
}
```

通过pinia实例注入

```ts
pinia.use(myPiniaPlugin)
```

### 引入新的store属性

也可以返回一个对象，这个对象中的属性会被注入所有store。

**向 store 添加新属性时，您还应该扩展 `PiniaCustomProperties` 接口**。

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    money: number
  }
}
function addMoney() {
  return {
    money: 100
  }
}
const pinia = createPinia()
pinia.use(addMoney)
```

### 引入新状态

当添加新的状态属性（`store` 和 `store.$state`）时，您需要将类型添加到 `PiniaCustomStateProperties`。 与 `PiniaCustomProperties` 不同，它只接收 `State` 泛型：

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomStateProperties<S> {
    hello: string
  }
}
```
