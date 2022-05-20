---
date: 2022.4.27
---

# [112. 路径总和](https://leetcode-cn.com/problems/path-sum/)

**题目**

> 给你二叉树的根节点 root 和一个表示目标和的整数 targetSum 。判断该树中是否存在 根节点到叶子节点 的路径，这条路径上所有节点值相加等于目标和 targetSum 。如果存在，返回 true ；否则，返回 false 。
>
> 叶子节点 是指没有子节点的节点。
>
>  
>
> 示例 1：
>
> ![image-20220427090755564](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220427090755564.png)
>
> 输入：root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
> 输出：true
> 解释：等于目标和的根节点到叶节点路径如上图所示。
> 示例 2：
>
> ![](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220427090755564.png)
>
> 输入：root = [1,2,3], targetSum = 5
> 输出：false
> 解释：树中存在两条根节点到叶子节点的路径：
> (1 --> 2): 和为 3
> (1 --> 3): 和为 4
> 不存在 sum = 5 的根节点到叶子节点的路径。
> 示例 3：
>
> 输入：root = [], targetSum = 0
> 输出：false
> 解释：由于树是空的，所以不存在根节点到叶子节点的路径。
>
>
> 提示：
>
> 树中节点的数目在范围 [0, 5000] 内
> -1000 <= Node.val <= 1000
> -1000 <= targetSum <= 1000

**思路**

- 首先是遍历二叉树的方式，这里使用前序遍历。
- 使用递归方式来做，分析如下：
  - 递归函数的参数是当前节点以及目前的路径和（包含当前节点的值），返回值就是true或false
  - 返回条件：当遇到叶子节点时判断路径和是否等于目标和，是的话返回true，否则返回false。
  - 单层递归的逻辑：如果左右节点存在，就递归左右节点，并且判断递归返回值，如果返回值为true就直接返回true，这一步保证了当遇到满足条件的一条路径时就结束了二叉树的遍历，而不是遍历整一棵二叉树。



**代码**

```js
var hasPathSum = function(root, targetSum) {
    function traversal(node , sum){
        // 遇到叶子节点且路径和等于目标和
        if(!node.left && !node.right && sum === targetSum) return true
        if(!node.left && !node.right) return false

        if(node.left && traversal(node.left , sum + node.left.val)) return true
        if(node.right && traversal(node.right , sum + node.right.val)) return true
        return false
    }

    if(!root) return false 
    return traversal(root , root.val)
};
```

精简一下代码

```js
var hasPathSum = function(root, targetSum) {
    if(!root) return false
    if(!root.left && !root.right && root.val === targetSum) return true
    return hasPathSum(root.left , targetSum - root.val) || hasPathSum(root.right , targetSum - root.val)
};
```



# [113. 路径总和 II](https://leetcode-cn.com/problems/path-sum-ii/)

