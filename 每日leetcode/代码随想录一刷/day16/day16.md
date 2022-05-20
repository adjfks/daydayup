---
date: 2022.4.16
---

# DAY16 买卖股票系列

## [121. 买卖股票的最佳时机](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/)

**题目**

> 给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。
>
> 你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。
>
> 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。
>
>  
>
> 示例 1：
>
> 输入：[7,1,5,3,6,4]
> 输出：5
> 解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
>      注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。
>
> 示例 2：
>
> 输入：prices = [7,6,4,3,1]
> 输出：0
> 解释：在这种情况下, 没有交易完成, 所以最大利润为 0。
>
>
> 提示：
>
> 1 <= prices.length <= 105
> 0 <= prices[i] <= 104

**思路**

- 贪心
  - 取最左最小值，取最大利润区间
  - 如何取到最左最小值？
    - low初始化为一个大数
    - 遍历prices数组，遇到更小的数就更新low
  - 如何取最大利润？
    - profit初始化为0
    - 遍历Prices数组的过程中，每次都计算(prices[i] - low) ，如果更大就更新利润profit
- 动态规划
  - 对于每一天有两种情况，持有股票和不持有股票
  - 设`dp[i][0]`表示第i天不持有股票时拥有的最大金额，`dp[i][1]`表示第i天持有股票时拥有的最大金额，且持有股票时金额为负
  - 递推关系
    - 不持有股票时
      - 可能是今天刚卖出 `dp[i-1][1] + prices[i]`
      - 可能是昨天就不持有 `dp[i-1][0]`
      - 两者选择金额大的 `dp[i][0] = Math.max(dp[i-1][1] + prices[i]),dp[i-1][0]`
    - 持有股票时
      - 可能是今天刚买入 `- prices[i]`
      - 可能是昨天就持有 `dp[i-1][1]`
      - 两者选择金额最大的 `dp[i][1] = Math.max(dp[i-1][0] - prices[i],dp[i-1][1])`
  - `dp`数组初始化，`dp[0][0] = 0` 表示第0天不持有股票的最大金额就是0，`dp[0][1] = -prices[0]`表示第0天持有股票的最大金额就是买入当天的股票后的金额

**代码**

```js
// 贪心
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let low = Number.MAX_SAFE_INTEGER , profit = 0
    for(let i = 0 ; i < prices.length ; i++){
        low = Math.min(prices[i] , low)
        profit = Math.max(profit , prices[i] - low)
    }
    return profit
};
```

```js
//动态规划
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let len = prices.length
    let dp = (new Array(len)).fill([0 , 0])
    dp[0][0] = 0
    dp[0][1] = -prices[0]
    for(let i = 1 ; i < len ; i++){
        dp[i][0] = Math.max(dp[i-1][0] , prices[i] + dp[i-1][1])
        dp[i][1] = Math.max(dp[i-1][1] , - prices[i])
    }
    return dp[len-1][0]
};
```

**复杂度**

- 贪心

  - 时间复杂度：O(n)
  - 空间复杂度： O(1)
  
- 动态规划

  - 时间复杂度：O(n)
  - 空间复杂度： O(n)
  
  

## [122. 买卖股票的最佳时机 II](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/)

**题目**

> 给定一个数组 prices ，其中 prices[i] 表示股票第 i 天的价格。
>
> 在每一天，你可能会决定购买和/或出售股票。你在任何时候 最多 只能持有 一股 股票。你也可以购买它，然后在 同一天 出售。
> 返回 你能获得的 最大 利润 。
>
>  
>
> 示例 1:
>
> 输入: prices = [7,1,5,3,6,4]
> 输出: 7
> 解释: 在第 2 天（股票价格 = 1）的时候买入，在第 3 天（股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
>      随后，在第 4 天（股票价格 = 3）的时候买入，在第 5 天（股票价格 = 6）的时候卖出, 这笔交易所能获得利润 = 6-3 = 3 。
> 示例 2:
>
> 输入: prices = [1,2,3,4,5]
> 输出: 4
> 解释: 在第 1 天（股票价格 = 1）的时候买入，在第 5 天 （股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
>      注意你不能在第 1 天和第 2 天接连购买股票，之后再将它们卖出。因为这样属于同时参与了多笔交易，你必须在再次购买前出售掉之前的股票。
> 示例 3:
>
> 输入: prices = [7,6,4,3,1]
> 输出: 0
> 解释: 在这种情况下, 没有交易完成, 所以最大利润为 0。
>
>
> 提示：
>
> 1 <= prices.length <= 3 * 104
> 0 <= prices[i] <= 104

