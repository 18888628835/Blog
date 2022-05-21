# 前言

这是一篇关于`webpack5`从0开始配置的入门文章。

通过本文你可以获得：

* 了解webpack具体的作用
* 了解如何使用webpack做打包资源
* 了解如何利用webpack提升开发体验
* 能看懂官方文档的配置项
* 能获得一些优化的知识

>  本文阅读时长大概在15分钟左右，如果你能根据例子来配置的话，可能花费的时间更长一些。

我会尽可能用白话跟你解释所有配置项的由来，能解决什么问题。

同时也希望读者能亲自配一下，加深自己的印象。

话不多说，我们开始。

# 一、基本概念

## 1.1 Webpack是什么

Webpack是一个开源的JavaScript模块打包工具，其最核心的功能是解决模块之间的依赖，把前端的各种资源文件（js、css、jpg、png等等）作为各个模块按照特定的规则和顺序组织在一起。

它根据模块的依赖关系进行静态分析，最终打包生成对应的静态资源。

这个过程就叫作模块打包。

官网上的构建图示能很好地说明`Webpack`的作用

![image-20220123152437255](../assets/image-20220123152437255.png)



## 1.2 JS中的模块

所谓模块，就是将特定功能的代码分拆成多个代码片段，每个片段实现一种目的，最终通过接口将它们组合在一起，各个模块协同工作，保证程序的正常运转。

在很长一段时间，JavaScript不像其他程序语言一般，能够使用模块化进行开发。因为这门语言诞生时，仅仅作为轻量级的脚本语言，为用户提供上传表单时的校验功能。

随着业务越来越复杂以及前端技术的发展，引入多个js文件到页面中已经逐渐成为常态，此时也暴露出一些问题：

* 需要手动维护JavaScript的加载顺序。页面中多个script之间通常存在依赖关系，但由于这种依赖关系是隐性的，当js文件过多时就容易出现问题。
* 每个script标签都意味着请求一次静态资源，过多的请求会拖慢页面的渲染速度。
* 每个script标签中，顶级作用域都是全局作用域，如果没有经过处理直接在代码中进行变量或者函数声明，会造成全局作用域的污染。

模块化则一一解决了上述问题：

* 通过导入和导出语句来分析模块间的依赖关系
* 使用工具将全部js文件打包成一个或多个文件，减少网络开销
* 多个模块间的作用域相互隔离，彼此之间不会存在命名冲突

对于模块化，社区提出了AMD、CMD、CommonJS等方案，ES6模块标准则将模块化提升到语言层面。但由于以下原因，ES6标准模块还不能用于实际应用：

1. 无法使用code splitting和tree shaking
2. 大部分npm模块采用ComminJS的规则，浏览器不支持其语法
3. 浏览器兼容性问题等

于是，我们需要使用模块打包工具来帮助我们完成一系列工作。

模块打包工具的任务就是解决模块间的依赖，使其打包后的结果可以运行在浏览器上。



## 1.3 打包工具做了什么

使用打包工具的一个好处是 —— 它们可以更好地控制模块的解析方式，允许我们使用裸模块和更多的功能，例如 CSS/HTML 模块等。

打包工具做以下内容：

1. 从一个打算放在 HTML 中的 `<script type="module">` “主”模块开始。（Webpack默认从`src/index.js`开始）
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



## 1.4 Webpack的优势

1. 默认支持多种模块标准，包括AMD、CommonJS、ES6模块等。它会帮我们处理好模块间的依赖关系。

2. 完备的代码分割（code splitting）解决方案。它可以分割打包后的资源，首屏只加载必要的部分，不太重要的功能动态加载。这有助于有效减少资源体积，提升首页渲染速度。

3. Webpack可以处理各种类型的资源，js、图片、css等等。

4. Webpack有庞大的社区支持,插件齐全。

4. webpack可以提高前端开发的体验，`webpack-dev-server`具备整套的协同开发功能，提高前端开发、调试的效率

   

## 1.5 Webpack五个核心概念

* `entry`：入口。指定打包工具从哪个文件开始构建内部依赖图，并以此为起点打包

* `output`：输出。指定打包好后的bundles资源最终输出到哪个地方，输出名字是什么

* `loader`：加载器。让webpack能够处理非js文件的翻译、打包工作。（例如less、image等静态资源）

* `plugin`：插件。让webpack能够处理打包优化、压缩、生成模板等功能性任务。

* `mode`：模式。development模式、production模式、none。能够设置`process.env.NODE_ENV`的值，并且根据环境不同自动开启一些插件。

## 1.6 小结

通过上面的介绍，我们能够大概知道webpack的概念、作用。

下面我们进入实战环节，在实战环节，我们需要做一些准备工作。

# 二、准备工作

## 2.1 初始化项目 

```bash
mkdir webpack-demo-1
cd webpack-demo-1
// 初始化
yarn init -y
// 安装webpack和cli工具
yarn add webpack webpack-cli --dev
// 查看版本
npx webpack -v
```

为了测试，我们首先在根目录下创建`src`目录，并创建三个文件(`index.html`在根目录下)

```bash
index.html
src
├── index.css
└── index.js

```

分别在里面添加内容:

index.css

```css
.div {
  color: red;
  font-size: 16px;
}
```

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>first webpack app</title>
  </head>
  <body></body>
  <script src="./dist/bundle.js"></script>
