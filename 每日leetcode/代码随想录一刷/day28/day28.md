# [654.最大二叉树](https://leetcode-cn.com/problems/maximum-binary-tree/)

> 给定一个不重复的整数数组 nums 。 最大二叉树 可以用下面的算法从 nums 递归地构建:
>
> 创建一个根节点，其值为 nums 中的最大值。
> 递归地在最大值 左边 的 子数组前缀上 构建左子树。
> 递归地在最大值 右边 的 子数组后缀上 构建右子树。
> 返回 nums 构建的 最大二叉树 。
>
> 
>
> 示例 1：
>
> ![image-20220428095707537](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220428095707537.png)
>
>
> 输入：nums = [3,2,1,6,0,5]
> 输出：[6,3,5,null,2,0,null,null,1]
> 解释：递归调用如下所示：
> - [3,2,1,6,0,5] 中的最大值是 6 ，左边部分是 [3,2,1] ，右边部分是 [0,5] 。
>     - [3,2,1] 中的最大值是 3 ，左边部分是 [] ，右边部分是 [2,1] 。
>         - 空数组，无子节点。
>         - [2,1] 中的最大值是 2 ，左边部分是 [] ，右边部分是 [1] 。
>             - 空数组，无子节点。
>             - 只有一个元素，所以子节点是一个值为 1 的节点。
>     - [0,5] 中的最大值是 5 ，左边部分是 [0] ，右边部分是 [] 。
>         - 只有一个元素，所以子节点是一个值为 0 的节点。
>         - 空数组，无子节点。
>
> 示例 2：
>
> ![image-20220428095753299](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220428095753299.png)
>
>
> 输入：nums = [3,2,1]
> 输出：[3,null,2,null,1]
>
>
> 提示：
>
> 1 <= nums.length <= 1000
> 0 <= nums[i] <= 1000
> nums 中的所有整数 互不相同

**思路**

- 递归的参数和返回值：递归参数就是数组，返回值是一个节点。
- 递归的返回条件是：当传入的是空数组时，直接返回Null
- 递归的单层逻辑是：首先取得传入数组的最大值，然后以该值构建一个二叉树节点，接着递归左数组得到左子树，递归右数组得到右子树

**代码**

```js
var constructMaximumBinaryTree = function(nums) {
    if(!nums.length) return null

    const val = Math.max.apply(nums , nums)
    const idx = nums.indexOf(val)
    const node = new TreeNode(val)

    node.left = constructMaximumBinaryTree(nums.slice(0 , idx))
    node.right = constructMaximumBinaryTree(nums.slice(idx+1))

    return node
};
```





## [617. 合并二叉树](https://leetcode-cn.com/problems/merge-two-binary-trees/)

**题目**

> 给你两棵二叉树： root1 和 root2 。
>
> 想象一下，当你将其中一棵覆盖到另一棵之上时，两棵树上的一些节点将会重叠（而另一些不会）。你需要将这两棵树合并成一棵新二叉树。合并的规则是：如果两个节点重叠，那么将这两个节点的值相加作为合并后节点的新值；否则，不为 null 的节点将直接作为新二叉树的节点。
>
> 返回合并后的二叉树。
>
> 注意: 合并过程必须从两个树的根节点开始。
>
>  
>
> 示例 1：
>
> ![image-20220428101752814](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220428101752814.png)
>
> 输入：root1 = [1,3,2,5], root2 = [2,1,3,null,4,null,7]
> 输出：[3,4,5,5,4,null,7]
> 示例 2：
>
> 输入：root1 = [1], root2 = [1,2]
> 输出：[2,2]
>
>
> 提示：
>
> 两棵树中的节点数目在范围 [0, 2000] 内
> -104 <= Node.val <= 104

**思路**

因为要从根节点开始遍历，也就是前序遍历，使用递归来做，我们比较两棵树的差异，改造第二棵树。改造的过程中我们假设只有不为空的节点才能进入递归，因为我们要比较的是它们的左右子树，这里我称传入的第一棵树为1号树，第二棵树为2号树，即我们改造2号树。

首先第一步是2号树节点值加上1号树的节点值得到新值。然后比较左右子树。

以左子树为例，有几种情况：

第一种：1号树的子树不为空，2号树的子树为空，则要把1号树子树所在的那截树枝给2号树。

![image-20220428103529003](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220428103529003.png)

第二种情况反过来，则不用任何操作

![image-20220428103848915](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220428103848915.png)

第三种情况，左子树都为空，也不用做任何操作。

![image-20220428104040604](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220428104040604.png)

第四种就是左右都有值，这时才需要递归，那么就回到第一步，进入下一层递归。

![image-20220428104413921](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220428104413921.png)

递归三部曲：

- 递归函数参数和返回值：参数就是两棵树的根节点，没有返回值，我们只是用递归来改造2号树。
- 递归的返回条件：不用返回，因为我们是使用条件判断是否进入下一层递归，即上面分析的第4种情况才进入递归。等待当层函数运行完就自动返回了。
- 单层递归逻辑：2号节点的值累加上1号节点的值。

**代码**

```js
var mergeTrees = function(root1, root2) {
    
    function traversal(node1 , node2){
        node2.val += node1.val
        
        if(node1.left && !node2.left){
            node2.left = node1.left
            node1.left = null
        }
        if(node1.right && !node2.right){
            node2.right = node1.right
            node1.right = null
        }
        if(node1.left && node2.left){
            traversal(node1.left , node2.left)
        }
        if(node1.right && node2.right){
            traversal(node1.right , node2.right)
        }
    }

    if(!root1 || !root2) return root1 ? root1 : root2
    traversal(root1 , root2)
    return root2
};
```





# [700. 二叉搜索树中的搜索](https://leetcode-cn.com/problems/search-in-a-binary-search-tree/)

**题目**

> 给定二叉搜索树（BST）的根节点 root 和一个整数值 val。
>
> 你需要在 BST 中找到节点值等于 val 的节点。 返回以该节点为根的子树。 如果节点不存在，则返回 null 。
>
>  
>
> 示例 1:
>
> ![image-20220428112235928](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220428112235928.png)
>
> 输入：root = [4,2,7,1,3], val = 2
> 输出：[2,1,3]
>
> Example 2:
>
> ![image-20220428112247758](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220428112247758.png)
>
> 输入：root = [4,2,7,1,3], val = 5
> 输出：[]
>
>
> 提示：
>
> 数中节点数在 [1, 5000] 范围内
> 1 <= Node.val <= 107
> root 是二叉搜索树
> 1 <= val <= 107

**思路**

二叉搜索树是一个有序树：

- 若它的左子树不空，则左子树上所有结点的值均小于它的根结点的值；
- 若它的右子树不空，则右子树上所有结点的值均大于它的根结点的值；
- 它的左、右子树也分别为二叉搜索树

使用递归的方法来做：

- 递归函数的参数和返回值：参数就是搜索树的根节点以及要搜索的值。
- 递归函数的返回条件：如果root为空或者root的值等于要搜索的值，就返回root
- 单层递归的逻辑：如果要搜索的值比节点值大，就递归右子树，如果小就递归左子树。

**代码**

```js
var searchBST = function(root, val) {
    if(!root || root.val === val) return root

    if(val > root.val) return searchBST(root.right , val)
    if(val < root.val) return searchBST(root.left , val)
};
```