**思路**

- 贪心
  - 思路一
    -  按照何种策略来进行每天的操作能过获得最大利润呢？
    - 当第二天要涨价时且手里没有股票那就买入
    - 当第二天要降价时且手里有股票那就卖出
    - 最后一天如果手里有股票，无论怎样一定要卖出
  - 思路二
    - 什么时候有收益呢？
    - 今天相比于昨天涨价了，收益增加`prices[i] - prices[i-1]`
    - 今天相比于昨天不变或降价，收益增加0
- 动态规划
  - 对于每一天有两种情况，持有股票和不持有股票
  - 设`dp[i][0]`表示第i天不持有股票时拥有的最大利润，`dp[i][1]`表示第i天持有股票时拥有的最大利润
  - 递推关系
    - 不持有股票时
      - 可能是今天刚卖出 `dp[i-1][1] + prices[i]`
      - 可能是昨天就不持有 `dp[i-1][0]`
      - 两者选择金额大的 `dp[i][0] = Math.max(dp[i-1][1] + prices[i]),dp[i-1][0]`
    - 持有股票时
      - 可能是今天刚买入 `dp[i-1][0]- prices[i]`
      - 可能是昨天就持有 `dp[i-1][1]`
      - 两者选择金额最大的 `dp[i][1] = Math.max(dp[i-1][0] - prices[i],dp[i-1][1])`
  - `dp`数组初始化，`dp[0][0] = 0` 表示第0天不持有股票的最大金额就是0，`dp[0][1] = -prices[0]`表示第0天持有股票的最大金额就是买入当天的股票后的金额

**代码**

```js
// 贪心一
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    // has用来标记手头有没有股票，profit记录收益
    let len = prices.length , has = false , profit = 0
    // 遍历prices数组，遍历到倒数第二项就结束，因为要和后一天比较
    for(let i = 0 ; i < len - 1 ; i++){
        if(!has && prices[i+1] > prices[i]) {
            profit -= prices[i]
            has = true
        }
        if(has && prices[i+1] < prices[i]){
            profit += prices[i]
            has = false
        }
    }
    if(has) profit += prices[len - 1]
    return profit
};
//贪心二
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let len = prices.length , profit = 0
    // 从i = 1开始遍历，因为要和前一天比
    for(let i = 1 ; i < len ; i++){
        //涨价了
        if(prices[i] > prices[i-1]) profit += prices[i] - prices[i-1]
    }
    return profit
};
```

```js
//动态规划
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let len = prices.length
    let dp = (new Array(len)).fill([0 , 0])
    dp[0][0] = 0
    dp[0][1] = -prices[0]
    for(let i = 1 ; i < len ; i++){
        dp[i][0] = Math.max(dp[i-1][0] , prices[i] + dp[i-1][1])
        dp[i][1] = Math.max(dp[i-1][1] , dp[i-1][0]- prices[i])
    }
    return dp[len-1][0]
};
```

**复杂度**

- 贪心

  - 时间复杂度：O(n)
  - 空间复杂度： O(1)
- 动态规划
  - 时间复杂度：O(n)
  - 空间复杂度： O(n)



## [123. 买卖股票的最佳时机 III](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/)

**题目**

