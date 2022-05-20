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

let s = '  sky is  blue '
let arr = s.split('')
removeExtraSpaces(arr)
console.log(arr)
reversePart(arr, 0, arr.length - 1)
console.log(arr)
reverseWord(arr)
console.log(arr.join(''))
