# 一、鼠标事件

鼠标事件不单单来自于鼠标，还可能来自手机或平板，它们对此类操作进行了模拟以实现兼容。

## 1.1 鼠标事件类型

```
mousedown/mouseup
```

在元素上点击/释放鼠标按钮。

```
mouseover/mouseout
```

鼠标指针从一个元素上移入/移出。

```
mousemove
```

鼠标在元素上的每个移动都会触发此事件。

```
click
```

如果使用的是鼠标左键，则在同一个元素上的 `mousedown` 及 `mouseup` 相继触发后，触发该事件。

```
dblclick
```

在短时间内双击同一元素后触发。如今已经很少使用了。

```
contextmenu
```

在鼠标右键被按下时触发。还有其他打开上下文菜单的方式，例如使用特殊的键盘按键，在这种情况下它也会被触发，因此它并不完全是鼠标事件。

## 1.2 事件顺序

一个操作可能会触发多个事件。

在单动作触发多个事件时，事件是固定的，例如鼠标被按下时，会触发`mousedown`—> `mouseup` —>`click`的顺序。

## 1.3 鼠标按钮属性

与点击相关的事件中有一个`event.button`属性，这个属性可以知道用户具体点击了哪个鼠标按钮。

一般来说，我们不会在`click`和`contextmenu`事件中使用，因为我们已经知道了，前者用的是左键，后者用的是右键。

但是`mousedown`和`mouseup`事件中则可能需要用到这个属性，因为不管用户点到哪个键，都会触发这两个事件，所以我们需要知道用户到底按的是鼠标的哪个按钮。

`event.button` 的所有可能值如下：

| 鼠标按键状态     | `event.button` |
| :--------------- | :------------- |
| 左键 (主要按键)  | 0              |
| 中键 (辅助按键)  | 1              |
| 右键 (次要按键)  | 2              |
| X1 键 (后退按键) | 3              |
| X2 键 (前进按键) | 4              |

还有一个 `event.buttons` 属性，其中以整数的形式存储着当前所有按下的鼠标按键。



## 1.4 组合键

鼠标是可以跟键盘按键组合的，鼠标事件中会包含组合键的信息

- `shiftKey`：Shift
- `altKey`：Alt（或对于 Mac 是 Opt）
- `ctrlKey`：Ctrl
- `metaKey`：对于 Mac 是 Cmd,**在 Mac 上我们通常使用** `Cmd` **代替** `Ctrl`

如果在事件期间按下了相应的键，则它们为 `true`。

比如，下面这个按钮仅在 Alt+Shift+click 时才有效:

```html
<button id="button">Alt+Shift+Click on me!</button>

<script>
  button.onclick = function(event) {
    if (event.altKey && event.shiftKey) {
      alert('Hooray!');
    }
  };
</script>
```

## 1.5 鼠标坐标：clientX/Y，pageX/Y

1. 相对于窗口的坐标：`clientX` 和 `clientY`。
2. 相对于文档的坐标：`pageX` 和 `pageY`。



## 1.6 防止在鼠标按下时的选择

双击鼠标后它会选择文本。

如果按下鼠标左键，不松开的情况下移动鼠标，也会选择文本。

如果不想要这种默认行为，最合理的方式是防止浏览器对`mousedown`进行操作的默认行为。

```javascript
      elem.addEventListener("mousedown", function (event) {
        //这样就不会对文本选择
        event.preventDefault();
      });
```

## 1.7 防止复制

如果我们允许用户选择文本，但是不允许用户复制内容，我们可以用另外一个事件：`copy`

在`copy`事件上禁止默认行为就可以保护页面内容不被复制。

```javascript
      elem.addEventListener("copy", function (event) {
        event.preventDefault();
      });
```

> 当然，用户如果打开开发者工具还是可以复制的...

## 1.8 小结

鼠标有以下属性：

* `button` —用户点的是鼠标的哪个键
* 组合键，如果按下则为`true`：`altKey`，`ctrlKey`，`shiftKey` 和 `metaKey`（Mac）。
  * `mac`下的`metaKey`等于`window`下的`ctrlKey`

* 文档坐标`pageX/Y`
* 窗口坐标`clientX/Y`

`mousedown` 的默认浏览器操作是文本选择，如果不想要，则可以取消这个默认行为。

# 二、移动鼠标

## 2.1 事件mouseover/mouseout，relatedTarget

1. `mouseover` ：鼠标指针移动上去触发
2. `mouseout`：鼠标指针移动出去触发

![image-20220113182656466](../assets/image-20220113182656466.png)

这些事件很特别，因为它们具有`relatedTarget`属性。这个属性是对`target`的补充。

当鼠标从一个元素离开去另一个元素时，其中一个元素就变成了`target`，另一个就变成了`relatedTarget`。

