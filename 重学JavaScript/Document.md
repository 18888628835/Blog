# 一、浏览器环境和规格

一开始JavaScript是为浏览器创建的语言，现在它已经能够在多平台运行的语言了。

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