如果[【leetcode】112.路径总和](https://blog.csdn.net/laplacepoisson/article/details/124443631)还没做过的可以先做一下，然后再来看这道题。

**题目**

> 给你二叉树的根节点 root 和一个整数目标和 targetSum ，找出所有 从根节点到叶子节点 路径总和等于给定目标和的路径。
>
> 叶子节点 是指没有子节点的节点。
>
>  
>
> 示例 1：
>
> ![image-20220427094553303](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220427094553303.png)
>
> 输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
> 输出：[[5,4,11,2],[5,8,4,5]]
> 示例 2：
>
> ![image-20220427094614329](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220427094614329.png)
>
> 输入：root = [1,2,3], targetSum = 5
> 输出：[]
> 示例 3：
>
> 输入：root = [1,2], targetSum = 0
> 输出：[]
>
>
> 提示：
>
> 树中节点总数在范围 [0, 5000] 内
> -1000 <= Node.val <= 1000
> -1000 <= targetSum <= 1000

**思路**

- 首先我们需要一个result数组来存放所有路径数组，一个path数组来存放每条路径。仍然使用强大的递归来做。
- 递归函数的参数是当前节点和当前的路径和，没有返回值，只是在返回前判断一下是否要记录结果
- 递归返回条件是当遇到叶子节点时就直接返回，在返回前判断路径和是否满足要求，满足的话就把叶子节点的值加入path数组，然后把path数组拷贝一份后加入叶子节点的值，然后放到结果数组result中，
- 单层递归的逻辑：将当前节点的值加入path数组，左节点存在就递归左子树，右节点存在就递归右子树，回到当前这层时把当前节点的值从path中移出。

**代码**

```js
var pathSum = function(root, targetSum) {
    function traversal(node , sum){
        if(!node.left && !node.right && sum === targetSum) {
            let _path = path.slice(0)	//拷贝path
            _path.push(node.val)	//加入当前节点
            return result.push(_path)
        }
        if(!node.left && !node.right) return 

        path.push(node.val)
        if(node.left) traversal(node.left , sum + node.left.val)
        if(node.right) traversal(node.right , sum + node.right.val)
        path.pop()
    }

    if(!root) return []
    let result = []
    let path = []
    traversal(root , root.val)
    return result

};
```





# [106. 从中序与后序遍历序列构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)

**题目**

> 给定两个整数数组 inorder 和 postorder ，其中 inorder 是二叉树的中序遍历， postorder 是同一棵树的后序遍历，请你构造并返回这颗 二叉树 。
>
>  
>
> 示例 1:
>
> ![image-20220427102130732](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220427102130732.png)
>
>
> 输入：inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]
> 输出：[3,9,20,null,null,15,7]
> 示例 2:
>
> 输入：inorder = [-1], postorder = [-1]
> 输出：[-1]
>
>
> 提示:
>
> 1 <= inorder.length <= 3000
> postorder.length == inorder.length
> -3000 <= inorder[i], postorder[i] <= 3000
> inorder 和 postorder 都由 不同 的值组成
> postorder 中每一个值都在 inorder 中
> inorder 保证是树的中序遍历
> postorder 保证是树的后序遍历

**思路**

- 后序数组的最后一个元素就是当前节点，以它为切割点来切割中序数组，就可以得到中序的左数组（子树）和右数组（子树），然后根据切割后的中序数组来切割后序数组。然后再递归中序左数组和后序左数组，中序右数组和后序右数组。
- 递归函数的参数就是**中序数组**和**后序数组**，返回值是一个**节点**，对于最外层递归函数而言就是二叉树的根节点。
- 递归的返回条件：遇到两个数组为空，返回**空节点**。
- 单层递归逻辑：以传入的后序数组的最后一个值构造一个节点作为中间节点，然后在中序数组中寻找与该值相等的点作为切割点，切割得到**中序左数组**和**中序右数组**。然后根据中序数组的切割索引且后序数组得到**后序左数组**和**后序右数组**。**递归两个做数组得到左节点（左子树），递归两个右数组得到右节点（右子树），让中间节点指向左右子节点。**

**代码**

```js
var buildTree = function(inorder, postorder) {

    function traversal(inorder , postorder){
        if(postorder.length === 0) return null    //返回空节点

        const val = postorder.pop() //中间节点的值
        const node = new TreeNode(val)  //当前中间节点

        // 在中序数组中寻找切割点
        for(var sep = 0 ; sep < inorder.length ; sep++){    //用var声明sep在外部可以访问到
            if(inorder[sep] === val) break
        }

        // 切割得到4个数组
        let leftInorder = inorder.slice(0 , sep) , rightInorder = inorder.slice(sep + 1)
        let leftPostorder = postorder.slice(0 , sep) , rightPostorder = postorder.slice(sep)

        node.left = traversal(leftInorder , leftPostorder)
        node.right = traversal(rightInorder , rightPostorder)

        return node
    }
    
    return traversal(inorder , postorder)
};
```

精简一下代码

```js
var buildTree = function(inorder, postorder) {
    if(postorder.length === 0) return null    //返回空节点

    const val = postorder.pop() //中间节点的值
    const node = new TreeNode(val)  //当前中间节点
    const sep = inorder.indexOf(val)    //在中序数组中寻找分割点索引

    node.left = buildTree(inorder.slice(0 , sep) , postorder.slice(0 , sep))
    node.right = buildTree(inorder.slice(sep + 1) , postorder.slice(sep))

    return node
};
```

当然这里每一层递归都创建了四个新的数组，比较耗费时间和空间，可以改为索引的形式来切割。

