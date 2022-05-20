---
date: 2022.4.18
---

# 动态规划

## [674. 最长连续递增序列](https://leetcode-cn.com/problems/longest-continuous-increasing-subsequence/)

**题目**

> 给定一个未经排序的整数数组，找到最长且 连续递增的子序列，并返回该序列的长度。
>
> 连续递增的子序列 可以由两个下标 l 和 r（l < r）确定，如果对于每个 l <= i < r，都有 nums[i] < nums[i + 1] ，那么子序列 [nums[l], nums[l + 1], ..., nums[r - 1], nums[r]] 就是连续递增子序列。
>
>  
>
> 示例 1：
>
> 输入：nums = [1,3,5,4,7]
> 输出：3
> 解释：最长连续递增序列是 [1,3,5], 长度为3。
> 尽管 [1,3,5,7] 也是升序的子序列, 但它不是连续的，因为 5 和 7 在原数组里被 4 隔开。 
> 示例 2：
>
> 输入：nums = [2,2,2,2,2]
> 输出：1
> 解释：最长连续递增序列是 [2], 长度为1。
>
>
> 提示：
>
> 1 <= nums.length <= 104
> -109 <= nums[i] <= 109

**思路**

- 设`dp[i]`表示以i位置元素为结尾元素的最长连续递增子序列的长度
- 递推关系：由于子序列必须连续，故`dp[i]`与`dp[i-1]`有关，`if(nums[i] > nums[i-1]) { d[i] = dp[i-1] + 1}`
- `dp`数组初始化：全部初始化为1即可（最长连续递增子序列的长度最小就是1）
- 由于`dp[i]`依赖于前一项，故遍历顺序是从前向后比遍历

**代码**

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findLengthOfLCIS = function(nums) {
    let len = nums.length
    let dp = (new Array(len)).fill(1)
    let res = 1
    for(let i = 1 ;i < len ;i++){
        if(nums[i] > nums[i-1]) dp[i] += dp[i-1]
        res = Math.max(res , dp[i])
    }
    return res
};
```

当然，可以用变量代替`dp`数组优化一下空间复杂度

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findLengthOfLCIS = function(nums) {
    let len = nums.length
    let pre = 1 , cur = 1
    let res = 1
    for(let i = 1 ; i < len ; i++){
        if(nums[i] > nums[i-1]) cur += pre
        pre = cur
        cur = 1
        res = Math.max(res , pre)
    }
    return res
};
```



**复杂度**

- 时间复杂度 $O(n)$
- 空间复杂度 $O(n)$（优化前）、$O(1)$（优化后）



## [718. 最长重复子数组](https://leetcode-cn.com/problems/maximum-length-of-repeated-subarray/)

**题目**

> 给两个整数数组 nums1 和 nums2 ，返回 两个数组中 公共的 、长度最长的子数组的长度 。
>
> 示例 1：
>
> 输入：nums1 = [1,2,3,2,1], nums2 = [3,2,1,4,7]
> 输出：3
> 解释：长度最长的公共子数组是 [3,2,1] 。
> 示例 2：
>
> 输入：nums1 = [0,0,0,0,0], nums2 = [0,0,0,0,0]
> 输出：5
>
>
> 提示：
>
> 1 <= nums1.length, nums2.length <= 1000
> 0 <= nums1[i], nums2[i] <= 100

**思路**

- 设`dp[i][j]`表示以`i-1`结尾的A数组和以`j-1`结尾的B数组的最长公共子数组的长度为`dp[i][j]`
- 确定递推关系：`if(nums1[i-1] === nums2[j-1]){ dp[i][j] = dp[i-1][j-1] + 1 }`
- `dp`数组初始化：遍历的时候i、j从1开始，i = 0 或 j = 0 的 `d[i][j]`没有实际意义，但为了方便递推关系正确推到，初始化`dp[0][j] = 0 dp[i][0] = 0`
- 由于当前项依赖于左上斜对角线的那一项，故外层遍历nums1，内层遍历nums2或外层遍历nums2，内层遍历nums1都可以。

