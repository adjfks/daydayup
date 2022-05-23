```js
// 获取单个顶级分类的数据
 const subList = computed(() => {
  let sub = []
  findTopCategory(route.params.id).then((data) => {
    sub = data.result
  })
  return sub
})
// error  Unexpected asynchronous action in computed function  
// vue/no-async-in-computed-properties
```


