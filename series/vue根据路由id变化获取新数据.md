```js
const subList = ref([])
watch(
  () => route.params.id,
  (newVal) => {
    if (newVal) {
      findTopCategory(newVal).then((data) => {
        subList.value = data.result.children
      })
    }
  },
  {
      // watch 在组件初始化时默认不触发，设置immediate: true就会触发
    immediate: true
  }
)
```
