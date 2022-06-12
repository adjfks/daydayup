```js

class Emitter { 

    constructor(x) { 

        this.max = x this.idx = 0 

    }

    *[Symbol.iterator]() { 

        while (this.idx < this.max) { 

            yield this.idx++ 

        } 

    }

}

function count() { 

    const emitter = new Emitter(5) 

    for (const x of emitter) { 

        console.log(x); 

    }

}

count()// 0// 1// 2// 3// 4
```


