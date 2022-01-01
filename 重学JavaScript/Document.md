# 一、浏览器环境和规格

一开始JavaScript是为浏览器创建的语言，现在它已经能够在多平台运行了。

平台可以是一个浏览器，也可以是一个web服务器，或者其他主机(host)。这些平台都能够运行JavaScript程序并且提供了特定的功能。JavaScript称它们为“主机环境”。

主机环境提供了自己的对象和语言核心外函数。Web浏览器提供了控制页面的方法，Node.JS提供了服务端的功能等。

JavaScript在浏览器中运行时，能有以下的操作功能

<img src="assets/image-20211227173213949.png" alt="image-20211227173213949" style="zoom:50%;" />

有一个叫做window的根对象。它有两个角色：

* JavaScript代码的全局对象
* 它代表浏览器窗口，并且提供控制它的方法

比如，当我们创建一个全局函数时，我们可以通过window访问到它

```javascript
function sayHi(){
  console.log('hello')
}
window.sayHi() // 全局函数是全局对象的方法
```

我们还可以用它访问浏览器窗口高度

```javascript
window.innerHeight // 内部窗口的高度
```

## 1.1 DOM

文档对象模型（document Object Model），简称DOM，将所有页面的内容表现为可以修改的对象。

`document`对象是页面的主要入口点。我们可以用它来修改或者创建页面上的任何内容

```javascript
// 修改页面内容的背景颜色为绿色
document.body.style.background = 'green'
```

> DOM不仅仅用于浏览器
>
> DOM规范解释了文档的结构，并提供了操作文档的对象。有的非浏览器设备也使用了DOM。
>
> 例如：下载HTML文件并对其进行处理的服务端脚本也可以使用DOM。但它们可能只支持规范中的部分内容

> 对应于DOM结构，还有CSSOM，这是一份针对css规则和样式表的规范，它解释了将css表示为对象，以及如何读写这些对象。
>
> 当我们修改文档的样式规则时，CSSOM 与 DOM 是一起使用的。但实际上，很少需要 CSSOM，因为我们很少需要从 JavaScript 中修改 CSS 规则（我们通常只是添加/移除一些 CSS 类，而不是直接修改其中的 CSS 规则），但这也是可行的。

## 1.2 BOM

BOM是浏览器对象模型(Browser Object Model)，表示由浏览器作为主机环境提供用于文档（document）之外的所有内容的对象。

例如：

* navigator对象提供有关浏览器和操作系统的背景信息。navigator有许多属性，最广为人知的是：`navigator.userAgent`——当前浏览器 和`navigator.platform`——关于平台信息（Windows/Mac/Linux）等
* location对象允许我们读取当前URL，并且可以将浏览器重定向到新的URL

```javascript
location.href='http://www.baidu.com' // 跳转到百度页面
```

函数`alert/confim/prompt`也是BOM的一部分，BOM与文档(document)没有直接关系，但它代表了浏览器与用户之间通信的浏览器方法。

> BOM 是HTML规范的一部分，HTML规范不仅是关于HTML语言，还涵盖了一些对象、方法和特定的DOM扩展。这就是广义的HTML

## 1.3 小结

JavaScript的主机环境如果是浏览器，则会有一个全局对象window，里面涵盖了DOM、BOM、JavaScript代码等内容。这些内容遵循一些标准规范：

* HTML规范 —— HTML语言以及BOM（浏览器对象模型） —— 各种浏览器函数（setTimeout、alert、location）等
* DOM规范 —— 浏览器中document文档的结构、操作和事件的规范
* CSSOM规范 —— 描述css样式表和样式规则，对它们的操作、以及它们与文档的绑定等规范
* 其他规范

# 二、DOM树

HTML文档的主干是标签（tag）。

根据文档对象模型(DOM)，每个 HTML 标签都是一个对象。嵌套的标签是闭合标签的“子标签（children）”。标签内的文本也是一个对象。

所有这些对象都可以通过 JavaScript 来访问，我们可以使用它们来修改页面。

