# 一、Node.js的特性

常见的后端开发语言和技术有多种:

* 基于Java的Spring
* 基于Python的Django

...

相比其他后端技术，JavaScript这门脚本语言需要一个解析器才能运行。在HTML页面的JavaScript程序，浏览器就是解析器。

而对于独立运行的JavaScript程序，Node就是它的解析器。

Node是一个让JavaScript运行在服务器端的开发平台。它让JavaScript脱离脚本语言，在后端能够与其他语言一样操控数据库、服务器等等。

Node是基于V8引擎开发的，V8引擎执行JavaScript程序的速度非常快，性能也非常好。

> Chrome V8是一个由Google开发的开源JavaScript引擎，用于GoogleChrome及Chromium中。Chrome V8在运行之前会将JavaScript代码编译成机器代码而非字节码，以此提升程序性能。更进一步，Chrome V8使用了如内联缓存（Inline Caching）等方法来提高性能。有了这些功能，JavaScript程序与ChromeV8引擎的运行速度可媲美二进制编译的程序。

## 1.1 模块化规范

模块化的开发可以提高代码的复用率，方便进行代码管理。通常一个文件就是一个模块，有自己的作用域，只向外暴露特定的变量和函数。

CommonJS是JavaScript模块化的一种规范，该规范最初用在服务端的Node开发中，现在前段Weback打包工具也支持原生CommonJS。

根据这个规范，每一个文件都是一个模块，其内部定义的变量是属于这个模块的，不会对外暴露，也就是说不会污染全局变量。

CommonJS的核心思想就是通过require()方法同步加载所要依赖的其他模块，然后通过exports或者module.exports来导出需要暴露的接口。 

示例代码

```JavaScript
.
├── index.js
├── math.js
├── package-lock.json
└── package.json
```

其中index.js代码引入

```JavaScript
var math = require('./math.js');

console.log(math.add(10, 20)); // 30
```

math.js代码导出

```JavaScript
var add = function (a, b) {
  return a + b;
};

module.exports.add = add;
```

在package.json上配置`scripts`和`type`属性

```
{
  "name": "demo-1",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "commonjs",
  "dependencies": {},
  "devDependencies": {},
  "scripts": {
    "start": "node index.js"
  },
  "author": "",
  "license": "ISC"
}
```

type属性中的node index.js表示从命令行运行Node脚本

运行

```bash
npm start
```

但common.js属于社区规范并非真正意义上的标准规范。

ES6在语言标准层面上实现了模块功能。它成为浏览器和服务器通用的模块化解决方案。但是ES6目前无法在所有浏览器中执行，需要通过Babel将不被支持的import语法编译成当前受到广泛支持的require语法。

但在Nodejs中，则不需要这么做。

 ES 6模块的设计思想是尽量静态化，使得编译而非运行时就能确定模块的依赖关系，以及输入和输出的变量。

使用ES6模块化的示例项目结构如下

```JavaScript
.
├── index.js
├── math.js
├── package-lock.json
└── package.json
```

首先需要修改package.json文件的type属性

```JavaScript
"type": "module",
```

其中，index.js代码如下

```JavaScript
import add from './math.js';

console.log(add(10, 20)); // 30
```

math.js代码如下

```JavaScript
var add = function (a, b) {
  return a + b;
};

export default add;
```

执行index.js脚本

```JavaScript
npm start
```

## 1.2 异步I/O和事件驱动

1. 单线程

   Node的Runtime是基于V8引擎的。V8引擎是chrome浏览器中的JavaScript代码解析引擎，其最大的特点是单线程，因此Node也是单线程。

   简单来说单线程就是进行中只有一个线程，程序按照顺序执行，前面的程序执行完才会执行后面的程序。

   > 进程和线程的关系：进程是资源分配的最小单位，而线程是程序执行的最小单位（资源调度的最小单位）。线程可以看做是特殊的进程，某个进程下的多个线程共享部分资源，如地址空间。

   Node的单线程指的是主线程是单线程。主线程按照代码顺序一步一步执行，如果遇到同步代码阻塞，主线程就被占用，则后续的程序代码执行就会被卡住。

   因为单线程具有这个特性，所以Node程序不能有耗时很长的同步处理程序阻塞程序的后续执行，对于耗时过长的程序，应该采用异步执行的方式。这就需要说到异步I/O。

