const fs = require('fs')
const path = require('path')
const Stream = require('stream')

// 读取当前目录下的文件和文件夹
const rootDir = path.resolve(__dirname)
const repoPath = 'https://github.com/adjfks/daydayup/blob/main/'
const content = `# daydayup

<br/>
<p align='center'>
    <p align='center'>你好！我是coner!一名前端小白~</p>
    <p align='center'>这个仓库包含了我的个人文章，学习笔记，前端资源...</p>
    <p align='center'>仓库取名为daydayup就是要激励自己每天学习，技术沉淀！</p>
</p>

<br/>

时刻提醒自己学习时多思考以下问题：

- 这个东西是什么？它有什么用？有没有其他东西替代？
- 这个问题这样子解决了，它的原理是什么？有没有其他的解决方式？
- 这个问题很难，难在哪里？需要把握什么关键点？
- 这个知识点我真的会了吗？真会还是假会？有实践过吗？变通一下还会不会
- 今天复盘了吗？学到了什么？还有哪些没弄懂的？

<br/>

`
const ignore = ['.git', 'README.md']

function traverse(root, level, arr) {
	if (ignore.findIndex((item) => item === root.split('\\').pop()) !== -1) return
	const stat = fs.statSync(root)
	var count = level
	var prefix = ''
	while (count > 0 && --count) prefix += '    '
	prefix += '- '
	if (stat.isFile()) {
		if (path.extname(root) !== '.md') return
		var pathArr = root.split('\\')
		var fileName = pathArr.pop()
		const src = `${prefix}[${fileName.split('.')[0]}](${repoPath}${pathArr[pathArr.length - 1]}/${fileName})`
		console.log(src)
		arr.push(src)
	} else {
		var title = root.split('\\').pop()
		if (level) arr.push(`${prefix}${title}`)
		const dirs = fs.readdirSync(root)
		for (var i = 0; i < dirs.length; i++) {
			traverse(path.resolve(root, dirs[i]), level + 1, arr)
		}
	}
}

try {
	var arr = []
	traverse(rootDir, 0, arr)
	fs.writeFileSync('README.md', content)
	fs.writeFileSync('README.md', arr.join('\n'), { flag: 'a' })
	console.log('创建成功！')
} catch (err) {
	console.log(err.message)
}