例如，`document.body` 是表示 `<body>` 标签的对象。

## 2.1 DOM的例子

```html
<!DOCTYPE HTML>
<html>
<head>
  <title>About elk</title>
</head>
<body>
  The truth about elk.
</body>
</html>
```

以上的HTML被DOM表示为标签的树形结构，就类似这样：

<img src="assets/image-20211229145603478.png" alt="image-20211229145603478" style="zoom:50%;" />

每棵树的节点都是一个对象。

标签被称为元素节点，并形成树形结构：html在根节点，head和body是其子节点。

元素内的文本形成文本节点，被标记为`#text`。一个文本节点只包含一个字符串。它没有子项，而且总是树的叶子。

例如：title标签里面有文本“About elk”。

有两种特殊的字符：

* 换行符（\n）
* 空格

这两种都是有效的字符，它们也能形成文本节点并成为DOM的一部分。

例如，head标签前面有一些空格，也有一个换行符，它们形成一个#text节点。

* `<head>`之前的空格和换行符会被忽略（历史原因）
* `</body>`后的东西会被放置到body内，并放在body的底部。（HTML规范）所以`</body>` 之后没有空格。

> 浏览器工具不会在文本开始/结尾显示空格，并且在标签之间也不会显示换行符

## 2.2 自动修正

如果浏览器遇到格式不正确的 HTML，它会在形成 DOM 时自动更正它。

例如，顶级标签总是 `<html>`。即使它不存在于文档中 — 它也会出现在 DOM 中，因为浏览器会创建它。

在生成 DOM 时，浏览器会自动处理文档中的错误，关闭标签等。

比如说以下标签

```html
<p>Hello
<li>Mom
<li>and
<li>Dad
```

DOM最终会修正错误，帮助闭合标签，并且生成HTML标签、BODY标签、body标签等

表格是一个有趣的“特殊的例子”。按照 DOM 规范，它们必须具有 `<tbody>`，但 HTML 文本却忽略了它。然后浏览器在创建 DOM 时，自动地创建了 `<tbody>`。

下面的例子中的代码在浏览器中会自动出现`<tbody>`

```html
<table id="table"><tr><td>1</td></tr></table>
```

## 2.3 其他节点类型

除了元素和文本节点外，还有其他节点类型：

* 注释
* `<!DOCTYPE...>`等



## 2.4 小结

HTML/XML文档在浏览器内均被表示为DOM树

* 标签(tag)是元素节点，并形成文档结构
* 文本(text)是文本节点
* ...HTML中所有东西都能在DOM树中有所映射，注释也可以。

一般我们直接使用F12开发者工具来手动检查或者修改它们。



# 三、遍历DOM

对DOM的所有操作都是以`document`对象开始的。从它我们可以访问任何节点。

下图是描述对象间关系的图片，通过这些关系我们可以在DOM节点之间切换

<img src="assets/image-20211228212806935.png" alt="image-20211228212806935" style="zoom:50%;" />

## 3.1 document.documentElement和Body

最顶层的树节点可以直接作为document对象的属性来使用：

* `<html>`=document.documentElement  顶层DOM节点
* `<body>`=document.body 
* `<head>`=document.head

document.body可以是个null。

如果我们没写body标签，DOM会自动创建，但是在以下情况下body可能是个null

```html
<html>

<head>
  <script>
    alert( "From HEAD: " + document.body ); // null，这里目前还没有 <body>
  </script>
</head>

<body>

  <script>
    alert( "From BODY: " + document.body ); // HTMLBodyElement，现在存在了
  </script>

</body>
</html>
```

因为DOM节点是从上到下解析并形成的，如果脚本在head就开始运行了，浏览器还没读到body，所以就不存在document.body。



## 3.2 子节点：childNodes，firstChild，lastChild

* 子节点含义：对应的直系子元素。它们被完全被嵌套在给定的元素中。例如`head`和`body`标签就是`html`元素的子元素。
* 子孙元素含义：嵌套在给定元素的所有元素，包括子元素以及子元素的子元素等。

