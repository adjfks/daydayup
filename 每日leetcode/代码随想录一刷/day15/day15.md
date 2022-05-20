---
date: 2022.4.15
---

# DAY15 打家劫舍系列

## [198. 打家劫舍](https://leetcode-cn.com/problems/house-robber/)

**题目**

> 你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
>
> 给定一个代表每个房屋存放金额的非负整数数组，计算你 不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。
>
>  
>
> 示例 1：
>
> 输入：[1,2,3,1]
> 输出：4
> 解释：偷窃 1 号房屋 (金额 = 1) ，然后偷窃 3 号房屋 (金额 = 3)。
>      偷窃到的最高金额 = 1 + 3 = 4 。
> 示例 2：
>
> 输入：[2,7,9,3,1]
> 输出：12
> 解释：偷窃 1 号房屋 (金额 = 2), 偷窃 3 号房屋 (金额 = 9)，接着偷窃 5 号房屋 (金额 = 1)。
>      偷窃到的最高金额 = 2 + 9 + 1 = 12 。
>
>
> 提示：
>
> 1 <= nums.length <= 100
> 0 <= nums[i] <= 400

**思路**

- 设dp[i] 表示前i间房子能够得到的最大价值为dp[i]
- 递推关系就是 `dp[i] = Math.max(dp[i-2] + nums[i] , dp[i-1])`
- dp数组初始化，由于 `dp[i]`依赖于它的前两项，所以要初始化 `dp[0] = 0 , dp[1] = nums[0]`，`dp[0]`只是为了初始化，没有实际意义，因为nums数组的长度大于等于1.
- 从 `i = 2`开始遍历dp数组，对应nums数组的下标 `i - 1`

**代码**

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    let len = nums.length
    let dp = (new Array(len + 1)).fill(0)
    dp[1] = nums[0]
    for(let i = 2 ; i < len + 1 ; i++){
        dp[i] = Math.max(dp[i - 2] + nums[i-1] , dp[i-1])
    }
    return dp[len]
};
```

优化一下空间复杂度，用变量代替dp数组

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    let len = nums.length
    let pre = 0
    let cur = nums[0]
    for(let i = 1 ; i < len ; i++){
        let temp = cur
        cur = Math.max(pre + nums[i] , cur)
        pre = temp
    }
    return cur
};
```

#### [213. 打家劫舍 II](https://leetcode-cn.com/problems/house-robber-ii/)

**题目**

> 你是一个专业的小偷，计划偷窃沿街的房屋，每间房内都藏有一定的现金。这个地方所有的房屋都 围成一圈 ，这意味着第一个房屋和最后一个房屋是紧挨着的。同时，相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警 。
>
> 给定一个代表每个房屋存放金额的非负整数数组，计算你 在不触动警报装置的情况下 ，今晚能够偷窃到的最高金额。
>
>  
>
> 示例 1：
>
> 输入：nums = [2,3,2]
> 输出：3
> 解释：你不能先偷窃 1 号房屋（金额 = 2），然后偷窃 3 号房屋（金额 = 2）, 因为他们是相邻的。
> 示例 2：
>
> 输入：nums = [1,2,3,1]
> 输出：4
> 解释：你可以先偷窃 1 号房屋（金额 = 1），然后偷窃 3 号房屋（金额 = 3）。
>      偷窃到的最高金额 = 1 + 3 = 4 。
> 示例 3：
>
> 输入：nums = [1,2,3]
> 输出：3
>
>
> 提示：
>
> 1 <= nums.length <= 100
> 0 <= nums[i] <= 1000

**思路**

- 房屋成环，可以分两种请况考虑

  - 一是考虑第一间房子而不考虑最后一间房子
  - 二是考虑最后一间房子而不考虑第一间房子
  - 注意只是考虑，而不是选
  - 两种情况选择获得最大金额的那一种情况的结果返回即可

- 动态规划

  - 设`dp[i]` 表示在从前向后偷，偷到当前 `i`这间房子时能获得的最大金额为`dp[i]`

  - 偷当前这间的金额 `dp[i - 2] + nums[i - 1]`,不偷当前这间的金额 `dp[i-1]`，

    两者取最大即可 `dp[i] = Math.max(dp[i - 2] + nums[i - 1],dp[i-1])`

  - dp数组初始化 `dp[0] = 0  , dp[1] = nums[第一间的下标]`

**代码**

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    if (nums.length === 1) return nums[0]
    // 情况一：考虑第一间房子而不考虑最后一间房子
    let res1 = robArea(nums , 0 , nums.length - 2)
    // 情况二： 考虑最后一间房子而不考虑第一间房子
    let res2 = robArea(nums , 1 , nums.length - 1)
    // 返回较大值
    return res1 > res2 ? res1 : res2

    function robArea(nums , startIndex , endIndex){
        let len = endIndex - startIndex + 1
        let dp = (new Array(len + 1)).fill(0)
        dp[1] = nums[startIndex]
        //遍历dp数组
        for(let i = 2 ; i <= len ; i++){
            dp[i] = Math.max(dp[i - 2] + nums[startIndex + i - 1] , dp[i-1])
        }
        return dp[len]
    }
};
```



## [337. 打家劫舍 III](https://leetcode-cn.com/problems/house-robber-iii/)

**题目**

> 小偷又发现了一个新的可行窃的地区。这个地区只有一个入口，我们称之为 root 。
>
> 除了 root 之外，每栋房子有且只有一个“父“房子与之相连。一番侦察之后，聪明的小偷意识到“这个地方的所有房屋的排列类似于一棵二叉树”。 如果 两个直接相连的房子在同一天晚上被打劫 ，房屋将自动报警。
>
> 给定二叉树的 root 。返回 在不触动警报的情况下 ，小偷能够盗取的最高金额 。
>
>  
>
> 示例 1:
>
> 
>
> 输入: root = [3,2,3,null,3,null,1]
> 输出: 7 
> 解释: 小偷一晚能够盗取的最高金额 3 + 3 + 1 = 7
> 示例 2:
>
> 
>
> 输入: root = [3,4,5,1,3,null,1]
> 输出: 9
> 解释: 小偷一晚能够盗取的最高金额 4 + 5 = 9
>
>
> 提示：
>
> 树的节点数在 [1, 104] 范围内
> 0 <= Node.val <= 104

**思路**

- 房屋是树形结构，采用何种方式遍历遍历呢？由于要知道当前节点的最大金额，我们需要知道其左右子节点的最大金额，因此左右子节点要先遍历，中间节点后遍历，故采用后序遍历
- 后序遍历使用递归
  - 递归的返回值？返回该节点的偷与不偷两种金额结果，用长度为2的数组保存,[偷的金额，不偷的金额]
  - 递归结束条件？当遍历到空节点，返回[0,0]
  - 单层递归的逻辑？分两种情况
    - 偷当前节点获得的最大金额 = 左节点两个孩子节点的最大金额 + 右节点两个孩子节点的最大金额
    - 不偷当前节点的最大金额 = 左节点的最大金额（偷与不偷取最大的） + 右节点的最大金额（偷与不偷取最大的）

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
var rob = function(root) {

    function robTree(node){
        // 节点为空，偷与不偷都为0
        if(!node) return [0,0]
        let left = robTree(node.left)
        let right = robTree(node.right)
        // 偷当前节点
        let val1 = node.val + left[1] + right[1]
        // 不偷当前节点,左右节点可偷可不偷，结果最大就好
        let val2 = Math.max(left[0] , left[1]) + Math.max(right[0] , right[1])
        return [val1 , val2]
    }
    let res = robTree(root)
    return Math.max(res[0] , res[1])
};
```

