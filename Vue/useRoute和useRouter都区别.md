# useRoute和useRouter都区别

首先两个函数都只能在setup中调用。它们都是VueRouter中的方法，`useRoute`返回的是一个Proxy实例，`useRouter`返回的是Object。



## $route的属性

```js
$route.fullPath: /about/12#1
$route.path: /about/12
$route.query: {}
$route.hash: #1
$route.params: { "id": "12" }
$route.matched: [ { "path": "/about/:id", "meta": { "msg": "我是路由元信息哦" }, "props": { "default": false }, "children": [], "instances": {}, "leaveGuards": { "Set(0)": [] }, "updateGuards": { "Set(0)": [] }, "enterCallbacks": {}, "components": { "default": { "template": "<div>About</div>" } } } ]
$route.meta: { "msg": "我是路由元信息哦" }
$route.href: #/about/12#1

```





## $router的属性

```js
$router.currentRoute: { "fullPath": "/about/12#1", "path": "/about/12", "query": {}, "hash": "#1", "params": { "id": "12" }, "matched": [ { "path": "/about/:id", "meta": { "msg": "我是路由元信息哦" }, "props": { "default": false }, "children": [], "instances": {}, "leaveGuards": { "Set(0)": [] }, "updateGuards": { "Set(0)": [] }, "enterCallbacks": {}, "components": { "default": { "template": "<div>About</div>" } } } ], "meta": { "msg": "我是路由元信息哦" }, "href": "#/about/12#1" }
$router.options: { "history": { "location": "/about/12#1", "base": "/demo1.html#", "state": { "back": null, "current": "/about/12#1", "forward": null, "replaced": true, "position": 0, "scroll": { "left": 0, "top": 0 } } }, "routes": [ { "path": "/", "component": { "template": "<div>Home</div>" } }, { "path": "/about/:id", "component": { "template": "<div>About</div>" }, "meta": { "msg": "我是路由元信息哦" } } ] }
$router.__hasDevtools: true
```





## router的方法

```js
addRoute()

afterEach(guard: NavigationHookAfter)    // 添加一个导航钩子，在每次导航后执行。返回一个删除注册钩子的函数。
beforeEach(guard: NavigationGuard)    // 添加一个导航守卫，在任何导航前执行。返回一个删除已注册守卫的函数。

back()    // 相当于 router.go(-1)
forward()    // 相当于 router.go(1)

beforeResolve(guard: NavigationGuard)    // 添加一个导航守卫，在导航即将解析之前执行。在这个状态下，所有的组件都已经被获取，并且其他导航守卫也已经成功。返回一个删除已注册守卫的函数。

getRoutes()    // 获取所有路由记录的完整列表。

go() // 传入一个整数

hasRoute()    // 确认是否存在指定名称的路由。

isReady()    // 当路由器完成初始化导航时，返回一个 Promise

onError((error , to ,from)=>{})    // 添加一个错误处理程序，在导航期间每次发生未捕获的错误时都会调用该处理程序。

push(路由地址)    // 用于编程方式导航

removeRoute(路由名称)    // 删除指定路由

replace(路由地址)

resolve(路由地址)     //返回路由地址的标准化版本。还包括一个包含任何现有 base 的 href 属性。
```


