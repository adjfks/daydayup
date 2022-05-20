---
date: 2022.4.22
---

# 二叉树

## [145. 二叉树的后序遍历](https://leetcode-cn.com/problems/binary-tree-postorder-traversal/)

**题目**

> 给你一棵二叉树的根节点 `root` ，返回其节点值的 **后序遍历** 。
>
>  
>
> **示例 1：**
>
> <img src="https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220422082014186.png" alt="image-20220422082014186" style="zoom: 50%;" />
>
> 输入：root = [1,null,2,3]
> 输出：[3,2,1]
> 示例 2：
>
> 输入：root = []
> 输出：[]
> 示例 3：
>
> 输入：root = [1]
> 输出：[1]
>
>
> 提示：
>
> 树中节点的数目在范围 [0, 100] 内
> -100 <= Node.val <= 100

**思路**

- 递归写法
  - 函数参数是当前二叉树节点和一个用于存放结果的数组
  - 终止条件是节点为空
  - 二叉树后序遍历的顺序是“左右中”，因此单层递归逻辑就是先递归左节点，再递归右节点，最后将中间节点的值存放进结果数组。
- 迭代写法
  - 迭代写法可以先看看先序遍历的迭代写法[【leetcode】144.二叉树的前序遍历](https://blog.csdn.net/laplacepoisson/article/details/124317386)，先序遍历的顺序是“中左右”，后续遍历的顺序是“左右中”，交换先序遍历中左节点和右节点的遍历顺序，变成"中右左"，然后再反转结果数组即得到“左右中”。
  - 代码只需要在前序遍历的基础上稍微更改。





**代码**

- 递归写法

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
var postorderTraversal = function(root) {
    function traversal(node , ans){
        if(!node) return 
        // 递归左节点
        traversal(node.left , ans)
        // 递归右节点
        traversal(node.right , ans)
        // 将中间节点的值存放进结果数组
        ans.push(node.val)
    }

    let ans = []
    traversal(root , ans)
    return ans
};
```

- 迭代写法

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
var postorderTraversal = function(root) {
    if(!root) return []
    let stack = []
    let ans = []
    queue.push(root)
    while(stack.length){
        const node = stack.pop()
        // 中间节点值加入结果数组
        ans.push(node.val)
        // 左节点先入栈
        if(node.left) stack.push(node.left)
        // 右节点后入栈
        if(node.right) stack.push(node.right)
    }

    // 结果数组翻转后返回
    return ans.reverse()
};
```





## [94. 二叉树的中序遍历](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/)

**题目**

> 给定一个二叉树的根节点 `root` ，返回 *它的 **中序** 遍历* 。
>
>  
>
> **示例 1：**
>
> <img src="https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220422083907882.png" alt="image-20220422083907882" style="zoom:50%;" />
>
> 输入：root = [1,null,2,3]
> 输出：[1,3,2]
> 示例 2：
>
> 输入：root = []
> 输出：[]
> 示例 3：
>
> 输入：root = [1]
> 输出：[1]
>
>
> 提示：
>
> 树中节点数目在范围 [0, 100] 内
> -100 <= Node.val <= 100

**思路**

- 递归
  - 中序遍历的顺序是“左中右”
  - 递归函数的参数是当前节点和结果数组
  - 返回条件是当前所遍历的节点为空，直接返回
  - 单层递归逻辑是先递归左节点，再将中间节点的值放入结果数组，最后递归右节点。
- 迭代
  - 由于我们访问二叉树是从根节点，也就是中间节点开始，但是中序遍历要求先遍历左节点，因此我们需要记录中间节点，并先去访问它的左子树。
  - 我们使用栈来记录节点
  - 一：只要当前遍历到的节点不为空，就要记录该节点并且去访问该节点的左节点。
  - 二：前节点为空时，说明左节点为空，需要将中间节点的值加入结果数组，此时的中间节点位于栈顶，将中间节点出栈，将它的值加入结果数组。
  - 三：接下来访问右节点，右节点不为空，回到第一步，右节点为空，回到第二步。
  - 当栈为空时结束遍历。



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
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {

    function traversal(node , ans){
        if(!node) return 

        // 先递归左节点
        traversal(node.left , ans)
        // 将中间节点的值放入结果数组
        ans.push(node.val)
        // 递归右节点
        traversal(node.right , ans)
    }

    let ans = []
    traversal(root , ans)
    return ans
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
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    let stack = []
    let ans = []
    // cur为当前节点
    let cur = root
    while(cur || stack.length){
        if(cur){
            stack.push(cur)
            // 遍历左节点
            cur = cur.left
        }else{  //当前节点为空，要处理栈顶（中间）节点
            const node = stack.pop()
            ans.push(node.val)
            // 中间节点遍历完，遍历右子树
            cur = node.right
        }
    }

    return ans
};
```





## 二叉树遍历迭代法的统一模板

leetcode上二叉树前中后序遍历对应的题目

[144. 二叉树的前序遍历](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/)

[94. 二叉树的中序遍历](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/)

[145. 二叉树的后序遍历](https://leetcode-cn.com/problems/binary-tree-postorder-traversal/)

前面学习了二叉树三种遍历方式的递归和迭代写法：

[【leetcode】144.二叉树的前序遍历](https://blog.csdn.net/laplacepoisson/article/details/124317386)

[【leetcode】94.二叉树的中序遍历](https://blog.csdn.net/laplacepoisson/article/details/124337416)

[【leetcode】145.二叉树的后序遍历](https://blog.csdn.net/laplacepoisson/article/details/124337335)

但是迭代写法前序和后序相似，而中序则很不同。

在遍历二叉树时，我们先**访问**的是中间节点，而前序遍历刚好就是要先**处理**中间节点，访问和处理可以同时进行。后续遍历的代码和前序遍历一样，也是先访问中间节点并处理中间节点，只不过交换左右节点的入栈顺序并且最后翻转一下结果数组。

但是中序遍历要先**处理**的是左节点，但是访问时先**访问**的是中间节点，处理和访问不能同时进行。

**思路**

迭代统一写法

- 用栈来保存访问过的节点，注意要保证出栈的顺序与遍历顺序一致。比如中序遍历是“左中右”，那么入栈的顺序应该为“右中左”，这样出栈时才是"左中右"。
- 我们要处理的节点都是中间节点，只不过三种遍历方式处理中间节点的顺序不一样。在中间节点入栈时我们要标记一下，用于判断该节点是中间节点。怎么标记呢？可以在中间节点入栈后再入栈一个空节点null。
- 首先判断根节点是否为空，不为空就入栈。
- 开始遍历时，让当前节点指向栈顶节点，分为2种情况：
  - 栈顶节点不为空，那么我们要按顺序将该节点和它的左右节点入栈，**这里就是三种遍历方式唯一不同的地方。**
  - 栈顶节点为空，说明遇到了可以处理的中间节点，将空节点弹出，然后弹出中间节点，并将它的值加入结果数组。
- 遍历结束的条件就是栈为空。

**代码**

- 统一模板

```js
var preorderTraversal = function(root) {
    let stack = []
    let ans = []

    if(root) stack.push(root)

    while(stack.length){
        // 当前指针指向栈顶节点
        let cur = stack[stack.length - 1]

        if(cur){    // 当前节点不为空
            stack.pop()
            // TODO:按照各自遍历顺序将节点入栈，入栈中间节点后要入栈一个空节点
            //...
            
            
        }else{  //当前节点为空
            // 弹出空节点
            stack.pop()
            // 弹出中间节点并将它的值加入结果数组
            ans.push(stack.pop().val)
        }
    }

    return ans
};
```

如以上代码所示，三种遍历方式只有TODO区域的代码有所差异

- 前序遍历

```js
// TODO:按照各自遍历顺序将节点入栈，入栈中间节点后要入栈一个空节点
if(cur.right) stack.push(cur.right)
if(cur.left) stack.push(cur.left)
stack.push(cur)
stack.push(null)
```

- 中序遍历

```js
// TODO:按照各自遍历顺序将节点入栈，入栈中间节点后要入栈一个空节点
if(cur.right) stack.push(cur.right)
stack.push(cur)
stack.push(null)
if(cur.left) stack.push(cur.left)
```

- 后续遍历

```js
// TODO:按照各自遍历顺序将节点入栈，入栈中间节点后要入栈一个空节点
stack.push(cur)
stack.push(null)
if(cur.right) stack.push(cur.right)
if(cur.left) stack.push(cur.left)
```

