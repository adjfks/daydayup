---
date: 2022.4.6
---

# DAY7 贪心算法（二）

## [55. 跳跃游戏](https://leetcode-cn.com/problems/jump-game/)

**题目**

> 给定一个非负整数数组 nums ，你最初位于数组的 第一个下标 。
>
> 数组中的每个元素代表你在该位置可以跳跃的最大长度。
>
> 判断你是否能够到达最后一个下标。
>
>  
>
> 示例 1：
>
> 输入：nums = [2,3,1,1,4]
> 输出：true
> 解释：可以先跳 1 步，从下标 0 到达下标 1, 然后再从下标 1 跳 3 步到达最后一个下标。
> 示例 2：
>
> 输入：nums = [3,2,1,0,4]
> 输出：false
> 解释：无论怎样，总会到达下标为 3 的位置。但该下标的最大跳跃长度是 0 ， 所以永远不可能到达最后一个下标。
>
>
> 提示：
>
> 1 <= nums.length <= 3 * 104
> 0 <= nums[i] <= 105

**思路**

- 实际上不用关心每次跳几格，只需知道能够覆盖的最大范围即可
- 在当前i位置，首先判断i是否在覆盖范围内，如果在，更新覆盖最大范围，覆盖最大范围为前一次的范围 most，或 i + nums[i]
- 遍历一遍数组，当most >= n-1时就可以返回true

**代码**

```python
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        n , most = len(nums) , 0
        for i in range(n):
            if i <= most:
                most = max(most , i + nums[i])
            if most >= n - 1:
                return True
        else:
            return False

```



## [45. 跳跃游戏 II](https://leetcode-cn.com/problems/jump-game-ii/)

**题目**

> 给你一个非负整数数组 nums ，你最初位于数组的第一个位置。
>
> 数组中的每个元素代表你在该位置可以跳跃的最大长度。
>
> 你的目标是使用最少的跳跃次数到达数组的最后一个位置。
>
> 假设你总是可以到达数组的最后一个位置。
>
>  
>
> 示例 1:
>
> 输入: nums = [2,3,1,1,4]
> 输出: 2
> 解释: 跳到最后一个位置的最小跳跃数是 2。
>      从下标为 0 跳到下标为 1 的位置，跳 1 步，然后跳 3 步到达数组的最后一个位置。
> 示例 2:
>
> 输入: nums = [2,3,0,1,4]
> 输出: 2
>
>
> 提示:
>
> 1 <= nums.length <= 104
> 0 <= nums[i] <= 1000

**思路**

- 一开始，step = 0 ， curMost = 0 ，nextMost = max(i + nums[i] , nextMost)
- 开始遍历，看一下下标是不是小于curMost ， 不是就要step++，此时就要更新curMost为step++后的范围，范围更新后，检查curMost是否已经达到末尾位置，达到就返回step

**代码**

```python
class Solution:
    def jump(self, nums: List[int]) -> int:
        n , curMost , nextMost , step = len(nums) , 0 , 0 , 0
        if n == 1:
            return 0
        for i in range(n):
            nextMost = max(nextMost , i + nums[i])
            if i == curMost:
                step += 1
                curMost = nextMost
                if curMost >= n - 1:
                    return step
                
```



## [1005. K 次取反后最大化的数组和](https://leetcode-cn.com/problems/maximize-sum-of-array-after-k-negations/)

**题目**

> 给你一个整数数组 nums 和一个整数 k ，按以下方法修改该数组：
>
> 选择某个下标 i 并将 nums[i] 替换为 -nums[i] 。
> 重复这个过程恰好 k 次。可以多次选择同一个下标 i 。
>
> 以这种方式修改数组后，返回数组 可能的最大和 。
>
>  
>
> 示例 1：
>
> 输入：nums = [4,2,3], k = 1
> 输出：5
> 解释：选择下标 1 ，nums 变为 [4,-2,3] 。
> 示例 2：
>
> 输入：nums = [3,-1,0,2], k = 3
> 输出：6
> 解释：选择下标 (1, 2, 2) ，nums 变为 [3,1,0,2] 。
> 示例 3：
>
> 输入：nums = [2,-3,-1,5,-4], k = 2
> 输出：13
> 解释：选择下标 (1, 4) ，nums 变为 [2,3,-1,5,4] 。
>
>
> 提示：
>
> 1 <= nums.length <= 104
> -100 <= nums[i] <= 100
> 1 <= k <= 104

**思路**

- 将数组按照绝对值从大到小排序
  - python使用 `sort(key = lambda x : abs(x) , reverse = True)`或 `A = sorted(A, key=abs, reverse=True)`
- 遍历数组遇到负数且k != 0 就翻转，k--
- 遍历完成K还大于0，将最后一个数根据k翻转
- 返回和



**代码**

```python
class Solution:
    def largestSumAfterKNegations(self, nums: List[int], k: int) -> int:
        n = len(nums)
        # 将数组按照绝对值从大到小进行排序
        nums.sort(key = lambda x : abs(x) , reverse = True)
        # 遍历数组，遇到复数翻转，k--
        for i in range(n):
            if nums[i] < 0 and k > 0:
                nums[i] = -nums[i]
                k -= 1
        k %= 2
        if k == 1:
            nums[-1] = -nums[-1]
        return sum(nums)
```