</html>
```

index.js

```js
function createElement() {
  const div = document.createElement('div');
  div.innerHTML = 'hello world';
  div.classList.add('div');
  document.body.append(div);
}
createElement();
```

## 2.2 打包第一个js文件

初始化好后，我们可以看到`index.html`上的`<script src="./dist/bundle.js"></script>`，目前我们的项目并没有创建`dist`这个目录，`bundle.js`也是不存在的。

我们期望能够用`webpack`打包`index.js`的内容来生成`dist`目录和`bundle.js`文件

此时在命令行上输入：

```bash
npx webpack --entry=./src/index.js --output-filename=bundle.js --mode=development
```

`npx webpack`是在本地用`npx`启动`webpack`的意思

`--entry` 参数是寻找当前目录下的`src/index.js`文件

`--output-filename` 是指定输出的文件名 

`--mode `指的是开发模式

此时，根目录下应该会多了`dist`目录，下面有一个`bundle.js`的文件，它就是打包后的`index.js`文件。

如果此时用`http-server`或者`vscode`的`live server`插件打开本地项目，你会发现`chrome`浏览器屏幕前输出现`hello world`字样，代表打包成功了。

> 由于目前是从0开始配置，您需要自行下载http-server或者vscode的live-server插件来查看打包后的项目页面。

简单总结，我们刚才的操作是：

`Webpack`以`entry`指定的入口文件`src/index.js`为入口点**查找模块依赖**，此时没有其他依赖。于是通过`output`输出成`bundle.js`。

最后的参数mode指的是打包模式，一共有三种：development、production、none三种模式。它会自动添加适合于当前模式的一系列配置，减少了人为的工作量。

## 2.3 配置script

由于使用cli的方式会增加很多指令参数，不容易维护，所以我们需要在`package.json`中添加脚本，这样就不需要输入那么长的指令了。

在`package.json`中添加命令：

```json
  ...
  "scripts": {
    "build": "webpack --output-filename=bundle.js --mode=development"
  },
  ...
```

上面的脚本省略掉了`entry`的配置。

这是因为`webpack`默认是从工程根目录的`src`目录下的`index.js`作为入口文件，打包好后的文件自动放在`dist`目录。所以我们可以按照默认目录配置来简化我们的命令行。

此时通过`yarn build`也可以打包。

## 2.4 配置文件

Webpack提供大量的命令行参数，可以帮助我们满足各种场景的需求。

上面的例子我们已经看到了，我们可以定制入口文件和输出的文件名和指定模式等。

这些命令行参数可以使用下面的命令获取

```bash
npx webpack –h
```

命令中添加更多的参数仅适用于配置较少的项目，如果配置比较多，我们就需要专门的配置文件。

Webpack每次打包时都会读取该配置文件，这样就不必在命令行中添加太多参数了，方便后期修改维护。

默认的配置文件为`webpack.config.js`，也可以通过命令行参数`--config`指定配置文件。

```json
  "scripts": {
    "build": "webpack --config build.config.js",
  },
```

这里就按照之前的命令行参数，在根目录下创建`webpack.config.js`,并且加入配置项：

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: { filename: 'bundle.js' },
  mode: 'development',
};
```

`output.filename`还是跟先前一样，但是如果要配置`output.path`——最终资源输出路径则需要**绝对路径**。

默认的配置输出路径相当于

```javascript
  output: {  path: path.join(__dirname, 'dist') } 
```

>  由于是默认配置，所以webpack.config.js中省略了`output.path`的配置

写好配置项后，我们就可以去除`package.json`中配置的打包参数了。

```json
  "scripts": {
    "build": "webpack"
  },
```

执行`yarn build`后，`webpack`会预读`webpack.config.js`中的配置，再进行打包。

当构建后，请使用编辑器打开并在chrome上查看结果。

## 2.5 小结

准备工作主要是熟悉webpack-cli的使用以及webpack脚本、webpack配置文件的默认项等。

我们还用webpack打包了一个js文件，这甚至不需要任何配置，因为webpack自身就具备打包js的能力。

但是它默认不具备打包其他静态资源（css、sass、file文件等）的能力，所以我们需要给它配置`loader`，让它可以”翻译“这些静态资源。

在翻译的同时，我们还能够使用`plugin`让webpack帮助我们做一些额外的工作，例如生成模板文件、压缩、优化等等。

下面进入配置`loader`、`plugin`的环节。

# 三、利用loader、plugin打包资源

## 3.1 打包css 

我们在准备工作中虽然写了css，但是实际打包后并没有css的效果，这是因为webpack在分析依赖时，并没有找到css的引入语句。

我们可以在`index.js`上引入css

```js
import './index.css';
```

打包除js文件外的资源需要用到`loader`，我们先安装两个loader：

```bash
yarn add style-loader css-loader --dev
```

`style-loader`用于将`<style>`标签插入到html中，`css-loader`是用于识别`import './index.css'`语句并打包css文件。

根据目前的官方网站，配置如下：

```javascript
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],//注意顺序，webpack从右到左读取loader
      },
    ],
  },
};
```

webpack 根据正则表达式，来确定应该查找哪些文件，并将其提供给指定的 loader。在这个示例中，所有以 `.css` 结尾的文件，都将被提供给 `style-loader` 和 `css-loader`。

模块 loader 可以链式调用。链中的每个 loader 都将对资源进行转换。链会逆序执行。第一个 loader 将其结果（被转换后的资源）传递给下一个 loader，依此类推。最后，webpack 期望链中的最后的 loader 返回 JavaScript。

上面的顺序是先执行`css-loader`再执行`style-loader`。

配置完后，请用`yarn build`构建并在`chrome`上查看结果，以下不再提示。

## 3.2 打包less

我们先在`src`目录下增加一个`style.less`的文件，内容如下：

```css
@width: 100px;
@height: 100px;
div {
  background-color: aqua;
  width: @width;
  height: @height;
  border: 1px solid red;
  user-select: none;
}
```

然后在`index.js`中引入`less`：

```css
import './style.less';
```

接着安装less和less-loader

```bash
yarn add less less-loader --dev
```

配置：

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [
      ...
      {
        test: /\.less$/i,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
};
```



## 3.3 postcss

postcss是利用JavaScript转换样式的工具。我们可以用它配合`autoprefixer`来给css添加更多兼容性的前缀代码以支持更多浏览器平台。

首先我们在当前的index.css上加一句css代码：

```diff
// index.css
.div {
  color: red;
  font-size: 16px;
  /* 为了查看postcss-loader有没有效果 */
+ user-select: none;
}
```

```bash
yarn add postcss autoprefixer postcss-loader --dev
```

然后在webpack中配置规则：

```javascript
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('autoprefixer')],
              },
            },
          },
        ],
      },
    ],
  },
