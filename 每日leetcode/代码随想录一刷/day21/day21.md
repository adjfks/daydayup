---
date: 2022.4.21
---

# DAY21 动态规划

## [647. 回文子串](https://leetcode-cn.com/problems/palindromic-substrings/)

**题目**

> 给你一个字符串 s ，请你统计并返回这个字符串中 回文子串 的数目。
>
> 回文字符串 是正着读和倒过来读一样的字符串。
>
> 子字符串 是字符串中的由连续字符组成的一个序列。
>
> 具有不同开始位置或结束位置的子串，即使是由相同的字符组成，也会被视作不同的子串。
>
>  
>
> 示例 1：
>
> 输入：s = "abc"
> 输出：3
> 解释：三个回文子串: "a", "b", "c"
> 示例 2：
>
> 输入：s = "aaa"
> 输出：6
> 解释：6个回文子串: "a", "a", "a", "aa", "aa", "aaa"
>
>
> 提示：
>
> 1 <= s.length <= 1000
> s 由小写英文字母组成

**思路**

思路一：双重for循环暴力

思路二：动态规划

- 设`dp[i][j]`表示区间`[i,j]`（左闭右闭）的子串是否是回文串，是则为true,否则为false
- 递推关系，分为2种情况
  - 情况一：`s[i] !== s[j]`，那么区间`[i,j]`的子串一定不是回文串，`dp[i][j] = false`
  - 情况二：`s[i] === s[j]`，此时又要分为3种情况考虑
    - 当`i === j`，比如`'a'`这种是回文串，`dp[i][j] = true`
    - 当`j - i === 1`，比如`aa`这种也属于回文串，`dp[i][j] = true`
    - 当`j - i > 1`，那么就要看`[i+1 ,j-1]`是否为回文串，当`dp[i+1][j-1] === true`时，`dp[i][j] = true`;当`dp[i+1][j-1] === false`时，`dp[i][j] = false`
- dp数组全部初始化为false
- 由情况二中的第三种情况，需要根据`dp[i+1][j-1]`的值来得到`dp[i][j]`的值，而`dp[i+1][j-1]`在`dp[i][j]`的左下角，故遍历时从左到右，从下到上。



**代码**

- 思路一：暴力

```js
/**
 * @param {string} s
 * @return {number}
 */
var countSubstrings = function(s) {
    function isPalindrome(s , start , end){
        let str = s.slice(start , end + 1)
        return str === str.split('').reverse().join('')
    }

    let ans = 0

    for(let i = 0 ; i < s.length ; i++){
        for(let j = i ; j < s.length ; j++){
            if(isPalindrome(s , i , j)) ans++
        }
    }
    return ans
};
```



- 思路二：动态规划

```js
/**
 * @param {string} s
 * @return {number}
 */
var countSubstrings = function(s) {
    let len = s.length
    let ans = 0
    let dp = (new Array(len)).fill(false).map(x => (new Array(len)).fill(false))

    for(let i = len - 1 ; i >= 0 ; i--){
        for(let j = i ; j < len ; j++){
            if(s[i] === s[j]){
                if(j - i <= 1 || dp[i+1][j-1]){
                    dp[i][j] = true
                    ans++
                }else{
                    dp[i][j] = false
                }
            }
        }
    }

    return ans
};
```

**复杂度**

- 时间复杂度
  - 思路一：$O(n^3)$
  - 思路二：$O(n^2)$

- 空间复杂度
  - 思路一：$O(n)$
  - 思路二：$O(n^2)$





## [516. 最长回文子序列](https://leetcode-cn.com/problems/longest-palindromic-subsequence/)

