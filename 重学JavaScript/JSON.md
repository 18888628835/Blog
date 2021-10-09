# JSON 有什么用

 JSON 是一种用户数据交换的文本格式，通常用于在网站上表示和传输数据，比如服务器向客户端发送一些数据，渲染在网页上。

在历史上，XML 曾一度成为互联网存储和传输结构化数据的标准，但是其语法冗余和啰嗦，所以 JSON 出来后迅速取代 XML，目前已经成为交换数据的标准格式。

# JSON 是什么

JSON 是 Javascript 的子集，是一种数据格式，利用 JavaScript 的几种模式来表示结构化的数据。

JSON 并不属于 JavaScript，只是它们拥有相同的语法，很多语言都有解析和序列化 JSON 的能力，所以 JSON 是一种通用的数据格式。

JSON 支持3种类型的值：简单值、对象、数组。

1. 简单值包括字符串、数字、布尔、null，但是不包含 undefined。
2. 对象和数组都是复杂数据类型，对象和数组内的值可以组合任意类型，包括简单值、数组、对象等。

## 简单值

最简单的 JSON 可以是一个数值或者一个字符串，5或者‘‘5’’都可以是 JSON，null 和布尔值也可以是 JSON。

需要额外注意

* 字符串必须由双引号包起来。

* undefined 会被 JSON 忽略，所以它不是 JSON 里的简单值。

## 对象

在 JavaScript 中，对象字面量是这样的

```javascript
const person={
  name:"qiuyanxi",
  age:29
};
```

如果用 JSON 表示则应该是这样的

```json
{
  "name":"qiuyanxi",
  "age":29
}
```

首先 JSON 没有变量声明,其次没有分号，此外所有属性名都必须用双引号包起来。

## 数组

数组的规则跟对象是一样的，没有变量，没有分号，都需要双引号包起来。以下就是一个 JSON 对象

```json
["1",{"name":"qiuyanxi"},["2"]]
```

数组和对象可以自由组合，以表示更加复杂的数据结构。

# JSON 怎么用

## 普通使用

ES5增加了 JSON 全局对象，用来引入解析 JSON 的能力。

JSON 对象有两个方法：`stringify`和 `parse`

`stringify`可以把 JavaScript 序列化为 JSON 字符串，`parse`可以将 JSON 字符串解析为原生 JavaScript 值。

举个例子

```javascript
let book={
  title:"Profession JavaScript",
  edition:4,
  year:2017
}
let jsonText=JSON.stringify(book)
'{"title":"Profession JavaScript","edition":4,"year":2017}' //JSON字符串

JSON.parse(jsonText)
{title: 'Profession JavaScript', edition: 4, year: 2017}
```

在序列化 JavaScript 对象时，所有函数和 undefined 都会被忽略

```js
let book={title:undefined,fn:function (){}}
JSON.stringify(book)
'{}'
```

**将JSON字符串解析为JavaScript 对象时，会创建一个新的对象，能够实现深拷贝。**

```js
let book={
  title:"Profession JavaScript",
  edition:4,
  year:2017
}
let jsonText=JSON.stringify(book)
let newObj=JSON.parse(jsonText)

newObj.edition=5
newObj
{title: 'Profession JavaScript', edition: 5, year: 2017}
book
{title: 'Profession JavaScript', edition: 4, year: 2017}
```

上面的结果就是深拷贝了一个对象，两者的属性不相交。

## 序列化选项

`JSON.stringify`除了可以接收需要序列化的对象，还可以接收两个参数，这两个参数可以指定序列化对象的方式

### JSON.stringify的第二个参数

第二个参数是过滤器，可以是数组或者函数

* 如果是数组，可以指定需要序列化的属性

  下面例子中，只序列化出

  ```js
  let book={
    title:"Profession JavaScript",
    edition:4,
    year:2017
  }
  JSON.stringify(book,['edition'])
  '{"edition":4}'
  ```

* 如果是函数，这个函数称之为还原函数（replacer）,它会接收到两个参数，分别是属性名和属性值，可以根据属性名和属性值来决定序列化做的操作。

```javascript
let book = {
  title: "Profession JavaScript",
  edition: 4,
  year: 2017
};
const jsonText = JSON.stringify(book, (key, value) => {
  switch (key) {
    case "title":
      return "title is modified";
    case "edition":
      return 5000;
    case "year":
      return undefined;
    default:
      return value; //一定要return value
  }
});
jsonText {"title":"title is modified","edition":5000} 
```

**第一次调用这个函数实际上会传入空字符串 key，值是 book 对象**

```javascript
const jsonText = JSON.stringify(book, (key, value) => {
  console.log("key", key);
  console.log("value", value);
});
// key "" 
// value {title: "Profession JavaScript", edition: 4, year: 2017}
```

### JSON.stringify的第三个参数

第三个参数可以控制缩进和空格。最大缩进值为10，大于10则自动设置为10

```js
const jsonText = JSON.stringify(book, null, 5);
{
     "title": "Profession JavaScript",
     "edition": 4,
     "year": 2017
} 
```

```js
const jsonText = JSON.stringify(book, null, 10);
{
          "title": "Profession JavaScript",
          "edition": 4,
          "year": 2017
}
```

如果设置为字符串，那么就会自动将空格转为这个字符串,字符串的最大长度限制为10

```js
const jsonText = JSON.stringify(book, null, "-");
{
-"title": "Profession JavaScript",
-"edition": 4,
-"year": 2017
} 
```

### toJSON 方法

原生的 Date 对象默认带有 toJSON 方法，可以将 Date 对象转化为 ISO8601日期字符串，本质上跟 `toISOString()`方法是一致的。

```js
console.log(new Date().toJSON() === new Date().toISOString());//true
```

我们也可以在对象中为自定义序列化添加一个 toJSON 方法，然后用 stringify 去序列化这个对象

```js
let book = {
  title: "Profession JavaScript",
  edition: 4,
  year: 2017,
  toJSON: function () {
    return this.edition;
  }
};
console.log(JSON.stringify(book));
// 4
```

在`JSON.stringify` 调用时，会执行以下操作：

1. 如果可以获取到实际的值，则调用 toJSON 方法获取实际的值，否则使用默认的序列化
2. 如果提供第二个参数，则应用过滤。传入过滤函数的值就是第1步返回的值
3. 第2步返回的值会被序列化
4. 如果提供了第三个参数，则相应对结果进行缩进

## 解析选项

`JSON.parse`接收第二个参数，这个参数是一个函数，称为还原函数（reviver），这个函数的参数跟 `JSON.stringify`一样，第一个参数为 key，第二个参数为 value。

如果这个还原函数返回 undefined，那么结果会删除相应的键。如果返回其他任何值，则会称为相应键的值插入到结果中。

```js
const jsonText = JSON.stringify(book);

JSON.parse(jsonText, (key, value) => {
  switch (key) {
    case "edition":
      return 5000;
    case "title":
      return undefined;
    case "year":
      return null;
    default:
      return value;
  }
});
// {edition: 5000, year: null}
```

# 总结

* JSON 是一种轻量的数据交换格式，可以很方便地表示复杂的数据结构
* JSON 格式可以表示 JavaScript 中的数字、布尔、字符串、null、数组和对象，但会忽略 undefined 和函数
* JSON 有两种方法，将JavaScript 对象转化为 JSON 串的 `JSON.stringify()`方法和将 JSON 串转化为 JavaScript 值的 `JSON.parse()`方法
* 两种方法都有额外的选项参数可以修改默认的行为，实现属性的过滤和修改。

