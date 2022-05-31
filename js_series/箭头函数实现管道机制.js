// 代码
const pipeline = (...fns) =>
val =>   fns.reduce((pre , cur) =>  cur(pre) , val)


// 要求实现一个管道函数，实现如下效果
const plus1 = a => a + 1
const mult2 = b => b * 2
const res = pipeline(plus1, mult2)(2)  // 6
console.log(res)


