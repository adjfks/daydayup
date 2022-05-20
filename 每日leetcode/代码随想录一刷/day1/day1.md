# Day1

## [541.反转字符串II](https://leetcode-cn.com/problems/reverse-string-ii/)

注意：字符串不可变

解法一：

```javascript
/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
var reverseStr = function (s, k) {
  sArr = s.split('')
  let len = sArr.length
  for (var i = 0; i + 2 * k < len; i += 2 * k) {
    reverse(sArr, i, i + k - 1)
  }
  if (len - i > k) {
    reverse(sArr, i, i + k - 1)
  } else {
    reverse(sArr, i, len - 1)
  }

  function reverse(arr, l, r) {
    for (let i = l, j = r; i < j; i++, j--) {
      let temp = arr[i]
      arr[i] = arr[j]
      arr[j] = temp
    }
  }

  return sArr.join('')
}

```

解法二：

```javascript
/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
var reverseStr = function(s, k) {
    let len = s.length
    let sArr = s.split('')
    for(let i = 0 ; i < len ; i+=2*k){
        let l = i - 1 , r = i + k > len ? len : i + k
        while(++l < --r){
            [sArr[l] , sArr[r]] = [sArr[r] , sArr[l]]
        }
    }
    return sArr.join('')
};
```



## [剑指offer05. 替换空格](https://leetcode-cn.com/problems/ti-huan-kong-ge-lcof/)

方法一：双指针法

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var replaceSpace = function(s) {
    // 字符串转数组
    let arr = s.split('')
    // 数组长度
    let len = arr.length
    // 记录空格数
    let count = 0
    for(let i = 0 ; i < len ; i++){
        if(arr[i] === ' '){
            count++
        }
    }
    // 双指针
    let i = len - 1 , j = len + 2 * count - 1
    while(i >= 0){
        if(arr[i] === ' '){
            arr[j--] = '0'
            arr[j--] = '2'
            arr[j--] = '%'
            i--
        }else{
            arr[j--] = arr[i--]
        }
    }
    return arr.join('')
};
```



## [151. 颠倒字符串中的单词](https://leetcode-cn.com/problems/reverse-words-in-a-string/)

首先利用双指针去除多余空格，然后翻转整个字符串，再翻转每一个单词

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
    // 移除多余空格
    function removeExtraSpaces(arr) {
        let len = arr.length
        for (var i = 0, j = 0; j < len; j++) {
            if (arr[j] === ' ') {
                continue
            } else {
                if (i !== 0 && arr[j - 1] === ' ') {
                    arr[i++] = ' '
                }
                    arr[i++] = arr[j]
            }
        }
        // 修改数组长度
        arr.length = i
    }

    // 翻转整个数组
    function reversePart(arr, l, r) {
        let len = arr.length
        for (let i = l, j = r; i < j; i++, j--) {
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
        }
    }

    // 翻转每个单词
    function reverseWord(arr) {
        let len = arr.length
        let pos = [-1]
        for (let i = 0; i < len; i++) {
            if (arr[i] === ' ') {
                pos.push(i)
            }
        }
        pos.push(len)

        for (let i = 0, j = i + 1; i < pos.length - 1; i++, j++) {
            reversePart(arr, pos[i] + 1, pos[j] - 1)
        }
    }

    let len = s.length
    let arr = s.split('')
    removeExtraSpaces(arr)
    reversePart(arr , 0 , len - 1)
    reverseWord(arr)
    return arr.join('')
};
```