如以下代码

```html
<html>
<body>
  <div>Begin</div>

  <ul>
    <li>
      <b>Information</b>
    </li>
  </ul>
</body>
</html>
```

body节点的子节点是div节点跟ul节点（包括一些空白空格的文本节点）

body的子孙元素是包含div、ul、li、b等子孙元素。

**查子节点**

我们可以用`childNodes`来列出所有子节点，包括文本节点。

```html
<html>
<body>
  <div>Begin</div>

  <ul>
    <li>Information</li>
  </ul>

  <div>End</div>

  <script>
    for (let i = 0; i < document.body.childNodes.length; i++) {
      alert( document.body.childNodes[i] ); // Text, DIV, Text, UL, ..., SCRIPT
    }
  </script>
  ...more stuff...
</body>
</html>
```

上面的代码会将body的所有子节点都打出来。

但不会打出`...more stuff ... `因为脚本运行时这个内容还没解析出来，所以浏览器读不到。

查第一个子节点：firstChild

查最后一个子节点：lastChild

查是否有子节点：node.hasChildNodes()

## 3.3 DOM集合

childNodes是一个伪数组，是部署了iterator接口的可迭代伪数组。

我们可以用for..of迭代它，但无法使用数组的方法。

不过我们可以用一些方法来让它使用数组的方法：

* `Array.from`、`[...childNodes]`变成真数组
* 用call、apply等方法

有几个注意点：

* DOM集合是只读的，我们不能用childNodes[i]=...的操作来替换一个子节点
* DOM集合是实时的，它反映DOM的当前状态
* 不要用for...in对集合进行迭代，原因是for..in会遍历所有可枚举（enumerable）属性。DOM集合中就有一些我们并不需要的这些属性会被for..in迭代到

## 3.4 兄弟节点和父节点

兄弟(Sibling)节点指的是有同一个父节点的节点。

```html
<html>
  <head>...</head><body>...</body>
</html>
```

* body是head的下一个兄弟节点

* head是body的前一个兄弟节点

父节点：parentNode

上一个兄弟节点：previousSibling

下一个兄弟节点：nextSibling

```javascript
console.log(document.body.parentNode.tagName) // HTML
console.log(document.head.nextSibling.tagName) // BODY
console.log(document.body.previousSibling.tagName) // HEAD
```

## 3.5 纯元素导航

childNodes中有很多节点，包括文本节点、元素节点、注释节点等。

但是有时候我们只想要元素节点。

以下就是纯元素节点的导航

<img src="assets/image-20211229153355775.png" alt="image-20211229153355775" style="zoom:50%;" />

这些纯元素节点跟上面的节点访问类似，区别在于需要添加`Element`

* Children —— 纯元素节点的子节点
* firstElementChild —— 第一个子元素节点
* lastElementChild —— 最后一个子元素节点
* previousElementSibling —— 上一个兄弟元素节点
* nextElementSibling —— 下一个兄弟元素节点
* parentElement —— 父元素节点



**parentElement和parentNode的区别**

从语义上来说parentElement是找父元素节点而parentNode是找父节点。

一般来说这两个是一样的，都是用于获取父节点。

不过出现这个API可能是由于`document.documentElement`的`parentElement`和`parentNode`不一致导致的

```javascript
document.documentElement.parentNode  // document
document.documentElement.parentElement  // null
```

因为html的父节点就是document对象

但是document并不是元素节点。

当我们希望从下到上遍历到html时，可能这个细节有用

```javascript
while(elem === elem.parentElement){ //向上遍历，直到html顶层
	...
}
```

## 3.6 特定的DOM属性

某些类型的DOM元素可能会提供特定于类型的其他属性。

比如表格（Table）

`<Table>`除了支持上面的基本属性，还额外支持以下属性：

* table.rows - `<tr>`元素的集合
* `table.caption/tHead/tFoot` - 引用表格的`<caption>``<thead>``<tfoot>`
* table.tBodies - `<tbody>`元素的集合

