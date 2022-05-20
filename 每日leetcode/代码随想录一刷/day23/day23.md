# DAY23 二叉树

## [102. 二叉树的层序遍历](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)

**题目**

> 给你二叉树的根节点 root ，返回其节点值的 层序遍历 。 （即逐层地，从左到右访问所有节点）。
>
>  
>
> 示例 1：
>
> <img src="https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220423084032237.png" alt="image-20220423084032237" style="zoom:50%;" />
>
> 输入：root = [3,9,20,null,null,15,7]
> 输出：[[3],[9,20],[15,7]]
> 示例 2：
>
> 输入：root = [1]
> 输出：[[1]]
> 示例 3：
>
> 输入：root = []
> 输出：[]
>
>
> 提示：
>
> 树中节点数目在范围 [0, 2000] 内
> -1000 <= Node.val <= 1000

**思路**

- 二叉树的层序遍历即一层一层从左往右遍历，利用队列这种数据结构先进先出的特点即可以完成。

**代码**

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if(!root) return []
    let queue = [root]
    let res = []
    while(queue.length){
        const len = queue.length
        let curLevel = []   //存放每一层的节点
        for(let i = 0 ; i < len ; i++){
            const curNode = queue.shift()
            curLevel.push(curNode.val)
            if(curNode.left) queue.push(curNode.left)
            if(curNode.right) queue.push(curNode.right)
        }
        res.push(curLevel)  //存放当层遍历结果
    }

    return res
};
```



## [107. 二叉树的层序遍历 II](https://leetcode-cn.com/problems/binary-tree-level-order-traversal-ii/)

**题目**

> 给你二叉树的根节点 root ，返回其节点值 自底向上的层序遍历 。 （即按从叶子节点所在层到根节点所在的层，逐层从左向右遍历）
>
>  
>
> 示例 1：
> <img src="C:/Users/PencilX/AppData/Roaming/Typora/typora-user-images/image-20220423085502174.png" alt="image-20220423085502174" style="zoom:50%;" />
>
> 输入：root = [3,9,20,null,null,15,7]
> 输出：[[15,7],[9,20],[3]]
>
> 示例 2：
> 输入：root = [1]
> 输出：[[1]]
> 
> 示例 3：
> 输入：root = []
> 输出：[]
>
>提示：
> 树中节点数目在范围 [0, 2000] 内
> -1000 <= Node.val <= 1000

**思路**

- 想想这道题目和这一道[【leetcode】102.二叉树的层序遍历](https://blog.csdn.net/laplacepoisson/article/details/124359003)题目遍历结果会有什么区别呢？其实就是那道题目结果数组翻转一下就行了。
- 翻转的操作可以在往结果数组里添加单层遍历结果时进行，即从数组头部添加。

**代码**

```
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrderBottom = function(root) {
    if(!root) return []
    let queue = [root]
    let res = []
    while(queue.length){
        const len = queue.length
        let curLevel = []   //存放每一层的节点
        for(let i = 0 ; i < len ; i++){
            const curNode = queue.shift()
            curLevel.push(curNode.val)
            if(curNode.left) queue.push(curNode.left)
            if(curNode.right) queue.push(curNode.right)
        }
        res.unshift(curLevel)  //存放当层遍历结果,从数组头部添加
    }

    return res
};
```



## [199. 二叉树的右视图](https://leetcode-cn.com/problems/binary-tree-right-side-view/)

**题目**

> 给定一个二叉树的 根节点 root，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。
>
>  
>
> 示例 1:
>
> <img src="https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220423090522452.png" alt="image-20220423090522452" style="zoom:50%;" />
>
> 输入: [1,2,3,null,5,null,4]
> 输出: [1,3,4]
> 
> 示例 2:
>输入: [1,null,3]
> 输出: [1,3]
> 
> 示例 3:
> 输入: []
> 输出: []
>
> 提示:
> 二叉树的节点个数的范围是 [0,100]
> -100 <= Node.val <= 100 

**思路**

- 想一想，从右往左看，看到的节点都有哪些特点呢？每一层都能且只能看到一个节点，且这个节点是每一层的最后一个节点。
- 根据上面的分析，很显然用二叉树的层序遍历就行了当遇到每一层的最后一个节点时，就把该节点添加到结果数组即可。

**代码**

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var rightSideView = function(root) {
    if(!root) return []
    let queue = [root]
    let res = []
    while(queue.length){
        const len = queue.length
        for(let i = 0 ; i < len ; i++){
            const curNode = queue.shift()
            if(i === len - 1) res.push(curNode.val) //判断是否当层的最后一个节点，是的话就保存
            if(curNode.left) queue.push(curNode.left)
            if(curNode.right) queue.push(curNode.right)
        }
    }

    return res
};
```

