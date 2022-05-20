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
