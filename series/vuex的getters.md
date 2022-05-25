### getters

在vue模板里使用

```html
{{$store.getters['cart/validTotal']}}
```

### 在getters中可以调用其他getters

```js
// 有效商品列表
validList(state) {
  return state.list.filter((item) => item.stock > 0 && item.isEffective)
},
// 选中的商品列表
selectedList(state , getters) {
  // 调用validList,第二个参数是getters
  return getters.validList.filter((item) => item.selected)
}
```

### 在actions中使用本模块getters

```js
checkAllCart(context) {
     // 访问getters的validList
     context.getters.validList.forEach((item) => {
         ...
     })
}
```


