---
date: 2022.4.12
---

# DAY12 动态规划（五）

## [494. 目标和](https://leetcode-cn.com/problems/target-sum/)

**题目**

> 给你一个整数数组 nums 和一个整数 target 。
>
> 向数组中的每个整数前添加 '+' 或 '-' ，然后串联起所有整数，可以构造一个 表达式 ：
>
> 例如，nums = [2, 1] ，可以在 2 之前添加 '+' ，在 1 之前添加 '-' ，然后串联起来得到表达式 "+2-1" 。
> 返回可以通过上述方法构造的、运算结果等于 target 的不同 表达式 的数目。
>
>  
>
> 示例 1：
>
> 输入：nums = [1,1,1,1,1], target = 3
> 输出：5
> 解释：一共有 5 种方法让最终目标和为 3 。
> -1 + 1 + 1 + 1 + 1 = 3
> +1 - 1 + 1 + 1 + 1 = 3
> +1 + 1 - 1 + 1 + 1 = 3
> +1 + 1 + 1 - 1 + 1 = 3
> +1 + 1 + 1 + 1 - 1 = 3
> 示例 2：
>
> 输入：nums = [1], target = 1
> 输出：1
>
>
> 提示：
>
> 1 <= nums.length <= 20
> 0 <= nums[i] <= 1000
> 0 <= sum(nums[i]) <= 1000
> -1000 <= target <= 1000

**思路**

- left组合 - right组合 = target
- left组合 + right组合 = sum
- left 组合 = （target + sum ）/ 2 , target 和 sum都是固定的
- 注意若 abs(target) > sum 或 (target + sum) 是奇数时 无解。
- dp[j] 表示装满容量为j的背包的方案数
- dp[j] += dp[j - nums[i]]
- 外层遍历nums数组，内层倒序遍历j , 注意 j >= nums[i] 

**代码**

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = function(nums, target) {
    let sum = nums.reduce((pre , cur) => pre + cur , 0)
    if( (sum + target) % 2 !== 0 || Math.abs(target) > sum) return 0
    let bagWeight = (sum + target) / 2
    let dp = new Array(bagWeight + 1)
    dp.fill(0)
    dp[0] = 1

    for(let i = 0 ; i < nums.length ; i++){
        for(let j = bagWeight ; j >= nums[i] ; j--){
                dp[j] = dp[j] + dp[j - nums[i]]
        }
    }

    return dp[bagWeight]
};
```



## [474. 一和零](https://leetcode-cn.com/problems/ones-and-zeroes/)

**题目**

> 给你一个二进制字符串数组 strs 和两个整数 m 和 n 。
>
> 请你找出并返回 strs 的最大子集的长度，该子集中 最多 有 m 个 0 和 n 个 1 。
>
> 如果 x 的所有元素也是 y 的元素，集合 x 是集合 y 的 子集 。
>
>  
>
> 示例 1：
>
> 输入：strs = ["10", "0001", "111001", "1", "0"], m = 5, n = 3
> 输出：4
> 解释：最多有 5 个 0 和 3 个 1 的最大子集是 {"10","0001","1","0"} ，因此答案是 4 。
> 其他满足题意但较小的子集包括 {"0001","1"} 和 {"10","1","0"} 。{"111001"} 不满足题意，因为它含 4 个 1 ，大于 n 的值 3 。
> 示例 2：
>
> 输入：strs = ["10", "0", "1"], m = 1, n = 1
> 输出：2
> 解释：最大的子集是 {"0", "1"} ，所以答案是 2 。
>
>
> 提示：
>
> 1 <= strs.length <= 600
> 1 <= strs[i].length <= 100
> strs[i] 仅由 '0' 和 '1' 组成
> 1 <= m, n <= 100

**思路**

- `dp[i][j]`表示最多有i个0，j个1的子集的长度
- `dp[i][j] = max(dp[i][j] , dp[i-zeroNum][j - oneNum] + 1)`
- 

**代码**

```js
/**
 * @param {string[]} strs
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var findMaxForm = function(strs, m, n) {
    let len = strs.length
    let dp = Array.from(Array(m + 1) , () => Array(n + 1).fill(0))
    let zeroNum , oneNum

    for(let str of strs){
        zeroNum = 0 , oneNum = 0

        for(let c of str){
            if(c === '0') zeroNum++
            else oneNum++
        }

        for(let i = m ; i >= zeroNum ;i--){
            for(let j = n; j >= oneNum ; j--){
                dp[i][j] = Math.max(dp[i][j] , dp[i - zeroNum][j - oneNum] + 1)
            }
        }
    }

    return dp[m][n]
};
```

