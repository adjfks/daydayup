```js
onMounted(() => {
  // 如果渲染完毕立即就直接变为true不会有过渡效果
  setTimeout(() => {
    fade.value = true
  }, 0)
})
```

```less
.xtx-confirm {
    &.fade {
        transition: all 0.4s;
        background: rgba(0, 0, 0, 0.5);
    }
    .wrapper{
        &.fade {
              transition: all 0.4s;
              transform: translate(-50%, -50%);
              opacity: 1;
        }
    }
}
```


