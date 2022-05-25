### 1. axios 遇见 http https 开头的地址，不会加上基准地址

```js
return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get')  
```


