抛开`useVModel`的第四个options参数，其基本原理其实就是使用了computed，实现代码简化如下

```js
function useVModel(props , varName , emit){
    return computed({
        get(){
            props[varName]
        },
        set(newVal){
            emit('updata:modelValue' , newVal)
        }
    })
}
```

该函数返回的是一个`ComputedRefImpl`类型，要访问值需要通过`value`属性

```js
const activeName = useVModel(props , 'activeName' , emit)
consolt.log(activeName.value)
```
