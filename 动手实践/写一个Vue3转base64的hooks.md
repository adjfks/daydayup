# 写一个图片转base64的hooks

Vue3中一个hooks其实就是一个函数。

```js
export default (options: Options):Promise<{base64: string}> => {}
```

获取图片DOM

```js
import {onMounted} from 'vue'
onMounted(() => {
      const img:HTMLImageElement = document.querySelector(options.el)
})
```

使用canvas将图片转为base64字符串

```js
const base64 = (el: HTMLImageElement) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = el.width
      canvas.height = el.height
      ctx?.drawImage(el, 0, 0, el.width, el.height)
      return canvas.toDataURL('image/jpg')
}
```

drawImage的参数：

| 参数      | 描述                                                |
| ------- | ------------------------------------------------- |
| img     | 要使用的图像、画布或视频                                      |
| sx      | 可选，开始剪切的x坐标位置                                     |
| sy      | 可选，开始剪切的y坐标位置                                     |
| swidth  | 可选，被剪切图像的宽度                                       |
| sheight | 可选，被剪切图像的高度                                       |
| x       | 在画布上放置图像的x坐标位置                                    |
| y       | 在画布上放置图像的y坐标位置                                    |
| width   | 可选，要使用的图像的宽度（伸展或缩小图像）                             |
| height  | 可选，要使用的图像的高度（伸展或缩小图像） |

使用上面的函数

```js
onMounted(() => {
      const img:HTMLImageElement = document.querySelector(options.el)
      img.onload = () => {
        base64(img)
      }
    })
```

用promise包装一下，完整代码

```js
import {onMounted} from 'vue'

type Options = {
  el:string
}

export default (options: Options):Promise<{base64: string}> => {
  return new Promise((resolve) => {
    onMounted(() => {
      const img:HTMLImageElement = document.querySelector(options.el)
      img.onload = () => {
        resolve({
          base64: base64(img)
        })
      }
    })

    const base64 = (el: HTMLImageElement) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = el.width
      canvas.height = el.height
      ctx?.drawImage(el, 0, 0, el.width, el.height)
      return canvas.toDataURL('image/jpg')
    }
  })

}

```