**`<thead>`，`<tfoot>`，`<tbody>`** 元素提供了 `rows` 属性：

* `tbody.rows` — 表格内部 `<tr>` 元素的集合。

**`<tr>`**：

- `tr.cells` — 在给定 `<tr>` 中的 `<td>` 和 `<th>` 单元格的集合。
- `tr.sectionRowIndex` — 给定的 `<tr>` 在封闭的 `<thead>/<tbody>/<tfoot>` 中的位置（索引）。
- `tr.rowIndex` — 在整个表格中 `<tr>` 的编号（包括表格的所有行）。

**`<td>` 和 `<th>`：**

* `td.cellIndex` — 在封闭的 `<tr>` 中单元格的编号。



## 3.7 小结

给定一个DOM节点，我们可以使用导航（navigation）属性 访问其直接的邻居

* 对于所有节点：parentNode、childNodes、firstChild、lastChild、nextSibling、previousSibling
* 对于所有元素节点：parentElement、children、firstElementChild、lastElementChild、nextElementSibling、previousElementSibling
* 有一些特定的元素还能有额外的属性



# 四、搜索DOM

## 4.1 搜索具有id的元素

`document.getElementById`或者只使用`id`

```javascript
document.getElementById('elem').style.background='red' // 通过getElementById搜索对应元素
// elem 是对带有 id="elem" 的 DOM 元素的引用
elem.style.background='red' // 也可以直接通过id访问
// id="elem-content" 内有连字符，所以它不能成为一个变量
// ...但是我们可以通过使用方括号 window['elem-content'] 来访问它
```

使用id方式直接访问dom是一种兼容性的支持，并不推荐在项目开发中使用。可以用于在元素来源非常明显且不会跟变量名重复的情况。（可用于写demo）

如果有具有相同名称的变量，那么则以变量名为优先。

> 保持id的唯一性，全局不要有重复的id，否则使用搜索API搜索某一个元素时，可能会随机返回另一个元素。
>
> document.getElementById只能被在document上调用，没有elem.getElementById

## 4.2 querySelectorAll

`querySelectorAll(css_selector)`方法可以搜索跟CSS选择器相匹配的**所有**元素。

 ` querySelector(css_selector)`方法可以搜索跟CSS选择器相匹配的第一个元素，相当于 `querySelectorAll(css_selector)[0]`

```html
  <ul>
    <li>The</li>
    <li>test</li>
  </ul>
  <ul>
    <li>has</li>
    <li>passed</li>
  </ul>
  <script>
    let elements = document.querySelectorAll('ul > li:last-child');
  
    for (let elem of elements) {
      alert(elem.innerHTML); // "test", "passed"
    }
    let element =document.querySelector('ul > li:last-child')
    alert(element.innerHTML) // "test"
  </script>
```

querySelector方法可以供elem调用

```html
    <div class="container">
      <div>123</div>
    </div>

    <script>
      let containerElem = document.querySelector(".container");
      let div = containerElem.querySelector("div");
      console.log(div.innerHTML); // 123
    </script>
```



## 4.3 getElementsBy*

旧的API中还有类似通过标签、类等查找节点的方法。`querySelector` 功能更强大，写起来更短，所以这些旧API通常在老代码中存在

* elem.getElementsByTagName(tag) 查询标签名的集合

  ```html
      <h1>
        This is a static template
      </h1>
      <script>
        const elem = document.getElementsByTagName("h1");
        console.log(elem[0].innerText);// This is a static template
      </script>
  ```

* elem.getElementsByClassName(className) 返回具有给定css类的元素

  ```html
      <h1 class="template">
        This is a static template
      </h1>
      <script>
        const elem = document.getElementsByClassName("template");
        console.log(elem[0].innerText);
      </script>
  ```

* document.getElementsByName(name) 返回在文档范围内具有给定name特性的元素。(很少用)

  ```html
      <form action="" name="form">
        <input type="text" />
      </form>
      <script>
        const elem = document.getElementsByName("form");
        console.log(elem[0].children);
      </script>
  ```

