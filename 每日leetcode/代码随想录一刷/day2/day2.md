# DAY2

## 1. [剑指 Offer 58 - II. 左旋转字符串](https://leetcode-cn.com/problems/zuo-xuan-zhuan-zi-fu-chuan-lcof/)

```javascript
/**
 * @param {string} s
 * @param {number} n
 * @return {string}
 */
var reverseLeftWords = function(s, n) {
    let len = s.length
    let arr = s.split('')
    
    // 翻转局部函数
    function reverse(arr , l , r){
        let i = l , j = r
        while(i < j){
            [arr[i] , arr[j]] = [arr[j] , arr[i]]
            i++
            j--
        }
    }

    // 翻转前n个子字符串
    reverse(arr , 0 , n - 1)
    // 翻转后面的子字符串
    reverse(arr , n , len - 1)
    // 翻转整个字符串
    reverse(arr , 0 , len - 1)
    return arr.join('')
};
```



## 2. [28. 实现 strStr()](https://leetcode-cn.com/problems/implement-strstr/)

kmp算法

```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    function getNext(next, s) {
        // 初始化
        next[0] = 0
        // 前缀末尾
        j = 0
        for (let i = 1; i < s.length; i++) {
            //i为后缀末尾
            // 1. 不相等的情况
            // 前缀末尾与后缀末尾不相等时，后缀末尾不动，重新找一个前缀末尾来比较
            // 如何找前缀末尾？
            // 利用next数组已填充好的部分，j应该跳到前一个next的值的位置
            // j > 0才跳
            while (j > 0 && s[j] !== s[i]) {
                j = next[j - 1]
            }

            // 2.相等的情况
            if (s[i] === s[j]) {
                j++
            }

            // 3. 更新next数组
            next[i] = j
        }
    }
    
    function solve(s, p) {
        if (p.length === 0) return 0

        // 1. 根据模式串得到next数组
        let next = []
        getNext(next, p)

        // 2. 根据next数组进行匹配
        let j = 0
        for (let i = 0; i < s.length; i++) {
            // 不相等的情况
            while (j > 0 && s[i] !== p[j]) {
                j = next[j - 1]
            }
            // 相等的情况
            if (s[i] === p[j]) {
                j++
            }
            // 匹配完成的情况
            if (j === p.length) {
                // 返回匹配开始位置
                return i - p.length + 1
            }
        }
        return -1
    }

    return solve(haystack , needle)

};

```



## 3. [459. 重复的子字符串](https://leetcode-cn.com/problems/repeated-substring-pattern/)

解法一：

```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var repeatedSubstringPattern = function(s) {
    // 将字符串与自身拼接后去除第一个和最后一个元素得到一个新字符串，如果该字符串包含原字符串则说明由重复子串构成
    return (s+s).slice(1 , -1).includes(s)
};
```

解法二：使用kmp算法，得到next数组

```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var repeatedSubstringPattern = function(s) {
    function getNext(next, s) {
        // 初始化
        next[0] = 0
        // 前缀末尾
        j = 0
        for (let i = 1; i < s.length; i++) {
            //i为后缀末尾
            // 1. 不相等的情况
            // 前缀末尾与后缀末尾不相等时，后缀末尾不动，重新找一个前缀末尾来比较
            // 如何找前缀末尾？
            // 利用next数组已填充好的部分，j应该跳到前一个next的值的位置
            // j > 0才跳
            while (j > 0 && s[j] !== s[i]) {
                j = next[j - 1]
            }

            // 2.相等的情况
            if (s[i] === s[j]) {
                j++
            }

            // 3. 更新next数组
            next[i] = j
        }
    }

    let len = s.length
    let next = []
    getNext(next , s)
    if(next[len - 1] !== 0 && len % (len - next[len - 1]) === 0) return true
    return false
};
```

