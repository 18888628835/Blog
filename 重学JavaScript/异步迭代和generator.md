# 异步迭代

迭代器是采用 `iterator`接口的,如果希望给一个未内置迭代接口的对象设置`iterator` 接口,我们需要完成以下步骤:

1. 给对象设置`[Symbol.iterator]`属性,这个属性指向一个 function
2. 该 `function`需要返回一个具有 `next`方法的对象,我们称之为`iterator object`
3. 该对象的 `next`方法返回具有 `done:boolean`和`value:any`属性的对象

以下是例子

```javascript
let range = {
  from: 1,
  to: 5,
  //for..of 循环开始时,会调用这个方法,获取 iterator object
  [Symbol.iterator]() {
    return {
      current: this.from,
      last: this.to,
      // for..of 每次循环,都会调用 next 方法,直到 done 为 true 为止
      next() {
        return this.current <= this.last
        // next 方法返回的对象必须为{done:boolean,value:any}的格式
          ? { done: false, value: this.current++ }
          : { done: true };
      }
    };
  }
};
for (let item of range) console.log(item);// 1 2 3 4 5
```

如果我们希望能够采用异步迭代,比如说 setTimeout 的延迟之后迭代,就需要用到异步迭代。

要让上面的对象拥有异步迭代的能力,我们需要做以下调整

* `[Symbol.iterator]`修改为`[Symbol.asyncIterator]`
* `next`方法返回一个 Promise,并且状态为 `fulfilled`
* 使用 for await ..进行循环

下面是修改后的代码

```javascript
let range = {
  from: 1,
  to: 5,
  [Symbol.asyncIterator]() {
    return {
      current: this.from,
      last: this.to,
      // 这里的 async 是让return 的值变成 promise
      async next() {
        // 这里使用 await 阻塞,模拟延迟效果
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return this.current <= this.last
          ? { done: false, value: this.current++ }
          : { done: true };
      }
    };
  }
};
// 配合 for await 必须用 async
(async () => {
  for await (let item of range) {
    console.log(item);
  }
})();

```

* next 方法可以不是`async`,这里只是为了让 `next`必须返回`promise`而写的语法糖
* 为了让异步迭代生效,其内部必须具有`Symbol.asyncIterator`方法
* 使用 `for await` 迭代,需要用上 `async` 关键字

以下是两者对比差异的表格:

|                          | Iterator          | 异步 iterator          |
| :----------------------- | :---------------- | :--------------------- |
| 提供 iterator 的对象方法 | `Symbol.iterator` | `Symbol.asyncIterator` |
| `next()` 返回的值是      | 任意值            | `Promise`              |
| 要进行循环，使用         | `for..of`         | `for await..of`        |

# 异步 generator

`generator` 可以很方便地帮助我们生成 iterator 所需要的东西：

 ——通过`*`关键字生成`generator`对象,内部包含 `next`方法

 ——通过 `yield`抛出 具有`done`和`value`属性的对象

上面的代码可以修改成这样

```javascript
let range = {
  from: 1,
  to: 5,
  async *[Symbol.asyncIterator]() {
    for (let i = this.from; i <= this.to; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      yield i;
    }
  }
};
// 配合 for await 必须用 async
(async () => {
  for await (let item of range) {
    console.log(item);// 1 2 3 4 5
  }
})();
```

此时,`generator.next()`返回一个 `promise`,且它是一个异步的函数

```javascript
(async () => {
  const asyncGenerator = range[Symbol.asyncIterator]();
  const result = await asyncGenerator.next(); // 返回Promise Object {done:false,value:1}
  console.log(result); // {done:false,value:1}
})();
```

