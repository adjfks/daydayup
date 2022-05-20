---
date: 2022.4.10
---

# DAY10 动态规划（三）

## [700. 二叉搜索树中的搜索](https://leetcode-cn.com/problems/search-in-a-binary-search-tree/)

> 给定二叉搜索树（BST）的根节点 root 和一个整数值 val。
>
> 你需要在 BST 中找到节点值等于 val 的节点。 返回以该节点为根的子树。 如果节点不存在，则返回 null 。
>
>  
>
> 示例 1:
>
> ![image-20220410075255422](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220410075255422.png)
>
> 输入：root = [4,2,7,1,3], val = 2
> 输出：[2,1,3]
>
> Example 2:
>
> ![image-20220410075320937](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220410075320937.png)
>
>
> 输入：root = [4,2,7,1,3], val = 5
> 输出：[]
>
>
> 提示：
>
> 数中节点数在 [1, 5000] 范围内
> 1 <= Node.val <= 107
> root 是二叉搜索树
> 1 <= val <= 107

**思路**

- 对于二叉搜索树，如果它的左子树不为空，则左子树上所有节点的值都小于根节点的值。
- 若右子树不为空，则右子树上所有节点的值都大于根节点的值。
- 它的左右子树也分别为二叉搜索数。

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
 * @param {number} val
 * @return {TreeNode}
 */
var searchBST = function(root, val) {
    function search(cur){
        if(cur === null || cur.val === val){
            return res = cur
        }
        if(val > cur.val){
            search(cur.right)
        }else{
            search(cur.left)
        }
    }
    let res = null
    search(root)
    return res
};
```







## [96. 不同的二叉搜索树](https://leetcode-cn.com/problems/unique-binary-search-trees/)

> 给你一个整数 n ，求恰由 n 个节点组成且节点值从 1 到 n 互不相同的 二叉搜索树 有多少种？返回满足题意的二叉搜索树的种数。
>
> 
>
> 示例 1：
>
>
> 输入：n = 3
> 输出：5
> 示例 2：
>
> 输入：n = 1
> 输出：1
>
>
> 提示：
>
> 1 <= n <= 19

思路

[见自己的题解](https://leetcode-cn.com/problems/unique-binary-search-trees/solution/jsdong-tai-gui-hua-jian-dan-tu-jie-by-vi-knw0/)

**代码**

```js
/**
 * @param {number} n
 * @return {number}
 */
var numTrees = function(n) {
    dp = [1,1,2]
    if(n <= 2) return dp[n]
    for(let i = 3 ; i <= n; i++){
        dp[i] = 0
        let mid = Math.floor(i / 2)
        for(let j = 1 ; j <= mid ; j++){
            dp[i] += 2 * dp[i - j] * dp[j - 1]
        }
        if(i % 2 !== 0){
            dp[i] += dp[i - (mid + 1)] * dp[i - (mid + 1)]
        }
    }
    return dp[n]
};
```