```

经过打包后，查看打包后的页面，会发现已经被添加了兼容性的前缀代码

![image-20220125101128795](../assets/image-20220125101128795.png)

postcss中还有很多有关于css加载所需要的插件，都集成到`postcss-preset-env`的插件中了，比如能够让浏览器支持`#12345678`这样的八位数颜色以及`autoprefixer`支持的功能。

我们也可以直接使用这个预设的插件，这样就相当于用了很多个类似`autoprefixer`这样的小`loader`。

使用方法：

```bash
yarn add postcss-preset-env --dev
```

直接配置在`options.postcssOptions.plugins`中即可,这里就替换掉上面的`require(autoprefixer)`,因为`postcss-preset-env`已经拥有它的功能了。

```javascript
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              }
```

### **专用的postcss配置**

我们可以使用less、css等来书写css，而postcss则需要体现到所有css上，因此我们需要给所有css预编译工具配置postcss-loader，但这就会增加大量重复的配置代码。

为了解决这个问题，我们可以使用默认的`postcss.config.js`来给postcss做共同的配置。

在根目录下创建`postcss.config.js`，内容如下：

```js
// postcss.config.js
module.exports = {
  plugins: ['postcss-preset-env'],
};
```

然后同步修改`webpack.config.js`配置

```js
// webpack.config.js
module.exports = {
...
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.less$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
      },
    ],
  },
};
```

设置好后，webpack打包代码时，会从`use`的最后一项开始（比如`less-loader`）往前执行`loader`，当执行到`postcss-loader`时，会读取`postcss.config.js`的配置，最后执行`css-loader`和`style-loader`。



## 3.4 importLoader

css-loader能够支持类似于`@import xxx.css`之类的css引入。

例如我们在`index.css`中用这种方法引入的`test.css`

```js
@import './test.css';
.div {
  color: red;
  font-size: 16px;
  /* 为了查看postcss-loader有没有效果 */
  user-select: none;
}
```

`test.css`内容如下：

```css
body {
  background-color: antiquewhite;
  min-height: 100vh;
  user-select: none;
}
```

但是根据目前配置，当`css-loader`识别到这个代码时，`postcss-loader`已经加载过了，就会导致`test.css`无法获得`postcss`的支持，所以需要修改`css-loader`的配置。

```js
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1, // 期望往回加载的位数，1代表往回1位-也就是postcss-loader加载
            },
          },
          'postcss-loader',
        ], //注意顺序，webpack从右到左读取loader
      },
      {
        test: /\.less$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
      },
    ],
  },
```

当`css-loader`读取到新的css时（此时可能这段新的css没有被postcss-loader处理过），配置了`options.importLoaders`属性后，会重新往回找`options.importLoaders`位，再依次往后重新loader一遍。

上面的例子是往回1位找`postcss-loader`。如果此时`postcss-loader`前还有`other-loader`，我们又希望它能够加载，那么可以填2。

## 3.5 file-loader打包图片

实际开发中，我们会将图片等资源放到一个叫`assets`的目录下。现在我们在`src`目录下创建`assets`目录，然后随便放一张图片进去。

随后在`index.js`中加入以下代码

```js
import animal from './assets/animal.jpg';
// 或 const animal= require('./assets/animal.jpg')

function createImg() {
  const img = new Image();
  img.src = animal;
  document.body.append(img);
}
createImg();
```

然后下载

```bash
yarn add file-loader --dev
```

配置：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1, // 期望往回加载的位数，1代表往回1位-也就是postcss-loader加载
              esModule: false, // 这里需要关闭esModule
            },
          },
          'postcss-loader',
        ], //注意顺序，webpack从右到左读取loader
      },
    // ...省略其他loader
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false, //不转为 esModule
              name: '[name].[hash:6].[ext]',//按照name+6位hash+扩展名的规则来命名
              outputPath:'image' //输出目录
            },
          },
        ],
      },
    ],
  },
};
```

如果不配置`options.esModule`，则需要使用`require().default`或者仅使用`import xx from 'xxx' `语句。

除此之外，还需要在`css-loader`处关闭esModule，这是因为类似于下面的代码，会被替换成`require`语法，替换成`require`语法后，需要用`.default`才能正常访问，这是不符合正常开发习惯的。

```css
// index.css
.div {
  background: url('./assets/animal.jpg');/*会被替换成require('./assets/animal.jpg') */
}
```

> 请在index.css上加入上面的代码，然后删除css-loader处的`esModule:false`代码测试一下。



## 3.6 url-loader打包图片

`url-loader`包含了`file-loader`的功能，此外它还可以将图片等资源打包成base64的形式，这样打包后的`dist`目录下就不会有对应的静态资源了，资源会转化成base64代码储存在打包后的`bundle.js`中。

好处是减少了静态资源的请求，坏处是静态资源越大，页面显示出来所需要的时间就越长。

我们开发时，一般都将体积小于10kb或者20kb的转成base64。

请在`assets`目录下分别放置一张20kb以上和一张20kb以下的图片，然后在`index.js`中引入比较大的图片，在`index.css`中引入比较小的图片

```js
// index.js
import dp from './assets/dp.png';// 这是比较大的图片
function createImg() {
  const img = new Image();
  img.src = dp;
  document.body.append(img);
}
```

```css
// index.css
.div {
  background: url('./assets/animal.jpg');/* 这是比较小的图片 */
}
```

然后下载

```bash
yarn add url-loader --dev
```

将原来的`file-loader`配置修改成以下：

```js
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false, //不转为 esModule
              name: '[name].[hash:6].[ext]', //按照name+6位hash+扩展名的规则来命名
              outputPath: 'image', //输出目录
              limit: 20 * 1024, // 限制20kb以下才打包成base64
            },
          },
        ],
      },
