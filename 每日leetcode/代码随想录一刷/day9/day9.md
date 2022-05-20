---
date: 2022.4.8
---

# DAY9 动态规划（二）

## [63. 不同路径 II](https://leetcode-cn.com/problems/unique-paths-ii/)

**题目**

> 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。
>
> 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish”）。
>
> 现在考虑网格中有障碍物。那么从左上角到右下角将会有多少条不同的路径？
>
> 网格中的障碍物和空位置分别用 1 和 0 来表示。
>
>  
>
> 示例 1：
>
>
> 输入：obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]
> 输出：2
> 解释：3x3 网格的正中间有一个障碍物。
> 从左上角到右下角一共有 2 条不同的路径：
> 1. 向右 -> 向右 -> 向下 -> 向下
> 2. 向下 -> 向下 -> 向右 -> 向右
> 示例 2：
>
>
> 输入：obstacleGrid = [[0,1],[0,0]]
> 输出：1
>
>
> 提示：
>
> m == obstacleGrid.length
> n == obstacleGrid[i].length
> 1 <= m, n <= 100
> obstacleGrid[i][j] 为 0 或 1

**思路**

1. dp\[i][j]表示第i行j列的方案数，i和j从0开始
2. 初始化第一行和第一列为1，遇到障碍物的地方及其后面地方都为0.将dp数组其余有障碍物的地方初始化为0
3. 递推公式为 `dp[i][j] = dp[i-1][j] + dp[i][j-1]`
4. 按顺序遍历行和列就好

**代码**

```python
class Solution:
    def uniquePathsWithObstacles(self, obstacleGrid: List[List[int]]) -> int:
        m, n = len(obstacleGrid), len(obstacleGrid[0])
        dp = [[0 for _ in range(n)] for _ in range(m)]
        for i in range(m):
            if obstacleGrid[i][0] != 1:
                dp[i][0] = 1
            else:
                break
        for j in range(n):
            if obstacleGrid[0][j] != 1:
                dp[0][j] = 1
            else:
                break
        for i in range(1, m):
            for j in range(1, n):
                if obstacleGrid[i][j] != 1:
                    dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
        return dp[m-1][n-1]
```

**注意**：dp = [[0] * n] * m 这种修改单项会修改整行或整列

## [343. 整数拆分](https://leetcode-cn.com/problems/integer-break/)

**题目**

> 给定一个正整数 n ，将其拆分为 k 个 正整数 的和（ k >= 2 ），并使这些整数的乘积最大化。
>
> 返回 你可以获得的最大乘积 。
>
> 
>
> 示例 1:
>
> 输入: n = 2
> 输出: 1
> 解释: 2 = 1 + 1, 1 × 1 = 1。
> 示例 2:
>
> 输入: n = 10
> 输出: 36
> 解释: 10 = 3 + 3 + 4, 3 × 3 × 4 = 36。
>
>
> 提示:
>
> 2 <= n <= 58

**思路**



**代码**

```python
class Solution:
    def integerBreak(self, n: int) -> int:
        dp = [1 for _ in range(n+1)]
        for i in range(3,n+1):
            for j in range(i):
                cur = max(j*(i-j) , j*dp[i-j])
                dp[i] =  max(cur , dp[i])
        return dp[n]
                

```



