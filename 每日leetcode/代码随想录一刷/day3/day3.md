# DAY3 回溯算法（一）

回溯法也可以叫做回溯搜索法，它是一种搜索的方式。**回溯函数也就是递归函数，指的都是一个函数**。

**因为回溯的本质是穷举，穷举所有可能，然后选出我们想要的答案**，如果想让回溯法高效一些，可以加一些剪枝的操作，但也改不了回溯法就是穷举的本质。

回溯法，一般可以解决如下几种问题：

- 组合问题：N个数里面按一定规则找出k个数的集合
- 切割问题：一个字符串按一定规则有几种切割方式
- 子集问题：一个N个数的集合里有多少符合条件的子集
- 排列问题：N个数按一定规则全排列，有几种排列方式
- 棋盘问题：N皇后，解数独等等



回溯三部曲

- 回溯函数模板返回值以及参数
- 回溯函数终止条件
- 回溯搜索的遍历过程



**for循环可以理解是横向遍历，backtracking（递归）就是纵向遍历**



回溯算法模板框架

```c
void backtracking(参数) {
    if (终止条件) {
        存放结果;
        return;
    }

    for (选择：本层集合中元素（树中节点孩子的数量就是集合的大小）) {
        处理节点;
        backtracking(路径，选择列表); // 递归
        回溯，撤销处理结果
    }
}
```





#### [77. 组合](https://leetcode-cn.com/problems/combinations/)

组合问题

js

```javascript
/**
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
var combine = function(n, k) {
    // result用于存储结果集合
    let result = []
    // path用于存储单次结果
    let path = []
    
    function backtracking(n , k , startIndex){
        // 结束条件，path达到了k的大小
        if(path.length === k){
            // 深拷贝一份path，否则只是把path的引用存储进结果
            result.push(path.slice())
            return 
        }

        for(let i = startIndex ; i <= n ; i++){
            path.push(i)
            backtracking(n , k , i+1)
            // 回溯
            path.pop(i)
        }
    }

    backtracking(n , k , 1)
    return result
};
```

python3

```python
class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        result = []
        path = []

        def backtracking(n , k , startIndex):
            if len(path) == k:
                result.append([i for i in path])
                return
            for i in range(startIndex , n+1):
                path.append(i)
                backtracking(n , k , i+1)
                path.pop()
        
        backtracking(n , k , 1)
        return result
```

回溯+剪枝

js

```javascript
for(let i = startIndex ; i <= n - (k - path.length) + 1 ; i++){
            path.push(i)
            backtracking(n , k , i+1)
            // 回溯
            path.pop(i)
        }
    }
```

python

```python
for i in range(startIndex , n-(k-len(path))+2):
                path.append(i)
                backtracking(n , k , i+1)
                path.pop()
```



#### [216. 组合总和 III](https://leetcode-cn.com/problems/combination-sum-iii/)

python

```python
class Solution:
    def combinationSum3(self, k: int, n: int) -> List[List[int]]:
        result = []
        path = []
        global _sum
        _sum = 0

        def backtracking( n , k , startIndex , _sum):
            if _sum > n:
                    return
            if len(path) == k:
                if _sum == n:
                    result.append([i for i in path])
                return
            for i in range(startIndex , 9 - (k - len(path)) + 2):
                _sum += i
                path.append(i)
                backtracking(n , k , i+1 , _sum)
                _sum -= i
                path.pop()
        
        backtracking(n , k , 1 , _sum)
        return result

```

js

```javascript
/**
 * @param {number} k
 * @param {number} n
 * @return {number[][]}
 */
var combinationSum3 = function(k, n) {
    result = []
    path = []
    sum = 0

    function backtracking(k , n , startIndex){
        if(sum > n) return
        if(path.length === k){
            if(sum === n) result.push(path.slice())
            return
        }
        for(let i = startIndex ; i <= 9 - (k - path.length)+ 1 ; i++){
            sum += i
            path.push(i)
            backtracking(k , n , i+1)
            sum -= i
            path.pop()
        }
    }

    backtracking(k , n , 1)
    return result
};
```



#### [17. 电话号码的字母组合](https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/)

js

```javascript
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function(digits) {
    let letterMap = ['' , '' , 'abc' , 'def' , 'ghi' , 'jkl' , 'mno' , 'pqrs' , 'tuv' , 'wxyz']
    let result = []
    let path = []

    function backtracking(curIndex){
        if(curIndex >= digits.length){
            result.push(path.join(''))
            return
        }

        let str = letterMap[digits[curIndex]]
        for(let i = 0 ; i < str.length ; i++){
            path.push(str[i])
            backtracking(curIndex + 1)
            path.pop()
        }
    }

    if(digits.length === 0)return []
    backtracking(0)
    return result
};
```

python

```python
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        result = []
        path = []
        letterMap = ['' , '' , 'abc' , 'def' , 'ghi' , 'jkl' , 'mno' , 'pqrs' , 'tuv' , 'wxyz']

        def backtracking(curIndex):
            if curIndex >= len(digits):
                result.append("".join(path))
                return
            
            s = letterMap[int(digits[curIndex])]
            for item in s:
                path.append(item)
                backtracking(curIndex + 1)
                path.pop()
        
        if len(digits) == 0: return []
        backtracking(0)
        return result

```

