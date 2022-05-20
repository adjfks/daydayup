const { getNext } = require('./getNext.js')
const { strStr } = require('./index.js')

// 测试
let s1 = 'abaabba'
let next1 = []
getNext(next1, s1)
console.log(next1)

let p1 = 'bba'
console.log(strStr(s1, p1))