```

**请删除原来的`dist`目录**，然后重新打包，你会看到新生成的`dist`目录只有一个大的图片被打包了

<img src="../assets/image-20220125162407810.png" alt="image-20220125162407810" style="zoom:50%;" />

这是因为我们的配置是将20kb以下的图片转成base64的代码，而20kb以上的依然打包到`image`目录下。

## 3.7 asset模块打包静态资源

webpack5内置了asset模块，它包含了`file-loader`和`url-loader`这两个旧模块的功能。

如果我们希望asset模块将所有静态资源以相同的命名规则打包到相同的目录下，则可以在`output.assetModuleFilename`中配置。

```js
  output: {
    ...
    assetModuleFilename: 'asset/[name].[hash:6][ext]', //asset模块全局配置
  },
```

> 由于静态资源的种类较多，包含图片、文件、字体等，所以一般不用全局配置。

如果我们希望有`file-loader`的功能，可以使用`asset/resource`

```js
  module: {
    rules: [
    ...
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name].[hash:6][ext]',
        },
      },
    ],
  }
```

如果希望有`url-loader`的功能，可以使用`asset/inline`

```js
  module: {
    rules: [
    ...
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/inline',
      },
    ],
  }
```

如果希望混用，则直接使用`asset`

```js
  module: {
    rules: [
    ...
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/[name].[hash:6][ext]', //输出规则
        },
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024, // 小于20kb则解析成dataUrl
          },
        },
      },
    ],
  }
```

我在这里直接使用`asset`混用模式的配置来**替换**掉上面的`url-loader`模块。

> 请删除原来的dist目录再重新打包试一试。由于目前没配plugin，所以只能手动清除原有的dist目录。

## 3.8 使用plugin在打包前删除dist

> 注意：webpack5内置了此功能。
>
> 在webpack.config.js中设置成`output.clean为true即可`
>
> ```diff
>  module.exports = {
>    ...
>    output: {
>      filename: '[name].bundle.js',
>      path: path.resolve(__dirname, 'dist'),
> +    clean: true,
>    },
>  };
> ```

以下为旧方法：

——分割线——

webpack在打包时并不会删除原有的`dist`目录，而是在其基础上替换内容，所以我们需要手动删除`dist`目录，下面介绍打包时自动帮我们先删除`dist`目录的`plugin`。

```bash
yarn add clean-webpack-plugin --dev
```

使用：

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
  ...
  },
  mode: 'development',
  module: {
  ...
  },
  plugins: [new CleanWebpackPlugin()],//插件会被当成类来用
};
```

这里有一点需要注意：我们需要手动设置上`output.path`。

`clean-webpack-plugin`在执行时，会读取`webpack.config.js`中的`output.path`，如果没加上的话，会报错：

```bash
clean-webpack-plugin: options.output.path not defined. Plugin disabled...
```

## 3.9 打包字体

`assets/resource`还可以用来打包字体，配置如下：

```js
  module: {
    rules: [
    ...
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:3][ext]', //输出规则
        },
      },
    ],
  }
```

## 3.10 html-webpack-plugin

这个插件用于生成`index.html`。

用它可以指定一个`html`模板，每次打包后，webpack会用该模板新生成一个`index.html`，并且自动引入打包好的资源。

插件内置`.ejs`文件作为模板，我们也可以手动指定自己写好的模板,下面是使用自己创建的模板的示例：

在根目录的`public`目录下，创建了一个`template.html`的模板，内容如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="<%=BASE_URL %>favicon.ico" />
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

下载

```bash
yarn add html-webpack-plugin --dev
```

插件配置：

```js
const { DefinePlugin } = require('webpack');//webpack自带的初始化插件
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
  	...
  },
  mode: 'development',
  module: {
    rules: [
    ...
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'my APP',
      template: './public/template.html', //指定index.html模板而不用插件内置的ejs模板
    }),
    new DefinePlugin({
      BASE_URL: '"./"', // 可以替换模板中的<%=BASE_URL %> 为”./“
    }),
  ],
};
```

执行`yarn build`后，请用chrome打开`dist/index.html`，会看到这个模板已经将打包好的资源都引入过来了。

这样就节省了我们手动引入资源到`index.html`下的繁琐环节了。

到这为止，我们就可以将根目录下的`index.html`删除掉了。

## 3.11 babel的使用

为了让浏览器平台直接使用`JSX`、`TS`、`es6`等代码，在打包前，可以用babel插件转换一下语法。

下载

```bash
yarn add @babel/core --dev // babel核心，需要跟各种插件配合
yarn add @babel/preset-env --dev // babel预设的插件集合
yarn add babel-loader --dev // babel的webpack loader
```

在项目`src`目录下，创建`es6.js`,内容如下：

```js
export const a = () => {
  const arr = [1, 2, 3];
  const arr2 = [...arr];
  const [a, ...rest] = arr2;
  console.log(a);
  console.log(rest);
};
```

然后在`index.js`中，引入并执行：

```js
import { a } from './es6';
a();
```

跟postcss一样，babel中包含大量的插件，比较好的实践是我们单独在根目录下创建`babel.config.js`

```js
// babel.config.js
module.exports = {
  presets: ['@babel/preset-env'],
};
```

在`webpack.config.js`中配置：

```js
// webpack.config.js 
  module: {
    rules: [
      {
        test: /\.js$/i,
        use: ['babel-loader'],
      },
    ],
  }
```

构建后打开`bundle.js`，仔细翻一下，可以看到我们的代码被转译了：

![image-20220125175124865](../assets/image-20220125175124865.png)

## 3.12 copy-webpack-plugin

实际项目中，有时候我们并不希望资源被打包，而仅仅是拷贝到dist目录下就行。

比如，开发时会把要打包的静态资源放到`src/assets`中，一些直接拿来就可以用的静态资源则会放到`public`目录下，然后`build`时在`public`目录下的资源我们希望它们可以不经过`loader`处理，直接被拷贝至`dist`目录，这样发布线上后可以直接使用。

这样的需求下，我们可以使用`copy-webpack-plugin`来帮我们做这件事。

