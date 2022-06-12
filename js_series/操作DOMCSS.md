### 1. 获取自定义属性

```js
<input type="range" data-sizing="px">


const suffix = this.dataset.sizing || ''
```



### 2. 给<html>设置css变量

```js
document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix)
```


