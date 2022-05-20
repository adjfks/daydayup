---
date: 2022.4.20
---

# DAY20 动态规划

## [115. 不同的子序列](https://leetcode-cn.com/problems/distinct-subsequences/)

**题目**

> 给定一个字符串 s 和一个字符串 t ，计算在 s 的子序列中 t 出现的个数。
>
> 字符串的一个 子序列 是指，通过删除一些（也可以不删除）字符且不干扰剩余字符相对位置所组成的新字符串。（例如，"ACE" 是 "ABCDE" 的一个子序列，而 "AEC" 不是）
>
> 题目数据保证答案符合 32 位带符号整数范围。
>
>  
>
> 示例 1：
>
> 输入：s = "rabbbit", t = "rabbit"
> 输出：3
> 解释：
> 如下图所示, 有 3 种可以从 s 中得到 "rabbit" 的方案。
> rabbbit
> rabbbit
> rabbbit
> 示例 2：
>
> 输入：s = "babgbag", t = "bag"
> 输出：5
> 解释：
> 如下图所示, 有 5 种可以从 s 中得到 "bag" 的方案。 
> babgbag
> babgbag
> babgbag
> babgbag
> babgbag
>
>
> 提示：
>
> 0 <= s.length, t.length <= 1000
> s 和 t 由英文字母组成

- 设`dp[i][j]`表示以`i - 1`为结尾元素的s中出现以`j - 1`为结尾元素的t的个数。
- 递推公式考虑两种情况
  - 当`s[i - 1] === t[j - 1]`
    - `s[i - 1]`参与匹配，则有`dp[i - 1][j - 1]`种情况
    - `s[i - 1]`不参与匹配，有`dp[i - 1][j]`种情况
  - 当`s[i - 1] !== t[j - 1]`，有`dp[i - 1][j]`
- `dp[0][j]`表示在空字符串中出现以`j - 1`为结尾元素的t的个数，所以`dp[0][j] = 0`,`dp[i][0]`表示以`i - 1`为结尾元素的s中出现空字符串的个数，那就是将s中的字符全都删除，所以`dp[i][0] = 1`,`dp[0][0]`表示空字符串中出现空字符串的个数，所以`dp[0][0] = 1`
- 对于遍历顺序，由递推关系知`dp[i][j]`依赖于前一列或前一行，故从左向右遍历，从上到下遍历。

**代码**

```js
/**
 * @param {string} s
 * @param {string} t
 * @return {number}
 */
var numDistinct = function(s, t) {
    let len1 = s.length , len2 = t.length
    let dp = (new Array(len1 + 1)).fill(0).map(x => (new Array(len2 + 1).fill(0)))
    // 初始化dp[i][0]为1
    for(let i = 0 ; i <= len1 ; i++){
        dp[i][0] = 1
    }
    // 遍历dp数组
    for(let i = 1 ; i <= len1 ; i++){
        for(let j = 1 ; j <= len2 ; j++){
            if(s[i - 1] === t[j - 1]) dp[i][j] = dp[i-1][j-1] + dp[i-1][j]
            else dp[i][j] = dp[i - 1][j]
        }
    }
    return dp[len1][len2]
};
```

**复杂度**

- 时间复杂度： $O(n*m)$
- 空间复杂度： $O(n*m)$



## [583. 两个字符串的删除操作](https://leetcode-cn.com/problems/delete-operation-for-two-strings/)

**题目**

> 给定两个单词 word1 和 word2 ，返回使得 word1 和  word2 相同所需的最小步数。
>
> 每步 可以删除任意一个字符串中的一个字符。
>
>  
>
> 示例 1：
>
> 输入: word1 = "sea", word2 = "eat"
> 输出: 2
> 解释: 第一步将 "sea" 变为 "ea" ，第二步将 "eat "变为 "ea"
> 示例  2:
>
> 输入：word1 = "leetcode", word2 = "etco"
> 输出：4
>
>
> 提示：
>
> 1 <= word1.length, word2.length <= 500
> word1 和 word2 只包含小写英文字母

**思路**