2. 异步I/O

   I/O分为以下情况：

   * 阻塞I/O与非阻塞I/O

   * 同步I/O与异步I/O

   对于阻塞I/O，当需要执行I/O操作读取硬盘或者网络等数据时，线程就会被阻塞，直到要读取的数据全部准备好返回给用户，这时线程就会解除阻塞状态。

   对于非阻塞I/O，当需要执行I/O操作时，线程可以在发起I/O处理请求后，不用等请求完成，继续做其他事情。但是程序如何知道要读取的数据已经准备好了呢？除了存在效率问题的轮询方法外，现在通常的做法是I/O多路复用的方式，即用一个阻塞函数同时监听多个文件描述符，当其中有一个文件描述符准备好了，就立刻返回。Linux系统提供了select、poll和epoll等实现I/O多路复用的功能。

   因此，阻塞I/O和非阻塞I/O是基于线程是否会阻塞来区分的。

   同步I/O做操作的时候会阻塞线程，而异步I/O则不会造成任何阻塞。

   阻塞I/O和非阻塞I/O以及I/O多路复用都是同步I/O。

   非阻塞I/O虽然在操作时不会阻塞线程，但是当其准备好数据以后还是要阻塞线程去内核读取数据的，因此不算异步I/O。

   以下是模型图

   ![img](https://res.weread.qq.com/wrepub/epub_35971867_33)

## 1.3 事件驱动

Node还有另一个重要的特性：事件驱动。

简单来说，事件驱动就是通过监听事件的状态变化来做出相应的操作。

例如：读取一个文件，文件读取完毕或者文件读取错误都会触发相应的状态，然后调用对应的回调函数来处理。

```javascript
var fs = require('fs');
fs.readFile('./math.js', { encoding: 'utf-8' }, function (error, data) {
  if (error) console.log(error);
  console.log(data);
});
```

上面的代码会读取math.js文件，然后将里面的内容打出来。如果没有，则会打出error信息。

对于事件驱动编程来说，如果某个事件的回调函数是计算密集型（CPU被占用）函数，那么这个回调函数将会阻塞所有回调函数的执行。这也是Node不适用于计算密集型业务的原因。

# 二、RESTful架构风格

REST全称是Representational State Transfer，即表征性状态转移。

REST指的是一组架构约束条件和原则。

如果一个架构符合REST的约束条件和原则，那么就称它为RESTful架构。REST本身没有创造新的技术、组件或者服务，隐藏在RESTful背后的理念是使用Web现有的特征和能力，以及更好地使用现有的Web标准的一些准则和约束。

RESTful是目前最流行的API设计规范，我们可以从3个方面来理解RESTful的基本特征：

1. 资源和动作
2. 响应状态码
3. 响应数据

**资源和动作**

RESTful架构应该遵循统一的接口原则。统一接口包含了一组受限的预定义操作，不管什么样的资源都使用相同的接口进行资源访问。

任何接口的URL都可以抽象成以下部分：

* 资源：必须是名词且都是复数形式。

* 动作：通过HTTP定义的方法来表述对资源的动作

  常用5种HTTP方法对应CRUD操作：

  ```
  GET：读取（Read）
  POST：新建（Create）
  PUT：更新（Update）
  PATCH：更新（Update）
  DELETE：删除（Delete）
  ```

  上面的更新分为PUT和PATCH，它们的区别在于

  * PUT是幂等的，即多次进行PUT操作后的资源总是相同的，因为PUT会更新整个资源。
  * PATCH是非幂等的，多次进行PATCH操作会导致资源有不同的变化，PATCH只更新资源的部分字段。

**响应状态码**

客户端每一次请求服务器都必须给出回应。服务器响应包括HTTP状态码和数据两部分。其中，状态码分为五大类，覆盖绝大部分情况。每一种状态码都有标准的解释，客户端只需要查看状态码就可以判断发生什么情况，因此客户端应该尽可能返回精确地状态码。



**响应数据**

API返回的数据格式不推荐使用纯文本，应该返回标准化的结构数据，如JSON格式的数据。因此，在服务器响应的HTTP头上，将Content-Type设置为application/json。

客户端请求时也要明确告诉服务器可以接受JSON数据的格式，即在请求的HTTP头上将ACCEPT属性设置为application/json。

API的调用者未必直到URL是如何设计的，一个解决方法是在响应中添加相关的链接，以便下一步操作。这样用户只需要记住一个URL，就可以发现其他URL，这种方法叫HATEOAS。

以GitHub的API为例，当访问https://api.github.com/时，就可以得到其他相关的URL，如下：

```json
{
    ......
    "feeds_url": "https://api.github.com/feeds",
    "followers_url": "https://api.github.com/user/followers",
    "following_url": "https://api.github.com/user/following{/target}",
    "gists_url": "https://api.github.com/gists{/gist_id}",
    "hub_url": "https://api.github.com/hub",
    ......
}
```

# 三、回调函数和Promise对象

Node具有单线程和事件驱动的特性，这意味着我们需要用到大量的异步代码以让程序不被阻塞。

下面是利用异步回调函数来读取文件的示例代码

```JavaScript
var fs = require('fs');

fs.readFile('./test.txt', { encoding: 'utf8' }, function (err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});

console.log('read async');
```

使用异步回调函数能够大大提升Node单线程的处理能力，但是基于回调函数的编程风格会让代码可读性变得更加糟糕，即所谓的回调地狱。

为么解决这个问题，ES6引进了Promise对象，有了Promise对象，就可以将异步操作以同步的流程表达出来，避免层层回调。

使用Promise对象后的读取文件的示例

```JavaScript
var fs = require('fs');

function getData(fileName, options) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, options, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

getData('./test.txt', { encoding: 'utf8' })
  .then(function (data) {
    console.log('Data: ', data);
  })
  .catch(function (error) {
    console.log('Error: ', error);
  });
```

# 四、Node.js常用模块

## 4.1 全局变量

在浏览器中，window是全局对象，在Node中的全局变量是global，在任何地方都可以访问global的属性。

* 保留字

  两个常用保留字`__filename`和`__dirname`

  __filename表示正在执行脚本的文件名。它会输出文件所在位置的绝对路径，并且和命令行参数所指定的文件名并不一定相同。在模块中，返回的值是模块文件的路径。

  ```javascript
  console.log(__filename);
  
  /Users/qiuyanxi/Desktop/demo/NodeJS-demo/node-demo-1/index.js
  ```

  __dirname表示当前执行的脚本所在的目录。

  ```javascript
  console.log(__dirname);
  /Users/qiuyanxi/Desktop/demo/NodeJS-demo/node-demo-1
  ```

* 定时任务

  Node开发中的定时器除了setTimeout、setInterval外，还有setImmediate

* 控制台

  console.log：向标准输出流打印字符并以换行符结束，该方法接收若干个参数；

  console.info：输出提示信息，用法与console.log方法类似；

  console.warn：输出警告消息，在Chrome浏览器控制台会显示黄色的惊叹号；

  console.error：输出错误消息，在Chrome浏览器控制台会显示红色的叉。

  console.time：启动一个计时器；

  console.timeEnd：停止一个通过console.time()启动的计时器。

* process进程

  process进程代表当前Node进程状态的对象，并提供一个与操作系统交互的简单接口。

  ```
  import process from 'process';
  
  process.on('exit', code => {
    console.log(process.cwd()); //打印出当前进程的工作目录
  });
  ```

  上面的代码监听进程退出时的生命周期。



## 4.2 系统模块-os

os模块提供一些基本的系统操作函数，通过os模块，Node程序可以实现和操作系统的交互。

```javascript
import os from 'os';
console.log('hostname:' + os.hostname());//主机名
console.log('type:' + os.type());//操作系统名
console.log(os.userInfo());// 用户信息
```

## 4.3 路径模块——path

系统中的每个文件都有路径。

但是macos跟windows的路径符号是相反的，分别为`/`和`\`

path模块提供用于处理文件路径和目录路径的工具来消除这种差异。

```javascript
import path from 'path';
var full_path = '/application/todoList/index.js';
//目录名
path.dirname(full_path); // /application/todoList

//返回路径的最后一部分
path.basename(full_path); // index.js

//后缀
path.extname(full_path); // .js

//路径片段分隔符
path.sep; // /

//拼接成规范路径
path.join('./user', 'local', 'bin'); // user/local/bin

//是否为绝对路径
path.isAbsolute(full_path); // true

//当包含类似 .、.. 或双斜杠等相对的说明符时，则尝试计算实际的路径
path.normalize('/users/joe/..//test.txt') //'/users/test.txt'

// 解析对象的路径为组成其的片段
path.parse('/users/test.txt')
/*
{
  root: '/',
  dir: '/users',
  base: 'test.txt',
  ext: '.txt',
  name: 'test'
}
*/

// 接受 2 个路径作为参数。 基于当前工作目录，返回从第一个路径到第二个路径的相对路径。
path.relative('/Users/joe', '/Users/joe/test.txt') //'test.txt'

//获得相对路径的绝对路径计算
path.resolve('joe.txt') //'/Users/joe/joe.txt' 如果从主文件夹运行

//通过指定第二个参数，resolve 会使用第一个参数作为第二个参数的基准：
path.resolve('tmp', 'joe.txt') //'/Users/joe/tmp/joe.txt' 如果从主文件夹运行

//第一个参数以斜杠开头，则表示它是绝对路径：
path.resolve('/etc', 'joe.txt') //'/etc/joe.txt'
```

## 4.4 文件模块——fs

**获取详细信息**

每个文件都有一组详细信息，可以使用fs模块提供的stat()方法获取。

```javascript
import fs from 'fs';
fs.stat('./math.ts', (err, Stats) => {
  console.log(Stats);//打印出math.js的信息
});
```

也可以使用同步的方法来获取信息，这个方法在文件属性准备就绪前会阻塞线程。

```javascript
import fs from 'fs';
const stats = fs.statSync('./math.ts');
```

文件的信息包含在属性变量中，我们可以通过以下常见的属性来获取信息

```javascript
console.log(stats.isFile());//是否为文件
console.log(stats.isDirectory());//是否为文件夹
console.log(stats.isSymbolicLink());//是否符号链接
console.log(stats.size);// 文件大小
```

**读取文件**

```
import fs from 'fs';
fs.readFile('./math.ts', 'utf8', (err, file) => {
  console.log(file);
});
```

**写入文件**

```javascript
fs.writeFile('./test.txt', 'hello23', { flag: 'a+' }, err => {
  console.log(err);
});
```

flag标志可以指定写的行为。

> 默认为 ‘w’: 打开文件进行写入， 创建（如果它不存在）或截断（如果它存在）该文件。

追加内容到文件里还有个便捷的方法 `fs.appendFile()`

```javascript
import fs from 'fs';
fs.appendFile('./test.txt', '一些内容', err => {
  console.log(err);
});
```

**文件夹是否存在**

使用 `fs.access()` 检查文件夹是否存在以及 Node.js 是否具有访问权限。



**创建新的文件夹**

使用 `fs.mkdir()` 或 `fs.mkdirSync()` 可以创建新的文件夹。

```javascript
import fs from 'fs';
let folderName = './dir';
try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (error) {
  console.log(error);
}
```

**读取目录的内容**

使用 `fs.readdir()` 或 `fs.readdirSync()` 可以读取目录的内容并返回它们的相对路径

```javascript
console.log(fs.readdirSync(folderName)); // [ 'test.txt' ]
```

**删除文件夹**

使用 `fs.rmdir()` 或 `fs.rmdirSync()` 可以删除文件夹。

删除包含内容的文件夹可能会更复杂。

在这种情况下，最好安装 [`fs-extra`](https://www.npmjs.com/package/fs-extra) 模块，该模块非常受欢迎且维护良好。 它是 `fs` 模块的直接替代品，在其之上提供了更多的功能。

```javascript
import fs from 'fs-extra';
let folderName = './dir';
fs.remove(folderName, err => {
  console.log(err);
});

/* 或者可以这样用 */
let folderName = './dir';
(async () => {
  await fs.remove(folderName);
})();
```

在fs模块中，我们可以使用非常使用的函数来访问文件系统并与文件系统进行交互。

所有办法默认是异步的，但是通过添加上Sync就是同步代码。

```javascript
fs.rename()
fs.renameSync()
fs.write()
fs.writeSync()
```

当调用`fs.rename`方法时，异步API会与回调一起使用。

```javascript
let folderName = './dir';
fs.rename(folderName, 'afterDir', err => {
  console.log(err);
});
```

当使用同步API时，则使用try/catch捕获错误

```javascript
try {
  fs.renameSync('./dir', './afterDir');
} catch (error) {
  console.log(error);
}
```

主要的区别在于，同步API会阻塞脚本执行，直到文件操作成功。
