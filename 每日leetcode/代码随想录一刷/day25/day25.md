---
date:2022.4.25
---

# DAY25 二叉树

## [104. 二叉树的最大深度](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/)

**题目**

> 给定一个二叉树，找出其最大深度。
>
> 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。
>
> 说明: 叶子节点是指没有子节点的节点。
>
> 示例：
> 给定二叉树 [3,9,20,null,null,15,7]，
>
>       3
>      / \
>      9  20
>        /  \
>       15   7
>返回它的最大深度 3 。

**思路**

一、递归法

使用前序遍历（中左右）或者使用后序遍历（左右中）来遍历二叉树，这里我们用前序遍历求的就是深度，后续遍历求的是高度，其实两者相等。我们使用后序来讲解。

- 确定递归函数的参数和返回值：参数就是树的根节点，返回值是树的高度
- 确定递归函数的结束条件，什么时候结束递归呢？当遇到节点为空时，结束递归，返回高度为0（空节点看作高度为0的树）
- 单层递归的逻辑：要得到树的最大高度，怎么做呢？当前节点不为空，高度贡献就是1，所有只要得到左子树的高度和右子树的高度，然后选择高度大的加上1就可以了。

二、迭代法

求二叉树的最大深度，迭代法使用层序遍历最为合适，求深度就是求有多少层嘛！

**代码**

一、递归法

```js
var maxDepth = function(root) {
    // 递归返回条件,空节点看作高度为0的树
    if(!root) return 0

    // 后序遍历
    const leftDepth = maxDepth(root.left)   // 左边节点高度
    const rightDepth = maxDepth(root.right) // 右边节点高度
    const depth = 1 + Math.max(leftDepth , rightDepth)

    // 返回最终的高度
    return depth
};
```

当然，上面的代码只是为了体现出后序遍历且使逻辑更加清晰，我们当然可以精简一下,这样只需要两行代码就搞定了。

```js
var maxDepth = function(root) {
    // 递归返回条件,空节点看作高度为0的树
    if(!root) return 0
    // 返回最终的高度
    return 1 + Math.max(maxDepth(root.left) , maxDepth(root.right))
};
```

二、迭代法（层序遍历）

```js
var maxDepth = function(root) {
    if(!root) return 0
    let queue = [root]
    let depth = 0

    while(queue.length){
        const levelLength = queue.length	//每一层的节点个数
        for(let i = 0 ; i < levelLength ; i++){
            const cur = queue.shift()
            if(cur.left) queue.push(cur.left)
            if(cur.right) queue.push(cur.right)
        }
        depth++
    }

    return depth
};
```





## [559. N 叉树的最大深度](https://leetcode-cn.com/problems/maximum-depth-of-n-ary-tree/)

**题目**

> 给定一个 N 叉树，找到其最大深度。
> 最大深度是指从根节点到最远叶子节点的最长路径上的节点总数。
> N 叉树输入按层序遍历序列化表示，每组子节点由空值分隔（请参见示例）。
>
> 示例 1：
> <img src="https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220425093330535.png" alt="image-20220425093330535" style="zoom:67%;" />
> 输入：root = [1,null,3,2,4,null,5,6]
> 输出：3
>
> 示例2：
> <img src="https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220425093414593.png" alt="image-20220425093414593" style="zoom:67%;" />
>
> 输入：root = [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]
> 输出：5
>
>提示：
> 树的深度不会超过 1000 。
> 树的节点数目位于 [0, 104] 之间。

**思路**

首先来看看代码模板中n叉树节点的定义

```js
/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */
```

对比二叉树，n叉树的孩子节点个数不一致，但是通过`children`的就可以遍历每个孩子节点了，所以这道题本质与[【leetcode】104.二叉树的最大深度](https://blog.csdn.net/laplacepoisson/article/details/124396929)是一样的，思路也完全一样，这里同样给出递归和迭代两种写法。



**代码**

一、递归法

```js
/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {Node|null} root
 * @return {number}
 */
var maxDepth = function(root) {
    // 递归返回条件,空节点看作高度为0的树
    if(!root) return 0

    let max = 0

    // 后序遍历,通过children遍历所有孩子节点并计算得到高度
    for(let i = 0 ; i < root.children.length ; i++){
        const cur = maxDepth(root.children[i])
        max = max > cur ? max : cur
    }

    // 返回最终的高度
    return 1 + max
};
```

二、迭代法（层序遍历）

```js
/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {Node|null} root
 * @return {number}
 */
var maxDepth = function(root) {
    if(!root) return 0
    let queue = [root]
    let depth = 0

    while(queue.length){
        const levelLength = queue.length	//每一层的节点个数
        for(let i = 0 ; i < levelLength ; i++){
            const cur = queue.shift()
            // 这里的逻辑和二叉树不同
            for(let i = 0 ; i < cur.children.length ; i++){
                queue.push(cur.children[i])
            }
        }
        depth++
    }

    return depth
};
```





## [111. 二叉树的最小深度](https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/)

**题目**

> 给定一个二叉树，找出其最小深度。
>
> 最小深度是从根节点到最近叶子节点的最短路径上的节点数量。
>
> **说明：**叶子节点是指没有子节点的节点。
>
>  
>
> **示例 1：**
>
> <img src="C:/Users/PencilX/AppData/Roaming/Typora/typora-user-images/image-20220425095155048.png" alt="image-20220425095155048" style="zoom: 67%;" />
>
> 输入：root = [3,9,20,null,null,15,7]
> 输出：2
> 示例 2：
>
> 输入：root = [2,null,3,null,4,null,5,null,6]
> 输出：5
>
>
> 提示：
>
> 树中节点数的范围在 [0, 105] 内
> -1000 <= Node.val <= 1000

**思路**

首先要注意以下最小深度的定义：从根节点到最近**叶子节点**的最短路径上的节点数量。

所以像下面这棵树的深度应该为3而不是1

<img src="https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220425095848222.png" alt="image-20220425095848222" style="zoom:67%;" />

递归法

- 我们定义一个递归函数用于求树的最小高度，因为最小高度等于最小深度

- 递归函数的参数和返回值：参数就是要求的树的根节点，返回值就是该树的最小高度。

- 递归结束条件：当遇到空节点时，返回高度为0，即空节点看作高度为0的节点。

- 单层递归的逻辑：这里是容易出错的地方，因为树的最小深度是根节点到最近**叶子节点**的节点数量，所以要分4种情况讨论：

  - 第一种：左子树为空，右子树不为空，深度为`1 + minDepth(node.right)`
  - 第二种：左子树不为空，右子树为空，深度为`1 + minDepth(node.left)`
  - 第三种：左右子树都不为空，深度为`1 + Math.min(minDepth(node.right),minDepth(node.left))`
  - 第四种：左右子树都为空，深度为`1`

  其中第三种和第四种可以合并为一种 ，深度为`1 + Math.min(minDepth(node.right),minDepth(node.left))`

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
 * @return {number}
 */
var minDepth = function(root) {
    if(!root) return 0
    // 计算左右子树最小深度
    const leftDepth = minDepth(root.left)
    const rightDepth = minDepth(root.right)

    if(!leftDepth && rightDepth) return 1 + rightDepth
    if(leftDepth && !rightDepth) return 1 + leftDepth
    return 1 + Math.min(leftDepth , rightDepth)
};
```