**代码**

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findLength = function(nums1, nums2) {
    let len1 = nums1.length , len2 = nums2.length
    let dp = (new Array(len1 + 1)).fill(0).map(x => (new Array(len2 + 1)).fill(0))
    let res = 0

    for(let i = 1 ; i <= len1 ; i++){
        for(let j = 1 ; j <= len2 ; j++){
            if(nums1[i-1] === nums2[j-1]) dp[i][j] = dp[i-1][j-1] + 1
            res = Math.max(res , dp[i][j])
        }
    }

    return res
};
```

**优化**

以`nums1 = [1,2,3,2,1], nums2 = [3,2,1,4,7]`为例，打印出最后的dp数组如下

```js
[
  [ 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 1, 0, 0 ],
  [ 0, 0, 1, 0, 0, 0 ],
  [ 0, 1, 0, 0, 0, 0 ],
  [ 0, 0, 2, 0, 0, 0 ],
  [ 0, 0, 0, 3, 0, 0 ]
]
```

可以看到，当前的状态只依赖于左上斜对角元素的状态，因此我们可以把二维数组压缩成一维。

此时`dp[j] = dp[j-1] + 1`由于当前项依赖于一维数组的前一项，所以遍历j时从后往前遍历，这样不会把前一项改变。

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findLength = function(nums1, nums2) {
    let len1 = nums1.length , len2 = nums2.length
    let dp = (new Array(len1 + 1)).fill(0)
    let res = 0

    // 外层遍历nums2数组
    for(let j = 1 ; j <= len2 ; j++){
        // 内层从后向前遍历nums1数组
        for(let i = len1 ; i >= 1 ; i--){
            if(nums1[i - 1] === nums2[j - 1]) dp[i] = dp[i-1] + 1
            // 不相等时要清0
            else dp[i] = 0
            res = Math.max(res , dp[i])
        }
    }

    return res
};
```

**复杂度**

n为nums1长度，m为nums2长度

时间复杂度：$O(n*m)$

空间复杂度： $O(n*m)$（压缩前）、$O(n)$（压缩后）





## [1143. 最长公共子序列](https://leetcode-cn.com/problems/longest-common-subsequence/)

**题目**

> 给定两个字符串 text1 和 text2，返回这两个字符串的最长 公共子序列 的长度。如果不存在 公共子序列 ，返回 0 。
>
> 一个字符串的 子序列 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。
>
> 例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。
> 两个字符串的 公共子序列 是这两个字符串所共同拥有的子序列。
>
>  
>
> 示例 1：
>
> 输入：text1 = "abcde", text2 = "ace" 
> 输出：3  
> 解释：最长公共子序列是 "ace" ，它的长度为 3 。
> 示例 2：
>
> 输入：text1 = "abc", text2 = "abc"
> 输出：3
> 解释：最长公共子序列是 "abc" ，它的长度为 3 。
> 示例 3：
>
> 输入：text1 = "abc", text2 = "def"
> 输出：0
> 解释：两个字符串没有公共子序列，返回 0 。
>
>
> 提示：
>
> 1 <= text1.length, text2.length <= 1000
> text1 和 text2 仅由小写英文字符组成。

**思路**

- 设`dp[i][j]`表示`[0,i-1]`的text1字符串和`[0,j-1]`的text2字符串的最长公共子序列的长度

- 递推关系，`if(text1[i - 1] === text2[j - 1]) { dp[i][j] = dp[i-1][j-1] + 1}`

  如果不相等，那就选则`dp[i-1][j]`和`dp[i][j-1]`中较大的

- dp数组初始化为0即可

- 由递推关系知，当前`dp[i][j]`依赖于左边、上边和左上斜对角元素的值，因此要从上到下，从左往右遍历

- 返回`dp[len1][len2]`即可

 

**代码**

```js
/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function(text1, text2) {
    let len1 = text1.length , len2 = text2.length
    let dp = (new Array(len1 + 1)).fill(0).map(x => new Array(len2 + 1).fill(0))

    for(let i = 1 ; i <= len1 ; i++){
        for(let j = 1 ; j <= len2 ; j++){
            if(text1[i-1] === text2[j-1]) dp[i][j] = dp[i-1][j-1] + 1
            else dp[i][j] = Math.max(dp[i-1][j] , dp[i][j-1])
        }
    }

    return dp[len1][len2]
};
```

**复杂度**

- 时间复杂度：$O(n*m)$
- 空间复杂度：$O(n*m)$
- n 、m分别表示text1和text2的长度