- 思路一
  - 这道题可以转化为找出两个字符串的最长公共子序列的长度，然后用两个字符串的长度和减去该长度的两倍即可。
  - 至于找出两个字符串的最长公共子序列的长度可以参考这片文章[【leetcode】1143.最长公共子序列](https://blog.csdn.net/laplacepoisson/article/details/124245187)
- 思路二
  - 这道题也可以直接使用动态规划来做
  - 设`dp[i][j]`表示以`i-1`为结尾元素的word1和以`j - 1`为结尾元素的word2想要达到相同所需要的删除次数为`dp[i][j]`
  - 递推关系分为两种情况
    - 当`word1[i - 1] === word2[j - 1] `，`dp[i][j] = dp[i - 1][j - 1]`
    - 当`word1[i - 1] !== word2[j - 1]`，此时分为三种情况
      - 删除`word1[i - 1]`，需要的步数为`dp[i - 1][j] + 1`
      - 删除`word2[j - 1]`，需要的步数为`dp[i][j - 1] + 1`
      - 同时删除`word1[i - 1]`和`word2[j - 1]`，需要的步数为`dp[i - 1][j - 1] + 2`
      - 三种情况选择删除步数最少的
  - 由于`dp[i][j]`依赖于前一列或上一行，故遍历时从前往后，从上到下。
  - 初始化`dp`数组
    - `dp[i][0] = i，删除多少次可以得到空字符串？i次，所以`dp[i][0] = i`
    - `dp[0][j] = j`
    - `dp[0][0] = 0`

**代码**

- 思路一

```js

/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function(word1, word2) {
    let len1 = word1.length , len2 = word2.length
    let dp = (new Array(len1 + 1)).fill(0).map(x => (new Array(len2 + 1)).fill(0))

    for(let i = 1 ; i <= len1 ; i++){
        for(let j= 1; j <= len2 ; j++){
            if(word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i-1][j-1] + 1
            else dp[i][j] = Math.max(dp[i-1][j] , dp[i][j-1])
        }
    }

    return len1 + len2 - 2 * dp[len1][len2]
};
```

- 思路二

```js
/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function(word1, word2) {
    let len1 = word1.length , len2 = word2.length
    let dp = (new Array(len1 + 1)).fill(0).map(x => (new Array(len2 + 1)).fill(0))
    // 初始化dp数组
    for(let i = 0 ; i <= len1 ; i++){
        dp[i][0] = i
    }
    for(let j = 0 ; j <= len2 ; j++){
        dp[0][j] = j
    }

    for(let i = 1 ; i <= len1 ; i++){
        for(let j= 1; j <= len2 ; j++){
            if(word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i-1][j-1]
            else dp[i][j] = Math.min(dp[i-1][j] + 1 , dp[i][j-1] + 1 , dp[i-1][j-1] + 2)
        }
    }

    return dp[len1][len2]
};
```

**复杂度**

- 时间复杂度：$O(n*m)$
- 空间复杂度：$O(n*m)$





## [72. 编辑距离](https://leetcode-cn.com/problems/edit-distance/)

**题目**

> 给你两个单词 word1 和 word2， 请返回将 word1 转换成 word2 所使用的最少操作数  。
>
> 你可以对一个单词进行如下三种操作：
>
> 插入一个字符
> 删除一个字符
> 替换一个字符
>
>
> 示例 1：
>
> 输入：word1 = "horse", word2 = "ros"
> 输出：3
> 解释：
> horse -> rorse (将 'h' 替换为 'r')
> rorse -> rose (删除 'r')
> rose -> ros (删除 'e')
> 示例 2：
>
> 输入：word1 = "intention", word2 = "execution"
> 输出：5
> 解释：
> intention -> inention (删除 't')
> inention -> enention (将 'i' 替换为 'e')
> enention -> exention (将 'n' 替换为 'x')
> exention -> exection (将 'n' 替换为 'c')
> exection -> execution (插入 'u')
>
>
> 提示：
>
> 0 <= word1.length, word2.length <= 500
> word1 和 word2 由小写英文字母组成

**思路**

- 设`dp[i][j]`表示以`i - 1`为结尾元素的word1转化为以`j - 1`为结尾元素的word2的最少操作次数
- 递推关系分为2种情况
  - 当`word1[i - 1] === word2[j - 1]`时，不操作，`dp[i][j] = dp[i-1][j-1]`
  - 当`word[i - 1] !== word2[j - 1]`时,有6种操作方式，可以归纳为3种，选择最小的
    - 删除`word1[i-1]`，然后`i-2`结尾的word1转化为`j-1`结尾的word2，操作次数为`dp[i-1][j] + 1`
    - 删除`word2[j-1]`，然后`i-1`结尾的word1转化为`j - 2`结尾的word2,操作次数为`dp[i][j-1] + 1`
    - word2增加`word1[i-1]`，然后`i-2`结尾的word1转化为`j - 1`结尾的word2,操作次数为`dp[i-1][j] + 1`,发现操作次数和删除`word1[i-1]`一样
    - word1增加`word2[j-1]`,操作次数和删除`word2[j-1]`一样
    - 将`word1[i-1]`替换为`word2[j-1]`，然后以`i-2`结尾的word1和以`j - 2`结尾的word2，操作次数为`dp[i-1][j-1] + 1`
    - 将`word2[j-1]`替换为`word1[i-1]`，然后以`i-2`结尾的word1和以`j - 2`结尾的word2，操作次数为`dp[i-1][j-1] + 1`
- dp数组初始化
  - `dp[0][j]`，删除或增加j次即可，`dp[0][j] = j`
  - `dp[i][0]`,删除或增加i次即可，`dp[i][0] = i`
  - `dp[0][0]`，不用操作，`dp[0][0] = 0`
- `dp[i][j]`依赖于前面列或前面行，故遍历时从上到下，从左到右。

**代码**

```js
/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function(word1, word2) {
    let len1 = word1.length , len2 = word2.length
    let dp = (new Array(len1 + 1)).fill(0).map(x => (new Array(len2 + 1)).fill(0))
    // 初始化dp数组
    for(let i = 0 ; i <= len1 ; i++){
        dp[i][0] = i
    }
    for(let j = 0 ; j <= len2 ; j++){
        dp[0][j] = j
    }

    for(let i = 1 ; i <= len1 ; i++){
        for(let j= 1; j <= len2 ; j++){
            if(word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i-1][j-1]
            else dp[i][j] = Math.min(dp[i-1][j] + 1 , dp[i][j-1] + 1 , dp[i-1][j-1] + 1)
        }
    }

    return dp[len1][len2]
};
```

**复杂度**

- 时间复杂度：$O(n*m)$
- 空间复杂度：$O(n*m)$