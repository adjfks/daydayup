---
date: 2022.4.14
---

# DAY14 动态规划（七）

## [322. 零钱兑换](https://leetcode-cn.com/problems/coin-change/)

**题目**

> 给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。
>
> 计算并返回可以凑成总金额所需的 最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回 -1 。
>
> 你可以认为每种硬币的数量是无限的。
>
>  
>
> 示例 1：
>
> 输入：coins = [1, 2, 5], amount = 11
> 输出：3 
> 解释：11 = 5 + 5 + 1
> 示例 2：
>
> 输入：coins = [2], amount = 3
> 输出：-1
> 示例 3：
>
> 输入：coins = [1], amount = 0
> 输出：0
>
>
> 提示：
>
> 1 <= coins.length <= 12
> 1 <= coins[i] <= 231 - 1
> 0 <= amount <= 104

**思路**

- 题目求的是最少的金币个数，设 `dp[j]`表示凑足j需要的最少金币个数是 `dp[j]`
- 递推公式针对 `coins[i]`就是 `dp[j] = Math.min(dp[j - coins[i]] + 1 , dp[j])`
- dp数组初始化，`dp[0] = 0` ,其他初始化为最大值
- 遍历顺序，由于该问题强调的是组合而不是顺序，故先遍历背包容量，再遍历物品

**代码**

```js
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    const dp = new Array(amount+1).fill(Number.MAX_SAFE_INTEGER);
    dp[0] = 0;
    for(let num of coins) {
        for(let i=num; i<=amount; i++) {
            dp[i] = Math.min(dp[i],dp[i-num]+1);
        }
    }
    return dp[amount] === Number.MAX_SAFE_INTEGER ? -1 : dp[amount];
};
```





## [279. 完全平方数](https://leetcode-cn.com/problems/perfect-squares/)

**题目**

> 给你一个整数 n ，返回 和为 n 的完全平方数的最少数量 。
>
> 完全平方数 是一个整数，其值等于另一个整数的平方；换句话说，其值等于一个整数自乘的积。例如，1、4、9 和 16 都是完全平方数，而 3 和 11 不是。
>
>  
>
> 示例 1：
>
> 输入：n = 12
> 输出：3 
> 解释：12 = 4 + 4 + 4
> 示例 2：
>
> 输入：n = 13
> 输出：2
> 解释：13 = 4 + 9
>
> 提示：
>
> 1 <= n <= 104

**思路**

- 首先把小于n的完全平方数都找出来，作为物品
- 然后完全背包的做法做

```js
/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function(n) {
    let dp = new Array(n + 1).fill(Number.MAX_SAFE_INTEGER)
    dp[0] = 0
    for(let i = Math.floor(Math.sqrt(n)) ; i >= 1 ; i--){
        for(let j = i ** 2 ; j <= n ; j++){
            dp[j] = Math.min(dp[j - i ** 2] + 1 , dp[j])
        }
    }
    return dp[n]
};
```





## [139. 单词拆分](https://leetcode-cn.com/problems/word-break/)

**思路**

> 给你一个字符串 s 和一个字符串列表 wordDict 作为字典。请你判断是否可以利用字典中出现的单词拼接出 s 。
>
> 注意：不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。
>
>  
>
> 示例 1：
>
> 输入: s = "leetcode", wordDict = ["leet", "code"]
> 输出: true
> 解释: 返回 true 因为 "leetcode" 可以由 "leet" 和 "code" 拼接成。
> 示例 2：
>
> 输入: s = "applepenapple", wordDict = ["apple", "pen"]
> 输出: true
> 解释: 返回 true 因为 "applepenapple" 可以由 "apple" "pen" "apple" 拼接成。
>      注意，你可以重复使用字典中的单词。
> 示例 3：
>
> 输入: s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]
> 输出: false
>
>
> 提示：
>
> 1 <= s.length <= 300
> 1 <= wordDict.length <= 1000
> 1 <= wordDict[i].length <= 20
> s 和 wordDict[i] 仅有小写英文字母组成
> wordDict 中的所有字符串 互不相同

**思路**

- 背包是字符串s ，物品是字典wordDict里的字符串
- `dp[i]` 为1表示长度为i的字串可以由字典里的构成
- `[j , i)`这个子串出现在集合里且`dp[j]`为`true`，说明 `dp[i] = 1`
- 遍历时先遍历背包，再遍历物品

```js
/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function(s, wordDict) {
    let dp = (new Array(s.length + 1)).fill(0)
    dp[0] = 1
    for(let i = 1 ; i <= s.length ; i++){
        for(let j = 0 ; j < i ; j++){
            let word = s.slice(j , i)
            if(wordDict.indexOf(word) !== -1 && dp[j]){
                dp[i] = 1
            }
        }
    }
    return dp[s.length] === 1
};
```