安装：

```bash
yarn add copy-webpack-plugin --dev
```

在根目录下的`public`内放置一张图片或者其他静态资源，目前我的`public`目录结构是这样的：

```js
.
├── dp.png
├── template.html
```

其中`dp.png`是我需要直接拷贝到`dist`目录内的静态资源，`template.html`是模板。

接着在`index.js`中把原来的`createImage`函数修改成这样：

```js
function createImg() {
  const img = new Image();
  // 注意，这里不再使用require或者import语句，因为不需要经过打包，直接用拷贝到dist内的资源
  img.src = './dp.png'; 
  document.body.append(img);
}
```

我们在引用该静态资源时，已经预先知道它会被拷贝到`dist`目录下了，所以可以直接用`./`而不是`require`或`import`。

实际开发中，我们有时候也会这样用静态资源，很多框架就提供了这样的功能，一些特别大的静态资源（例如地图）等，我们并不需要它们再被打包工具“翻译”一遍，而是直接拷贝到`dist`目录，在这种情况下，我们就能够直接使用`./`的形式引入这些静态资源。

接着补充配置

```js
  plugins: [
  ...
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/template.html'], // 忽略public下的template.html
          },
        },
      ],
    }),
  ],
```

当前`public`下的`template.html`会被`html-webpack-plugin`拷贝到`dist`目录下并被读写成`index.html`模板，所以我们在这里就忽略它。

毫无疑问，如果你的项目中不需要被打包的静态资源特别多，那使用这种拷贝的方式能够大大提高上线前构建的速度。



## 3.13 编译TS

支持TS语法需要安装`typescript`和执行`tsc --init`

```bash
yarn add typescript @types/react --dev
yarn add ts-loader --dev
tsc --init  // 初始化`tsconfig.json`文件
```

在`tsconfig.json`文件中开启`sourceMap`以及开启jsx语法

```json
"compilerOptions": {
  "jsx": "react",
  "sourceMap": true,
  ...
}
```

最后配置

```javascript
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [
      ...
      {
        test: /\.tsx?$/i,
        use: ['ts-loader'],
      },
    ],
  },
};
```

这里有个小插曲，我们已经在项目中使用了babel，根据官方文档的一篇介绍，我觉得我们可以使用另一个loader

> Note that if you're already using [`babel-loader`](https://github.com/babel/babel-loader) to transpile your code, you can use [`@babel/preset-typescript`](https://babeljs.io/docs/en/babel-preset-typescript) and let Babel handle both your JavaScript and TypeScript files instead of using an additional loader. Keep in mind that, contrary to `ts-loader`, the underlying [`@babel/plugin-transform-typescript`](https://babeljs.io/docs/en/babel-plugin-transform-typescript) plugin does not perform any type checking.

> 注意如果你已经使用了`babel-loader`去转译你的代码，你可以使用`@babel/preset-typesctipt`让`babel`去处理你的`jvascript`以及`typesctipt`代码来替代其他额外的loader。请记住，与 ts-loader 不同，底层的 @babel/plugin-transform-typescript 插件不执行任何类型检查。

这种情况下需要下载`@babel/preset-typescript`

```
yarn add @babel/preset-typescript --dev
```

修改配置：

```diff
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [
      ...
      {
        test: /\.tsx?$/i,
-       use: ['ts-loader'],
+       use: ['babel-loader'],
      },
    ],
  },
};
```

添加`babel`的预设

```diff
// babel.config.js
module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
+    '@babel/preset-typescript',
  ],
  plugins: [['react-refresh/babel']],
};
```

## 3.14 打包CSV、TSV 和 XML

webpack内置支持json，但如果项目要导入csv、tsv、xml等资源，需要另外安装loader

```bash
yarn add csv-loader xml-loader --dev
```

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [
      ...
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader'],
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader'],
      },
    ],
  },
};
```

## 3.15 区分生产、打包环境

如何区分生产、打包环境其实官网上已经有详细的介绍了，简单来说，就是将`webpack.config.js`分成三个文件

```diff
  webpack-demo
  |- package.json
  |- package-lock.json
- |- webpack.config.js
+ |- webpack.common.js
+ |- webpack.dev.js
+ |- webpack.prod.js
```

其中dev.js是存放开发环境要用的配置，prod.js存放生产环境要用的配置，common.js则存放两者都要用的配置。

比如，common.js会放置入口、出口、必须的插件、必须的loader等

**webpack.common.js**

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   entry: {
     app: './src/index.js',
   },
   plugins: [
     new HtmlWebpackPlugin({
       title: 'Production',
     }),
   ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
     clean: true,
   },
 };
```

`dev.js`则存放开发时要用的devServer之类的配置,`mode`是一定要写的（也可以通过脚本命令传递模式）

```js
 const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');

 module.exports = merge(common, {
   mode: 'development',
   devtool: 'inline-source-map',
   devServer: {
     static: './dist',
   },
 });
```

`prod.js`则存放生产环境要用的插件之类的

```js
 const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');

 module.exports = merge(common, {
   mode: 'production',
 });
```

其中`dev.js`和`prod.js`是通过webpack提供的merge函数对common.js的配置进行合并。

最后在package.json中设置脚本命令对应不同的`config.js`即可

```js
  "scripts": {
    "build": "webpack --config ./webpack.prod.js",
    "dev": "webpack serve --config ./webpack.dev.js"
  },
```

区分生产、开发环境的难点在于需要根据环境理清每个配置项、插件、loader。

## 3.16 小结

在这个环节，我们利用`webpack`替我们打包了一些资源，由于篇幅原因，这里没办法具体讲到所有静态资源。

落实到实际开发也是如此。我们没办法考虑到所有因素，只能在遇到实际问题时再对症下药，去寻找网上提供的方案，再配置`webpack`帮助我们解决这些问题。

好在很多优秀的模板，例如`next.js`，`umi.js`等，得益于这些集成型前端框架的作者，或由于其高超的技术水平，或脱胎于大量实际场景，我们获得了配套的、成熟的webpack配置，开箱即用。

