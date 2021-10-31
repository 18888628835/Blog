# 第四章 单例模式

单例模式的定义是：保证一个类仅有一个实例，并提供一个访问它的全局访问点。

单例模式是一种常用的模式，有一些对象我们往往只需要一个，比如线程池、全局缓存、浏览器中的window对象等。

## 4.1 实现单例模式

要实现一个单例模式，只需要用一个变量来标识当前是否已为某个类创建过对象，如果是，则在下一次获取该类的实例时，直接返回之前创建的对象。

```javascript
        var Singleton = function( name ){
            this.name = name;
            this.instance = null;
        };

        Singleton.prototype.getName = function(){
            alert ( this.name );
        };

        Singleton.getInstance = function( name ){
            if ( ! this.instance ){
              this.instance = new Singleton( name );
            }
            return this.instance;
        };

        var a = Singleton.getInstance( 'sven1' );
        var b = Singleton.getInstance( 'sven2' );

        alert ( a === b );    // true
```

也可以使用闭包来完成这个功能

```javascript
var Singleton = function(name) {
  this.name = name;
};

Singleton.prototype.getName = function() {
  alert(this.name);
};


Singleton.getInstance = (function() {
  var instance = null
  return function(name) {
    if (!instance) {
      instance = new Singleton(name);
    }
    return instance;
  }

})();
```

这个方法非常简单，但是却增加了单例类的“不透明性”。跟以往通过new xxx来获取对象的方式不同，开发者必须知道这是一个单例类，并且通过`Singleton.getInstance`来获取Singleton类的对象。

## 4.2 透明的单例模式

下面代码是对上面的单例模式的一种改进，以创建唯一的div节点为例。

```JavaScript
var CreateDiv = (function() {

  var instance;

  CreateDiv = function(html) {
    if (instance) {
      return instance;
    }
    this.html = html;
    this.init();
    return instance = this;
  };

  CreateDiv.prototype.init = function() {
    var div = document.createElement('div');
    div.innerHTML = this.html;
    document.body.appendChild(div);
  };

  return CreateDiv;

})();

var a = new CreateDiv('sven1');
var b = new CreateDiv('sven2');

alert(a === b); // true
```

这个单例模式比较透明，为了将instance封装起来，使用了闭包和立即执行函数，并且返回了真正的构造函数。

这种方式增加了一些程序的复杂度，阅读起来也不是很舒服。

观察这段代码

```javascript
  CreateDiv = function(html) {
    if (instance) {
      return instance;
    }
    this.html = html;
    this.init();
    return instance = this;
  };
```

在这个构造函数中，一共负责了两件事情。第一是保证只有一个实例，第二是调用该函数的init函数，这违反了单一职责原则，让这个函数看起来很奇怪。

## 4.3 用代理实现单例模式

我们来对上面的CreateDiv构造函数进行改造，将返回单一实例的代码提炼出来，使它变成一个纯正的构造函数

```javascript
var CreateDiv = function(html) {
  this.html = html;
  this.init();
};

CreateDiv.prototype.init = function() {
  var div = document.createElement('div');
  div.innerHTML = this.html;
  document.body.appendChild(div);
};
```

然后引入一个代理类

```javascript
const proxySingletonCreateDiv = (function() {
  let instance
  return function(html) {
    if (!instance) {
      return instance = new CreateDiv(html)
    }
    return instance
  }
})()
```

现在我们把负责管理单例的逻辑移到了代理类proxySingletonCreateDiv中，它使职责划分更清晰，跟createDiv组合也可以产生单例模式的效果。

接下来测试一下

```javascript
var a = new proxySingletonCreateDiv('sven1');
var b = new proxySingletonCreateDiv('sven2');

alert(a === b); // true
```

## 4.4 JavaScript中的单例模式

前面的几种单例模式的实现，在传统的面向对象语言当中， 是非常自然的。以Java为例，如果需要某个对象，就必须先定义一个类，对象总是从类中创建而来。单例对象自然也是从类创建而来。

但在JavaScript中，创建对象非常简单，我们并不需要创建一个类。

这就意味着传统的单例模式并不适用于JavaScript。

**单例模式的核心是确保只有一个唯一的实例并提供给全局访问。**

全局变量不是单例模式，但在JavaScript中，我们可以将其当作单例来使用。

例如：

```JavaScript
var a ={}
```

全局对象提供给全局访问时理所当然的，这样就满足了单例模式的两个条件。

但全局变量也有问题。它会造成命名空间受污染。

以下有几种方式可以降低全局变量带来的命名污染。

1. 使用namespace

   最简单的方式是采取对象字面量的方式：

   ```javascript
   var namespace={
     a:function(){},
     b:function(){}
   }
   ```

   把需要的变量都定义为namespace的属性，这样可以减少变量和全局作用域打交道的机会。

   还可以动态创建全局命名空间

   ```javascript
   const myApp = {
     namespace(name) {
       var current = this
       var parts = name.split('.')
       for (let p of parts) {
         if (!current[p]) {
           current[p] = {}
         }
         current = current[p]
       }
     }
   }
   myApp.namespace('dom.style.classname')
   
   //上面的代码相当于
   var myApp={
     dom:{
       style:{
         classname:{}
       }
     }
   }
   ```

