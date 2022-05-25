### 应用：更新购物车内所有商品的信息

```js
const promiseArr = context.state.list.map((item) => {
  // getNewCartGoods是后台api接口，返回promise
  return getNewCartGoods(item.skuId)
})
Promise.all(promiseArr).then((dataArr) => {
  dataArr.forEach((data, i) => {
    context.commit('updateCart', { skuId: context.state.list[i].skuId, ...data.result })
  })
})
```


