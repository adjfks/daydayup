---
date: 2022.4.26
---

## [222. 完全二叉树的节点个数](https://leetcode-cn.com/problems/count-complete-tree-nodes/)

> Q给你一棵 完全二叉树 的根节点 root ，求出该树的节点个数。
>
> 完全二叉树 的定义如下：在完全二叉树中，除了最底层节点可能没填满外，其余每层节点数都达到最大值，并且最下面一层的节点都集中在该层最左边的若干位置。若最底层为第 h 层，则该层包含 1~ 2h 个节点。
>
>  
>
> 示例 1：
>
> ![image-20220426083420808](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220426083420808.png)
>
> 输入：root = [1,2,3,4,5,6]
> 输出：6
> 示例 2：
>
> 输入：root = []
> 输出：0
> 示例 3：
>
> 输入：root = [1]
> 输出：1
>
>
> 提示：
>
> 树中节点的数目范围是[0, 5 * 104]
> 0 <= Node.val <= 5 * 104
> 题目数据保证输入的树是 完全二叉树

**思路**

最简单的办法就是遍历整棵树，记录节点的数量，可以使用递归和迭代两种方法。

一、遍历递归法

- 递归函数的参数为树的节点，返回值为以传入节点为根节点的树的节点数量。
- 递归结束条件，当遇到空节点时，返回0，表示节点数量为0
- 单层递归逻辑：节点数量=左子树节点数量+右子树节点数量+1（自身）

二、迭代层序遍历