2. 使用闭包封装私有变量

   这种方法是将变量封装在闭包的内部，只暴露一些接口跟外部通信

   ```JavaScript
           var user = (function(){
               var __name = 'sven',
                 __age = 29;
   
               return {
                 getUserInfo: function(){
                     return __name + '-' + __age;
                 }
               }
   
           })();
   ```

   我们用下划线来约定私有变量`__name`和`__age`，它们被封装在闭包产生的作用域中，外部是访问不到这两个变量的，这就避免了对全局的命令污染

## 4.5 惰性单例

惰性单例指的是在需要的时候才创建对象实例。惰性单例是单例模式的终点，这种技术在实际开发中非常有用。

下面假设我们的网站上有一个登录按钮，当用户点击这个按钮后，会出现一个登录弹窗。很显然这个弹窗在页面中总是唯一的，不可能同时存在两个登录窗口的情况。

下面我们来写第一种解决方案：页面加载完成时创建好登录框，登录框是隐藏的，当用户点击登录按钮时，它才显示出来

```javascript
var loginLayer = (function() {
  var div = document.createElement('div');
  div.innerHTML = ’我是登录浮窗’;
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
})();

document.getElementById('loginBtn').onclick = function() {
  loginLayer.style.display = 'block';
};
```

这种方式的缺点在于该节点一开始就创建好了，如果用户没有点击登录按钮，那么创建该节点的操作就白白浪费了。

下面这种方式倒是可以在点击按钮时创建，但是每次都会创建多个div，也就违背了单例模式。

```javascript
var createLoginLayer = function() {
  var div = document.createElement('div');
  div.innerHTML = '我是登录浮窗';
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
};

document.getElementById('loginBtn').onclick = function() {
  const LoginLayer = createLoginLayer()
  LoginLayer.style.display = 'block';
};
```

我们只需要在上面代码的基础上用一个div进行判断是否创建过浮窗就可以实现单例模式了。

```javascript
var createLoginLayer = (function() {
  let div
  return function() {
    if (!div) {
      div = document.createElement('div');
      div.innerHTML = '我是登录浮窗';
      div.style.display = 'none';
      document.body.appendChild(div);
    }
    return div;
  }
})();

document.getElementById('loginBtn').onclick = function() {
  const LoginLayer = createLoginLayer()
  LoginLayer.style.display = 'block';
};
```

## 4.6 通用的单例模式

上面的单例模式虽然已经完成了功能，但是缺陷也很明显：

* 代码违背了单一原则，所有逻辑都放在createLoginLayer中
* 立即执行函数使得代码阅读起来不是很舒服
* 无法给其他需要单例模式的场景复用

我们先把不变的逻辑抽离出来，返回单例的逻辑始终是不变的，可以封装成一个通用的单例函数：用一个变量来标识是否创建过对象，如果是，则在下次直接返回这个已经创建好的对象，然后把需要执行什么函数通过参数传递给这个单例函数：

```javascript
var singleton = function(handler) {
  let result
  return function() {
    return result || (result = handler.apply(this, arguments))
  }
}
```

> 由于result始终在闭包里，所以它始终不会被销毁

然后修改创建登录浮窗的方法

```javascript
var createLoginLayer = function() {
  div = document.createElement('div');
  div.innerHTML = '我是登录浮窗';
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
}
```

使用：

```javascript
const createSingletonLoginLayer =singleton(createLoginLayer);

document.getElementById('loginBtn').onclick = function() {
  const LoginLayer = createSingletonLoginLayer()
  LoginLayer.style.display = 'block';
};
```

我们将两个创建实例对象的职责和管理单例的职责分别放置在两个方法里，这两个方法可以独立变化而互不影响，当它们连接在一起时，就完成了创建唯一实例对象的功能。

单例模式的应用不止创建一个唯一的对象，也可以用在只处理一遍的业务场景上。

jquey有一个one方法，它可以为元素添加处理函数。处理函数在每个元素上每种事件类型都只处理一次。

```javascript
$("#foo").one("click", function() {
  alert("This will be displayed only once.");
});
```

使用getSingleton也可以达到一样的效果

```javascript
      var singleton = function (handler) {
        var result;
        return function () {
          return result || (result = handler.apply(this, arguments));
        };
      };
      var bindEvent = singleton(function () {
        alert(123);
        return true;
      });

      document.getElementById("loginBtn").onclick = bindEvent;
```

## 4.7 小结

由于语言之间的差异性，传统的单例模式跟JavaScript中创建单例的方法并不相同。

在JavaScript的单例模式中，更多的是运用闭包和高阶函数来实现单例模式。

单例模式非常简单且实用，特别是惰性单例技术，在合适的时候才创建对象，并且只创建唯一的一个对象。

当我们在写单例模式时，最好将创建对象和管理单例的职责进行分离，等到它们组合在一起，就形成一个可复用，可读性更高的单例模式。