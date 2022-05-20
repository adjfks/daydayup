# [98. 验证二叉搜索树](https://leetcode-cn.com/problems/validate-binary-search-tree/)

**题目**

> 给你一个二叉树的根节点 root ，判断其是否是一个有效的二叉搜索树。
>
> 有效 二叉搜索树定义如下：
>
> 节点的左子树只包含 小于 当前节点的数。
> 节点的右子树只包含 大于 当前节点的数。
> 所有左子树和右子树自身必须也是二叉搜索树。
>
> 示例 1：
>
> ![image-20220429091905726](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220429091905726.png)
>
> 输入：root = [2,1,3]
> 输出：true
> 示例 2：
>
> ![image-20220429091842688](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220429091842688.png)
>
>
> 输入：root = [5,1,4,null,null,3,6]
> 输出：false
> 解释：根节点的值是 5 ，但是右子节点的值是 4 。
>
>
> 提示：
>
> 树中节点数目范围在[1, 104] 内
> -231 <= Node.val <= 231 - 1

💖**思路**

方法一

二叉搜索树的中序遍历是一个递增的序列，所以最简单的方式就是得到中序遍历的结果数组，然后判断该数组是不是递增的。

方法二

其实不一定要先得到数组，可以直接在中序遍历的过程中判断是否递增。递归三部曲如下：

1️⃣递归函数的参数和返回值：参数就是二叉树的节点，返回值是true或false

2️⃣递归函数的返回条件：因为进行中序遍历，所以遍历到空节点时就返回，而且返回的是true，因为此时还没有遇到不递增的情况。

3️⃣单层递归的逻辑：先递归遍历左子树得到返回值`left`，然后判断当前节点是否小于或等于前一个节点的值，如果是则返回false，否则返回true.然后递归遍历右子树得到返回值`right`。最后返回`left && right`

💻**代码**

方法一：

```js
var isValidBST = function(root) {
    function traverse(root){
        if(!root) return
        traverse(root.left)
        res.push(root.val)
        traverse(root.right)
    }

    let res = []
    traverse(root)
    for(let i = 1 ; i < res.length ; i++){
        if(res[i] <= res[i-1]) return false
    }
    return true
};
```

方法二：

```js
var isValidBST = function(root) {
    function traverse(root){
        if(!root) return true
        let left = traverse(root.left)
        if(root.val <= maxVal) return false
        maxVal = root.val
        let right = traverse(root.right)
        return left && right
    }

    let maxVal = Number.MIN_SAFE_INTEGER
    return traverse(root)
};
```





# [530. 二叉搜索树的最小绝对差](https://leetcode-cn.com/problems/minimum-absolute-difference-in-bst/)

题目

> 给你一个二叉搜索树的根节点 root ，返回 树中任意两不同节点值之间的最小差值 。
>
> 差值是一个正数，其数值等于两值之差的绝对值。
>
>  
>
> 示例 1：
>
> ![image-20220429104612972](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220429104612972.png)
>
> 输入：root = [4,2,6,1,3]
> 输出：1
> 示例 2：
>
> ![image-20220429104550067](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220429104550067.png)
>
>
> 输入：root = [1,0,48,null,null,12,49]
> 输出：1
>
>
> 提示：
>
> 树中节点的数目范围是 [2, 104]
> 0 <= Node.val <= 105

思路

