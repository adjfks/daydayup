---
date: 2022.4.13
---

# 动态规划（六）

## [518. 零钱兑换 II](https://leetcode-cn.com/problems/coin-change-2/)

**题目**

> 给你一个整数数组 coins 表示不同面额的硬币，另给一个整数 amount 表示总金额。
>
> 请你计算并返回可以凑成总金额的硬币组合数。如果任何硬币组合都无法凑出总金额，返回 0 。
>
> 假设每一种面额的硬币有无限个。 
>
> 题目数据保证结果符合 32 位带符号整数。
>
>  
>
> 示例 1：
>
> 输入：amount = 5, coins = [1, 2, 5]
> 输出：4
> 解释：有四种方式可以凑成总金额：
> 5=5
> 5=2+2+1
> 5=2+1+1+1
> 5=1+1+1+1+1
> 示例 2：
>
> 输入：amount = 3, coins = [2]
> 输出：0
> 解释：只用面额 2 的硬币不能凑成总金额 3 。
> 示例 3：
>
> 输入：amount = 10, coins = [10] 
> 输出：1
>
>
> 提示：
>
> 1 <= coins.length <= 300
> 1 <= coins[i] <= 5000
> coins 中的所有值 互不相同
> 0 <= amount <= 5000

**思路**

- 硬币有无限个，这是一个完全背包问题
- 问题求的是硬币的组合数，而不是能凑到的最大数值
- dp[j]表示凑金额j有dp[j]种组合数
- dp[j] += dp[j - coins[i]]
- dp数组初始化时，当j==0时,dp[j] = 1,其余初始化为0

**代码**

```js
/**
 * @param {number} amount
 * @param {number[]} coins
 * @return {number}
 */
var change = function(amount, coins) {
    let dp = (new Array(amount + 1)).fill(0)
    dp[0] = 1

    for(let i = 0 ; i < coins.length ; i++){
        for(let j = coins[i] ; j <= amount; j++){
            dp[j] += dp[j - coins[i]]
        }
    }

    return dp[amount]
};
```



## [377. 组合总和 Ⅳ](https://leetcode-cn.com/problems/combination-sum-iv/)

**题目**

> 给你一个由 不同 整数组成的数组 nums ，和一个目标整数 target 。请你从 nums 中找出并返回总和为 target 的元素组合的个数。
>
> 题目数据保证答案符合 32 位整数范围。
>
>  
>
> 示例 1：
>
> 输入：nums = [1,2,3], target = 4
> 输出：7
> 解释：
> 所有可能的组合为：
> (1, 1, 1, 1)
> (1, 1, 2)
> (1, 2, 1)
> (1, 3)
> (2, 1, 1)
> (2, 2)
> (3, 1)
> 请注意，顺序不同的序列被视作不同的组合。
> 示例 2：
>
> 输入：nums = [9], target = 3
> 输出：0
>
>
> 提示：
>
> 1 <= nums.length <= 200
> 1 <= nums[i] <= 1000
> nums 中的所有元素 互不相同
> 1 <= target <= 1000

**思路**

- 完全背包排列问题，外层循环遍历背包容量，内层循环遍历物品。

**代码**

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var combinationSum4 = function(nums, target) {
    let dp = (new Array(target + 1)).fill(0)
    dp[0] = 1

    for(let j = 1 ; j <= target ; j++){
        for(let i = 0; i < nums.length; i++){
            if(j >= nums[i]){
                dp[j] += dp[j - nums[i]]
            }
        }
    }

    return dp[target]
};
```



## [70. 爬楼梯](https://leetcode-cn.com/problems/climbing-stairs/)

**题目**

> 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
>
> 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
>
>  
>
> 示例 1：
>
> 输入：n = 2
> 输出：2
> 解释：有两种方法可以爬到楼顶。
> 1. 1 阶 + 1 阶
> 2. 2 阶
> 示例 2：
>
> 输入：n = 3
> 输出：3
> 解释：有三种方法可以爬到楼顶。
> 1. 1 阶 + 1 阶 + 1 阶
> 2. 1 阶 + 2 阶
> 3. 2 阶 + 1 阶
>
>
> 提示：
>
> 1 <= n <= 45

**思路**

- 

```js
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    let dp = (new Array(n + 1)).fill(0)
    dp[0] = 1
    
    for(let i = 0 ; i <= n ; i++){
        for(let j = 1 ; j <= 2; j++){
            if(j <= i){
                dp[i] += dp[i - j]
            }
        }
    }
    return dp[n]
};
```