我们可以参考它们的配置来做细小的优化或者更多的扩展。

`webpack`除了拥有几乎所有类型的静态资源的打包能力，对前端开发来说，更重要的是它带来的不一样的开发体验。这对于从远古时期一路走来的前端er来说，是革命性的创举，同时也真正让前端拥有模块化开发的感受。

下面介绍webpack配套的开发工具。

# 四、开发工具

## 4.1 webpack-dev-server

实际开发中，我们都会用到`webpack-dev-server`这样的静态服务器协助开发，它的好处是能够自动监控文件的修改，而且不用打包就能够直接预览效果。

>  当前我们的方案是每次修改后执行yarn build打包然后用`live-server`预览打包后的项目页面。
>
>  它有以下缺点：
>
>  * 每次修改后都需要重新将所有的源码编译打包一次
>  * 每次编译成功后都需要进行文件读写，性能开销大
>  * 不能实现局部刷新

而webpack的`webpack-dev-server`能够提供热更新、无需打包即可预览的功能，完美解决上述的问题。

首先我们在package.json的`script`里创建脚本命令：

```javascript
  "scripts": {
    ...
    "dev": "webpack serve"
  },
```

然后安装

```bash
yarn add -D webpack-dev-server
```

修改配置文件，告知 dev server，从什么位置查找文件：

```diff
 module.exports = {
  ...
+  devServer: {
+    static: './dist',
+  },
 ...
 };
```

以上配置告知 `webpack-dev-server`，将 `dist` 目录下的文件 serve 到 `localhost:8080` 下。

> serve，将资源作为 server 的可访问文件

接着使用命令

```bash
yarn dev
```

`webpack-dev-server`就启动好了

```bash
<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:8080/
<i> [webpack-dev-server] On Your Network (IPv4): http://192.168.199.229:8080/
```

接着我们进入`http://localhost:8080/`就可以预览效果。

此时可以删除`dist`目录，并且任意修改各个地方的源代码，修改后保存，`webpack-dev-server`会监听到文件有修改，于是会实时重新加载。

> `Webpack-dev-server`默认会查找`webpack.config.js`。
>
> 如果你的`webpack`配置文件不是默认的`webpack.config.js`，假设这里叫`wb.config.js`那么package.json需要这么配
>
> ```javascript
> "scripts": {
>  "build": "webpack --config wb.config.js",
>  "dev": "webpack serve --config wb.config.js"
> },
> ```

`webpack-dev-server`的热更新功能主要是将数据保存在缓存当中，每次启动后，都去缓存中更新数据，这样的好处是提高开发效率，减少文件读写，提升静态服务器的性能。

想要获得热更新功能，我们需要手动开启HMR。

## 4.2 HMR功能

HMR是hot module replacement的简写，翻译过来就是模块热替换。

它允许在运行时更新所有类型的模块，而无需完全刷新。

当前的开发模式是组件化开发，当我们修改其中一个组件时，启动HMR功能则会让浏览器只对局部发生源代码改变的组件进行更新展示，不需要全部刷新一遍。

`webpack5`已经内置了这样的功能，我们只需要开启它就行

```diff
 module.exports = {
  ...
  devServer: {
    static: './dist',
+   hot: true,
  },
 ...
 };
```

然后我们需要在入口文件（我这里是`src/index.js`）内写上需要热更新模块的代码

```diff
// src/index.js

/* ...省略其他代码...*/
+if (module.hot) {
+  module.hot.accept(['./es6.js'], function () {
+    console.log('Accepting the updated printMe module!');
+  });
+}
```

在上面的代码中，数组的每个项是需要热更新文件的路径。当这些文件的源码修改后，就会触发局部更新，然后执行`callback`。

当前我的项目中`es6.js`文件修改了任何代码都只会局部刷新，并且热替换完成后会打印`Accepting the updated printMe module!`



## 4.3 打包React组件jsx

打包jsx的代码依然需要用到babel，我们需要安装以下插件（其中章节【babel的使用】已经用了前三个 ）：

```bash
yarn add @babel/core --dev // babel核心，需要跟各种插件配合
yarn add @babel/preset-env --dev // babel预设的插件集合
yarn add babel-loader --dev // babel的webpack loader
yarn add @babel/preset-react --dev
```

接着安装`react`

```bash
yarn add react react-dom
```

然后在`index.js`中添加如下代码

```javascript
import App from './App.jsx';
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';

const rootElement = document.getElementById('root');
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);
```

接着新建`App.jsx`,内容如下：

```jsx
import React from 'react';

const App = () => {
  return <div>hello world</div>;
};

export default App;
```

下面修改配置：

```diff
// webpack.config.js 
  module: {
    rules: [
    ...
-      {
-        test: /\.js$/i,
-        use: ['babel-loader'],
-      },
+      {
+        test: /\.jsx?$/i,
+        use: ['babel-loader'],
+      },
    ],
  }
```

最后在babel.config.js中添加`@babel/preset-react`即可

```javascript
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
};
```

## 4.4 React组件热更新

下面实现React组件热更新的功能

安装

```javascript
yarn add @pmmmwh/react-refresh-webpack-plugin react-refresh --dev
```

在`webpack.config.js`中添加插件

```diff
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
  	...
  },
  mode: 'development',
  module: {
    rules: [
    ...
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'my APP',
      template: './public/template.html', //指定index.html模板而不用插件内置的ejs模板
    }),
    new DefinePlugin({
      BASE_URL: '"./"', // 可以替换模板中的<%=BASE_URL %> 为”./“
    }),
+   new ReactRefreshWebpackPlugin(),
  ],
};
```

当前是启动`babel`插件来`loader`React组件的，我们还需要到`babel.config.js`中添加插件

```diff
// babel.config.js
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
+ plugins: [['react-refresh/babel']],
};
```

下面测试一下：

在`src`目录下新建一个`Hello.jsx`,内容如下：

