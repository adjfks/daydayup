在vue单文件组件的`render`属性函数里，可以通过两种方式访问`props`

```js
// 假设接收了一个名为modelValue的props
console.log(this.modelValue)
console.log(this.$props.modelValue)
```
