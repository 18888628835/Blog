# 模块简介

所谓的模块就是将普通代码、函数库、类等分拆成多个文件，一个文件就是一个模块。

由于一开始的 JavaScript 并没有语言级的模块系统（一开始的脚本代码相对简单），在 ES6之前，想要实现模块化是调用社区采用 JS 语法实现的各种模块方法库：

* AMD
* CommonJS
* UMD

在应用日益复杂的今天，ES6就推出其语言级别的模块系统Module，用来取代上述模块库。

# Module的使用

模块之前是可以相互加载的，这里有两个指令，import（导入）和 export（导出）。

```javascript
//index.js
export default function sayHi(user) {
  return `Hello, ${user}!`;
}
```

```html
<script type="module">
      import sayHi from "./index.js";
      document.body.innerHTML = sayHi("john");
</script>
```

> 由于模块支持特殊的关键字和功能，所以需要在`script`标签中采用`type='module`来告诉浏览器，以下代码需要用 module 的方式对待。

以上代码就实现了模块化，通过 import 导入入了另一个模块导出的`sayHi`方法。浏览器会自动获取并解析导入模块的代码，并运行该脚本。

# Module 核心

## 模块默认严格模式

在模块中，使用以严格模式`use strict`来对待代码

```javascript
<script type="module">
  a = 5; // error
</script>
```

以上代码会报错。

## 模块级作用域

**每个模块文件都有自己的顶级作用域**，各个模块间的顶级作用域间的变量是隔离开来，只能用关键指令访问。

```javascript
// hello.js
alert(user); // no such variable (each module has independent variables)
```

```javascript
//user.js
let user = "John";
```

```html
<!doctype html>
<script type="module" src="user.js"></script>
<script type="module" src="hello.js"></script>
```

上面的代码，index 和 user 模块是相互隔离的，所以在浏览器中，解析`user.js`模块并不能让其`user`对象被`index.js`模块使用。

我们只能使用关键指令来获取需要的变量

```javascript
// hello.js
import {user} from './user.js'
alert(user);
```

```javascript
//user.js
export let user = "John";
```

```html
<!doctype html>
<script type="module" src="hello.js"></script>
```

**这个特性也在浏览器中有所体现，`<script type="module">`中也存在独立的作用域**

```javascript
<script type="module">
  // 变量仅在这个 module script 内可见
  let user = "John";
</script>

<script type="module">
  alert(user); // Error: user is not defined
</script>
```

不过对于 `window`这个全局对象，每个模块间都是可以访问的。（但最好不要将变量存在 window 里）

## 模块代码仅在第一次导入时被解析

如果一个模块被导入到多个脚本文件中，那只有第一次被解析时创建，但会被分享给其他文件使用。（导入对象是唯一的）

我们假设一个模块导出了一个对象：

```javascript
// 📁 admin.js
export let admin = {
  name: "John"
};
```

如果这个模块被导入到多个文件中，模块仅在第一次被导入时被解析，并创建 `admin` 对象，然后将其传入到所有的导入。

所有的导入都只获得了一个唯一的 `admin` 对象：

```javascript
// 📁 1.js
import {admin} from './admin.js';
admin.name = "Pete";

// 📁 2.js
import {admin} from './admin.js';
alert(admin.name); // Pete

// 1.js 和 2.js 导入的是同一个对象
// 在 1.js 中对对象做的更改，在 2.js 中也是可见的
```

**导出的变量只被执行一次，然后它被分享给将其导入的文件。这一点非常重要。**

比如，下面的示例

```javascript
// 📁 admin.js
export let admin = { };

export function sayHi() {
  alert(`Ready to serve, ${admin.name}!`);
}
```

然后在 init.js 中生成 admin.name,

```javascript
// 📁 init.js
import {admin} from './admin.js';
admin.name = "Pete";
```

再被其他导入的模块使用，就可以看到，它已经发生变化了。（需要保证 init.js 加载的顺序在 admin.js 之后在其他文件之前）

```javascript
// 📁 other.js
import {admin, sayHi} from './admin.js';

alert(admin.name); // Pete

sayHi(); // Ready to serve, Pete!
```

## import.meta

`import.meta` 对象包含关于当前模块的信息。

它的内容取决于其所在的环境。在浏览器环境中，它包含当前脚本的 URL，或者如果它是在 HTML 中的话，则包含当前页面的 URL。

```html
<script type="module">
  alert(import.meta.url); // 脚本的 URL（对于内嵌脚本来说，则是当前 HTML 页面的 URL）
</script>
```

## 模块中,顶级this 是 undefined

在一个模块中，顶级 `this` 是 undefined。

将其与非模块脚本进行比较会发现，非模块脚本的顶级 `this` 是全局对象：

```html
<script>
  alert(this); // window
</script>

<script type="module">
  alert(this); // undefined
</script>
```

# 浏览器中对 Module 的处理

在浏览器中，`type="module"`除了告知浏览器需要加载和解析 import 和 export 指令外，还有以下拓展

## 模块是延时的

与`defer`特性类似，模块脚本是延时的，这代表：

* 下载外部模块脚本 `<script type="module" src="...">` 不会阻塞 HTML 的处理，它们会与其他资源并行加载。
* 模块脚本会等到 HTML 文档完全准备就绪（即使它们很小并且比 HTML 加载速度更快），然后才会运行。
* 保持脚本的相对顺序：在文档中排在前面的脚本先执行。

由于模块脚本是等 html加载后才延时运行的，所以总是能够读到 html 中的元素。

