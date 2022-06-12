# 判断在A树中是否存在和B树相同的子结构

判断从根节点开始有相同的部分

```js
const isSameTree = (A , B) => {
    // B先遍历完说明A中有和B相同的部分
    if(!B) return true
    // A先遍历完B还没遍历完说明不相同
    if(!A) return false
    // 值不相同，两棵树没有相同部分
    if(A.val !== B.val) return false
    // 左子树相同且右子树相同就相同
    return isSameTree(A.left , B.left) && isSameTree(A.right , B.right)
}
```

判断A中有B子结构

```js

```
