---
date: 2022.4.11
---

# DAY11 动态规划（四）

## [416. 分割等和子集](https://leetcode-cn.com/problems/partition-equal-subset-sum/)

**题目**

> 给你一个 只包含正整数 的 非空 数组 nums 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。
>
>  
>
> 示例 1：
>
> 输入：nums = [1,5,11,5]
> 输出：true
> 解释：数组可以分割成 [1, 5, 5] 和 [11] 。
> 示例 2：
>
> 输入：nums = [1,2,3,5]
> 输出：false
> 解释：数组不能分割成两个元素和相等的子集。
>
>
> 提示：
>
> 1 <= nums.length <= 200
> 1 <= nums[i] <= 100

**思路**

如何转化为01背包问题？

- 背包的容量为 sum / 2
- 商品的重量为元素的数值，价值也是元素的数值
- 一个物品只能放入一次
- 如果背包正好装满，那么就找到了总和为 sum / 2 的子集

接下来就是动态规划五部曲

- 确定dp数组及其下标含义： dp[j]表示容量为j的背包所能得到的最大价值
- 确定递推公式：dp[j] = max(dp[j] , dp[j-weight[i]] + value[i])
- 初始化dp数组： 初始化为0就行
- 确定遍历顺序：先遍历物品，倒序遍历背包的容量（**因为当前背包的价值依赖于之前的背包价值**，要在之前的背包价值更新前利用它）
- 举例推到dp数组

**代码**

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function(nums) {
    let len = nums.length
    let sum = nums.reduce((pre , cur) => pre + cur , 0)
    if(sum % 2 !== 0) return false
    let bagWeight = sum / 2
    // 注意数组的长度为bagWeight + 1
    let dp = new Array(bagWeight + 1)
    dp.fill(0)
    

    for(let i = 0 ; i < len ; i++){
        for(let j = bagWeight ; j >= nums[i] ; j--){
            dp[j] = Math.max(dp[j] , dp[j - nums[i]] + nums[i])
        }
    }

    return dp[bagWeight] === bagWeight
};
```

**复杂度**

时间复杂度：O(n^2)

空间复杂度：Ｏ（ｎ）





## [1049. 最后一块石头的重量 II](https://leetcode-cn.com/problems/last-stone-weight-ii/)

**题目**

> 有一堆石头，用整数数组 stones 表示。其中 stones[i] 表示第 i 块石头的重量。
>
> 每一回合，从中选出任意两块石头，然后将它们一起粉碎。假设石头的重量分别为 x 和 y，且 x <= y。那么粉碎的可能结果如下：
>
> 如果 x == y，那么两块石头都会被完全粉碎；
> 如果 x != y，那么重量为 x 的石头将会完全粉碎，而重量为 y 的石头新重量为 y-x。
> 最后，最多只会剩下一块 石头。返回此石头 最小的可能重量 。如果没有石头剩下，就返回 0。
>
>  
>
> 示例 1：
>
> 输入：stones = [2,7,4,1,8,1]
> 输出：1
> 解释：
> 组合 2 和 4，得到 2，所以数组转化为 [2,7,1,8,1]，
> 组合 7 和 8，得到 1，所以数组转化为 [2,1,1,1]，
> 组合 2 和 1，得到 1，所以数组转化为 [1,1,1]，
> 组合 1 和 1，得到 0，所以数组转化为 [1]，这就是最优值。
> 示例 2：
>
> 输入：stones = [31,26,33,21,40]
> 输出：5
>
>
> 提示：
>
> 1 <= stones.length <= 30
> 1 <= stones[i] <= 100

**思路**

- 核心思路： 把石头分为重量尽量相同的两堆，这样两堆石头碰撞后剩余重量最小，这样就转化为了01背包问题
- 动态规划五部曲
  - 确定dp数组及其下标含义：dp[j]表示容量为j的背包最多能装下的重量 ， j的取值为0到sum / 2
  - 确定递推关系： dp[j] = max(dp[j] , dp[j - stones[i]] + stones[i])
  - 初始化dp数组：全部初始化为0即可
  - 确定遍历顺序
  - 推到dp数组

**代码**

```js
/**
 * @param {number[]} stones
 * @return {number}
 */
var lastStoneWeightII = function(stones) {
    let len = stones.length
    let sum = stones.reduce((pre , cur) => pre + cur , 0)
    let bagWeight = Math.ceil(sum / 2)
    let dp = new Array(bagWeight + 1)
    dp.fill(0)

    for(let i = 0 ; i < len ; i++){
        for(let j = bagWeight ; j >= stones[i] ; j--){
            dp[j] = Math.max(dp[j] , dp[j - stones[i]] + stones[i])
            if(dp[bagWeight] === bagWeight) {
                return Math.abs(sum - 2*bagWeight)
            }
        }
    }

    return Math.abs(sum - 2 * dp[bagWeight])
};
```

