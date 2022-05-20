/**
 * @param {string} s
 * @return {string[]}
 */
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
      // 截取当前位置
      let sub = s.slice(startIndex, i + 1)
      // 判断是否合法
      if (!isValid(sub)) continue
      path.push(sub)
      count++
      if (count === 3) {
        let last = s.slice(i + 1)
        if (!isValid(last)) {
          path.pop()
          count--
          continue
        }
        path.push(last)
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

/* 优化代码 */
/**
 * @param {string} s
 * @return {string[]}
 */
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
