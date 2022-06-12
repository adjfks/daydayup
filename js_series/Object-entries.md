```js
/* 
Object.entries()方法返回一个给定对象自身可枚举属性的键值对数组，
其排列与使用 for...in 循环遍历该对象时返回的顺序一致
（区别在于 for-in 循环还会枚举原型链中的属性）。
*/

// 遍历数组
const arr = [1, 2, 3, 4, 5]
for(const [i , item] of arr.entries()) {
  console.log(i, item)
}

// 遍历对象
const object1 = {
  a: 'somestring',
  b: 42
};

for (const [key, value] of Object.entries(object1)) {
  console.log(`${key}: ${value}`);
}

// 将Object转换为map
var obj = { foo: "bar", baz: 42 };
var map = new Map(Object.entries(obj));
console.log(map); // Map { foo: "bar", baz: 42 }

```


