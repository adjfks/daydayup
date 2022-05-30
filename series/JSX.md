在render()函数返回的内容就是当前组件的渲染内容，JSX表达式中使用单花括号

```js
<script>
export default {
  name: 'XtxTabs',
  render() {
    const name = 'tom'
    const sub = [<sub>123</sub>, <p>pppp</p>]
    function say() {
      console.log('hi jsx')
    }
    return (
      <h1 title={name} onClick={say}>
        {name}
        {sub}
      </h1>
    )
  }
}
</script>
```

```js
const nav = (
      <nav>
        {items.map((item, idx) => {
          return <a href="javascript:;">{item.props.label}</a>
        })}
      </nav>
    )
```

```js
<script>
export default {
  name: 'XtxTabs',
  render() {
    const panels = this.$slots.default()

    const nav = (
      <nav>
        {panels.map((panel, idx) => {
          return <a href="javascript:;">{panel.props.label}</a>
        })}
      </nav>
    )

    return <div class="xtx-tabs">{[nav, panels]}</div>
  }
}
</script>
```

当插入默认插槽的内容是组件标签，且组件标签通过v-for方式动态创建多个组件标签，这时通过`this.$slots.default()`拿到的内容的`type`熟悉是`Symbol(Fragment)`，真正的通过v-for得到的组件标前包含在它的`children`属性上，是一个数组。

```js
<script>
export default {
  name: 'XtxTabs',
  render() {
    const items = this.$slots.default()
    console.log(items)

    const dynamicPanels = []
    items.forEach((item, idx) => {
      if (item.type.name === 'XtxTabsPanel') {
        dynamicPanels.push(item)
      } else {
        item.children.forEach((child, idx) => {
          dynamicPanels.push(child)
        })
      }
    })
    const nav = (
      <nav>
        {dynamicPanels.map((panel, idx) => {
          return <a href="javascript:;">{panel.props.label}</a>
        })}
      </nav>
    )

    return <div class="xtx-tabs">{[nav, dynamicPanels]}</div>
  }
}
</script>
```

### jsx中绑定class

```js
(
    <a class={{ active: this.modelValue === panel.props.name }}  href="javascript:;">
    {panel.props.label}
   </a>
)
```

### jsx中绑定函数

注意JSX是单大括号插值，大括号里的就是js表达式

```js
// 函数传参错误做法: 函数会直接执行
<a onClick={this.tabClick(xxx)}>

// 正确做法
<a onClick={() => this.tabClick(xxx) >
```

### 在render()的jsx中访问setup()返回的值

使用this即可。

```js
this.activeName
```


