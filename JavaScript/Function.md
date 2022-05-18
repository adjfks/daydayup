# Function

## 1.Function.length

> `**length**` 属性指明函数的形参个数。

注意：它只会计算具有默认值的形参前面的形参个数。

```js
console.log((function(a, b = 1, c) {}).length);
// 1, only parameters before the first one with
// a default value is counted

console.log((function(...args) {}).length);
// 0, rest parameter is not counted
```

应用：在写柯里化函数时用于判断形参个数。
