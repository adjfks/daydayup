1. 给vue组件标签直接添加style属性，会作用在根标签上：

```html
<!-- 轮播图 -->
<XtxCarousel :sliders="sliders" style="height: 500px"></XtxCarousel>
```

组件template

```html
<template>
  <div class="xtx-carousel">
    ...
  </div>
</template>
```

相当于

```html
<template>
  <div class="xtx-carousel" style="height: 500px">
    ...
  </div>
</template>
```