做这道题之前可以先看一下这一道[【leetcode】647.回文子串](https://blog.csdn.net/laplacepoisson/article/details/124315424)

**题目**

> 给你一个字符串 s ，找出其中最长的回文子序列，并返回该序列的长度。
>
> 子序列定义为：不改变剩余字符顺序的情况下，删除某些字符或者不删除任何字符形成的一个序列。
>
>  
>
> 示例 1：
>
> 输入：s = "bbbab"
> 输出：4
> 解释：一个可能的最长回文子序列为 "bbbb" 。
> 示例 2：
>
> 输入：s = "cbbd"
> 输出：2
> 解释：一个可能的最长回文子序列为 "bb" 。
>
>
> 提示：
>
> 1 <= s.length <= 1000
> s 仅由小写英文字母组成

**思路**

动态规划

- 设`dp[i][j]`表示区间`[i,j]`的最长回文子序列的长度为`dp[i][j]`
- 递推关系分为2种情况
  - 当`s[i] === s[j]`时，分为3种情况
    - `j === i`,`dp[i][j] = 1`
    - `j - i === 1` , 即类似`'aa'`这种情况，`dp[i][j] = 2`
    - `j - i > 1` , `dp[i][j] = dp[i+1][j-1] + 2`
  - 当`s[i] !== s[j]`时，要删除两者中的一个字符，取删除后回文串长度大的，即`dp[i][j] = Math.max(dp[i+1][j] , dp[i][j-1])`
- `dp`数组初始化为0即可
- 遍历顺序从左到右，从下到上

**代码**

```js
/**
 * @param {string} s
 * @return {number}
 */
var longestPalindromeSubseq = function(s) {
    let len = s.length
    let ans = 0
    let dp = (new Array(len)).fill(false).map(x => (new Array(len)).fill(false))

    for(let i = len - 1 ; i >= 0 ; i--){
        for(let j = i ; j < len ; j++){
            if(s[i] === s[j]){
                if(j === i) dp[i][j] = 1
                else if(j - i === 1) dp[i][j] = 2
                else dp[i][j] = dp[i+1][j-1] + 2
            }else{
                dp[i][j] = Math.max(dp[i][j-1] , dp[i+1][j])
            }
            // 更新最长长度
            ans = Math.max(ans , dp[i][j])
        }
    }

    return ans
};
```

**复杂度**

- 时间复杂度：$O(n^2)$
- 空间复杂度：$O(n^2)$





## [144. 二叉树的前序遍历](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/)

**题目**

> 给你二叉树的根节点 `root` ，返回它节点值的 **前序** 遍历。
>
> 
>
> **示例 1：**
>
> ![image-20220421111257113](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220421111257113.png)
>
> 输入：root = [1,null,2,3]
> 输出：[1,2,3]
> 示例 2：
>
> 输入：root = []
> 输出：[]
> 示例 3：
>
> 输入：root = [1]
> 输出：[1]
>
> **示例 4：**
>
> ![image-20220421111331568](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220421111331568.png)
>
> 输入：root = [1,2]
> 输出：[1,2]
>
> **提示：**
>
> - 树中节点数目在范围 `[0, 100]` 内
> - `-100 <= Node.val <= 100`



**思路**

- 递归
  - 递归函数参数：当前节点node，用于存放结果的数组ans
  - 确定递归返回条件：当前节点为空，直接return
  - 单层递归逻辑：前序遍历是'根左右'，先存放中间节点的值，然后递归左节点，再递归右节点

- 迭代
  - 利用栈使用迭代的方法来完成前序遍历
  - 首先将中间节点入栈
  - 出栈一个节点，将该节点的右节点先入栈，然后再将左节点入栈。为什么右节点先入栈？这样出栈时才是左节点先出栈，右节点后出栈，也就是前序遍历的‘中左右’
  - 栈为空时就结束

**代码**

- 递归

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
 * @return {number[]}
 */
var preorderTraversal = function(root) {
    function traversal(node , ans){
        if(node === null) return

        // 放入中间节点的值
        ans.push(node.val)
        // 递归左右节点
        traversal(node.left , ans)
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
var preorderTraversal = function(root) {
    if(!root) return []
    let queue = []
    let ans = []
    queue.push(root)

    while(queue.length){
        const node = queue.pop()
        ans.push(node.val)
        if(node.right) queue.push(node.right)
        if(node.left) queue.push(node.left)
    }

    return ans
};
```