---
date: 2022.4.24
---

# DAY24 二叉树

## [226. 翻转二叉树](https://leetcode-cn.com/problems/invert-binary-tree/)

**题目**

> 给你一棵二叉树的根节点 `root` ，翻转这棵二叉树，并返回其根节点。
>
>  
>
> **示例 1：**
>
> ![image-20220424085411774](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220424085411774.png)输入：root = [4,2,7,1,3,6,9]
> 输出：[4,7,2,9,6,3,1]
>
> **示例 2：**
>
> ![image-20220424085452318](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220424085452318.png)
>
> 输入：root = [2,1,3]
> 输出：[2,3,1]
> 示例 3：
>
> 输入：root = []
> 输出：[]
>
>
> 提示：
>
> 树中节点数目范围在 [0, 100] 内
> -100 <= Node.val <= 100

**思路**

- 观察一下翻转后的二叉树，与原二叉树有什么区别呢？以示例一为例，可以看到4的左右节点7和2位置互换，2的左右节点1和3位置互换，7的左右节点6和9位置互换
- 根据上面的分析，我们只需要翻转每一个节点的左右子树即可。
- 要翻转每一个节点的左右子树，那么就要遍历二叉树所有节点，遍历方式选择前序、后序、中序、层序到可以，具体到写法上也有递归和迭代，看自己哪个熟选哪个就好。

**代码**

- 递归写法（前序遍历）

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
 * @return {TreeNode}
 */
var invertTree = function(root) {
    
    function reverseSon(node){
        // 结束递归的条件是左右节点都为空
        if(!node.left && !node.right) return
        // 交换左右子树的位置
        const temp = node.left
        node.left = node.right
        node.right = temp
        // 递归左右子树
        if(node.left) reverseSon(node.left)
        if(node.right) reverseSon(node.right)
    }
    
    if(!root) return root
    reverseSon(root)
    return root
};
```

- 迭代写法（层序遍历）

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
 * @return {TreeNode}
 */
var invertTree = function(root) {
    if(!root) return root
    let queue = [root]
    while(queue.length){
        const cur = queue.shift()
        // 如果左右子树都为null，则跳过本轮循环
        if(!cur.left && !cur.right) continue

        if(cur.left) queue.push(cur.left)
        if(cur.right) queue.push(cur.right)

        // 交换左右子树
        const temp = cur.left
        cur.left = cur.right
        cur.right = temp
    }
    return root
};
```





## [101. 对称二叉树](https://leetcode-cn.com/problems/symmetric-tree/)

**题目**

> 给你一个二叉树的根节点 root ， 检查它是否轴对称。
>
>  
>
> 示例 1：
>
> <img src="https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220424093026661.png" alt="image-20220424093026661" style="zoom:50%;" />
>
> 输入：root = [1,2,2,3,4,4,3]
> 输出：true
>
> 示例 2：
>
> <img src="https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220424093043633.png" alt="image-20220424093043633" style="zoom:50%;" />
>
> 输入：root = [1,2,2,null,3,null,3]
> 输出：false
>
>
> 提示：
>
> 树中节点数目在范围 [1, 1000] 内
> -100 <= Node.val <= 100

**思路**

- 迭代

  - 观察一下对称二叉树的特点，发现根节点的左右子树是相互翻转的关系，即左子树翻转后对应位置的节点值与右子树相同，那么一种最简单的方法就是翻转其中一个子树，然后同时遍历两个树，比较每个节点的值，都相同就返回true,有不同就直接返回false。
  - 其实上面的翻转步骤我们可以不做，直接迭代遍历两个子树，比较左子树的左节点和右子树的右节点，左子树的右节点和右子树的左节点。
  - 那么要怎么遍历和比较呢？我们可以借助队列。
    - 根节点的左右子节点先入队。
    - 然后出队两个节点，比较它们的值，如果不相等，直接返回false
    - 如果相等，就要去比较接下来对应位置的节点了。让出队的**左节点的右节点**和出队的**右节点的左节点**相继入队，再让**左节点的左节点**和**右节点的右节点**相继入队。
    - 重复第二和第三个步骤，直到队列为空。

