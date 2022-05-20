# DAY5 回溯算法（三）

## [93. 复原 IP 地址](https://leetcode-cn.com/problems/restore-ip-addresses/)

**题目**

> 有效 IP 地址 正好由四个整数（每个整数位于 0 到 255 之间组成，且不能含有前导 0），整数之间用 '.' 分隔。
>
> - 例如："0.1.2.201" 和 "192.168.1.1" 是 有效 IP 地址，但是 "0.011.255.245"、"192.168.1.312" 和 "192.168@1.1" 是 无效 IP 地址。
>
> 给定一个只包含数字的字符串 s ，用以表示一个 IP 地址，返回所有可能的有效 IP 地址，这些地址可以通过在 s 中插入 '.' 来形成。你 不能 重新排序或删除 s 中的任何数字。你可以按 任何 顺序返回答案。
>

示例 1：

输入：s = "25525511135"
输出：["255.255.11.135","255.255.111.35"]
示例 2：

输入：s = "0000"
输出：["0.0.0.0"]
示例 3：

输入：s = "101023"
输出：["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]


提示：

1 <= s.length <= 20
s 仅由数字组成



**思路**

- 只能在原字符串中插入`.`来形成IP地址，不能重新排序和删除任何数字，因此如果字符串长度超过16，肯定不能形成有效IP，直接返回空解
- 插入三个点，即截取三次就可以形成一个IP地址
- 每一段的数字不含前导0，若截取到一段有前导0，就只能截取一个0
- 每一段数字范围为0到255
- 注意不合法的字符串回溯时要将以变更变量还原，记得回溯。

**代码详解**

```javascript
var restoreIpAddresses = function (s) {
  let result = []
  let path = []
  let len = s.length

  backtracking(0, 0)
  return result

  function backtracking(startIndex, count) {
    // 结束条件就是截取了三次了
    if (count === 3) {
      return result.push(path.join('.'))
    }

    for (let i = startIndex; i < len; i++) {
      count++
      // 截取当前位置
      let sub = s.slice(startIndex, i + 1)
      // 判断是否合法
      if (!isValid(sub)) {
        count--
        continue
      }
      if (count === 3) {
        let last = s.slice(i + 1)
        if (!isValid(last)) {
          count--
          continue
        }
        path.push(sub)
        path.push(last)
      } else {
        path.push(sub)
      }
      backtracking(i + 1, count)
      path.pop()
      if (count === 3) path.pop()
      count--
    }
  }

  // 用于判断截取的部分是否满足条件
  function isValid(s) {
    if (s.length === 0) return false
    if (s === '0') return true
    if (s[0] === '0') return false
    if (Number(s) > 255) return false
    return true
  }
}
```



## [78. 子集](https://leetcode-cn.com/problems/subsets/)

**题目**

> 给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。
>
> 解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。
>
>  
>
> 示例 1：
>
> 输入：nums = [1,2,3]
> 输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
> 示例 2：
>
> 输入：nums = [0]
> 输出：[[],[0]]
>
>
> 提示：
>
> 1 <= nums.length <= 10
> -10 <= nums[i] <= 10
> nums 中的所有元素 互不相同

**思路**

- 子集不能重复，所以每次选取当前元素之后，只能选取该元素后面的元素
- 结束条件可以不写，因为当startIndex超出索引时会自动完成当前递归
- 每次进入函数就要收集结果，否则会漏掉不选取当前元素的子集，会少掉一半的子集

**代码详解**

```python
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        length = len(nums)
        result = []
        path = []

        def backtracking(startIndex):
            # 子集问题要在结束条件前收集结果，否则会漏掉自己，少掉一半结果
            result.append(path[:])
            for i in range(startIndex , length):
                path.append(nums[i])
                backtracking(i+1)
                path.pop()
        
        backtracking(0)
        return result
        
```



## [90. 子集 II](https://leetcode-cn.com/problems/subsets-ii/)

**题目**

> 给你一个整数数组 nums ，其中可能包含重复元素，请你返回该数组所有可能的子集（幂集）。
>
> 解集 不能 包含重复的子集。返回的解集中，子集可以按 任意顺序 排列。
>
>  
>
> 示例 1：
>
> 输入：nums = [1,2,2]
> 输出：[[],[1],[1,2],[1,2,2],[2],[2,2]]
> 示例 2：
>
> 输入：nums = [0]
> 输出：[[],[0]]
>
>
> 提示：
>
> 1 <= nums.length <= 10
> -10 <= nums[i] <= 10

**思路**

- 注意去重，同一层不能重复选取，但同一树枝可以

**代码详解**

```python
class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        length = len(nums)
        result = []
        path = []
        # used 数组用于去重
        used = [0] * length
        nums.sort()

        def backtracking(startIndex):
            # 子集问题要在结束条件前收集结果，否则会漏掉自己，少掉一半结果
            result.append(path[:]) 
            for i in range(startIndex , length):
                if i > 0 and nums[i-1] == nums[i] and used[i-1] == 0:
                    continue
                path.append(nums[i])
                used[i] = 1
                backtracking(i+1)
                path.pop()
                used[i] = 0
        
        backtracking(0)
        return result
```

