class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        length = len(nums)
        result = []
        path = []
        # used 数组用于去重
        used = [0] * length
        nums.sort()

        def backtracking(startIndex):
            # 子集问题要在结束条件前收集结果，否则会漏掉自己，少掉一半结果
            result.append(path[:]) 
            for i in range(startIndex , length):
                if i > 0 and nums[i-1] == nums[i] and used[i-1] == 0:
                    continue
                path.append(nums[i])
                used[i] = 1
                backtracking(i+1)
                path.pop()
                used[i] = 0
        
        backtracking(0)
        return result