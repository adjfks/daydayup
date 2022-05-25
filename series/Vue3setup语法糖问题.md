> 注意⚠️，通过`<script setup>`语法糖的写法，其组件是默认关闭的，也就是说如果是通过`$refs`或者`$parents`来访问子组件中定义的值是拿不到的，必须通过**defineExpose**向外暴露你想获取的值才行。





出处：[Vue3挂载全局变量和$refs - 掘金](https://juejin.cn/post/7082374037024243748)


