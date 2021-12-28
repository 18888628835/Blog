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

<svg width="690" height="320"><g transform="translate(20,30)"><path class="link" d="M7,0L7,30L57,30" style="fill: none; stroke: rgb(190, 195, 199); stroke-width: 1px;"></path><path class="link" d="M7,0L7,150L57,150" style="fill: none; stroke: rgb(190, 195, 199); stroke-width: 1px;"></path><path class="link" d="M7,0L7,180L57,180" style="fill: none; stroke: rgb(190, 195, 199); stroke-width: 1px;"></path><path class="link" d="M57,30L57,60L107,60" style="fill: none; stroke: rgb(190, 195, 199); stroke-width: 1px;"></path><path class="link" d="M57,30L57,90L107,90" style="fill: none; stroke: rgb(190, 195, 199); stroke-width: 1px;"></path><path class="link" d="M57,30L57,120L107,120" style="fill: none; stroke: rgb(190, 195, 199); stroke-width: 1px;"></path><path class="link" d="M57,180L57,210L107,210" style="fill: none; stroke: rgb(190, 195, 199); stroke-width: 1px;"></path><g class="node" transform="translate(0,0)" style="opacity: 1;"><rect y="-12.5" x="-5" rx="4" ry="4" height="25" width="280" style="fill: rgb(206, 224, 244); cursor: pointer;"></rect><text dy="4.5" dx="3.5" style="fill: black; pointer-events: none;">▾ </text><text dy="4.5" dx="16.5" style="font: 14px Consolas, &quot;Lucida Console&quot;, Menlo, Monaco, monospace; fill: rgb(51, 51, 51); pointer-events: none;">HTML</text></g><g class="node" transform="translate(50,30)" style="opacity: 1;"><rect y="-12.5" x="-5" rx="4" ry="4" height="25" width="280" style="fill: rgb(206, 224, 244); cursor: pointer;"></rect><text dy="4.5" dx="3.5" style="fill: black; pointer-events: none;">▾ </text><text dy="4.5" dx="16.5" style="font: 14px Consolas, &quot;Lucida Console&quot;, Menlo, Monaco, monospace; fill: rgb(51, 51, 51); pointer-events: none;">HEAD</text></g><g class="node" transform="translate(50,150)" style="opacity: 1;"><rect y="-12.5" x="-5" rx="4" ry="4" height="25" width="280" style="fill: rgb(255, 222, 153); cursor: pointer;"></rect><text dy="4.5" dx="3.5" style="fill: black; pointer-events: none;"></text><text dy="4.5" dx="5.5" style="font: 14px Consolas, &quot;Lucida Console&quot;, Menlo, Monaco, monospace; fill: rgb(51, 51, 51); pointer-events: none;">#text ↵␣␣</text></g><g class="node" transform="translate(50,180)" style="opacity: 1;"><rect y="-12.5" x="-5" rx="4" ry="4" height="25" width="280" style="fill: rgb(206, 224, 244); cursor: pointer;"></rect><text dy="4.5" dx="3.5" style="fill: black; pointer-events: none;">▾ </text><text dy="4.5" dx="16.5" style="font: 14px Consolas, &quot;Lucida Console&quot;, Menlo, Monaco, monospace; fill: rgb(51, 51, 51); pointer-events: none;">BODY</text></g><g class="node" transform="translate(100,60)" style="opacity: 1;"><rect y="-12.5" x="-5" rx="4" ry="4" height="25" width="280" style="fill: rgb(255, 222, 153); cursor: pointer;"></rect><text dy="4.5" dx="3.5" style="fill: black; pointer-events: none;"></text><text dy="4.5" dx="5.5" style="font: 14px Consolas, &quot;Lucida Console&quot;, Menlo, Monaco, monospace; fill: rgb(51, 51, 51); pointer-events: none;">#text ↵␣␣␣␣</text></g><g class="node" transform="translate(100,90)" style="opacity: 1;"><rect y="-12.5" x="-5" rx="4" ry="4" height="25" width="280" style="fill: rgb(206, 224, 244); cursor: pointer;"></rect><text dy="4.5" dx="3.5" style="fill: black; pointer-events: none;">▸ </text><text dy="4.5" dx="16.5" style="font: 14px Consolas, &quot;Lucida Console&quot;, Menlo, Monaco, monospace; fill: rgb(51, 51, 51); pointer-events: none;">TITLE</text></g><g class="node" transform="translate(100,120)" style="opacity: 1;"><rect y="-12.5" x="-5" rx="4" ry="4" height="25" width="280" style="fill: rgb(255, 222, 153); cursor: pointer;"></rect><text dy="4.5" dx="3.5" style="fill: black; pointer-events: none;"></text><text dy="4.5" dx="5.5" style="font: 14px Consolas, &quot;Lucida Console&quot;, Menlo, Monaco, monospace; fill: rgb(51, 51, 51); pointer-events: none;">#text ↵␣␣</text></g><g class="node" transform="translate(100,210)" style="opacity: 1;"><rect y="-12.5" x="-5" rx="4" ry="4" height="25" width="280" style="fill: rgb(255, 222, 153); cursor: pointer;"></rect><text dy="4.5" dx="3.5" style="fill: black; pointer-events: none;"></text><text dy="4.5" dx="5.5" style="font: 14px Consolas, &quot;Lucida Console&quot;, Menlo, Monaco, monospace; fill: rgb(51, 51, 51); pointer-events: none;">#text ↵␣␣The truth about elk.</text></g></g></svg>

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