> 给定一个数组，它的第 i 个元素是一支给定的股票在第 i 天的价格。
>
> 设计一个算法来计算你所能获取的最大利润。你最多可以完成 两笔 交易。
>
> 注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
>
>  
>
> 示例 1:
>
> 输入：prices = [3,3,5,0,0,3,1,4]
> 输出：6
> 解释：在第 4 天（股票价格 = 0）的时候买入，在第 6 天（股票价格 = 3）的时候卖出，这笔交易所能获得利润 = 3-0 = 3 。
>      随后，在第 7 天（股票价格 = 1）的时候买入，在第 8 天 （股票价格 = 4）的时候卖出，这笔交易所能获得利润 = 4-1 = 3 。
> 示例 2：
>
> 输入：prices = [1,2,3,4,5]
> 输出：4
> 解释：在第 1 天（股票价格 = 1）的时候买入，在第 5 天 （股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。   
>      注意你不能在第 1 天和第 2 天接连购买股票，之后再将它们卖出。   
>      因为这样属于同时参与了多笔交易，你必须在再次购买前出售掉之前的股票。
> 示例 3：
>
> 输入：prices = [7,6,4,3,1] 
> 输出：0 
> 解释：在这个情况下, 没有交易完成, 所以最大利润为 0。
> 示例 4：
>
> 输入：prices = [1]
> 输出：0
>
>
> 提示：
>
> 1 <= prices.length <= 105
> 0 <= prices[i] <= 105

**思路**

- 针对本题，每一天有几个状态？持有股票和不持有股票两种？不行，要考虑到只能交易两次来区分转态。
- 一天有五种状态

  - 还没有操作

  - 已经第一次买入

  - 已经第一次卖出

  - 已经第二次买入

  - 已经第二次卖出

- 设`dp[i][j]`表示第i天在状态j下的手里的金额，j的范围为0~4，分别表示上面的五种状态。
- 递推关系
  - 还没有操作 `dp[i][0] = dp[i-1][0]`
  - 已经第一次买入，有两种情况
    - 前一天已经买入 `dp[i - 1][1]`
    - 前一天还没有操作，今天第一次买入 `dp[i-1][0] - prices[i]`
    - 选择手里金额大的 `dp[i][1] = Math.max(dp[i - 1][1],dp[i-1][0] - prices[i])`
  - 已经第一次卖出，有两种情况
    - 前一天已经第一次卖出 `dp[i-1][2]`
    - 前一天第一次买入，今天卖出 `dp[i-1][1] + prices[i]`
    - 选择手里金额大的 `dp[i][2] = Math.max(dp[i-1][2] , dp[i-1][1] + prices[i])`
  - 已经第二次买入，有两种情况
    - 前一天已经第二次买入 `dp[i-1][3]`
    - 前一天已经第一次卖出，今天第二次买入 `dp[i-1][2] - prices[i]`
    - 选择手里金额大的`dp[i][3] = Math.max(dp[i-1][3] , dp[i-1][2] - prices[i])`
  - 已经第二次卖出，有两种情况
    - 前一天已经第二次卖出 `dp[i-1][4]`
    - 前一天已经第二次买入 ，今天第二次卖出`dp[i-1][3] + prices[i]`
    - 选择手里金额大的 `dp[i][4] = Math.max(dp[i-1][4],dp[i-1][3] + prices[i])`
- dp数组初始化
  - `dp[0][0] = 0`
  - `dp[0][1] = -prices[0]`
  - `dp[0][2] = 0`
  - `dp[0][3] = -prices[0]`
  - `dp[0][4] = 0`
- 从prices数组第二项开始从前向后遍历
- 最后返回`dp[len - 1][4]`

**代码**

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let len = prices.length , dp = (new Array(len)).fill([0 , 0 , 0 , 0 , 0])
    dp[0][1] = -prices[0] , dp[0][3] = -prices[0]

    for(let i = 1 ; i < len ;i++){
        dp[i][0] = dp[i-1][0]
        dp[i][1] = Math.max(dp[i - 1][1],dp[i-1][0] - prices[i])
        dp[i][2] = Math.max(dp[i-1][2] , dp[i-1][1] + prices[i])
        dp[i][3] = Math.max(dp[i-1][3] , dp[i-1][2] - prices[i])
        dp[i][4] = Math.max(dp[i-1][4],dp[i-1][3] + prices[i])
    }
    return dp[len - 1][4]
};
```

- 时间复杂度：O(n)
- 空间复杂度： O(n)