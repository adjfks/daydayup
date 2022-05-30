# Monorepo 实战

## Lerna

Lerna 是 npm 模块的管理工具，为项目提供了集中管理 package 的目录模式，如统一的 repo 依赖安装、package scripts 和发版等特性。

### 全局安装

```shell
npm i -g lerna
```

然后创建一个文件夹命名为 monorepo 好了。

### 初始化项目

```shell
lerna init
```

初始化后生成了 packages 空目录、lerna.json 和 package.json

文件内容如下：

```js
// lerna.json
{
  "packages": [
    "packages/*"
  ],
  "version": "0.0.0"
}

// package.json
{
  "name": "root",
  "private": true,
  "devDependencies": {
    "lerna": "^5.0.0"
  }
}
```

## 创建 npm 包

我们创建一个 utils 包和 package-a 包

```shell
lerna create @monorepo/utils
lerna create @monorepo/package-a  // 包名不允许出现大写字母
```

运行命令后会让你输入包名等内容以供生成 package.json 文件。

此时会在 packages 目录下创建 utils 目录，utils 目录包含两个文件夹：*tests*和 lib，还有一个 README.md 文件，两个文件夹中各有一个 js 文件：

```js
// __tests__/utils.test.js
'use strict'

const utils = require('..')

describe('@monorepo/utils', () => {
	it('needs tests')
})

// lib/utils.js
;('use strict')

module.exports = utils

function utils() {
	// TODO
}
```

## yarn workspace

```json
// lerna.json
{
	"packages": ["packages/*"],
	"npmClient": "yarn",
  "useWorkspaces": true, // 使用yarn workspaces
	"version": "0.0.0"
}

// package.json
{
  "name": "root",
  "private": true,  // private 如果设置为 true，则可以防止应用程序/软件包被意外地发布到 npm。
  "workspaces": [ //指定workspace路径
    "packages/*"
  ],
  "devDependencies": {
    "lerna": "^5.0.0"
  }
}
```

## 清理环境

```shell
lerna clean # 清理所有packages的node_modules目录，不能删除根目录的node_modules
yarn workspaces run clean # 执行所有package的clean操作（应是需自行写脚本）
```

## 安装依赖的命令

这里记录一些关于 yarn workspace 的命令

1. 给某个包安装依赖

```shell
yarn workspace @monorepo/utils add lodash --dev
// 运行后在utils的package.json中生成以下依赖：
"devDependencies": {
    "lodash": "^4.17.21"
  }
// 同时，lodash是安装在项目的根目录下的node_modules中
// 此时再给package-a也安装loadsh就不会进行二次安装了，因为lodash是安装在根目录下公用的。运行命令后会直接修改package-a的package.json里的依赖项。

//如果给package-a安装不同版本的lodash呢？
 yarn workspace @monorepo/package-a add lodash@4.0.0 --dev
// 此时会单独在package-a的node_modules里安装对应版本lodash
```

3. 给所有包安装同一个依赖

```shell
lerna add lodash --dev
```

2. 删除某个包的依赖

```shell
yarn workspace @monorepo/package-a remove lodash
```

3. 删除所有包的某个依赖

```shell
lerna exec -- yarn remove lodash
```

4. 给某个包安装本地包依赖
   下面的例子将@monorepo/package-a 指定为@monorepo/utils 的依赖。

```shell
lerna add @monorepo/package-a --scope=@monorepo/utils
```

## yarn workspace 其他命令

```shell
yarn workspaces info  // 展示当前project依赖树信息
```

## 提交规范

使用 commitizen 和 cz-lerna-changelog 来规范提交，以此为基础之后可以自动生成提交日志。

### 在根目录安装

```shell
yarn add commitizen cz-lerna-changelog -D -W
// -W 明确表示我们要把依赖关系添加到工作区根目录。
// 注意必须在根目录下执行此命令
```

### 配置根目录 package.json

```json
{
	"name": "root",
	"private": true,
	"workspaces": ["packages/*"],
	"scripts": {
		"commit": "git-cz"
	},
	"config": {
		"commitizen": {
			"path": "./node_modules/cz-lerna-changelog"
		}
	},
	"devDependencies": {
		"commitizen": "^4.2.4",
		"cz-lerna-changelog": "^2.0.3",
		"lerna": "^5.0.0"
	}
}
```

## commitlint && husky

配置强制开发者遵顼提交规范，校验的工作由 commitlint 来完成，校验的时机则由 husky 来指定。husky 继承了 Git 下所有的钩子，在触发钩子的时候，husky 可以阻止不合法的 commit，push 等等。

### 安装 commitlint 以及要遵守的规范

```shell
yarn add -D -W husky @commitlint/cli @commitlint/config-conventional
```

### commitlint.config.js 配置文件

在根目录下创建 commitlint.config.js

```js
module.exports = {
	extends: ['@commitlint/config-conventional']
}
```

在 package.json 中配置

```json
"husky": {
 		"hooks": {
    		"commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
     }
 }
```

"commit-msg"是 git 提交时校验提交信息的钩子，当触发时便会使用 commitlint 来校验。安装配置完成后，想通过 git commit 或者其它第三方工具提交时，只要提交信息不符合规范就无法提交。从而约束开发者使用 yarn run commit 来提交。

## eslint && lint-staged

