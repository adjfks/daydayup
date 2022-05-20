---
date: 2022.4.19
---

# DAY19 动态规划

## [1035. 不相交的线](https://leetcode-cn.com/problems/uncrossed-lines/)

**题目**

> 在两条独立的水平线上按给定的顺序写下 nums1 和 nums2 中的整数。
>
> 现在，可以绘制一些连接两个数字 nums1[i] 和 nums2[j] 的直线，这些直线需要同时满足满足：
>
>  nums1[i] == nums2[j]
> 且绘制的直线不与任何其他连线（非水平线）相交。
> 请注意，连线即使在端点也不能相交：每个数字只能属于一条连线。
>
> 以这种方法绘制线条，并返回可以绘制的最大连线数。
>
>  
>
> 示例 1：
>
> <img src="https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220419191757152.png" alt="image-20220419191757152" style="zoom: 33%;" />
>
> 输入：nums1 = [1,4,2], nums2 = [1,2,4]
> 输出：2
> 解释：可以画出两条不交叉的线，如上图所示。 
> 但无法画出第三条不相交的直线，因为从 nums1[1]=4 到 nums2[2]=4 的直线将与从 nums1[2]=2 到 nums2[1]=2 的直线相交。
> 示例 2：
>
> 输入：nums1 = [2,5,1,2,5], nums2 = [10,5,2,1,5,2]
> 输出：3
> 示例 3：
>
> 输入：nums1 = [1,3,7,1,7,5], nums2 = [1,9,2,5,1]
> 输出：2
>
>
> 提示：
>
> 1 <= nums1.length, nums2.length <= 500
> 1 <= nums1[i], nums2[j] <= 2000

**思路**

- 要求相连的两个数要相同，且相连的线不能相交
- 相连的数有什么特点呢？其实相连的那一组数就是nums1和nums2数组的公共子序列，并且序列中的数字在原数组中的相对顺序不能变
- 此题转换为求两个序列中的最长公共子序列的长度，和 [【leetcode】1143.最长公共子序列](https://blog.csdn.net/laplacepoisson/article/details/124245187)是一样的。

**代码**

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var maxUncrossedLines = function(nums1, nums2) {
    let len1 = nums1.length , len2 = nums2.length
    let dp = (new Array(len2 + 1)).fill(0).map(x => (new Array(len1 + 1)).fill(0))

    for(let i = 1 ; i <= len2 ; i++){
        for(let j = 1 ; j <= len1 ; j++){
            if(nums1[j-1] === nums2[i-1]) dp[i][j] = dp[i-1][j-1] + 1
            else dp[i][j] = Math.max(dp[i-1][j] , dp[i][j-1])
        }
    }

    return dp[len2][len1]
};
```

**复杂度**

- 时间复杂度$O(n*m)$
- 空间复杂度$O(n*m)$



## [53. 最大子数组和](https://leetcode-cn.com/problems/maximum-subarray/)

**题目**

> 给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
>
> 子数组 是数组中的一个连续部分。
>
>  
>
> 示例 1：
>
> 输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
> 输出：6
> 解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
>
> 示例 2：
>
> 输入：nums = [1]
> 输出：1
>
> 示例 3：
>
> 输入：nums = [5,4,-1,7,8]
> 输出：23
>
>
> 提示：
>
> 1 <= nums.length <= 105
> -104 <= nums[i] <= 104
>
>
> 进阶：如果你已经实现复杂度为 O(n) 的解法，尝试使用更为精妙的 分治法 求解。
>

**思路**

- 设dp[i]表示以i位置元素为结尾元素的连续子数组的最大和
- 递推关系`dp[i] = Math.max(nums[i] , nums[i] + dp[i-1])`
- 由于数组长度大于等于1，dp[0]初始化为`dp[0] = nums[0]`
- 遍历时从`i = 1`开始遍历

**代码**

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    let len = nums.length
    let dp = (new Array(len)).fill(0)
    dp[0] = nums[0]
    let ans = dp[0]

    for(let i = 1 ; i < len ; i++){
        dp[i] = Math.max(nums[i] , dp[i-1] + nums[i])
        ans = Math.max(ans , dp[i])
    }
    return ans
};
```



## [392. 判断子序列](https://leetcode-cn.com/problems/is-subsequence/)

**题目**

> 给定字符串 s 和 t ，判断 s 是否为 t 的子序列。
>
> 字符串的一个子序列是原始字符串删除一些（也可以不删除）字符而不改变剩余字符相对位置形成的新字符串。（例如，"ace"是"abcde"的一个子序列，而"aec"不是）。
>
>  
>
> 示例 1：
>
> 输入：s = "abc", t = "ahbgdc"
> 输出：true
>
> 示例 2：
>
> 输入：s = "axc", t = "ahbgdc"
> 输出：false
>
> 
>
> 提示：
>
> 0 <= s.length <= 100
> 0 <= t.length <= 10^4
> 两个字符串都只由小写字符组成。

**思路**

- 题目说到子序列，其实这道题和 [【leetcode】1143.最长公共子序列](https://blog.csdn.net/laplacepoisson/article/details/124245187)很相似，我们可以把问题看成求两个字符串的最长公共子序列的长度，然后判断该长度是否等于s的长度，因此在该题的基础上加一个判断结果返回即可，具体方法可以参看 [【leetcode】1143.最长公共子序列](https://blog.csdn.net/laplacepoisson/article/details/124245187)

**代码**

```js
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isSubsequence = function(s, t) {
    const len1 = s.length , len2 = t.length
    let dp = (new Array(len1 + 1)).fill(0).map(x => (new Array(len2 + 1)).fill(0))

    for(let i = 1 ; i <= len1 ; i++){
        for(let j = 1 ; j <= len2 ; j++){
            if(s[i-1] === t[j-1]) dp[i][j] = dp[i-1][j-1] + 1
            else dp[i][j] = Math.max(dp[i][j-1] , dp[i-1][j])
        }
    }
    return len1 === dp[len1][len2]
};
```

**复杂度**

- 时间复杂度$O(n*m)$
- 空间复杂度$O(n*m)$