```javascript
<script type="module">
  alert(typeof button); // object：脚本可以“看见”下面的 button
  // 因为模块是被延迟的（deferred，所以模块脚本会在整个页面加载完成后才运行
</script>

相较于下面这个常规脚本：

<script>
  alert(typeof button); // button 为 undefined，脚本看不到下面的元素
  // 常规脚本会立即运行，常规脚本的运行是在在处理页面的其余部分之前进行的
</script>

<button id="button">Button</button>
```

常规版本的`script`会先于`html`标签运行，因为其顺序在 HTML 之上。

`module`版本的`script`标签虽然在`html`之上,但是其只会同步下载,而晚执行,所以可以获取到`dom`。

上面代码执行的顺序是

常规版本 `script`> `HTML`> `module` 版本 `script`

## 在内联模块脚本中使用 async 属性

如果没加`type="module"`,那么 script 标签中的 async 只适用于外部脚本。它相当于一个异步脚本,独立于其他脚本或者HTML 文档.

这个属性适用于模块脚本中的内联脚本。

下面的内联脚本具有 `async` 特性，因此它不会等待任何东西。

```html
<!-- 所有依赖都获取完成（analytics.js）然后脚本开始运行 -->
<!-- 不会等待 HTML 文档或者其他 <script> 标签 -->
<script async type="module">
  import {counter} from './analytics.js';

  counter.count();
</script>
```

## 外部脚本规则

具有 `type="module"` 的外部脚本（external script）在两个方面有所不同：

1. 具有相同 `src` 的外部脚本仅运行一次：

   ```javascript
   <!-- 脚本 my.js 被加载完成（fetched）并只被运行一次 -->
   <script type="module" src="my.js"></script>
   <script type="module" src="my.js"></script>
   ```

2. 从另一个源（例如另一个网站）获取的外部脚本需要 [CORS](https://developer.mozilla.org/zh/docs/Web/HTTP/CORS) header,换句话说，如果一个模块脚本是从另一个源获取的，则远程服务器必须提供表示允许获取的 header `Access-Control-Allow-Origin`。

   ```javascript
   <!-- another-site.com 必须提供 Access-Control-Allow-Origin -->
   <!-- 否则，脚本将无法执行 -->
   <script type="module" src="http://another-site.com/their.js"></script>
   ```

## 不允许裸模块

在浏览器中，`import` 必须给出相对或绝对的 URL 路径。没有任何路径的模块被称为“裸（bare）”模块。在 `import` 中不允许这种模块。

例如，下面这个 `import` 是无效的：

```JavaScript
import {sayHi} from 'sayHi'; // Error，“裸”模块
// 模块必须有一个路径，例如 './sayHi.js' 或者其他任何路径
```

某些环境，像 Node.js 或者打包工具（bundle tool）允许没有任何路径的裸模块，因为它们有自己的查找模块的方法和钩子（hook）来对它们进行微调。但是浏览器尚不支持裸模块。

## 兼容性

旧时的浏览器不理解 `type="module"`。未知类型的脚本会被忽略。对此，我们可以使用 `nomodule` 特性来提供一个后备:

```javascript
<script type="module">
  alert("Runs in modern browsers");
</script>

<script nomodule>
  alert("Modern browsers know both type=module and nomodule, so skip this")
  alert("Old browsers ignore script with unknown type=module, but execute this.");
</script>
```

# 打包工具

实际开发中,很少使用原始的浏览器模块来开发,而是使用打包工具来帮助我们完成。例如 webpack 等

使用打包工具的一个好处是 —— 它们可以更好地控制模块的解析方式，允许我们使用裸模块和更多的功能，例如 CSS/HTML 模块等。

打包工具做以下内容

1. 从一个打算放在 HTML 中的 `<script type="module">` “主”模块开始。

2. 分析它的依赖：它的导入，以及它的导入的导入等。

3. 使用所有模块构建一个文件（或者多个文件，这是可调的），并用打包函数（bundler function）替代原生的 `import` 调用，以使其正常工作。还支持像 HTML/CSS 模块等“特殊”的模块类型。

4. 在处理过程中，可能会应用其他转换和优化：

   - 删除无法访问的代码。
   - 删除未使用的导出（“tree-shaking”）。
   - 删除特定于开发的像 `console` 和 `debugger` 这样的语句。
   - 可以使用 [Babel](https://babeljs.io/) 将前沿的现代的 JavaScript 语法转换为具有类似功能的旧的 JavaScript 语法。
   - 压缩生成的文件（删除空格，用短的名字替换变量等）。

   如果我们使用打包工具，那么脚本会被打包进一个单一文件（或者几个文件），在这些脚本中的 `import/export` 语句会被替换成特殊的打包函数（bundler function）。因此，最终打包好的脚本中不包含任何 `import/export`，它也不需要 `type="module"`，我们可以将其放入常规的 `<script>`：

   ```html
   <!-- 假设我们从诸如 Webpack 这类的打包工具中获得了 "bundle.js" 脚本 -->
   <script src="bundle.js"></script>
   ```

   # 总结

   1. 一个模块就是一个文件,浏览器需要用`<script type="module">` 以使 `import/export` 可以工作
   2. 一个模块脚本对于常规脚本有以下区别:
      * 延迟解析
      * Async 可以用于内联脚本
      * 要从另一个源(域/协议/端口)加载外部脚本,需要支持CORS header
      * 重复的外部脚本会被忽略(src 一致)
   3. 模块具有自己的顶级作用域,不同模块间互相分离,只能通过 `import/export` 关键指令获取
   4. 模块使用采用`use strict`模式
   5. 模块代码只执行一次,导出时仅创建一次
   6. 浏览器会自动加载并解析我们导入导出的模块
   7. 在生产环境,Webpack 这类打包工具会将模块打包在一起,它们的内部实现并不一定用 Module 形式,而是采用自身实现的bundler 函数来取代`import/export`。同时打包工具自身也会管理变量间导入导出的关系。

