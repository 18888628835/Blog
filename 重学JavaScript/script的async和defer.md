# 脚本加载

当浏览器加载文档流时,如果遇到`script`,就会马上去执行这个脚本里的内容,因为有可能脚本中的代码会修改 DOM,为了让浏览器顺利构建 DOM 树,这样的做法无可厚非。

当执行完脚本内的代码后，浏览器再接着处理剩下的文档内容。

但这样会导致两个重要的问题

- `script`内可能要访问位于它下面的 DOM 元素
- 如果页面中的 `script`内容很大,就会阻塞页面。因为浏览器要花很长事件去执行脚本中的代码。此时渲染引擎无法工作

```html
<p>...content before script...</p>

<script src="https://javascript.info/article/script-async-defer/long.js?speed=1"></script>

<!-- 下面的代码没办法被上面的 script 访问到,并且上面的脚本执行过慢 就会阻塞页面-->
<p>...content after script...</p>
```

这里有一些解决方法,比如把脚本放在页面的最底部

```html
<body>
  ...all content is above the script...

  <script src="https://javascript.info/article/script-async-defer/long.js?speed=1"></script>
</body>
```

这样的做法虽然有效,但是一旦碰到和 HTML 很长的文档,浏览器会下载完文档才加载这个脚本,并且开始下载它,这样可能会造成明显的延迟。

有没有可能有更好地解决方法呢?

这里就要提到 `script`的特性: defer 和 async

# defer

`defer`特性告诉浏览器,不要等待 `script`而是先去处理 HTML,构建 DOM。脚本会在后台下载,然后等到 DOM 构建完成后,脚本才会执行。

- **defer 并不会阻塞页面**

如果把上面的代码这样改掉,就会发现页面会先把所有 DOM 都渲染出来,最后执行脚本

```html
<p>...content before script...</p>

<script
  defer
  src="https://javascript.info/article/script-async-defer/long.js?speed=1"
></script>

<!-- 下面的代码没办法被上面的 script 访问到,并且上面的脚本执行过慢 就会阻塞页面-->
<p>...content after script...</p>
```

- defer 总是要等 DOM 解析完毕,但是在 DOMContentLoaded 生命周期前执行

```html
<p>...content before scripts...</p>

<script>
  document.addEventListener('DOMContentLoaded', () =>
    alert('DOM ready after defer!')
  );
</script>

<script
  defer
  src="https://javascript.info/article/script-async-defer/long.js?speed=1"
></script>

<p>...content after scripts...</p>
```

上面的代码会先执行 defer 脚本中的代码,再执行`DOMContentLoaded`事件中的代码。

- **defer 脚本保持其相对顺序,在前面的先执行,在后面的后执行**

```html
<script
  defer
  src="https://javascript.info/article/script-async-defer/before.js"
></script>
<script
  defer
  src="https://javascript.info/article/script-async-defer/after.js"
></script>
```

`before.js`和 `after.js`会并行在后台下载,但是等构建完 DOM 后,先执行 `before`脚本中的代码,再执行`after.js`

即使有可能 `after.js`先下载完成,也不会影响加载顺序。

- **如果 `script` 属性没有 `src`,换言之它并不是外部引入的脚本,那浏览器会忽略 defer 属性。**

# async

`async`意思是异步,它跟`defer`一样,也不会阻塞页面。但是它们的行为有很大区别

- 异步脚本不会等其他脚本加载完成，它是完全独立的。
- 异步脚本不会等待`DOMContentLoader`,所以它可能在之前执行,也可能在之后执行

换句话说,异步脚本也会在后台下载,它会在加载就绪时运行,不会等待 DOM 和其他脚本。

下面是一个例子

```html
<p>...content before scripts...</p>

<script>
  document.addEventListener('DOMContentLoaded', () => alert('DOM ready!'));
</script>

<script
  async
  src="https://javascript.info/article/script-async-defer/long.js"
></script>
<script
  async
  src="https://javascript.info/article/script-async-defer/small.js"
></script>

<p>...content after scripts...</p>
```

- 你会先看到页面出现内容,因为这过程很快。过程中有`async`属性的`script`在浏览器加载 DOM 过程中会并行下载
- 其次你会看到"DOM ready!",因为 DOM 构建完成了,而它也不会等 `async`脚本,这与`defer` 就不同
- 两个`async`脚本会并行下载,虽然顺序上 `long`在上面,但由于`small`更快,所以它先执行

这样的属性比较适合放一些跟页面主程序关系不大的内容,比如说投放广告,因为它并不依赖我们的脚本,我们的脚本也并不需要等待它们。

# 动态脚本

还有一种方式可以给页脚添加脚本,它也是异步的:

我们可以使用 JavaScript 动态创建一个脚本,并将其添加到文档中

```javascript
let script = document.createElement('script');
script.src = '/article/script-async-defer/long.js';
document.body.append(script); // (*)
```

当脚本被附加到文档时,会立即开始下载

**默认情况下,它也是异步的,它默认带有 async 属性**

也就是说:

- 它不会阻塞页面,也不会等待任何东西
- 加载优先顺序(先加载好先执行)

如果我们将其设置为`script.async=false`,那么就可以改变这个规则。

它会变得跟`defer`一样,会推迟到`DOM` 构建完成,`DOMContentLoaded` 前执行,并且按照文档顺序执行。

```javascript
function loadScript(src) {
  let script = document.createElement('script');
  script.src = src;
  script.async = false;
  document.body.append(script);
}

// long.js 先执行，因为代码中设置了 async=false
loadScript('/article/script-async-defer/long.js');
loadScript('/article/script-async-defer/small.js');
```

上面的代码跟`defer`规则一样,如果没有设置`script.async = false`,那么大概率是`small.js`先执行,因为它可能先加载完成。

# 总结

`defer`和`async`的共同点是:都不会阻塞页面的渲染,都会在后台同步并行下载。

|       | 语义 | 顺序         | 与DOMContentLoaded的关系                      |
| ----- | ---- | ------------ | --------------------------------------------- |
| defer | 推迟 | 文档顺序优先 | DOM 构建完成后,在`DOMContentLoaded`生命周期前 |
| async | 异步 | 加载顺序优先 | 不会等待任何东西                              |

