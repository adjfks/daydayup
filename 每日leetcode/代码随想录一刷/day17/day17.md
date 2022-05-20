---
date: 2022.4.17
---

# DAY17 

## [LCP 51. 烹饪料理](https://leetcode-cn.com/problems/UEcfPD/)

**题目**

> 欢迎各位勇者来到力扣城，城内设有烹饪锅供勇者制作料理，为自己恢复状态。
>
> 勇者背包内共有编号为 0 ~ 4 的五种食材，其中 materials[j] 表示第 j 种食材的数量。通过这些食材可以制作若干料理，cookbooks[i][j] 表示制作第 i 种料理需要第 j 种食材的数量，而 attribute[i] = [x,y] 表示第 i 道料理的美味度 x 和饱腹感 y。
>
> 在饱腹感不小于 limit 的情况下，请返回勇者可获得的最大美味度。如果无法满足饱腹感要求，则返回 -1。
>
> 注意：
>
> 每种料理只能制作一次。
> 示例 1：
>
> 输入：materials = [3,2,4,1,2]
> cookbooks = [[1,1,0,1,2],[2,1,4,0,0],[3,2,4,1,0]]
> attribute = [[3,2],[2,4],[7,6]]
> limit = 5
>
> 输出：7
>
> 解释：
> 食材数量可以满足以下两种方案：
> 方案一：制作料理 0 和料理 1，可获得饱腹感 2+4、美味度 3+2
> 方案二：仅制作料理 2， 可饱腹感为 6、美味度为 7
> 因此在满足饱腹感的要求下，可获得最高美味度 7
>
> 示例 2：
>
> 输入：materials = [10,10,10,10,10]
> cookbooks = [[1,1,1,1,1],[3,3,3,3,3],[10,10,10,10,10]]
> attribute = [[5,5],[6,6],[10,10]]
> limit = 1
>
> 输出：11
>
> 解释：通过制作料理 0 和 1，可满足饱腹感，并获得最高美味度 11
>
> 提示：
>
> materials.length == 5
> 1 <= cookbooks.length == attribute.length <= 8
> cookbooks[i].length == 5
> attribute[i].length == 2
> 0 <= materials[i], cookbooks[i][j], attribute[i][j] <= 20
> 1 <= limit <= 100

**思路**

- 每道料理可选可不选（材料足够时可选），可以使用回溯

- 返回条件是每一道料理都遍历过了（即选了或没选），索引超出料理数组最大索引，此时判断饱腹感y是否满足要求，满足则更新结果。最后记得返回。

- 循环遍历当前料理后的每一道料理，如果材料还够就选择该料里

- 回溯时要判断该料理是否选择了，选择了要归还材料并还原x、y

做题时忽略了题目要求：如果无法满足饱腹感要求，则返回 -1。所以记得res初始化为-1



**代码**

```js
var perfectMenu = function (materials, cookbooks, attribute, limit) {
  let len = cookbooks.length
  let res = -1
  backtracking(0, 0, 0)
  return res

function backtracking(startIndex, x, y) {
    if (startIndex >= len) {
        // 饱腹感满足要求才更新美味度
        if (y >= limit) {
            res = Math.max(res, x)
        }
        return
    }
    // 遍历每一道料理
    for (let i = startIndex; i < len; i++) {
        // 得到该料理的每一种材料需求
        let [a, b, c, d, e] = [...cookbooks[i]]
        // flag用于标记该道料理有没有被选择，方便回溯的时候将材料归还回去
        let flag = 0
        // 所有材料都够用才选择该料理
        if (a <= materials[0] && b <= materials[1] && c <= materials[2] && d <= materials[3] && e <= materials[4]) {
            // 更新美味度和饱腹感
            x += attribute[i][0]
            y += attribute[i][1]
            // 消耗材料
            materials[0] -= a
            materials[1] -= b
            materials[2] -= c
            materials[3] -= d
            materials[4] -= e
            // 标记选择了该料理
            flag = 1
        }
        // 递归下一道料理
        backtracking(i + 1, x, y)
        // 回溯回来，根据flag判断用不用归还材料和还原美味度、饱腹感
        if (flag) {
            x -= attribute[i][0]
            y -= attribute[i][1]
            materials[0] += a
            materials[1] += b
            materials[2] += c
            materials[3] += d
            materials[4] += e
        }
    }
}

}

```



## [188. 买卖股票的最佳时机 IV](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iv/)

**题目**

