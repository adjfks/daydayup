def findContentChildren(g, s) -> int:
        # 结果
        res = 0
        # 排序
        g.sort()
        s.sort()
        
        # 定义两个指针
        i = len(g) - 1
        j = len(s) - 1

        while i >= 0 and j >= 0:
          if s[j] >= g[i]:
            res += 1
            i -= 1
            j -= 1
          else:
            i -= 1

        return res


""" 优化代码 """
def findContentChildren2(self, g: List[int], s: List[int]) -> int:
        g.sort()
        s.sort()
        child = 0
        for i in range(len(s)):
           if child < len(g) and s[i] >= g[child]:
               child += 1
        return child


print(findContentChildren([1,2] , [1,2,3]))