# 弹窗和 window 的方法

使用下面的方法可以打开一个新的弹窗，大多数浏览器都是新建一个选项卡，并打开`url`

```javascript
window.open('https://xxx')
```

弹窗是一种在不关闭主窗口的情况下显示其他内容的设计。

> 现在更普遍的方法是，使用 ajax 请求到内容，然后将其动态加载到`<div>`中。

## 阻止弹窗

现代浏览器会通过阻止弹窗来保护用户以避免恶意网站滥用弹窗，比如推送广告。

**如果弹窗是在用户触发的事件处理程序（如 `onclick`）之外调用的，大多数浏览器都会阻止此类弹窗。**

例如：

```javascript
// 弹窗被阻止
window.open('https://javascript.info');

// 弹窗被允许
button.onclick = () => {
  window.open('https://javascript.info');
};
```

不过还是有一些方法可以绕过这种机制，比如在`setTimeout`之后调用

```javascript
// 3 秒后打开弹窗
setTimeout(() => window.open('http://google.com'), 1000);
```

## window.open

这个函数的语法是`window.open(url, name, params)`

* url 是新窗口要加载的 URL。第一个参数是`/`就会直接将当前窗口的`origin`放到新的弹窗中。

* name 新窗口的名称。每个窗口都有一个 `window.name`，在这里我们可以指定哪个窗口用于弹窗。如果已经有了一个这样的名字的窗口，就在这个窗口打开URL。

* params 新窗口的配置字符串。它包括设置，用逗号分割，参数之间不能有空格，例如 `width=20,height=100`

  `params`的设置项如下：

  * 位置
    * `left/top` ——屏幕上窗口的左上角坐标。这里的限制是新窗口不能超到屏幕外边去
    * `width/height` —— 新窗口的宽度和高度。宽高的最小值是有限制的。
  * 窗口功能（yes/no）
    * `menubar` —— 显示或隐藏新窗口的浏览器菜单。
    * `toolbar` ——显示或隐藏新窗口的浏览器导航栏（后退，前进，重新加载等）。 
    * `location` ——  显示或隐藏新窗口的 URL 字段。Firefox 和 IE 浏览器不允许默认隐藏它。
    * `status` —— 显示或隐藏状态栏。同样，大多数浏览器都强制显示它。
    * `resizable` —— 允许禁用新窗口大小调整。不建议使用。
    * `scrollbars` —— 允许禁用新窗口的滚动条。不建议使用。



## 示例

在浏览器中运行以下代码

```javascript
let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=600,height=300,left=100,top=100`;

open('/', 'test', params);
```

它会打开一个宽 600、高 300，距离左边和最右边都是 100 的新窗口。这个新窗口会隐藏某些窗口功能。



## 访问弹窗

`open`方法调用会返回对新窗口的引用，这样我们就可以用来操作新的弹窗的属性，可以更改它的位置等等操作。

比如以下方法打开一个空弹窗。并在上面写一些内容：

```javascript
let newWin = window.open("about:blank", "hello", "width=200,height=200");

newWin.document.write("Hello, world!");
```

当我们要对新窗口进行操作时，应该在某些页面的生命周期下进行，因为我们可能需要等他完全加载完成。

比如：

```javascript
let newWindow = open('/', 'example', 'width=300,height=300')
newWindow.focus();

alert(newWindow.location.href); // (*) about:blank，加载尚未开始

newWindow.onload = function() {
  let html = `<div style="font-size:30px">Welcome!</div>`;
  newWindow.document.body.insertAdjacentHTML('afterbegin', html);
};
```

上面的代码中，我们在监听弹窗的`onload`事件来插入一段 HTML 到body 中，否则可能无法成功，因为页面可能没有加载完成。

也可以使用`window.DOMContentLoaded` 等待 DOM 树构建完成了再做操作。

> 只有在窗口是同源的时，窗口才能自由访问彼此的内容（`相同的协议://domain:port`）。
>
> 否则，例如，如果主窗口来自于 `site.com`，弹窗来自于 `gmail.com`，则处于安全性考虑，这两个窗口不能访问彼此的内容。



## 弹窗访问当前窗口

窗口之间的连接是双向的：主窗口和弹窗之间可以互相引用。

在弹窗中可以使用`window.opener`来访问当前打开弹窗的那个窗口。

比如下面的代码，会打开一个弹窗，然后在弹窗中插入一段脚本，脚本的内容是将当前窗口的所有内容替换成`Test`