- 递归

  - 确定递归的参数和返回值：参数是对应位置的节点，返回值有以下几种情况
    - 当两个节点都为null，对称，返回true
    - 当一个节点为null另一个不为null，返回false
    - 当两个节点的值不相等，返回false
    - 当两个节点的值都相等，进行接下来的递归操作
  - 单层递归的逻辑，也就是当传入的两个节点的值相等时要进行的操作。
    - 递归一个节点的左子树和另一个节点的右子树，得到返回值
    - 递归一个节点的右子树和另一个节点的左子树，得到返回值
    - 只有两个返回值都为true时才返回true,否则返回false
  
  

**代码**

- 迭代（使用队列）

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
 * @return {boolean}
 */
var isSymmetric = function(root) {
    let queue = []
    queue.push(root.left)
    queue.push(root.right)
    
    while(queue.length){
        // 出队两个节点
        const leftNode = queue.shift()
        const rightNode = queue.shift()
        // 两个节点都为空，对称，跳过本次循环
        if(!leftNode && !rightNode) continue
        // 两个节点有一个为空 或者 都不为空但值不相等 返回false
        if(!leftNode || !rightNode ||  leftNode.val !== rightNode.val) return false
        // 入队对应位置的节点
        queue.push(leftNode.left)
        queue.push(rightNode.right)
        queue.push(leftNode.right)
        queue.push(rightNode.left)
    }

    return true

};
```

- 递归

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
 * @return {boolean}
 */
var isSymmetric = function(root) {

    function compare(l , r){
        // 当两个节点都为null，对称，返回true
        if(!l && !r) return true
        // 当一个节点为null另一个不为null，返回false
        if(!l || !r) return false
        // 当两个节点的值不相等，返回false
        if(l.val !== r.val) return false

        // 当两个节点的值都相等，进行接下来的递归操作
        // 递归一个节点的左子树和另一个节点的右子树，得到返回值
        const res1 = compare(l.left , r.right)
        // 递归一个节点的右子树和另一个节点的左子树，得到返回值
        const res2 = compare(l.right , r.left)
        // 只有两个返回值都为true时才返回true,否则返回false
        return res1 && res2
    }

    return compare(root.left , root.right)
};
```





## [100. 相同的树](https://leetcode-cn.com/problems/same-tree/)

**题目**

> 给你两棵二叉树的根节点 p 和 q ，编写一个函数来检验这两棵树是否相同。
>
> 如果两个树在结构上相同，并且节点具有相同的值，则认为它们是相同的。
>
>  
>
> 示例 1：
>
> <img src="https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220424102522254.png" alt="image-20220424102522254" style="zoom:50%;" />
>
> 输入：p = [1,2,3], q = [1,2,3]
> 输出：true
>
> 示例 2：
>
> <img src="https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220424102541069.png" alt="image-20220424102541069" style="zoom:50%;" />
>
> 输入：p = [1,2], q = [1,null,2]
> 输出：false
> 示例 3：
>
> <img src="https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220424102557695.png" alt="image-20220424102557695" style="zoom:50%;" />
>
> 输入：p = [1,2,1], q = [1,1,2]
> 输出：false
>
>
> 提示：
>
> 两棵树上的节点数目都在范围 [0, 100] 内
> -104 <= Node.val <= 104

**思路**

