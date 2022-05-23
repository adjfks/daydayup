1. 下面这里使用await会报`TypeError: Cannot read properties of null (reading 'id')`错误

```js
// 获取单个顶级分类的数据
const subList = ref([])
onBeforeRouteUpdate(async (to, from) => {
  // 仅当 id 更改时才获取用户，例如仅 query 或 hash 值已更改
  if (to.params.id && from.params.id && to.params.id !== from.params.id) {
    console.log(to.params)
    const { result } = await findTopCategory(to.params.id)
    subList.value = result
  }
})
```

2. 下面则不会报错

```js
// 获取单个顶级分类的数据
const subList = ref([])
onBeforeRouteUpdate(async (to, from) => {
  // 仅当 id 更改时才获取用户，例如仅 query 或 hash 值已更改
  if (to.params.id && from.params.id && to.params.id !== from.params.id) {
    findTopCategory(to.params.id).then((data) => {
      subList.value = data.result.children
    })
  }
})
```


