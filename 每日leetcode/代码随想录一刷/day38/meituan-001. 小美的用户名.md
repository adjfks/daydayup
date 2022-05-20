@[TOC](【leetcode】meituan-001. 小美的用户名)
![在这里插入图片描述](https://img-blog.csdnimg.cn/7bd3cd5ef8154d7da99e5cd9badf12f4.png#pic_center)

# 🚀题目

[leetcode原题链接](https://leetcode-cn.com/problems/BaR9fy/)

> 小美是美团的前端工程师，为了防止系统被恶意攻击，小美必须要在用户输入用户名之前做一个合法性检查，一个合法的用户名必须满足以下几个要求：
> 用户名的首字符必须是大写或者小写字母。
> 用户名只能包含大小写字母，数字。
> 用户名需要包含至少一个字母和一个数字。
> 如果用户名合法，请输出 "Accept"，反之输出 "Wrong"。

> 格式：
> 输入：
> 
> - 输入第一行包含一个正整数 T，表示需要检验的用户名数量。
> - 接下来有 T 行，每行一个字符串 s，表示输入的用户名。<br>
> 
> 输出：
> 
> - 对于每一个输入的用户名 s，请输出一行，即按题目要求输出一个字符串。

> 示例：
> 输入：
>      5
>      Ooook
>      Hhhh666
>      ABCD
>      Meituan
>      6666
> 输出：
>      Wrong
>      Accept
>      Wrong
>      Wrong
>      Wrong

> 提示：
> 1 <= T <= 100
> s 的长度不超过 20
> 请注意，本题需要自行编写「标准输入」和「标准输出」逻辑，以及自行 import/include 需要的 library。

# 💥leetcode代码模板

无，这道题目需要自己处理输入输出。

```javascript

```

# 🚀思路

![在这里插入图片描述](https://img-blog.csdnimg.cn/470f6b9e77f74bc390c692ed5c64bdeb.gif#pic_center)
这道题目使用正则表达式很简单，不过这是我第一次做Javascript的acm模式题目，先看看对于输入的处理。

输入使用node.js的fs模块

```javascript
const fs = require('fs')
// 读取文件并将文件的每一行作为数组的一项存储下来
const lines = fs.readFileSync(0).toString().trim().split(/\r\n|\r|\n/)
```

接下来就是编写正则表达式啦，一项一项要求来：

- 用户名的首字符必须是大写或者小写字母。

```javascript
const regName = /^[a-zA-Z]/
```

- 用户名只能包含大小写字母，数字。

```javascript
const regName = /[0-9a-zA-Z]/
```

- 用户名需要包含至少一个字母和一个数字。

```javascript
const regName = /[a-zA-Z]+[0-9]+/
// 或
const regName = /[0-9]+[a-zA-Z]+/
```

ok，现在把它们组合起来考虑，首字母必须是字母，用户名长度至少一个数字和一个字母，也就是说如果只有两位肯定是 字母+数字 的形式，即

```javascript
const regName = /^[a-zA-Z][0-9]$/
```

然后，在数字前和后都可以有任意多的合法字符（字母或数字）

```javascript
const regName = /^[a-zA-Z][0-9a-zA-Z]*[0-9]+[0-9a-zA-Z]*$/
```

# 💻代码

![在这里插入图片描述](https://img-blog.csdnimg.cn/50b64835a43344369939c44437475cc5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5YmN56uvY29ybmVy,size_8,color_FFFFFF,t_70,g_se,x_16#pic_center)

```js
const fs = require('fs')
const lines = fs.readFileSync(0).toString().trim().split(/\r\n|\r|\n/)
const T = lines[0]
const regName = /^[a-zA-Z][0-9a-zA-Z]*[0-9]+[0-9a-zA-Z]*$/
for(let i = 1 ; i < lines.length ; i++){
    if(regName.test(lines[i])) console.log('Accept')
    else console.log('Wrong')
}
```

<br/>

> ✨$\textcolor{green}{我是coner，请别关注我的专栏，本系列文章为个人刷题记录（偷偷自己卷🤤）：}$[leetcode题解js](https://blog.csdn.net/laplacepoisson/category_11759331.html?spm=1001.2014.3001.5482)<br/>
> ✨$\textcolor{green}{每天更新3道leetcode题目的js题解🚀🚀🚀}$<br/>
