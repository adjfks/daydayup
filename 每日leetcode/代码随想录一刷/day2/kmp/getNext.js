// 获取next数组
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

module.exports = {
  getNext
}
