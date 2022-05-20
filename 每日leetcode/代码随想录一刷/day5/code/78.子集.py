class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        length = len(nums)
        result = []
        path = []

        def backtracking(startIndex):
            # 子集问题要在结束条件前收集结果，否则会漏掉自己，少掉一半结果
            result.append(path[:])
            for i in range(startIndex , length):
                path.append(nums[i])
                backtracking(i+1)
                path.pop()
        
        backtracking(0)
        return result
        