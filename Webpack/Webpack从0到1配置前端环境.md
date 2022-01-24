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

1. 从一个打算放在 HTML 中的 `<script type="module">` “主”模块开始。（Webpack默认从`index.js`开始）
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

   

## 1.5 Webpack五个核心概念

* `entry`：入口。指定打包工具从哪个文件开始构建内部依赖图，并以此为起点打包

* `output`：输出。指定打包好后的bundles资源最终输出到哪个地方，输出名字是什么

* `loader`：加载器。让webpack能够处理非js文件的翻译、打包工作。（例如less、image等静态资源）

* `plugin`：插件。让webpack能够处理打包优化、压缩、生成模板等功能性任务。

* `mode`：模式。development模式、production模式、none。能够设置`process.env.NODE_ENV`的值，并且根据环境不同自动开启一些插件。



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
div {
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
  document.body.append(div);
}
createElement();
```

## 2.2 打包第一个js文件

初始化好后，我们可以看到`index.html`上的`<script src="./dist/bundle.js"></script>`，目前我们的项目并没有创建`dist`这个目录，`bundle.js`也是不存在的，我们期望能够用`webpack`打包`index.js`的内容。

此时在命令行上输入：

```bash
npx webpack --entry=./src/index.js --output-filename=bundle.js --mode=development
```

`npx webpack`是在本地用`npx`启动`webpack`的意思

`--entry` 参数是寻找当前目录下的`src/index.js`文件

`--output-filename` 是指定输出的文件名

`--mode `指的是开发模式

此时，根目录下应该会多了`dist`目录，下面有一个`bundle.js`的文件，它就是打包后的`index.js`文件。

如果此时用`http-server`或者`vscode`的`open in browser`插件打开本地项目，你会发现`chrome`浏览器屏幕前输出现`hello world`字样，代表打包成功了。

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

```json
  output: {  path: path.join(__dirname, 'dist') } 
```

>  由于是默认配置所以webpack.config.js中省略了`output.path`的配置

写好配置项后，我们就可以去除`package.json`中配置的打包参数了。

```json
  "scripts": {
    "build": "webpack"
  },
```

执行`yarn build`后，`webpack`会预读`webpack.config.js`中的配置，再进行打包。

当构建后，请使用编辑器打开并在chrome上查看结果。



# 三、开始实战

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

`style-loader`用于将css插入到页面中，`css-loader`是用于识别并打包css文件。

配置完后，请用`yarn build`构建并在`chrome`上查看结果，以下不再提示。

## 3.2 打包less

我们先在`src`目录下增加一个`style.less`的文件，内容如下：

```css
div {
  background-color: aqua;
  width: 100px;
  height: 100px;
  border: 1px solid red;
}
```

然后在`index.css`中引入

```css
@import './style.less';
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



