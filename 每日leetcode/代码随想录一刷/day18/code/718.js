// /**
//  * @param {number[]} nums1
//  * @param {number[]} nums2
//  * @return {number}
//  */
// var findLength = function (nums1, nums2) {
//   let len1 = nums1.length,
//     len2 = nums2.length
//   let dp = new Array(len1 + 1).fill(0).map((x) => new Array(len2 + 1).fill(0))
//   let res = 0

//   for (let i = 1; i <= len1; i++) {
//     for (let j = 1; j <= len2; j++) {
//       if (nums1[i - 1] === nums2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1
//       res = Math.max(res, dp[i][j])
//     }
//   }
//   console.log(dp);

//   return res
// }

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findLength = function (nums1, nums2) {
  let len1 = nums1.length,
    len2 = nums2.length
  let dp = new Array(len1 + 1).fill(0)
  let res = 0

  for (let i = 1; i <= len2; i++) {
    for (let j = len1; j >= 1; j--) {
      if (nums1[i - 1] === nums2[j - 1]) dp[j] = dp[j - 1] + 1
      // 注意这里不相等需要赋值0
      else dp[j] = 0
      res = Math.max(res, dp[j])
    }
    console.log('-------------')
    console.log(dp)
  }

  return res
}
findLength([1, 2, 3, 2, 1], [3, 2, 1, 4])
