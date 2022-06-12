# AJV

[官方文档](https://ajv.js.org/)

## 基本使用

安装

```powershell
yarn add ajv
```

使用

```js
const Ajv = require('ajv')
const { string } = require('yargs')

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3
    },
    age: {
      type: 'number'
    },
    pets: {
      type: 'array',
      items: {
        type: 'string',
      }
    },
    isWorker: {
      type: 'boolean'
    }
  }
}
const ajv = new Ajv()
const validate = ajv.compile(schema)
const valid = validate({
  name: 'Jane',
  age: 18,
  pets: ['mimi', 'wuwo'],
  isWorker: true
})
if(!valid) console.log(validate.errors);

```

## format

### 自定义format

自定义format使用`addFormat`方法

```js
ajv.addFormat('test', (data) => {
  console.log(data , '---------------->');
  return data === 'haha'
})
```

改写一下schema

```js
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      format: 'test'
    },

    ....
  }
}
```

校验失败：

```js
Jane ---------------->
[
  {
    instancePath: '/name',
    schemaPath: '#/properties/name/format',
    keyword: 'format',
    params: { format: 'test' },
    message: 'must match format "test"'
  }
]
```

修改为'haha'后校验成功

```js
const valid = validate({
  name: 'haha',    // 修改为'haha'
  age: 18,
  pets: ['mimi', 'wuwo'],
  isWorker: true
})
```

## 自定义关键字

文档[User defined keywords | Ajv JSON schema validator](https://ajv.js.org/keywords.html)

像前面使用到的`type properties items minLength`都是关键字，我们也可以自定义关键字。

定义关键字有四种方式

### 1. validate函数

```js
ajv.addKeyword({
  keyword: 'test',
  validate: (schema, data) => {
    console.log(schema, data);
    return schema === data
  },
  errors: false
})
```

### 2. macro函数

macro函数是在执行compile的时候调用的，它需要返回一个新的schema，这个schema会追加到`parentSchema`里

```js
ajv.addKeyword({
  keyword: 'range',
  type: 'number',
  macro: (schema, parentSchema) => {
    console.log(schema, parentSchema)
    return {
      minimum: schema[0],
      maximum: schema[1]
    }
  }
})


// [ 1, 20 ] { type: 'number', range: [ 1, 20 ] }
```



### 3. compile函数 和 metaSchema

metaSchema用来校验keyword，

compile函数和macro很相似，但是它返回的是一个函数，该函数之后会在compile阶段被调用，因此性能没那么好。

```js
ajv.addKeyword({
  keyword: 'range',
  compile(schema, parentSchema) {
    console.log(schema, parentSchema)
    return () => true
  },
  metaSchema: {
    type: 'array'
  }
})
```





### 4. code函数

文档推荐的一种方式

```js
import {_, nil, KeywordCxt} from Ajv

ajv.addKeyword({
  keyword: "range",
  type: "number",
  code(cxt: KeywordCxt) {
    const {schema, parentSchema, data} = cxt
    const [min, max] = schema
    const eq: Code = parentSchema.exclusiveRange ? _`=` : nil
    cxt.fail(_`${data} <${eq} ${min} || ${data} >${eq} ${max}`)
  },
  metaSchema: {
    type: "array",
    items: [{type: "number"}, {type: "number"}],
    minItems: 2,
    additionalItems: false,
  },
})
```





## 一些库

### ajv-i18n

用于定义报错信息语言设置，如设置为中文

### ajv-errors

支持原生关键字错误信息自定义信息

使用时给schema添加`errorMessage`

```js
errorMessage: {
    tyep: '必须是字符串',
    minLength: '长度不能小于10'
}
```
