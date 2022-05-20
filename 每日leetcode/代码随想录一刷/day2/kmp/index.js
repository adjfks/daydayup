const { getNext } = require('./getNext.js')

// 匹配字符串
function strStr(s, p) {
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

module.exports = {
  strStr
}