这道题目其实和[【leetcode】101.对称二叉树](https://blog.csdn.net/laplacepoisson/article/details/124376621)很相似，而且难度还降低了一些，我们只需要比较相同位置的节点值即可，同样可以使用递归和迭代两种写法。

代码只需要在[【leetcode】101.对称二叉树](https://blog.csdn.net/laplacepoisson/article/details/124376621)的基础上修改以下即可。

**代码**

- 递归

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
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
var isSameTree = function(p, q) {
    function compare(l , r){
        // 当两个节点都为null，对称，返回true
        if(!l && !r) return true
        // 当一个节点为null另一个不为null，返回false
        if(!l || !r) return false
        // 当两个节点的值不相等，返回false
        if(l.val !== r.val) return false
		
        //只需要修改这里的代码
        // 当两个节点的值都相等，进行接下来的递归操作
        const res1 = compare(l.left , r.left)
        const res2 = compare(l.right , r.right)
        // 只有两个返回值都为true时才返回true,否则返回false
        return res1 && res2
    }

    return compare(p , q)
};
```

- 迭代

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
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
var isSameTree = function(p, q) {
    let queue = []
    // 这里修改成p、q
    queue.push(p)
    queue.push(q)
    
    while(queue.length){
        // 出队两个节点
        const leftNode = queue.shift()
        const rightNode = queue.shift()
        // 两个节点都为空，对称，跳过本次循环
        if(!leftNode && !rightNode) continue
        // 两个节点有一个为空 或者 都不为空但值不相等 返回false
        if(!leftNode || !rightNode ||  leftNode.val !== rightNode.val) return false

        // 修改这里的代码
        // 入队对应位置的节点
        queue.push(leftNode.left)
        queue.push(rightNode.left)
        queue.push(leftNode.right)
        queue.push(rightNode.right)
    }

    return true
};
```



## [572. 另一棵树的子树](https://leetcode-cn.com/problems/subtree-of-another-tree/)

**题目**

> 给你两棵二叉树 root 和 subRoot 。检验 root 中是否包含和 subRoot 具有相同结构和节点值的子树。如果存在，返回 true ；否则，返回 false 。
>
> 二叉树 tree 的一棵子树包括 tree 的某个节点和这个节点的所有后代节点。tree 也可以看做它自身的一棵子树。
>
> **示例 1：**
>
> <img src="https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220424104024565.png" alt="image-20220424104024565" style="zoom:50%;" />
>
> 输入：root = [3,4,5,1,2], subRoot = [4,1,2]
> 输出：true
>
> **示例 2：**
>
> ![image-20220424104115799](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220424104115799.png)
>
> 输入：root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]
> 输出：false
>
>
> 提示：
>
> root 树上的节点数量范围是 [1, 2000]
> subRoot 树上的节点数量范围是 [1, 1000]
> -104 <= root.val <= 104
> -104 <= subRoot.val <= 104

**思路**

- 首先把问题简单化一下，如何判断两个树是否相等？只需满足三个条件：
  - 一是根节点值相等
  - 二是左子树相等
  - 三是右子树相等
- 然后回到本题，如何判断树s是t的子树？只需下面三个条件满足其一即可：
  - 两棵树相等
  - s的左子树等于t
  - s的右子树等于t
- 根据上面的分析，使用递归比较方便
  - 首先是判断两个树相等的递归函数，可以参考[【leetcode】100.相同的树](https://blog.csdn.net/laplacepoisson/article/details/124377096)的递归写法
  - 判断一个树是另一个树的子树的递归函数
    - 三种情况满足其一就返回true
      - 两棵树相等
      - s的左子树等于t
      - s的右子树等于t



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
 * @param {TreeNode} subRoot
 * @return {boolean}
 */
var isSubtree = function(root, subRoot) {
    // 判断两棵树是否相等的递归函数
    function isSame(s , t){
        if(!s && !t) return true
        if(!s || !t) return false
        if(s.val !== t.val) return false
        return isSame(s.left , t.left) && isSame(s.right , t.right)
    }
    // 判断子树的递归函数
    function isSub(s , t){
        if(!s && !t) return true
        if(!s || !t) return false
        return isSame(s , t) || isSub(s.left , t) || isSub(s.right , t)
    }

    return isSub(root , subRoot)
};
```

