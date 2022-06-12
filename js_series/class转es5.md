es6 class

```js
class Person{
	constructor(name ,age){
  	 	this.name = name
      this.age = age
  	}
  
  sayHi(){
  	console.log('hi')
  }
}

```



使用babel的在线工具进行转换，转换结果简化如下：

```js
function Person(name , age) {
  if (!this instanceof Person) {
    throw new TypeError("Cannot call a class as a function");
  }

  this.name = name
  this.age = age
}

Object.defineProperty(Person , 'prototype' , { writable: false})

const descriptor = {
  key: "sayHi",
  value: function sayHi() {
    console.log("hi");
  }
}
Object.defineProperties(Person , descriptor.key , descriptor)
```


