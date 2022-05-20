# DAY4 回溯算法（二）

#### [39. 组合总和](https://leetcode-cn.com/problems/combination-sum/)

**注意：为了使集合不重复，先将candidates排序，每次选择范围为上一次选择的数及其之后的数。**

```javascript
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function(candidates, target) {
    let result = []
    let path = []
    let sum = 0
    // 先排序
    candidates.sort((a,b)=>{
        return a - b
    })

    function backtracking(startIndex){
        if(sum === target) {
            result.push(path.slice())
        }

        for(let i = startIndex ; i < candidates.length ; i++){
            if(sum + candidates[i] > target) continue
            sum += candidates[i]
            path.push(candidates[i])
            // 每次可以选择的范围是上一次选择的数及其之后的数
            backtracking(i)
            sum -= candidates[i]
            path.pop()
        }
    }

    backtracking(0)
    return result
};
```



#### [40. 组合总和 II](https://leetcode-cn.com/problems/combination-sum-ii/)

**本题的难点在于区别1中：集合（数组candidates）有重复元素，但还不能有重复的组合**。

都知道组合问题可以抽象为树形结构，那么“使用过”在这个树形结构上是有两个维度的，一个维度是同一树枝上使用过，一个维度是同一树层上使用过。**没有理解这两个层面上的“使用过” 是造成大家没有彻底理解去重的根本原因。**

回看一下题目，元素在同一个组合内是可以重复的，怎么重复都没事，但两个组合不能相同。

**所以我们要去重的是同一树层上的“使用过”，同一树枝上的都是一个组合里的元素，不用去重**。

**强调一下，树层去重的话，需要对数组排序！**

**如果`candidates[i] == candidates[i - 1]` 并且 `used[i - 1] == false`，就说明：前一个树枝，使用了candidates[i - 1]，也就是说同一树层使用过candidates[i - 1]**。

![img](https://gitee.com/PencilX/myblogassets/raw/master/src/20201123202817973.png)

使用used数组
```javascript
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function(candidates, target) {
    let result = []
    let path = []
    let sum = 0
    let len = candidates.length
    let used = new Array(len).fill(0)
    // 去重 要排序
    candidates.sort((a,b)=>{
        return a - b
    })

    function backtracking(startIndex) {
        if(sum === target){
            return result.push(path.slice())
        }

        for(let i = startIndex ; i < len && sum + candidates[i] <= target ; i++){
            //同一层的第二个树枝开始要判断是否重复
            if(i > 0 && candidates[i] === candidates[i-1] && !used[i-1]) continue
            sum += candidates[i]
            path.push(candidates[i])
            used[i] = 1
            backtracking(i+1)
            sum -= candidates[i]
            path.pop()
            used[i] = 0
        }
    }

    backtracking(0)
    return result
};
```

也可以不使用used数组，直接使用 `startIndex`进行判断去重

```javascript
if(i > startIndex && candidates[i] === candidates[i-1]) continue

//i > startIndex 表示同一层从第二个树枝开始
```





#### [131. 分割回文串](https://leetcode-cn.com/problems/palindrome-partitioning/)

**题目**

给定一个字符串 s，将 s 分割成一些子串，使每个子串都是回文串。

返回 s 所有可能的分割方案。

示例: 输入: "aab" 输出: [ ["aa","b"], ["a","a","b"] ]

![image-20220403100100462](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220403100100462.png)

递归用来纵向遍历，for循环用来横向遍历，切割线（就是图中的红线）**切割到字符串的结尾位置，说明找到了一个切割方法。**

此时可以发现，切割问题的回溯搜索的过程和组合问题的回溯搜索的过程是差不多的。

```javascript
/**
 * @param {string} s
 * @return {string[][]}
 */
var partition = function(s) {
    let len = s.length
    let res = []
    let path = []

    backtracking(0)
    return res

    function backtracking(startIndex){
        if(startIndex >= len){
            return res.push(path.slice())
        }

        for(let i = startIndex ; i < len ;i++){
            if(isPalindrome(s , startIndex , i)){   //是回文串
                let str = s.slice(startIndex , i + 1)
                path.push(str)
            }else{
                continue
            }
            backtracking(i + 1)
            path.pop()
        }
    }

    // 判断回文串
    function isPalindrome(s , start , end){
        let i = start , j = end
        while(i < j){
            if(s[i] !== s[j]){
                return false
            }
            i++
            j--
        }
        return true
    }
};
```