```jsx
import React from 'react';

const Hello = () => {
  return (
    <section>
      <input type='text' />
    </section>
  );
};

export default Hello;
```

然后到`App.jsx`中使用这个组件

```diff
import React from 'react';
+ import Hello from './Hello.jsx';

const App = () => {
  return (
    <div>
      hello231
+     <Hello />
    </div>
  );
};

export default App;
```

打开`localhost:8080`,然后在输入框中输入任意内容：

![image-20220126130554796](../assets/image-20220126130554796.png)

为了测试组件是否支持热更新，我们在`App`组件中任意修改内容，这里就把`hello231`修改成`hello i am qiuyanxi`。

按照我们的设想，App组件的修改不会影响到`Hello`组件，所以原来在输入框中输入的内容依然会存在。

保存后，查看一下页面，成功了

![image-20220126131056353](../assets/image-20220126131056353.png)

查看`chrome`控制台提示

```bash
[HMR] Updated modules:
[HMR]  - ./src/App.jsx
[HMR] App is up to date.
```

## 4.5 Vue组件热更新

`Vue`组件需要用`Vue-loader`加载

```bash
yarn add vue-loader --dev
```

相对于React来说，Vue的配置简单很多。Vue组件默认支持HMR功能，因此我们不需要额外配置。

```diff
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports={
		...
  module: {
    rules: [
    ...
+      {
+        test: /\.vue$/i,
+        use: ['vue-loader'],
+      },
    ],
  }
  plugins: [
		...
+   new VueLoaderPlugin(),
  ],  
}
```



## 4.6 output.publicPath

在打包时，`output.publicPath`属性影响打包后的`index.html`内部的引用路径。

当不设置或者设置成空字符串时，打包后的资源会通过`origin`+`/`+`output.filename`来获取资源

举个例子：

当前我的设置如下：

```javascript
module.exports={
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '',// 也可以不设置，默认为空字符串
  },
}
```

那么打包后的脚本被这样引用

```html
<script defer src="bundle.js"></script>
```

当我们开启`http-server`去访问本地`http://127.0.0.0`时，会自动访问到`http://127.0.0.0/bundle.js`

浏览器会自动帮我们加上`/`。

为了保险起见，我们将`output.publicPath`设置成`/`

```diff
module.exports={
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
+    publicPath: '/',
  },
}
```

这样打包后的脚本引用方式就变成这样

```html
<script defer src="/bundle.js"></script>
```

相当于我们手动加上了`/`。

> 原来版本不知道是webpack的bug还是浏览器的bug，加上/后可能导致build后的资源无法在本地被访问，在笔者写这篇博客时，已经没有这个问题了。——本地静态服务器用的是http-server

## 4.7 devServer常用配置

`devServer.hot`:开启HMR时，我们将其设置成了true，但是更好的做法是设置成`only`，因为在构建失败时不刷新页面作为回退。举个例子，当你在某个组件上写错代码时，设置成`only`不会自动重新刷新全部的组件。

`devServer.open`:设置成`true`后，启动server服务时，自动打开浏览器

`devServer.port`:设置端口号

`devServer.historyApiFallback`:使用 HTML5 History API 时，可能必须提供 index.html 页面来代替任何 404 响应。

```js
  devServer: {
    static: './dist',
    hot: 'only', // 构建失败时不刷新页面作为回退
    open: true, // 自动打开浏览器
    port: 8888, // 端口号
    compress: true, // 自动压缩
    historyApiFallback: true,
  },
```

比较值得说的是`devServer.historyApiFallback`，下面我们创建目录`src/components`，再在里面新建几个两个React组件，如下：

```bash
components
├── About.jsx
└── Home.jsx
```

内容如下：

```jsx
// Home.jsx
import React from 'react';

const Home = () => {
  return <div>Home</div>;
};

export default Home;
```

```jsx
// About.jsx
import React from 'react';

const About = () => {
  return <div>about</div>;
};

export default About;
```

再修改`App.jsx`的源代码

```diff
import React from 'react';
import Hello from './Hello.jsx';
+ import Home from './components/Home.jsx';
+ import About from './components/About.jsx';
+ import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const App = () => {
  return (
    <div>
      hello i am qiuyanxi
      <Hello />
+      <BrowserRouter>
+        <Link to='/home'>Home</Link>
+        <br />
+        <Link to='/about'>About</Link>
+        <Routes>
+          <Route path='/home' element={<Home />} />
+          <Route path='about' element={<About />} />
+        </Routes>
+      </BrowserRouter>
    </div>
  );
};

export default App;
```

现在我们进入页面`http://localhost:8888/about`,刷新一下。

如果没有配置`historyApiFallback`,则会提示404。因为此时类似于向后端请求接口，而`/about`是前端路由，所以报404了。

如果配置了`historyApiFallback`,则会出现正确的页面。

## 4.8 proxy设置

在我们开发过程中，请求后端接口时，经常遇到跨域问题。

此时就需要使用代理转发一下请求。

配置如下:

```diff
  devServer: {
  	...
+    proxy: {
+      '/api': {
+        target: 'https://api.github.com',
+        pathRewrite: { '^/api': '' }, // 把/api重写为空
+        changeOrigin: true, // 修改主机来源，一般情况下不需要设置
+      },
+    },
  },
```

举个例子，现在有个现成的github接口：

```js
https://api.github.com/users
```

我在本地通过设置好上面的代理后，再通过`axios`访问

```js
axios.get('/api/users').then(res => {
  console.log('res.data:', res.data);
});
```

如果没有写`pathRewrite`,就将请求转发到了`https://api.github.com/api/users`上。

如果不希望传递`/api`，则需要通过`pathRewrite`重写路径。重写后转发到`https://api.github.com/users`

> 默认情况下，代理时会保留主机头的来源。
>
> `https://api.github.com/users`这个接口通过判断来源来响应数据，我们可以通过设置`changeOrigin: true`来绕过github的判断。一般开发时并不需要这样设置

## 4.9 resolve解析规则

