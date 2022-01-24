

## 1.8 postcss

postcss是利用JavaScript转换样式的工具。我们可以用它配合`autoprefixer`来给css添加更多兼容性的前缀代码以支持更多浏览器平台。

```bash
yarn add postcss autoprefixer postcss-loader --dev
```

配置：

```json
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

postcss中还有很多有关于css加载所需要的插件，都集成到`postcss-preset-env`的插件中了，比如能够让浏览器支持`#12345678`这样的八位数颜色以及`autoprefixer`支持的功能。

使用方法：

```bash
yarn add postcss-preset-env --dev
```

直接配置在`options.postcssOptions.plugins`中即可

```json
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              },
```

### **专用的postcss配置**

我们可以使用less、css等来书写css，而postcss则需要体现到所有css上，因此我们需要给所有css预编译工具配置postcss-loader，但这就会增加大量重复的配置代码。

为了解决这个问题，我们可以使用默认的`postcss.config.js`来给postcss做共同的配置。

```js
// postcss.config.js
module.exports = {
  plugins: ['postcss-preset-env'],
};
```

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

## 1.9 importLoader

css-loader能够支持类似于`@import xxx.css`之类的css引入。

例如下面的写法，可以让css-loader识别并打包`test.css`中的代码

```css
// login.css
@import './test.css';
h1 {
  color: red;
}
```

但是根据目前配置，当`css-loader`识别到这个代码时，`postcss-loader`已经加载过了，就会导致`test.css`无法获得`postcss`的支持，所以需要修改`css-loader`的配置。

```json
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
        ],
      },
    ],
  },
```

当`css-loader`读取到新的css时（此时可能这段新的css没有被postcss-loader处理过），配置了`options.importLoaders`属性后，会重新往回找`options.importLoaders`位，再依次往后重新loader一遍。

上面的例子是往回1位找`postcss-loader`。如果此时`postcss-loader`前还有`other-loader`，我们又希望它能够加载，那么可以填2。

## 2.0 file-loader打包图片

`file-loader`会将资源拷贝至对应的目录。

```bash
yarn add file-loader --dev
```

使用

```js
import jpeg from '../public/http.jpeg';
// 或
require('../public/http.jpeg')
```

配置

```js
module.exports = {
  module: {
    rules: [
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

如果不配置`options.esModule`，则需要使用`require().default`或者`import xx from 'xxx' `语句。

除此之外，还需要在css-loader处关闭esModule，这是因为类似于下面的代码，会被替换成`require`语法，替换成`require`语法后，需要用`default`访问，这是不正确的。

```css
.bg {
  background: url('../public/http.jpeg');/*会被替换成require('../public/http.jpeg') */
}
```

配置

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
              esModule:false
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
```

## 2.1 url-loader打包图片

`url-loader`包含了`file-loader`的功能，此外它还可以将图片等资源打包成base64的形式，这样打包后的`dist`目录下就不会有对应的静态资源了，资源会转化成base64代码储存在打包后的`bundle.js`中。

好处是减少了静态资源的请求，坏处是静态资源越大，页面显示出来所需要的时间就越长。

```
yarn add url-loader --dev
```

```js
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false, //不转为 esModule
              name: '[name].[hash:6].[ext]',
              outputPath: 'image',
              limit: 20 * 1024, // 限制20kb以下才打包成base64
            },
          },
        ],
      },
    ],
  },
```

## 2.2 asset模块打包静态资源

webpack5内置了asset模块，它包含了`file-loader`和`url-loader`这两个旧模块的功能。

如果我们希望有`file-loader`的功能，可以使用`asset/resource`

```js
  module: {
    rules: [
    ...
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'asset/[name].[hash:6][ext]',
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

```javascript
  module: {
    rules: [
    ...
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        generator: {
          filename: 'asset/[name].[hash:6][ext]', //输出规则
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

**打包字体**

```js
  module: {
    rules: [
    ...
      {
        test: /\.(ttf|woff2?)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name].[hash:3][ext]', //输出规则
        },
      },
    ],
  }
```

如果我们希望asset模块将所有静态资源以相同的命名规则打包到相同的目录下，则可以在`output.assetModuleFilename`中配置。

```javascript
  output: {
    ...
    assetModuleFilename: 'asset/[name].[hash:6][ext]', //asset模块全局配置
  },
```



## 2.3 使用plugin在打包前删除dist

```bash
yarn add clean-webpack-plugin --dev
```

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
  entry: './src/index.js',
  output: {
  ...
  },
  mode: 'development',
  module: {
  ...
  },
  plugins: [new CleanWebpackPlugin()],//插件会被当成类来用
};
```

## 2.4 html-webpack-plugin

```bash
yarn add html-webpack-plugin --dev
```

这个插件用于生成`index.html`。

用它指定一个`index.html`模板，每次打包后，webpack会用模板新生成一个新的`index.html`，并且自动引入打包好的资源。

这个插件内置`.ejs`文件作为模板，我们也可以手动指定自己写好的模板,下面是使用自己创建的模板的示例：

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

插件配置：

```js
const { DefinePlugin } = require('webpack');//webpack自带的初始化插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
```

```js
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
```

## 2.5 babel的使用

为了让浏览器平台直接使用`JSX`、`TS`、`es6`等代码，在打包前，可以用babel插件转换一下语法。

```bash
yarn add @babel/plugin-transform-arrow-functions --dev // babel内置的转换箭头函数的插件
yarn add @babel/cli --dev // 利用命令行来使用babel功能
/** 上面两个是指定功能用的，非必需  **/
yarn add @babel/core --dev // babel核心，需要跟各种插件配合
yarn add @babel/preset-env --dev // babel预设的插件集合
yarn add babel-loader --dev // babel的webpack loader
```

配置

```js
  module: {
    rules: [
      {
        test: /\.js$/i,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  }
```

由于babel有非常多的插件需要管理，跟postcss一样，我们最好创建一个`babel.config.js`的文件来管理babel的配置。上面代码中的配置可以拆分如下：

```js
// babel.config.js
module.exports = {
  presets: ['@babel/preset-env'],
};
```

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

## 2.6 copy-webpack-plugin

实际项目中，有时候我们并不希望资源被打包，而仅仅是拷贝到dist目录下就行。

比如，我们开发时会把要打包的静态资源放到`src/assets`中，一些直接拿来就使用的静态资源则会放到`public`目录下，然后`build`时在`public`目录下的资源我们希望它们可以直接被拷贝至`dist`目录，这样发布线上后可以直接使用。

这样的需求下，我们可以使用`copy-webpack-plugin`来帮我们做这件事。

```bash
yarn add copy-webpack-plugin --dev
```

假设现在我在`public`目录下放了一张图片,目前public目录是这样的：

```bash
.
├── http.jpeg
├── template.html
```

`template.html`是用于打包后的需要生成的`index.html`的模板。`http.jpeg`我们希望直接被拷贝到`dist`目录内，那么可以这么配置：

```js
  plugins: [
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