在上一道题[【leetcode】98. 验证二叉搜索树](https://blog.csdn.net/laplacepoisson/article/details/124489995)中，在总结里我们强调了二叉搜索树是有序的，它的中序遍历结果是一个递增的序列，因此本题可以转化为在一个递增序列中求最小插值的绝对值。

递增序列中相邻的数的差值比不相邻的差值小，因此我们遍历中序序列，每次计算相邻差值的绝对值，保存最小值即可。

代码

```js
var getMinimumDifference = function(root) {
    function traverse(root){
        if(!root) return
        traverse(root.left)
        res.push(root.val)
        traverse(root.right)
    }
    let res = []
    let minVal = Number.MAX_SAFE_INTEGER
    traverse(root)
    for(let i = 1; i < res.length ; i++){
        if(res[i] - res[i-1] < minVal) minVal = res[i] - res[i-1]
    }
    return minVal
};
```

```js
var getMinimumDifference = function(root) {
    function traverse(node){
        if(!node) return
        traverse(node.left)
        if(pre !== null) res = Math.min(res , node.val - pre)
        pre = node.val
        traverse(node.right)
    }

    let pre = null
    let res = Number.MAX_SAFE_INTEGER
    traverse(root)
    return res

    
};
```



# [501. 二叉搜索树中的众数](https://leetcode-cn.com/problems/find-mode-in-binary-search-tree/)

题目

> 给你一个含重复值的二叉搜索树（BST）的根节点 root ，找出并返回 BST 中的所有 众数（即，出现频率最高的元素）。
> 如果树中有不止一个众数，可以按 任意顺序 返回。
> 假定 BST 满足如下定义：
> 结点左子树中所含节点的值 小于等于 当前节点的值
> 结点右子树中所含节点的值 大于等于 当前节点的值
> 左子树和右子树都是二叉搜索树
> 示例 1：
> ![image-20220429111633890](C:/Users/PencilX/AppData/Roaming/Typora/typora-user-images/image-20220429111633890.png)
> 输入：root = [1,null,2,2]
> 输出：[2]
> 示例 2：
> 输入：root = [0]
> 输出：[0]
> 提示：
> 树中节点的数目在范围 [1, 104] 内
> -105 <= Node.val <= 105
> 进阶：你可以不使用额外的空间吗？（假设由递归产生的隐式调用栈的开销不被计算在内）

思路

首先注意这道题目中BST的定义和我们之前做的题目不同，否则也不可能有众数。

- 结点左子树中所含节点的值 **小于等于** 当前节点的值
- 结点右子树中所含节点的值 **大于等于** 当前节点的值
- 左子树和右子树都是二叉搜索树

 二叉搜索树是有序的，它的中序遍历序列是一个递增序列（此题中相邻元素可相等），因此这道题可以转化成在递增序列中寻找所有众数。

我们在中序遍历递归的过程中直接获得众数。基本代码如下：

```js
function traverse(cur){
    if(!cur) return 
    traverse(cur.left)
    //处理当前节点
    traverse(cur.right)
    return
}
```

那么中间节点如何处理呢?

1️⃣首先用`pre`记录前一个节点，这样才能比较。用`count`记录当前节点值出现的次数。

```js
if(pre === null){	//遍历第一个节点
	count = 1
}else if(pre.val === cur.val){	
	count++
}else{	//不相等了，重新开始计数
	count = 1
}
pre = cur
```

2️⃣使用`maxCount`来记录目前为止的众数出现的频率，初始化为0。

```js
if(count > maxCount){	//当count > maxCount 更新maxCount
	maxCount = count
}
```

3️⃣使用一个数组`result`来存放众数，什么时候放入众数？当`count === maxCount`的时候，说明找到了新的众数，那就把当前节点值加入数组`result`。

```js
if(count === maxCount){
    result.push(cur.val)
}
```

当`count > maxCount`，之前找到的众数就不是众数了，清空`result`，并把当前节点值加入`result`，更新`maxCount`

```js
if(count === maxCount){
    result.push(cur.val)
}else if(count > maxCount){
	result.splice(0,result.length)	//清空之前的众数
	result.push(cur.val)	//加入当前节点的值
	maxCount = count	//更新maxCount
}
```

**代码**

```js
var findMode = function(root) {
    function traverse(cur){
        if(!cur) return 
        traverse(cur.left)
        //处理当前节点
        if(pre === null){	//遍历第一个节点
            count = 1
        }else if(pre.val === cur.val){	
            count++
        }else{	//不相等了，重新开始计数
            count = 1
        }
        pre = cur

        if(count === maxCount){
            result.push(cur.val)
        }else if(count > maxCount){
            result.splice(0,result.length)	//清空之前的众数
            result.push(cur.val)	//加入当前节点的值
            maxCount = count	//更新maxCount
        }
        traverse(cur.right)
        return
    }

    let result = []
    let maxCount = 0
    let count
    let pre = null
    traverse(root)
    return result
};
```

