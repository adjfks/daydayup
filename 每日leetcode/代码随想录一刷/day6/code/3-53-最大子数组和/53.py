def maxSubArray( nums):
    res = -10000
    count = 0
    for i in range(len(nums)):
        count += nums[i]
        if count > res:
            res = count
        if count < 0:
            count = 0
    return res


        