注意点：

* 不要忘记字母s
* 返回的是一个集合（伪数组）

## 4.4 实时的集合

所有的“getElementsBy*”返回的都是**实时**的集合。这样的集合始终反映的是文档的当前状态，并且在文档发生更改时会自动更新。

```html
    <div>First div</div>

    <script>
      let divByGetElements = document.getElementsByTagName("div");
      let divBySelector = document.querySelectorAll("div");
      console.log(divByGetElements.length); // 1
      console.log(divBySelector.length); // 1
    </script>

    <div>Second div</div>

    <script>
      console.log(divByGetElements.length); // 2
      console.log(divBySelector.length); // 1
    </script>
```

上面的例子中，通过两种方式搜索出来的div，在文档发生改变后，通过`getElementsBy*`获取的元素集合更新了，而通过`querySelector`获取的元素集合是**静态**的，不会实时更新。

## 4.5 matches

matches可以检查`elem`是否和css选择器相匹配。它返回布尔值。

当我们遍历元素时，可以用这个API过滤我们需要的元素

```javascript
<a href="http://example.com/file.zip">...</a>
<a href="http://ya.ru">...</a>

<script>
  // 不一定是 document.body.children，还可以是任何集合
  for (let elem of document.body.children) {
    if (elem.matches('a[href$="zip"]')) {
      alert("The archive reference: " + elem.href );
    }
  }
</script>
```



## 4.6 closest

`elem.closest(css_selector)`这个API可以返回最靠近的并且与css选择器相匹配的祖先。elem自己也会被搜索。

换句话说，方法`closest`在元素中得到了提升，并检查每个父级和自己。如果与css选择器相匹配，则会返回对应的祖先元素（包括自己）

```html
   <h1>这是外层元素</h1>
    <div>
      <ul>
        <li>li1</li>
        <li>li2</li>
        <li>li3</li>
      </ul>
    </div>
    <script>
      let elem = document.body.querySelector("li");
      console.log(elem.closest("li").innerHTML); // li1
      console.log(elem.closest("ul").tagName); // UL
      console.log(elem.closest("div").tagName); // DIV
      console.log(elem.closest("h1").tagName); // 找不到
    </script>
```

## 4.7 contains

`elemA.contains(elemB)`这个API可以用来检查元素A是否是另一个元素B的祖先（元素B是否在元素A内），它返回boolean值。

如果elemA===elemB，那么会返回true

```html
    <h1>这是外层元素</h1>
    <div>
      <ul>
        <li>li1</li>
        <li>li2</li>
        <li>li3</li>
      </ul>
    </div>
    <script>
      let divElem = document.body.querySelector("div");
      let h1Elem = document.body.querySelector("h1");
      let ulElem = divElem.querySelector("ul");
      let liElem = ulElem.querySelector("li");
      console.log(divElem.contains(ulElem)); // true
      console.log(divElem.contains(liElem)); // true
      console.log(ulElem.contains(liElem)); // true
      console.log(divElem.contains(h1Elem)); // false
    </script>
```

## 4.8 小结

在DOM中搜索节点，可以用以下方式：

| 方法名                 | 搜索方式     | 能够给元素调用 | 实时性 |
| ---------------------- | ------------ | -------------- | ------ |
| querySelector          | CSS-selector | ✅              | ❌      |
| querySelectorAll       | CSS-selector | ✅              | ❌      |
| getElementById         | id           | ❌              | ❌      |
| getElementsByTagName   | tag或者 *    | ✅              | ✅      |
| getElementsByClassName | class        | ✅              | ✅      |
| getElementsByName      | Name         | ❌              | ✅      |

最常用的是querySelector和querySelectorAll

此外：

`elem.matches(css_selector)`这个API用于检查elem与css选择器是否匹配

`elem.closest(css_selector)`这个API用于检查elem与css选择器相匹配的祖先（包括自己）

`elemA.contains(elemB)`这个API用于检查子级与父级的关系 —— 如果elemA包含elemB（或者相等），则返回true

