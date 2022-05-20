---
date: 2022.4.7
---

# DAY8 动态规划（一）

**动态规划五部曲**

1. 确定dp数组（dp table）以及下标的含义
2. 确定递推公式
3. dp数组如何初始化
4. 确定遍历顺序
5. 举例推导dp数组

**动态规划如何debug**

**找问题的最好方式就是把dp数组打印出来，看看究竟是不是按照自己思路推导的！**

- 这道题目我**举例**推导状态转移公式了么？
- 我**打印dp数组**的日志了么？
- 打印出来了dp数组**和我想的一样么**？



## [509. 斐波那契数](https://leetcode-cn.com/problems/fibonacci-number/)

**题目**

> 斐波那契数 （通常用 F(n) 表示）形成的序列称为 斐波那契数列 。该数列由 0 和 1 开始，后面的每一项数字都是前面两项数字的和。也就是：
>
> F(0) = 0，F(1) = 1
> F(n) = F(n - 1) + F(n - 2)，其中 n > 1
> 给定 n ，请计算 F(n) 。
>
>  
>
> 示例 1：
>
> 输入：n = 2
> 输出：1
> 解释：F(2) = F(1) + F(0) = 1 + 0 = 1
> 示例 2：
>
> 输入：n = 3
> 输出：2
> 解释：F(3) = F(2) + F(1) = 1 + 1 = 2
> 示例 3：
>
> 输入：n = 4
> 输出：3
> 解释：F(4) = F(3) + F(2) = 2 + 1 = 3
>
>
> 提示：
>
> 0 <= n <= 30
>

**思路**

1. 确定dp数组以及下标的含义

   dp[i]的定义为：第i个数的斐波那契数值是dp[i]

2. 确定递推公式

   dp[i] = dp[i-1] + dp[i-2]

3. dp数组如何初始化

   dp[0] = 0

   dp[1] = 1

4. 确定遍历顺序

   从递归公式dp[i] = dp[i - 1] + dp[i - 2];中可以看出，dp[i]是依赖 dp[i - 1] 和 dp[i - 2]，那么遍历的顺序一定是从前到后遍历的

5. 举例推导dp数组

   按照这个递推公式dp[i] = dp[i - 1] + dp[i - 2]，我们来推导一下，当N为10的时候，dp数组应该是如下的数列：0 1 1 2 3 5 8 13 21 34 55



**代码**

```python
class Solution:
    def fib(self, n: int) -> int:
        if n < 2:
            return n
        a , b , c = 0 , 1 , 0
        for i in range(1,n):
            c = a + b
            a , b = b , c
        return c
```

```js
/**
 * @param {number} n
 * @return {number}
 */
var fib = function(n) {
    if( n < 2) return n
    let a = 0 , b = 1 , c = 0
    for(let i = 1 ; i < n; i++){
        c = a + b
        a = b
        b = c
    }
    return c
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

1. 确定dp数组及下标含义

   dp[i]表示有i级台阶的方案数

2. 确定递推公式

   dp[i] = dp[i-1] + dp[i-2]

3. 递推数组初始化

   台阶数为1时dp[1] = 1 , 为2时dp[2] = 2

4. 遍历顺序

   从下往上顺序遍历

5. 举例推导

   1 ，2 ，3 ，5 ，8 ，13



**代码**

```python
class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        dp1 , dp2 = 1 , 2
        for i in range(3 , n+1):
            temp = dp1 + dp2
            dp1 = dp2
            dp2 = temp
        return dp2
        
```





## [746. 使用最小花费爬楼梯](https://leetcode-cn.com/problems/min-cost-climbing-stairs/)

**题目**

> 给你一个整数数组 cost ，其中 cost[i] 是从楼梯第 i 个台阶向上爬需要支付的费用。一旦你支付此费用，即可选择向上爬一个或者两个台阶。
>
> 你可以选择从下标为 0 或下标为 1 的台阶开始爬楼梯。
>
> 请你计算并返回达到楼梯顶部的最低花费。
>
>  
>
> 示例 1：
>
> 输入：cost = [10,15,20]
> 输出：15
> 解释：你将从下标为 1 的台阶开始。
> - 支付 15 ，向上爬两个台阶，到达楼梯顶部。
> 总花费为 15 。
> 示例 2：
>
> 输入：cost = [1,100,1,1,1,100,1,1,100,1]
> 输出：6
> 解释：你将从下标为 0 的台阶开始。
> - 支付 1 ，向上爬两个台阶，到达下标为 2 的台阶。
> - 支付 1 ，向上爬两个台阶，到达下标为 4 的台阶。
> - 支付 1 ，向上爬两个台阶，到达下标为 6 的台阶。
> - 支付 1 ，向上爬一个台阶，到达下标为 7 的台阶。
> - 支付 1 ，向上爬两个台阶，到达下标为 9 的台阶。
> - 支付 1 ，向上爬一个台阶，到达楼梯顶部。
> 总花费为 6 。
>
>
> 提示：
>
> 2 <= cost.length <= 1000
> 0 <= cost[i] <= 999

**思路**

1. 确定dp数组（dp table）以及下标的含义

   从下标为i的台阶向上爬所需要的最少的花费为dp[i]

2. 确定递推公式

   第i级只能从i-1 或 i-2 级爬上来，选择一个花费低的

   `dp[i] = min(dp[i-1] + cost[i] , dp[i-2]+cost[i] , dp[i-2] + cost[i] + cost[i-1])`

3. dp数组如何初始化

   dp[0] = cost[0]

   dp[1] = cost[1]

4. 确定遍历顺序

   从前向后遍历cost数组

5. 举例推导dp数组



**代码**

```python
class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        length = len(cost)
        dp = [-1] * length
        dp[0] , dp[1] = cost[0] , cost[1]
        for i in range(2 , length):
            dp[i] = min(dp[i-1] , dp[i-2]) + cost[i]
        return min(dp[length - 2] , dp[length - 1] )
```

优化空间复杂度

```python
class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        n = len(cost)
        a , b = cost[0] , cost[1]
        for i in range(2 , n):
            c = min(a, b) + cost[i]
            a , b = b , c
        return min(a,b)
```



## [62. 不同路径](https://leetcode-cn.com/problems/unique-paths/)

**题目**

> 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。
>
> 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。
>
> 问总共有多少条不同的路径？
>
>  
>
> 示例 1：
>
>
> 输入：m = 3, n = 7
> 输出：28
> 示例 2：
>
> 输入：m = 3, n = 2
> 输出：3
> 解释：
> 从左上角开始，总共有 3 条路径可以到达右下角。
> 1. 向右 -> 向下 -> 向下
> 2. 向下 -> 向下 -> 向右
> 3. 向下 -> 向右 -> 向下
> 示例 3：
>
> 输入：m = 7, n = 3
> 输出：28
> 示例 4：
>
> 输入：m = 3, n = 3
> 输出：6
>
>
> 提示：
>
> 1 <= m, n <= 100
> 题目数据保证答案小于等于 2 * 109

**代码**

```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        dp = [[1]*(n + 1)] * (m + 1)
        for i in range(2,m + 1):
            for j in range(2,n + 1):
                dp[i][j] = dp[i-1][j] + dp[i][j-1]
        return dp[m][n]
```

