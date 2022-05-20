/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function (text1, text2) {
  let len1 = text1.length,
    len2 = text2.length
  let dp = new Array(len1 + 1).fill(0)

  // 外层循环遍历text2字符串
  for (let j = 1; j <= len2; j++) {
    //内层循环遍历text1字符串
    for (let i = 1; i <= len1; i++) {
      if (text1[i - 1] === text2[j - 1]) dp[i] = dp[i - 1] + 1
      else if(i !== 1) dp[i] = dp[i - 1]
    }
    console.log('----------------')
    console.log(dp)
  }

  return dp[len1]
}

longestCommonSubsequence('abcde', 'ace')