webpack内部有自己的一套解析规则，我们也可以通过`resolve`设置来修改它。

常见的有

1. `alias`：设置别名

   ```js
       alias: {
         '@': path.resolve(__dirname, 'src'),
       },
   ```

   设置以上的别名后，可以通过`import xxx from '@/xx'`来引入根目录下`src`目录的xx文件。

2. `enforceExtension`：是否允许导入时有扩展名。

3. `extensions`:尝试按顺序解析后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。

   举个例子,当前配置如下：

   ```js
     resolve: {
       extensions: ['.js', '.jsx', '.tsx'],
     },
   ```

   当我修改如下代码后：

   ```diff
   - import Home from './components/Home.jsx
   // 修改成
   + import Home from './components/Home
   ```

   `Webpack`会按照`extensions`属性自动加上后缀名。如果加上后缀名后依然没有找到文件，就会报错。

4. `mainFiles`:解析目录时要使用的文件名。

   假设当前有个`components`目录，我在某个地方这样`import`：

   ```js
   import xx from './components'
   ```

   如果此时`resolve`设置为`mainFiles: ['index']`,则会引入`components`目录下的`index`文件。

## 4.10 source map

顾名思义，source map是源代码映射。

如果没有配置`source map`,那浏览器的报错信息显示将会是打包后的对应位置

比如我在`index.js`内写这样一段代码

```js
console.log(abc);
```

在没有声明的情况下，浏览器会报错

![image-20220126190438414](../assets/image-20220126190438414.png)

此时定位的代码错误显示是在打包后的`bundle.js`中。这对于程序员来说基本无用。

程序员希望得到的信息是：在源代码中的哪一个文件哪一行出问题了。

于是`source map`出场了，它可以定位到源代码中的信息。

在`webpack.config.js`中添加配置：

```diff
module.exports = {
 ...
  mode: 'development',
+  devtool: 'source-map',
}
```

此时`yarn dev`后就可以看到源代码中的错误信息了

![image-20220126191425180](../assets/image-20220126191425180.png)

它的原理是，在打包后，生成一份`map`映射文件，它能够体现`bundle.js`和源代码的映射关系。

你可以通过`yarn build`后看到它。



# 五、关于优化

webpack是用来编译、打包的，所以能够优化的无非两种：更快、更小。

## 如何更快——优化打包速度

打包速度影响到的是开发过程中的热更新速度以及上线前的构建速度。

通过以下方式我们可以优化打包速度：

### mode参数

webpack内部对`production`或者`development`有做优化，所以针对开发和生产环境我们需要配置不同的`mode`。

### resolve配置

通过`resolve`解析规则，我们可以手动控制`webpack`的查找规则，除了对开发友好外，相当于显式告诉`webpack`利用`resolve`中的配置规则查找文件，合理的配置会提高`webpack`查找文件的效率。

* **alias设置别名**

  通过`alisa`设置别名可以让`webpack`通过规则项从上到下查找文件，而不是递归查找。

  ```js
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
  ```

  通过上面的别名设置，除了让我们开发时可以通过`import xx from '@/xxx'` 引用`src`目录下的内容以外，还对`webpack`的查找规则非常友好——`webpack`知道可以`src`目录从上到下查找文件，而不是通过相对路径递归向上查找文件。

* **extensions高频扩展名前置**

  通过设置`extensions`可以在引入时不写扩展名。

  ```
    resolve: {
      extensions: ['.js', '.jsx', '.tsx'],
    },
  ```

  webpack会从前到后遍历`extensions`属性来匹配是否有对应扩展名的文件，一些高频的后缀放在前面可以提高webpack搜索的速度

* **`modules`告诉webpack 解析模块时应该搜索的目录**

  ```js
  const path = require('path');
  
  module.exports = {
    //...
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  };
  ```

  上面的代码将告诉`webpack`搜索`src`目录和`node_modules`目录，`src`目录优先搜索。

  这样有助于加快搜索时间

### cache属性

```javascript
module.exports = {
  //...
  cache: {
    type: 'filesystem',
  },
};
```

通过设置cache属性为文件系统缓存生成的 webpack 模块和 chunk，来改善构建速度。

###  thread-loader

在耗时的操作中使用此loader可以生成独立的worker池。每个 worker 都是一个独立的 node.js 进程。

相当于开启了多进程来处理耗时慢的`loader`，这样就达到了多`loader`同时处理的效果。

下面是官方文档的示例：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('src'),
        use: [
          "thread-loader",
          // 耗时的 loader （例如 babel-loader）
        ],
      },
    ],
  },
};
```



## 如何更小——缩小打包体积

缩小打包体积的思路有利用一些plugin来缩小代码量，或者利用webpack的Tree-shaking功能来删除没用过的代码。

### 压缩css

[Optimize CSS Assets Webpack Plugin](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin)

使用方式参照官方文档

```javascript
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
  module: {
  ...
  },
  plugins: [
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    })
  ]
};
```

### 压缩bundle

通过webpack内置的[optimization](https://webpack.docschina.org/configuration/optimization/#optimizationminimizer)属性开启压缩功能。

```javascript
module.exports = {
  //...
  optimization: {
    minimize: true,
  },
};
```

### Tree Shaking

*tree shaking* 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。

`webpack`内置这个功能，只需要通过`mode:"production"`来开启就行。



## 最后

webpack生态太庞大了，而且变更非常快。

不单单是生态、插件、配置项的变化，包括优化方案变化都非常快。

本篇博客作为入门，只能提供一个构思，尽可能结合实际开发来解释`webpack`对我们的作用。

如果你详细看完了本篇博客，就可以去啃一啃`webpack`官方文档的配置说明了。

最后建议大家⭐️**使用vite**⭐️，手动狗头

新年快乐，我们下期再见👋🏻👋🏻

# 六、参考来源

[webpack-guides](https://webpack.docschina.org/guides/)

[Webpack实战：入门、进阶与调优](https://weread.qq.com/web/reader/8fc322d07185cc948fc5aa8)





