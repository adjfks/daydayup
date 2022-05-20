---
date: 2022.4.5
---

# DAY6 贪心算法（一）

**贪心的本质是选择每一阶段的局部最优，从而达到全局最优**。

**刷题或者面试的时候，手动模拟一下感觉可以局部最优推出整体最优，而且想不到反例，那么就试一试贪心**。

贪心算法一般分为如下四步：

- 将问题分解为若干个子问题
- 找出适合的贪心策略
- 求解每一个子问题的最优解
- 将局部最优解堆叠成全局最优解

## [455. 分发饼干](https://leetcode-cn.com/problems/assign-cookies/)

**题目**

> 假设你是一位很棒的家长，想要给你的孩子们一些小饼干。但是，每个孩子最多只能给一块饼干。
>
> 对每个孩子 i，都有一个胃口值 g[i]，这是能让孩子们满足胃口的饼干的最小尺寸；并且每块饼干 j，都有一个尺寸 s[j] 。如果 s[j] >= g[i]，我们可以将这个饼干 j 分配给孩子 i ，这个孩子会得到满足。你的目标是尽可能满足越多数量的孩子，并输出这个最大数值。
>
> 示例 1:
>
> - 输入: g = [1,2,3], s = [1,1]
> - 输出: 1 解释:你有三个孩子和两块小饼干，3个孩子的胃口值分别是：1,2,3。虽然你有两块小饼干，由于他们的尺寸都是1，你只能让胃口值是1的孩子满足。所以你应该输出1。
>
> 示例 2:
>
> - 输入: g = [1,2], s = [1,2,3]
> - 输出: 2
> - 解释:你有两个孩子和三块小饼干，2个孩子的胃口值分别是1,2。你拥有的饼干数量和尺寸都足以让所有孩子满足。所以你应该输出2.
>
> 提示：
>
> - 1 <= g.length <= 3 * 10^4
> - 0 <= s.length <= 3 * 10^4
> - 1 <= g[i], s[j] <= 2^31 - 1

**思路**

- 大尺寸的饼干既可以满足大胃口的，也可以满足小胃口的，那么优先满足大胃口的，这样不会浪费。
- 对两个数组进行排序，从大到小遍历并计数

**代码**

```python
def findContentChildren2(self, g: List[int], s: List[int]) -> int:
        g.sort()
        s.sort()
        child = 0
        for i in range(len(s)):
           if child < len(g) and s[i] >= g[child]:
               child += 1
        return child
```



## [376. 摆动序列](https://leetcode-cn.com/problems/wiggle-subsequence/)

**题目**

> 如果连续数字之间的差严格地在正数和负数之间交替，则数字序列称为 摆动序列 。第一个差（如果存在的话）可能是正数或负数。仅有一个元素或者含两个不等元素的序列也视作摆动序列。
>
> 例如， [1, 7, 4, 9, 2, 5] 是一个 摆动序列 ，因为差值 (6, -3, 5, -7, 3) 是正负交替出现的。
>
> 相反，[1, 4, 7, 2, 5] 和 [1, 7, 4, 5, 5] 不是摆动序列，第一个序列是因为它的前两个差值都是正数，第二个序列是因为它的最后一个差值为零。
> 子序列 可以通过从原始序列中删除一些（也可以不删除）元素来获得，剩下的元素保持其原始顺序。
>
> 给你一个整数数组 nums ，返回 nums 中作为 摆动序列 的 最长子序列的长度 。
>

> 示例 1：
>
> 输入：nums = [1,7,4,9,2,5]
> 输出：6
> 解释：整个序列均为摆动序列，各元素之间的差值为 (6, -3, 5, -7, 3) 。
> 示例 2：
>
> 输入：nums = [1,17,5,10,13,15,10,5,16,8]
> 输出：7
> 解释：这个序列包含几个长度为 7 摆动序列。
> 其中一个是 [1, 17, 10, 13, 10, 16, 8] ，各元素之间的差值为 (16, -7, 3, -3, 6, -8) 。
> 示例 3：
>
> 输入：nums = [1,2,3,4,5,6,7,8,9]
> 输出：2
>
>
> 提示：
>
> - `1 <= nums.length <= 1000`
> - `0 <= nums[i] <= 1000`

**思路**

- 删除单调坡度上的节点，不包括两端的节点，那么就拥有了一个局部的峰
- 整个序列有最多的局部峰值，那么整体就达到最多的峰值
- 举不到反例，试试贪心
- 实际操作直接计数即可，不用删除节点

**代码**

```python
class Solution:
    def wiggleMaxLength(self, nums: List[int]) -> int:
        if len(nums) == 1:
            return 1
        # 统计左边的峰，默认右边有一个峰
        res = 1
        curdiff = 0
        prediff = 0
        for i in range(1,len(nums)):
            curdiff = nums[i] - nums[i-1]
            if (curdiff > 0 and prediff <= 0) or (curdiff < 0 and prediff >= 0):
                res += 1
                prediff = curdiff
        return res

```





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
> 示例 2：
>
> 输入：nums = [1]
> 输出：1
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
> 

**思路**

- 一开始统计，肯定从整数开始计数
- 统计和，从和为正的时候开始统计，一旦遇到负的和，直接舍弃前面的子序列，从下一位置开始统计。
- **不能让“连续和”为负数的时候加上下一个元素，而不是 不让“连续和”加上一个负数**。

**代码**

```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        res = -10000
        count = 0
        for i in range(len(nums)):
            count += nums[i]
            if count > res:
                res = count
            if count < 0:
                count = 0
        return res

```

dp

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    let len = nums.length
    let dp = new Array(len)
    dp[0] = nums[0]
    let res = dp[0]
    for(let i = 1 ; i < len ; i++){
        dp[i] = Math.max(dp[i-1] + nums[i] , nums[i])
        if(dp[i] > res){
            res = dp[i]
        }
    }
    return res
};
```



## [122. 买卖股票的最佳时机 II](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/)

**题目**

> 给定一个数组 prices ，其中 prices[i] 表示股票第 i 天的价格。
>
> 在每一天，你可能会决定购买和/或出售股票。你在任何时候 最多 只能持有 一股 股票。你也可以购买它，然后在 同一天 出售。
> 返回 你能获得的 最大 利润 。
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
>
> 

**思路**

- 第一种思路
  - 在降价前卖出，涨价前如果还没买就买入
  - 最后一天如果手头有股票一定要卖出
- 第二种思路
  - 今天比昨天涨价了，卖出
  - 今天不涨价，不操作

**代码**

思路一：

```python
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        length = len(prices)
        if length == 1:
            return 0
        res = 0
        has = False
        buy = 0
        for i in range(length -1):
            if prices[i] > prices[i+1]:
                if has:
                    res += prices[i] - buy
                    buy = 0
                    has = False
            elif prices[i] < prices[i+1]:
                if not has:
                    buy = prices[i]
                    has = True
        if has:
            res += prices[length -1] - buy
        return res
                    
```

思路二

```python
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        res = 0
        for i in range(1 , len(prices)):
            if prices[i] > prices[i-1]:
                res += prices[i] - prices[i-1]
        return res
```