对于`mouseover`：

* `event.target` —— 是鼠标移过的那个元素。
* `event.relatedTarget` —— 是鼠标来自的那个元素（`relatedTarget` → `target`）。

`mouseout`则刚好相反：

* `event.target` —— 是鼠标移出的那个元素。
* `event.relatedTarget` —— 是鼠标当前移动到那个元素（`target` → `relatedTarget`）。

这很合理，当鼠标移入`a`元素时，此时触发`mouseover`事件，`target`自然是当前`a`元素。

当鼠标从`a`元素转为移入`b`元素时，对`a`来说，触发了`mouseout`事件，对`b`来说，触发了`mouseover`事件，所以`mouseout`下的`target`就是`a`，`mouseover`（此时为`b`元素触发的事件）中的`relatedTarget`则是`a`。

`relatedTarget`可以是`null`，比如鼠标来自窗口之外，或者离开了窗口。

## 2.2 跳过元素

当鼠标移动时，会触发`mousemove`事件。但不意味着每个元素都会导致一个事件。

浏览器会一直检查鼠标的位置，如果发生了变化，就会触发事件。

如果访问者非常快速地移动鼠标，那么某些DOM元素就可能被跳过。

![image-20220113210839143](../assets/image-20220113210839143.png)

如果鼠标从上图所示的 `#FROM` 快速移动到 `#TO` 元素，则中间的 `<div>`（或其中的一些）元素可能会被跳过。`mouseout` 事件可能会在 `#FROM` 上被触发，然后立即在 `#TO` 上触发 `mouseover`。

这对性能有好处，因为可能有很多中间元素，我们并不想真的要处理每一个移入和离开的过程。

鼠标指针并不会访问所有元素，它可以跳过一些元素。

因此，当鼠标从窗口外调到页面中间，这种情况下，`relatedTarget`就可能是`null`。

![image-20220113211051142](../assets/image-20220113211051142.png)

在鼠标快速移动下，中间元素可能会被忽略。但如果`mouseover`被触发了，当鼠标离开元素时，则一定会有`mouseout`事件

## 2.3 当移动到一个子元素时 mouseout

`mouseout`有一个重要的知识点——当鼠标指针从元素移动到其后代的时候会触发，例如下面这个结构，从`#parent`到`#child`：

```html
<div id="parent">
  <div id="child">...</div>
</div>
```

如果我们在`#parent`上，将鼠标指针移到`#child`上，`#parent`会得到一个`mouseout`事件。

![image-20220113211850836](../assets/image-20220113211850836.png)

根据浏览器的逻辑，鼠标指针可能随时位于单个元素上 —— 嵌套最多的那个元素（或z-index最大的那个）。

因此，如果他转到另一个元素（可能是后代），那么它将离开前一个元素。

这里的事件处理有一个重要的细节：

后代的`mouseover`事件会冒泡。因此如果`#parent`具有`mouseover`处理程序，它也将被触发。

![image-20220113212116987](../assets/image-20220113212116987.png)

所以当鼠标移动到`#child`时，会触发`#parent`的`moustout`事件和`mouseover`事件

我们并不希望发生这种情况，我们可以通过检查`relatedTarget`来避免这种事的发生。

但还有一种更好的方式：`mouseenter`和`mouseleave`事件，它们没有这样的问题。

## 2.4 mouseenter和mouseleave

当鼠标指针进入一个元素时 —— 会触发 `mouseenter`。而鼠标指针在元素或其后代中的确切位置无关紧要。

当鼠标指针离开该元素时，事件 `mouseleave` 才会触发。

这两个事件跟`mouseover`和`mouseleave`差不多，但它们有以下区别：

* 在元素内部与后代之间的转换不会有影响
* 不会冒泡

当鼠标移入子元素时，就算此时触发了子元素的`mouseenter`，但是并不会冒泡给父元素。

## 2.5 事件委托

由于`mouseenter`和`mouseleave`并不会冒泡，所以我们不能用它们来进行事件委托。

但如果我们一定要用到事件委托，就只能够用`mouseover`和`mouseout`来做额外的处理。

[这里有个例子](https://zh.javascript.info/mousemove-mouseover-mouseout-mouseenter-mouseleave#shi-jian-wei-tuo)

## 2.6 小结

1. 快速地鼠标移动可能会忽略掉某些元素
2. `mouseover/out`和`mouseenter/leave`事件还有一个附加属性：`relatedTarget`。
3. 如果我们从父元素转到子元素，也会触发`mouseover/out`事件。浏览器假定鼠标一次只会在最深的那个元素。
4. `mouseenter/leave`跟`over/out`不同，它们仅在鼠标进入和离开时才会触发。它们并不会冒泡。