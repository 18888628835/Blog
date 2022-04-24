# Fetch

新的通用网络请求是`fetch()`方法。

基本语法：

```js
let promise = fetch(url, [options])
```

* url —访问的 URL
* options —可选参数：method、header 等

如果不传 options，则默认为 get 请求。

`fetch`方法天然能够获取`promise`对象。

获取响应时，`fetch` 需要做以下事情：

1. 服务器发送了响应头，`fetch`使用 `Response class` 对象对响应头进行解析，并且会返回一个被 `Promise` 包裹着的 `response` 实例。

   在这个阶段，我们可以检查响应头来确定请求是否成功。

   如果`fetch`没办法建立HTTP 请求，比如网络问题，那么会返回一个 reject 的 promise。

   异常的 HTTP 状态，比如404 或者 500 等实际上都跟服务端做了交互，那么不会导致 error。

   我们可以通过 response 属性来查看 HTTP 状态：

   * `status` ——HTTP 状态码
   * `ok` —— 布尔值，如果 HTTP 状态码是 200-299，则为`true`

2. 上面的方法并没有获取到 `response body`，我们还需要调用方法来获取

   `Response`提供多种方法，用不同的格式来拿到 body

   * **`response.text()`** —— 读取 response，并以文本形式返回 response
   * **`response.json()`** —— 将 response 解析为 JSON
   * **`response.formData()`** —— 以 `FormData` 对象的形式返回 response
   * **`response.blob()`** —— 以 [Blob](https://zh.javascript.info/blob)形式返回 response
   * **`response.arrayBuffer()`** —— 以 [ArrayBuffer](https://zh.javascript.info/arraybuffer-binary-arrays)形式返回 response

   `response.body`是可读流（ReadableStream）对象，我们可以逐块读取body。

一个完整的请求示例：

```js
let response = await fetch(url);

if (response.ok) { // 如果 HTTP 状态码为 200-299
  // 获取 response body，将 body 转换成 json
  let json = await response.json();
} else {
  alert("HTTP-Error: " + response.status);
}
```

也可以只用 `promise` 语法，不使用 `await`

```js
fetch(url).then(response=>response.json()).then(...)
```

使用 fetch 来获取 blob 不需要像 XHR 一样指定 `responseType`,直接调用`response.blob()`即可：

```js
let response = await fetch('/article/fetch/logo-fetch.svg');

let blob = await response.blob(); // 下载为 Blob 对象

// 为其创建一个 <img>
let img = document.createElement('img');
img.style = 'position:fixed;top:10px;left:10px;width:100px';
document.body.append(img);

// 显示它
img.src = URL.createObjectURL(blob);
// 允许浏览器删除内存映射
URL.revokeObjectURL(img.src)
```

> 我们只能选择一种读取 body 的方法。
>
> 如果我们已经使用了 `response.text()` 方法来获取 response，那么如果再用 `response.json()`，则不会生效，因为 body 内容已经被处理过了。

## Response header

`response header`类似Map 对象，我们可以使用`get()`来获取到它的每一项`header`属性，也可以迭代它们：

```js
let response = await fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits');

// 获取一个 header
alert(response.headers.get('Content-Type')); // application/json; charset=utf-8

// 迭代所有 header
for (let [key, value] of response.headers) {
  alert(`${key} = ${value}`);
}
```

## Request header

在`fetch`的第二个参数中，我们可以设置请求头。

```js
let response = fetch(protectedUrl, {
  headers: {
    Authentication: 'secret'
  }
});
```

为了保证 HTTP 的正确性和安全性，以下属性只能由浏览器控制，我们不能手动发送：

[forbidden-header-name](https://fetch.spec.whatwg.org/#forbidden-header-name)

## POST 请求

要创建 POST 请求，我们需要设置两个option：

* method ——HTTP 方法
* body —— 请求体，可以是：
  * 字符串（例如 JSON 编码的）
  * FormData 对象
  * `Blob`/`BufferSource` 发送二进制数据
  * [URLSearchParams](https://zh.javascript.info/url)，以 `x-www-form-urlencoded` 编码形式发送数据，很少使用。

JSON 形式目前是最为广泛使用的：

```js
let user = {
  name: 'John',
  surname: 'Smith'
};

let response = await fetch('/article/fetch/post/user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  body: JSON.stringify(user)
});

let result = await response.json();
```

这里需要注意的点是，当我们发送的是字符串时，`fetch` 会默认替我们设置成`text/plain;charset=UTF-8`,所以如果我们想要发送 JSON，则必须指定对应的 `Content-type`

## 发送图片

下面的例子是通过`fetch`提交二进制数据。

我们先将`canvas`进行描绘，然后通过 `canvasElement.toBlob`将其转化成图片格式，最后发送给服务器。

```html
<body style="margin:0">
  <canvas id="canvasElem" width="100" height="80" style="border:1px solid"></canvas>

  <input type="button" value="Submit" onclick="submit()">

  <script>
    canvasElem.onmousemove = function(e) {
      let ctx = canvasElem.getContext('2d');
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    };

    async function submit() {
      let blob = await new Promise(resolve => canvasElem.toBlob(resolve, 'image/png'));
      let response = await fetch('/article/fetch/post/image', {
        method: 'POST',
        body: blob
      });

      // 服务器给出确认信息和图片大小作为响应
      let result = await response.json();
      alert(result.message);
    }

  </script>
</body>
```

这里不需要设置`Content-Type` header，因为 `Blob` 对象具有内建的类型（这里是 `image/png`，通过 `toBlob` 生成的）。对于 `Blob` 对象，这个类型就变成了 `Content-Type` 的值。

## 小结

典型的`fetch`请求需要做两个步骤：

```js
let response = await fetch(url, options); // 解析 response header
let result = await response.json(); // 将 body 读取为 json
```

换成`promise`形式则是这样的：

```js
fetch(url, options)
  .then(response => response.json())
  .then(result => /* process result */)
```

当解析 response header 时，我们可以获取到响应状态码`response.status`、`response.ok`、`response.headers`等属性。

需要解析 response body 时，需要调用对应的方法：

* **`response.text()`** —— 读取 response，并以文本形式返回 response
* **`response.json()`** —— 将 response 解析为 JSON
* **`response.formData()`** —— 以 `FormData` 对象的形式返回 response
* **`response.blob()`** —— 以 [Blob](https://zh.javascript.info/blob)形式返回 response
* **`response.arrayBuffer()`** —— 以 [ArrayBuffer](https://zh.javascript.info/arraybuffer-binary-arrays)形式返回 response

当发送请求时，我们可以设置:

* `method`——请求方法
* `headers`——请求头
* `body`——以 `string`，`FormData`，`BufferSource`，`Blob` 或 `UrlSearchParams` 对象的形式发送的数据（request body）

# FormData

FormData 对象是 HTML 表单数据的对象。

通过构造函数可以创建一个 formData 实例：

```javascript
let formData = new FormData([form]);
```

HTML 的 `form` 元素会自动捕获 `form` 元素字段

fetch 可以接受一个 formData 作为body。它被编码出去后，会带上`Content-Type: multipart/form-data`。

下面例子中，采用`FormData` 构造器,接受 `HTML` 的表单元素作为参数，发送一个 `formData` 给服务端

```js
<form id="formElem">
  <input type="text" name="name" value="John">
  <input type="text" name="surname" value="Smith">
  <input type="submit">
</form>

<script>
  formElem.onsubmit = async (e) => {
    e.preventDefault();

    let response = await fetch('/article/formdata/post/user', {
      method: 'POST',
      body: new FormData(formElem)
    });

    let result = await response.json();

    alert(result.message);
  };
</script>
```

## FormData 方法

我们可以使用以下方法来给 FormData 增加字段：

* `formData.append(name, value)` —— 添加具有给定 `name` 和 `value` 的表单字段
* `formData.append(name, blob, fileName)` —— 添加一个字段，就像它是 `<input type="file">`，第三个参数 `fileName` 设置文件名（而不是表单字段名），因为它是用户文件系统中文件的名称
* `formData.delete(name)` —— 移除带有给定 `name` 的字段
* `formData.get(name)` —— 获取带有给定 `name` 的字段值
* `formData.has(name)` —— 如果存在带有给定 `name` 的字段，则返回 `true`，否则返回 `false`。
* `formData.set(name,value)`——同 `append`方法
* `formData.set(name,blob,fileName)`——同 `append`方法

`append`和`set`方法的区别是` append`方法可以添加多个具有相同名称的字段。

而`set`方法会移除所有`name`字段，并附加一个新字段。它能够确保只有一个`name`字段。

我们也可以使用`for..of`来循环迭代 formData 字段

```javascript
let formData = new FormData();
formData.append('key1', 'value1');
formData.append('key2', 'value2');

// 列出 key/value 对
for(let [name, value] of formData) {
  alert(`${name} = ${value}`); // key1 = value1，然后是 key2 = value2
}
```

## 发送带有文件的表单

表单始终以 `Content-Type: multipart/form-data` 来发送数据，这个编码允许发送文件。因此 `<input type="file">` 字段也能被发送，类似于普通的表单提交。

```html
<form id="formElem">
  <input type="text" name="firstName" value="John">
  Picture: <input type="file" name="picture" accept="image/*">
  <input type="submit">
</form>

<script>
  formElem.onsubmit = async (e) => {
    // 防止表单提交后页面刷新
    e.preventDefault();

    let response = await fetch('/article/formdata/post/user-avatar', {
      method: 'POST',
      body: new FormData(formElem)
    });

    let result = await response.json();

    alert(result.message);
  };
</script>
```

## 发送具有 Blob 数据的表单

通常情况下，发送文件的方式不是单独发送，而是作为表单的一部分发送，并带有附加字段，例如：`name`。

服务器通常更适合接收多部分编码的表单（multipart-encoded form），而不是原始的二进制数据。

下面改写一下在`fetch`中发送 canvas 生成的图片的示例代码：

```javascript
<body style="margin:0">
  <canvas id="canvasElem" width="100" height="80" style="border:1px solid"></canvas>

  <input type="button" value="Submit" onclick="submit()">

  <script>
    canvasElem.onmousemove = function(e) {
      let ctx = canvasElem.getContext('2d');
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    };

    async function submit() {
      let imageBlob = await new Promise(resolve => canvasElem.toBlob(resolve, 'image/png'));

      let formData = new FormData();
      formData.append("firstName", "John");
      formData.append("image", imageBlob, "image.png");

      let response = await fetch('/article/formdata/post/image-form', {
        method: 'POST',
        body: formData
      });
      let result = await response.json();
      alert(result.message);
    }

  </script>
</body>
```

在这里主要使用`formData.append("image", imageBlob, "image.png");`来添加 `Blob`。

就像表单中有 `<input type="file" name="image">` 一样，用户从他们的文件系统中使用数据 `imageBlob`（第二个参数）提交了一个名为 `image.png`（第三个参数）的文件。

服务器读取表单数据和文件，就好像它是常规的表单提交一样。

## 小结

`FormData` 对象用于捕获 HTML 表单，并使用`fetch`或者其他网络方法提交。

我们可以从 HTML 表单创建  `new FormData(form)`,也可以自己创建一个完全没有表单的对象，然后给他添加字段。

添加字段的方式有以下几种：

- `formData.append(name, value)`
- `formData.append(name, blob, fileName)`
- `formData.set(name, value)`
- `formData.set(name, blob, fileName)`

请注意 `append` 和 `set` 的区别。

如果我们需要发送文件，那么就需要使用三个参数的语法，最后一个参数是文件名，通常是从文件系统获取的。

其他方法是：

- `formData.delete(name)`
- `formData.get(name)`
- `formData.has(name)`



# 用Fetch实现下载进度

`fetch`方法没办法跟踪上传进度，但是可以跟踪**下载进度**。

我们可以使用`response.body`属性，这是一个可读流——`ReadableStream`,它可以逐块（chunk）提供 body。

我们在下载时可以通过`response.body.getReader()`方法来获取流读取器，然后通过这个流读取器来计算下载了多少。

大概过程是这样的：

```js
// 代替 response.json() 以及其他方法
const reader = response.body.getReader();

// 在 body 下载时，一直为无限循环
while(true) {
  // 当最后一块下载完成时，done 值为 true
  // value 是块字节的 Uint8Array
  const {done, value} = await reader.read();

  if (done) {
    break;
  }

  console.log(`Received ${value.length} bytes`)
}
```

调用`await reader.read()`方法会得到两个属性的对象：

* `done` ——读取完成则为`true`，否则为`false`
* `value`——字节的类型化数组：`Uint8Array`

> 由于浏览器问题，上面循环异步迭代`ReadableStream`的方式不使用`for await..of`,而是`while`循环

简单来说，我们需要在循环中接受响应块（response chunk），直到加载完成，也就是 `done` 为 `true`。

要将进度打印出来，我们只需要将每个接收到的片段 `value` 的长度（length）加到 counter 即可。

步骤是这样的：

```js
// Step 1：启动 fetch，并获得一个 reader
let response = await fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits?per_page=100');

const reader = response.body.getReader();

// Step 2：获得总长度（length）
const contentLength = +response.headers.get('Content-Length');

// Step 3：读取数据
let receivedLength = 0; // 当前接收到了这么多字节
let chunks = []; // 接收到的二进制块的数组（包括 body）
while(true) {
  const {done, value} = await reader.read();

  if (done) {
    break;
  }

  chunks.push(value);
  receivedLength += value.length;

  console.log(`Received ${receivedLength} of ${contentLength}`)
}

// Step 4：将块连接到单个 Uint8Array
let chunksAll = new Uint8Array(receivedLength); // 创建一个具有所有数据块合并后的长度的同类型数组。
let position = 0;
for(let chunk of chunks) {
  chunksAll.set(chunk, position); // 使用 .set(chunk, position) 方法，从数组中一个个地复制这些 chunk
  position += chunk.length;
}

// Step 5：解码成字符串
let result = new TextDecoder("utf-8").decode(chunksAll);

// 我们完成啦！
let commits = JSON.parse(result);
alert(commits[0].author.login);
```

步骤解读：

1. 使用 fetch 获取数据，但不调用`response.json()`,而是获取一个流读取器（stream reader）`response.body.getReader()`

   >  要么使用流读取器，要么使用 `response` 方法,不能同时用两种方法读取相同响应。

2. 在读取数据之前，从`Content-Length`中获取完整的响应长度。

3. 调用 `await reader.read()`,直到结果为`done:true`。

   这时候需要将响应收集到数组`chunks`中。因为我们不能再用`response.json`来读取响应内容，所以需要有个地方把它存起来。

4. 拥有了`chunks`结果之后，实际上里面是一段一段的 `Unit8Array`的字节块。

   * **如果我们想要创建二进制内容（比如图片、文件**），就可以使用`Blob`类来创建一个 `Blob`对象。`Blob` 类直接可以接收内含`Unit8Array`字节块的数组，这里可以写为：

     ```js
     let blob = new Blob(chunks);
     ```

   * **如果我们想要做其他事情，比如将字节块解析成一段字符串**。我们首先需要将这些字节块拼起来：

     这里使用一些代码来将其串联起来：

     * 创建`chunksAll = new Uint8Array(receivedLength)`——一个具有所有数据块合并后的长度的同类型数组
     * 使用`.set(chunk,position)`方法，从这些数组中挨个复制这些`chunk`
     * 最后将结果拷贝到`chunksAll`中，但它们是字节数组，并不是字符串，我们需要解析这些字节——可以使用内建的`TextDecoder`对象来完成。

以上，这就是使用`fetch`来跟踪**下载**进度的过程。



# 用Fetch实现请求中止(Abort)

JavaScript 没有中止`Promise`的概念。但我们可以取消`fetch`请求。

有一个特殊的内置对象`AbortController`，它不单可以中止`fetch`，还可以中止其他异步任务。

## AbortController 对象用法

创建一个控制器：

```js
let controller = new AbortController();
```

控制器中有一个属性和一个方法：

* `abort()`方法
* `signal`属性，我们可以在这个属性上设置事件监听器

当`abort`被调用时：

* `controller.signal`会触发`abort`事件
* `controller.signal.aborted` 属性变为 `true`。

这个处理方式需要我们分两部分去做：

1. 在`controller.signal`上设置一个监听器，里面放一个取消操作后的回调函数
2. 调用`controller.abort()`来取消

下面是一个取消`setTimeout`的例子：

```html
  <body>
    <button id="button">点击我取消异步任务</button>
    <script>
      let controller = new AbortController();
      let signal = controller.signal;
      let timer = setTimeout(() => {
        alert("这是 setTimeout 异步执行的任务");
      }, 3000);
      // 可取消的操作这一部分
      // 获取 "signal" 对象，
      // 并将监听器设置为在 controller.abort() 被调用时触发
      signal.addEventListener("abort", () => clearTimeout(timer));
      button.onclick = function () {
        // 另一部分，取消（在之后的任何时候）：
        controller.abort(); // 中止！
        // 事件触发，signal.aborted 变为 true
        alert(signal.aborted); // true
      };
    </script>
  </body>
```

上面的代码会在点击 `button` 后取消`setTimeout`异步任务。

其实就是在`abort()`后触发监听器里面的函数，跟正常的发布订阅模式没有区别。

上面的实现完全没必要用到`AbortController`对象也可以实现。

但这个对象有意思的地方在于与 `fetch` 的集成。

## 与 fetch 集成实现取消请求的功能

fetch 的 `options` 参数可以接受一个`signal`属性，我们可以将`AbortController` 的 `signal` 属性传递进去：

```js
let controller = new AbortController();
fetch(url, {
  signal: controller.signal
});
```

这时候`fetch`会监听`signal`的 `abort` 事件。当我们想要中止`fetch`时，这样调用：

```javascript
controller.abort();
```

然后`fetch`就从 `signal` 获取了事件并中止了请求。

当`fetch`被中止时，它的`promise`就会`reject`一个`name`为`AbortError`的`error`，我们需要用`try..catch`进行捕获。

```js
// 1 秒后中止
let controller = new AbortController();
setTimeout(() => controller.abort(), 1000);

try {
  let response = await fetch('/article/fetch-abort/demo/hang', {
    signal: controller.signal
  });
} catch(err) {
  if (err.name == 'AbortError') { // handle abort()
    alert("Aborted!");
  } else {
    throw err;
  }
}
```

## 并行取消多个 fetch

`AbortController` 是可伸缩的。它允许一次取消多个 fetch。

```js
let urls = [...]; // 要并行 fetch 的 url 列表

let controller = new AbortController();

// 一个 fetch promise 的数组
let fetchJobs = urls.map(url => fetch(url, {
  signal: controller.signal
}));

let results = await Promise.all(fetchJobs);

// controller.abort() 被从任何地方调用，
// 它都将中止所有 fetch
```

上面的代码能够并行 `fetch` 很多个 `urls`，并使用单个控制器使其全部中止。

如果我们有自己的与 `fetch` 不同的异步任务，我们可以使用单个 `AbortController` 中止这些任务以及 fetch。

```js
let urls = [...];
let controller = new AbortController();

let ourJob = new Promise((resolve, reject) => { // 我们的任务
  ...
  controller.signal.addEventListener('abort', reject);
});

let fetchJobs = urls.map(url => fetch(url, { // fetches
  signal: controller.signal
}));

// 等待完成我们的任务和所有 fetch
let results = await Promise.all([...fetchJobs, ourJob]);

// controller.abort() 被从任何地方调用，
// 它都将中止所有 fetch 和 ourJob
```

## 小结

* `AbortController`是一个简单对象，当`abort()`方法被调用时，会调用自身`signal`属性监听的`abort`事件，并将`singnal.aborted`设置为`true`

* `signal`可以传递给 fetch 的` options.signal`属性，这样 fetch 就能够监听到他，因此可以中断 `fetch`

* 我们也可以在自己的代码中使用`AbortController`，先监听`abort`事件，在调用`abort()`方法后触发`abort`事件来中止某些任务

  

# Fetch API

https://zh.javascript.info/fetch-api



