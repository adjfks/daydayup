# typescript入门

## 类型注释

1. 变量

对于基本类型的变量，ts会有自动的类型推导，所以一般不用使用类型注释。

```ts
let a = 2
let b = 'abcd'
```

2. 函数参数

使用冒号+类型的方式进行注释，如果该参数是可选的，可以在形参后添加一个问号。

同时也可以声明函数返回值的类型，不过如果返回值的类型是确定的，ts也能自动推断出来，可以不用明确标注。

```ts
const fn = (a: string , b?: number):object => {}
```

3. 数组

使用`元素类型 + []`

```ts
let arr1: number[]
// 二维数组
let arr2: number[][]
arr2 = [[1,2] , [3,4]]
```

4. 元组

和数组类似，只不过它的元素数量和类型都是确定的。可以使用问号表示该元素可以不传。

如下面例子表示坐标，既可以是二维也可以是三维。

```ts
let point: [number , number , number?]
```

5. 联合类型

有时候我们希望一个变量可以是多种类型。

```ts
let color: number | string
```

也可以限制变量的取值只能是列出的字面量：

```ts
let gender: 'male' | 'female'
let dice: 1 | 2 | 3 | 4 | 5
```

6. 接口（INTERFACE）

可以用于定义对象的属性类型

```ts
interface User {
    name: string,
    age?: number,
    id: number
}


const user: User = {
    name: 'zs',
    id: 'kdasjfiof'
}
```

7. 函数类型（函数签名）

如下面的例子指定回调函数的签名，要求必须拥有一个string类型参数且没有返回值。

```ts
function getUserName(callback:(data: string) => void){
    // ...
}
```

8. 别名

可以给类型起个别名，这样如果在其他地方使用到这个类型就可以使用该别名。

使用type关键字即可定义别名：

```ts
type UserID = number | string


function getUserInfo(id: UserID){
    // ...
}
```

## 配置文件

ts的配置文件是tsconfig.json。

```json
{
  "compilerOptions": {
    "target": "es2017",
    "removeComments": false,    // 取出注释
    "noImplicitAny": true,    // 让编译器做更严格的验证
    "strictNullChecks": true     // 开启后，除非我们明确指明该变量可以为null或undefined，否则赋值undefined或null将报错。
  }
}
```