层序遍历利用队列实现，在遍历过程中记录节点数量即可。如果对层序遍历还不熟悉的话，可以看看这篇文章 [【leetcode】102.二叉树的层序遍历](https://blog.csdn.net/laplacepoisson/article/details/124359003)

三、公式+递归

完全二叉树有两种情况，一是它是一棵满二叉树，这时候直接利用公式`2^深度 - 1`, 二是它的最后一层节点没有满，这时候可以递归它的左右子树，当遇到满二叉树时就利用公式计算。如下图中红色方框圈起来的就是满二叉树，可以利用公式计算。

![image-20220426085140981](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220426085140981.png)

- 递归函数参数为树的节点，返回值是以该节点为根节点的树的节点数量。
- 递归结束条件：当遇到空节点时返回0
- 单层递归逻辑：计算以当前传入节点为根节点的树，最左边节点的深度和最右边节点的深度，如果两者相等，说明是满二叉树，利用公式计算节点数量并返回。如果不相等，就利用前面普通递归的逻辑，即节点数量=左子树节点数量+右子树节点数量+1（自身）



**代码**

一、遍历递归法

```js
var countNodes = function(root) {
    if(!root) return 0
    return countNodes(root.left) + countNodes(root.right) + 1
};
```

二、迭代层序遍历

```js
var countNodes = function(root) {
    if(!root) return []
    let queue = [root]
    let count = 0
    while(queue.length){
        const len = queue.length
        const curNode = queue.shift()
        count++
        if(curNode.left) queue.push(curNode.left)
        if(curNode.right) queue.push(curNode.right)
    }

    return count
};
```

三、公式+递归

```js
var countNodes = function(root) {
    if(!root) return 0

    let left = root.left
    let right = root.right
    let leftDepth = 1
    let rightDepth = 1

    while(left){
        left = left.left
        leftDepth++
    }

    while(right){
        right = right.right
        rightDepth++
    }

    if(leftDepth === rightDepth) return 2 ** leftDepth - 1
    return countNodes(root.left) + countNodes(root.right) + 1
};
```





## [110. 平衡二叉树](https://leetcode-cn.com/problems/balanced-binary-tree/)

**题目**

> 给定一个二叉树，判断它是否是高度平衡的二叉树。
> 本题中，一棵高度平衡二叉树定义为：
> 一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1 。

> 示例 1：
>
> ![image-20220426091600513](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220426091600513.png)
>
> 输入：root = [3,9,20,null,null,15,7]
> 输出：true

> 示例 2：
>
> ![image-20220426091624610](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220426091624610.png)
>
> 输入：root = [1,2,2,3,3,null,null,4,4]
> 输出：false

> 示例 3：
> 输入：root = []
> 输出：true

> 提示：
> 树中的节点数在范围 [0, 5000] 内
> -104 <= Node.val <= 104

**思路**

求二叉树的高度适合用后序遍历即左右中，因为后序遍历是从下往上遍历，符合求高度的逻辑。

我们可以定义一个求高度的递归函数，当以传入节点为根节点的二叉树是平衡二叉树则返回它的高度，如果不是平衡二叉树则返回-1来表示整棵树已经不是平衡二叉树了。

- 递归函数参数为树的节点，返回值为树的高度或-1
- 递归函数的结束条件是当传入节点为空节点则返回0，表示高度为0
- 单层递归逻辑就是求出左子树的高度和右子树的高度，判断两个高度的差，如果小于等于1，就返回高度值为 `1 + Math.max(leftHeight , rightHeight)`，否则返回-1。

**代码**

```js
var isBalanced = function(root) {
    function getHeight(node){
        if(!node) return 0
        const leftHeight = getHeight(node.left)
        if(leftHeight === -1) return -1
        const rightHeight = getHeight(node.right)
        if(rightHeight === -1) return -1

        // 计算高度差
        if(Math.abs(leftHeight - rightHeight) <= 1){
            return 1 + Math.max(leftHeight , rightHeight)
        }else{
            return -1
        }
    }

    return getHeight(root) !== -1
};
```



## [257. 二叉树的所有路径](https://leetcode-cn.com/problems/binary-tree-paths/)

**题目**

> 给你一个二叉树的根节点 root ，按 任意顺序 ，返回所有从根节点到叶子节点的路径。
>
> 叶子节点 是指没有子节点的节点。
>
> 示例 1：
>
> ![image-20220426093908192](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220426093908192.png)
>
>
> 输入：root = [1,2,3,null,5]
> 输出：["1->2->5","1->3"]
> 示例 2：
>
> 输入：root = [1]
> 输出：["1"]
>
>
> 提示：
>
> 树中节点的数目在范围 [1, 100] 内
> -100 <= Node.val <= 100

**思路**

使用前序遍历中左右，这样能够方便让父节点指向子节点。这道题目可以使用递归来解决，用前序遍历来递归整棵树，然后在递归的过程中用数组path记录路径，当遇到空节点时什么也不做，直接返回。当遇到的节点不为空但左右子节点为空时，说明它是一个叶子节点，把它记录到路径里，然后添加到结果数组result里。要记住的是：**每一次回溯（回退）到上一层时，都要把在本层对path的操作撤销。**

- 递归函数的作用是遍历前序整棵树并且记录路径，参数就是树的节点，无返回值，但是会对路径数组进行操作。
- 递归返回条件：当遇到空节点时，说明也不做，直接返回；当遇到叶子节点时，记录该节点到路径数组并添加路径数组到结果数组，然后**在返回前撤销路径数组的添加操作。**
- 单层递归的逻辑：添加当前节点的值到路径数组，然后递归左右子节点，**递归完左右子节点要把对path数组的操作撤销。**



**代码**

```js
var binaryTreePaths = function(root) {
    let result = []
    let path = []

    function traversal(node){
        if(!node) return
        // 左右节点为空，说明node是叶子节点
        if(!node.left && !node.right){
            // 添加该节点
            path.push(node.val)
            // 保存路径
            result.push(path.join('->'))
            // 返回时要退出该节点
            return path.pop()
        }

        // 将当前节点保存到路径里
        path.push(node.val)
        // 递归左子树
        traversal(node.left)
        // 递归右子树
        traversal(node.right)
        // 回退时将当前节点移除
        path.pop()
    }

    traversal(root)
    return result
};
```





## [404. 左叶子之和](https://leetcode-cn.com/problems/sum-of-left-leaves/)

**题目**

> 给定二叉树的根节点 root ，返回所有左叶子之和。
>
>  
>
> 示例 1：
>
> ![image-20220426101809035](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220426101809035.png)
>
> 输入: root = [3,9,20,null,null,15,7] 
> 输出: 24 
> 解释: 在这个二叉树中，有两个左叶子，分别是 9 和 15，所以返回 24
> 示例 2:
>
> 输入: root = [1]
> 输出: 0
>
>
> 提示:
>
> 节点数在 [1, 1000] 范围内
> -1000 <= Node.val <= 1000

**思路**

一、递归法

使用前序遍历中左右和递归来遍历二叉树，对于每一个传入的节点，判断它的左节点是否为叶子节点，如果是，将它的值累加。然后递归下去就好了。

- 递归函数参数是树的节点，无返回值，递归的目的只是遍历二叉树。
- 递归返回条件：当遇到空节点时直接返回
- 单层递归逻辑：这里是重点，对于当前节点，判断它的左节点是否存在且为叶子节点，是的话将它的值累加。然后递归左子树和右子树。

二、迭代法

既然递归可以做，那么迭代也可以，利用栈就可以模拟递归的过程。这里还是用前序遍历来做。

首先初始时根节点在栈中，然后出栈，如果其右节点存在，则右节点入栈，如果其左节点存在，则其左节点入栈，要按照右左的顺序入栈，这样出栈时才是左右。

左叶子节点值的累加在哪里操作好呢？可以在左节点入栈的时候，判断以下它是否为叶子节点，如果是就值累加。

总而言之，栈用来遍历二叉树，然后在遍历到左节点时处理以下就好。

**代码**

一、递归法

```js
var sumOfLeftLeaves = function(root) {
    let ans = 0

    function traversal(node){
        // 空节点直接返回
        if(!node) return
        // 左节点存在且为叶子节点
        if(node.left && !node.left.left && !node.left.right){
            ans += node.left.val
        }
        // 递归左右子树
        traversal(node.left)
        traversal(node.right)
    }

    traversal(root)
    return ans
};
```

二、迭代法

```js
var sumOfLeftLeaves = function(root) {
    if(!root) return 0
    let stack = [root]  //栈
    let ans = 0 //结果

    while(stack.length){
        const cur = stack.shift()
        // 注意右节点先入栈，左节点再入栈，这样出栈时才是中左右
        if(cur.right) stack.push(cur.right)
        if(cur.left){
            stack.push(cur.left)
            // 判断左节点是否为叶子节点
            if(!cur.left.left && !cur.left.right) ans += cur.left.val
        }
    }
    return ans
};
```





## [513. 找树左下角的值](https://leetcode-cn.com/problems/find-bottom-left-tree-value/)

**题目**

> 给定一个二叉树的 根节点 root，请找出该二叉树的 最底层 最左边 节点的值。
>
> 假设二叉树中至少有一个节点。
>
>  
>
> 示例 1:
>
> ![image-20220426104059772](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220426104059772.png)
>
> 输入: root = [2,1,3]
> 输出: 1
> 示例 2:
>
> ![image-20220426104108381](C:/Users/PencilX/AppData/Roaming/Typora/typora-user-images/image-20220426104108381.png)
>
> 输入: [1,2,3,4,null,5,6,null,null,7]
> 输出: 7
>
>
> 提示:
>
> 二叉树的节点个数的范围是 [1,104]
> -231 <= Node.val <= 231 - 1 

**思路**

找最底层的节点，也就是找深度最大的节点。找最左边的节点，可以使用前序遍历，这样优先遍历左节点。

遇到叶子节点，我们就把它的深度与原来的得到的值对应的深度比较一下，如果这个叶子节点的深度比原来的深度大，那就更新深度和值。

- 递归函数参数是树的节点，没有返回值。
- 遇到空节点时就直接返回
- 单层递归逻辑，分为两种情况：
  - 左节点存在时，判断其是否为叶子节点，是的话判断深度是否满足更新条件
  - 左节点不存在时，这时候才有必要判断右节点是否为叶子节点，是的话判断其深度是否满足更新条件



**代码**

```js
var findBottomLeftValue = function(root) {
    let res = [1 , root.val]    //res[0]记录深度,res[1]记录值
    let depth = 0

    function traversal(node){
        if(!node) return 
        depth++
        if(node.left){
            if(!node.left.left && !node.left.right && depth + 1 > res[0]){
                res[0] = depth + 1
                res[1] = node.left.val
            }
        }else if(node.right){
            if(!node.right.left && !node.right.right && depth + 1 > res[0]){
                res[0] = depth + 1
                res[1] = node.right.val
            }
        }
        traversal(node.left)
        traversal(node.right)
        depth-- //记得单层递归回退要把深度回退
    }

    traversal(root)
    return res[1]
};
```