> 给定一个整数数组 prices ，它的第 i 个元素 prices[i] 是一支给定的股票在第 i 天的价格。
>
> 设计一个算法来计算你所能获取的最大利润。你最多可以完成 k 笔交易。
>
> 注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
>
>  
>
> 示例 1：
>
> 输入：k = 2, prices = [2,4,1]
> 输出：2
> 解释：在第 1 天 (股票价格 = 2) 的时候买入，在第 2 天 (股票价格 = 4) 的时候卖出，这笔交易所能获得利润 = 4-2 = 2 。
> 示例 2：
>
> 输入：k = 2, prices = [3,2,6,5,0,3]
> 输出：7
> 解释：在第 2 天 (股票价格 = 2) 的时候买入，在第 3 天 (股票价格 = 6) 的时候卖出, 这笔交易所能获得利润 = 6-2 = 4 。
>      随后，在第 5 天 (股票价格 = 0) 的时候买入，在第 6 天 (股票价格 = 3) 的时候卖出, 这笔交易所能获得利润 = 3-0 = 3 。
>
>
> 提示：
>
> 0 <= k <= 100
> 0 <= prices.length <= 1000
> 0 <= prices[i] <= 1000

**思路**

看看[买卖股票的最佳时机III](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/)的分析

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

**回到本题**

- 本题和[买卖股票的最佳时机III](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/)的区别就是交易次数从2变成了一个变量k,按照该题的思路用一个for循环遍历k应该就可以解决问题。
- 设`dp[i][j]`表示第i天在状态j下的手里的金额，j的范围为`0~2*k`，分别表示`2*k + 1`种状态。
- 递推关系
  - 还没有操作 `dp[i][0] = dp[i-1][0]`
  - 第k次已经买入的递推关系 `dp[i][2*k-1] = Math.max(dp[i-1][2*k-1] , dp[i-1][2*k-2] - prices[i])`
  - 第k次已经卖出的递推关系 `dp[i][2*k] = Math.max(dp[i-1][2*k] , dp[i-1][2*k-1] + prices[i])`
- dp数组初始化

  - `dp[0][0] = 0`
  - `dp[0][1] = -prices[0]`
  - `dp[0][2] = 0`
  - `dp[0][3] = -prices[0]`
  - `dp[0][4] = 0`
  - ...用for循环解决
- 从prices数组第二项开始从前向后遍历
- 最后返回`dp[len - 1][2*k]`

**代码**

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(k,prices) {
    let len = prices.length 
    if(!len) return 0
    let dp = (new Array(len)).fill(new Array(2*k + 1).fill(0))
    for(let i = 0 ; i < k ; i++){
        dp[0][2*i + 1] = -prices[0]
    }

    for(let i = 1 ; i < len ;i++){
        dp[i][0] = dp[i-1][0]
        for(let j = 1 ; j <= k ; j++){
            dp[i][2*j-1] = Math.max(dp[i-1][2*j-1] , dp[i-1][2*j-2] - prices[i])
            dp[i][2*j] = Math.max(dp[i-1][2*j] , dp[i-1][2*j-1] + prices[i])
        }
    }
    return dp[len - 1][2*k]
};
```



## [300. 最长递增子序列](https://leetcode-cn.com/problems/longest-increasing-subsequence/)

**题目**

> 给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。
>
> 子序列 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。
>
>
> 示例 1：
>
> 输入：nums = [10,9,2,5,3,7,101,18]
> 输出：4
> 解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。
> 示例 2：
>
> 输入：nums = [0,1,0,3,2,3]
> 输出：4
> 示例 3：
>
> 输入：nums = [7,7,7,7,7,7,7]
> 输出：1
>
>
> 提示：
>
> 1 <= nums.length <= 2500
> -104 <= nums[i] <= 104
>
> 
>

**思路**

- 设`dp[i]`表示以i这个位置数字为结尾的最长升序子序列的长度
- `dp[i]`与`dp[j] (0 <= j < i)`的关系：对于每一个`dp[j]`，`if(nums[i] > nums[j]) dp[i] = Math.max(dp[i] , dp[j] + 1)`
- 初始化，对于每一个i，`dp[i]`至少等于1（即最长升序子序列），故每一项初始化为1
- 由于`dp[i]`依赖于前面的每一项，故从前向后遍历
- 返回dp数组中的最大值，而不是最后一项

**代码**

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
    let len = nums.length
    let dp = new Array(len).fill(1)
    let res = 1
	
    for(let i = 1 ; i < len ; i++){
        for(let j = 0 ; j < i ; j++){
            if(nums[i] > nums[j]){
                dp[i] = Math.max(dp[i] , dp[j] + 1)
            }
        }
        res = Math.max(res , dp[i])
    }
    return res

};
```

