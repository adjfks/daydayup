```html
<transition name="fade-right" mode="out-in">
    <XtxBreadItem to="/" :key="topCategory.id">{{ topCategory.name }}</XtxBreadItem>
 </transition>
```

css

```css
.fade-right-enter-to,
.fade-right-leave-from {
  opacity: 1;
  transform: none;
}
.fade-right-enter-active,
.fade-right-leave-active {
  transition: all 0.5s;
}
.fade-right-enter-from,
.fade-right-leave-to {
  opacity: 0;
  transform: translate3d(20px, 0, 0);
}
```



**注意：要使组件创建和移除需要加上key属性绑定id，否则vue会复用组件，就不会有动画效果。**