```javascript
let newWin = window.open("about:blank", "hello", "width=200,height=200");

newWin.document.write(
  "<script>window.opener.document.body.innerHTML = 'Test'<\/script>"
);
```

## 关闭弹窗

关闭一个窗口：`win.close()`

查看窗口是否被关闭：`win.closed`

以下代码会先加载再关闭弹窗

```javascript
let newWindow = open('/', 'example', 'width=300,height=300');

newWindow.onload = function() {
  newWindow.close();
  alert(newWindow.closed); // true
};
```

如果窗口被关闭了，那么 `closed` 属性则为 `true`。



## 滚动和调整大小

```
win.moveBy(x,y)
```

将窗口相对于当前位置向右移动 `x` 像素，并向下移动 `y` 像素。允许负值（向上/向左移动）。

```
win.moveTo(x,y)
```

将窗口移动到屏幕上的坐标 `(x,y)` 处。

```
win.resizeBy(width,height)
```

根据给定的相对于当前大小的 `width/height` 调整窗口大小。允许负值。

```
win.resizeTo(width,height)
```

将窗口调整为给定的大小。

还有 `window.onresize` 事件。

> 上面的方法仅对于弹窗
>
> JavaScript 无法最小化或者最大化一个窗口。这些操作系统级别的功能对于前端开发者而言是隐藏的。
>
> 移动或者调整大小的方法不适用于最小化/最大化的窗口。



## 滚动窗口

- `win.scrollBy(x,y)`

  相对于当前位置，将窗口向右滚动 `x` 像素，并向下滚动 `y` 像素。允许负值。

- `win.scrollTo(x,y)`

  将窗口滚动到给定坐标 `(x,y)`。

- `elem.scrollIntoView(top = true)`

  滚动窗口，使 `elem` 显示在 `elem.scrollIntoView(false)` 的顶部（默认）或底部。

这里也有 `window.onscroll` 事件。



## 弹窗聚焦/失焦

使用 `window.focus()` 和 `window.blur()` 方法可以使窗口获得或失去焦点。

这里还有 `focus/blur` 事件，可以捕获到访问者聚焦到一个窗口和切换到其他地方的时刻。

但浏览器也做了某些限制，以防止某些网站的恶意行为，比如：

```javascript
window.onblur = () => window.focus();
```

当用户从当前窗口切出去时，这段代码会让用户又重新回到窗口，因此，浏览器做了很多限制，以禁用此类代码。

不过有些情况下，弹窗聚焦/失焦很有用：

* 当我们打开一个弹窗时，在它上面执行`newWindow.focus()`是好主意，它可以确保用户现在就位于新窗口中。
* 如果我们想要追踪用户何时在实际使用我们的 web应用程序，我们可以跟踪`window.onfocus/onblur`。这使我们可以暂停/恢复页面活动和动画等。但是请注意，`blur` 事件意味着访问者从窗口切换了出来，但他们仍然可以观察到它。窗口处在背景中，但可能仍然是可见的。



## 总结

如果我们要打开一个弹窗，将其告知用户是一个好的实践。在链接或按钮附近的“打开窗口”图标可以让用户免受焦点转移的困扰，并使用户知道点击它会弹出一个新窗口。

- 可以通过 `open(url, name, params)` 调用打开一个弹窗。它会返回对新打开的窗口的引用。
- 浏览器会阻止来自用户行为之外的代码中的 `open` 调用。通常会显示一条通知，以便用户可以允许它们。
- 默认情况下，浏览器会打开一个新标签页，但如果提供了窗口参数，那么浏览器将打开一个弹窗。
- 弹窗可以使用 `window.opener` 属性访问 opener 窗口（即打开弹窗的窗口）。
- 如果主窗口和弹窗同源，那么它们可以彼此自由地读取和修改。否则，它们可以更改彼此的地址（location），[交换消息](https://zh.javascript.info/cross-window-communication)。
- 要关闭弹窗：使用 `close()` 调用。用户也可以关闭弹窗（就像任何其他窗口一样）。关闭之后，`window.closed` 为 `true`。
- `focus()` 和 `blur()` 方法允许聚焦/失焦于窗口。但它们并不是一直都有效
- `focus`和 `blur` 事件允许跟踪窗口的切换。但是请注意，在 `blur` 之后，即使窗口在背景状态下，窗口仍有可能是可见的。