这一步是为了统一代码风格

### 安装

```shell
yarn add -D -W lint-staged
```

[npm 关于配置的介绍](https://www.npmjs.com/package/lint-staged#how-to-use-lint-staged-in-a-multi-package-monorepo)

在 package.json 中配置

```json
"lint-staged": {
		"*.md": "prettier --write",
		"*.{ts,tsx,js,vue,scss}": "prettier --write",
		"*.{ts,tsx,js,vue}": "eslint --fix",
		"*.{vue,css,scss}": "stylelint --fix"
	},
```

这里的 stylelint 和 eslint 还没有安装，接下来我们把它们拆分出去，方便以后的配置扩展或更改。

lint-staged staged 是 Git 里的概念，表示暂存区，lint-staged 表示只检查并矫正暂存区中的文件。一来提高校验效率，二来可以为老的项目带去巨大的方便。

## 安装 prettier

```shell
yarn add prettier -W -D
```

## 安装 typescript

```shell
yarn add typescript -W -D
```

## eslint 和 stylelint

在 packages 创建 2 个包，分别存放 eslint 和 stylelint 的配置。

```shell
lerna create @monorepo/eslint-config
lerna create @monorepo/stylelint-config
```

运行后会有一些内容要填写，除了 entry 选项写上 index.js,其他全部直接回车。

### 删除多余文件

上面创建的两个文件夹中只保留 package.json,其余文件和文件夹都删除。

### 创建 index.js

在两个文件夹中都创建一个 index.js 作为入口文件。

### eslint

给 eslint-config 文件夹安装一些依赖，主要是 eslint 的预设配置

```shell
yarn workspace @monorepo/eslint-config add @typescript-eslint/eslint-plugin

// 以同样方式安装下列包
@typescript-eslint/parser
eslint
eslint-config-airbnb-base
eslint-config-prettier
eslint-plugin-import // 用于支持es2015+的带入导出语法并防止导入导出路径名称错误等问题
eslint-plugin-vue // vue.js官方插件
```

之后在 index.js 中导出配置：

```js
module.exports = {
	extends: [
		'airbnb-base',
		'plugin:@typescript-eslint/recommended',
		'plugin:vue/vue3-recommended',
		'prettier',
		'prettier/vue'
	],
	parserOptions: {
		parser: '@typescript-eslint/parser',
		ecmaVersion: 2020,
		sourceType: 'module',
		extraFileExtensions: ['.vue']
	},
	plugins: ['@typescript-eslint'],
	env: {
		es6: true,
		node: true,
		browser: true
	},
	rules: {
		'no-new': 'off',
		'no-shadow': 'off',
		'no-bitwise': 'off',
		'func-names': 'off',
		'no-console': 'off',
		'no-plusplus': 'off',
		'default-case': 'off',
		'prefer-template': 'off',
		'consistent-return': 'off',
		'no-param-reassign': 'off',
		'no-nested-ternary': 'off',
		'no-underscore-dangle': 'off',
		'no-unused-expressions': 'off',
		'no-restricted-globals': 'off',
		'class-methods-use-this': 'off',
		'prefer-destructuring': ['error', { object: true, array: false }],
		// eslint-plugin-import
		'import/order': 'off',
		'import/extensions': 'off',
		'import/no-unresolved': 'off',
		'import/prefer-default-export': 'off',
		'import/no-extraneous-dependencies': 'off',
		// eslint-plugin-vue
		'vue/no-v-html': 'off',
		'vue/attributes-order': 'off',
		'vue/require-v-for-key': 'off',
		'vue/require-default-prop': 'off',
		'vue/no-unused-components': 'off',
		'vue/name-property-casing': ['error', 'kebab-case'],
		'vue/component-name-in-template-casing': ['error', 'kebab-case'],
		// typescript-eslint
		'@typescript-eslint/camelcase': 'off',
		'@typescript-eslint/ban-ts-ignore': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off'
	}
}
```

ok,eslint 的配置搞定。接下来同样的道理配置 stylelint.

## stylelint

安装

```js
yarn workspace @monorepo/stylelint-config add stylelint

stylelint-config-prettier
stylelint-config-standard
```

index.js

```js
module.exports = {
	extends: ['stylelint-config-standard', 'stylelint-config-prettier']
}
```

## 根目录配置 prettier

在根目录下创建.prettierrc 文件

```js
{
  "useTabs": true,
  "tabWidth": 2,
  "singleQuote": true,
  "semi": false
}
```

## 配置脚本命令

在根目录的 package.json

```json
"scripts": {
		"bootstrap": "yarn || npm i",
		"commit": "git-cz",
		"publish": "lerna publish"
	},
  "eslintConfig": {
    "root": true,
    "extends": [
      "@varlet"
    ]
  },
  "stylelint": {
    "extends": [
      "varlet-stylelint-config"
    ]
  },
```

```
lerna bootstrap // 在当前 Lerna 仓库中执行引导流程（bootstrap）。安装所有 依赖项并链接任何交叉依赖。此命令至关重要，因为它让你可以 在 require() 中直接通过软件包的名称进行加载，就好像此软件包已经存在于 你的 node_modules 目录下一样。

lerna publish // 为已经更新过的软件包创建一个新版本。提示 输入新版本号并更新 git 和 npm 上的所有软件包。
```
