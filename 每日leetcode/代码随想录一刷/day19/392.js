/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isSubsequence = function (s, t) {
  const len1 = s.length,
    len2 = t.length
  let dp = new Array(len1 + 1).fill(0).map(x => new Array(len2 + 1).fill(0))

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (s[i - 1] === t[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1
      else dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j])
    }
  }
  console.log(dp)
  console.log(len1)
  console.log(dp[len1][len2])
  return len1 === dp[len1][len2]
}

isSubsequence('abc', 'ahbgdc')
