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

# 第五章 策略模式

策略模式的定义是：定义一系列的算法，把它们一个个封装起来，并且使它们可以互相替换。

## 5.1 使用策略模式计算奖金

以年终奖计算为例：

假设绩效S的年终奖有4倍工资，绩效A的年终奖有3倍工资，绩效B的则为2倍工资。

我们可以写这样一段代码

```javascript
var calculateBonus = function(performanceLevel, salary) {
  switch (performanceLevel) {
    case 'S':
      return salary * 4;
    case 'A':
      return salary * 3;
    case 'B':
      return salary * 2;
  }
};
calculateBonus('B', 20000); // 输出：40000
calculateBonus('S', 6000); // 输出：24000
```

calculateBonus函数接受两个参数，分别是绩效等级和工资水平。

这段代码非常简单，但是存在缺点：

* 存在太多条件判断分支
* 缺乏弹性，如果增加一种新的绩效等级，那么我们就需要来改代码，这违反了开放-封闭原则
* 复用性差

下面是使用组合函数来重构代码。组合函数就是将业务逻辑拆分成很多小函数，将其进行组合。这里是将计算的业务逻辑与判断等级的业务逻辑分开

```javascript
        var performanceS = function( salary ){
            return salary * 4;
        };

        var performanceA = function( salary ){
            return salary * 3;
        };

        var performanceB = function( salary ){
            return salary * 2;
        };

        var calculateBonus = function( performanceLevel, salary ){

            if ( performanceLevel === 'S' ){
              return performanceS( salary );
            }

            if ( performanceLevel === 'A' ){
              return performanceA( salary );
            }

            if ( performanceLevel === 'B' ){
              return performanceB( salary );
            }

        };

        calculateBonus(  'A' , 10000 );    // 输出：30000
```

虽然目前来看逻辑是分开了，但是依然很臃肿，系统变化时也缺乏弹性。

**使用策略模式来修改代码。**

策略模式指的是定义一系列的算法，把它们一个个封装起来。将不变的部分和变化的部分隔开时每个设计模式的主题，策略模式的目的就是将算法的使用和算法的实现隔离开来。

这个例子中，算法的使用方式是不变的，都是根据某个算法来得出金额。算法的实现是多种多样和可变化的，每种绩效对应不同的规则。

一个基于策略模式的程序由两部分组成。第一部分是一组策略类，策略类封装了具体的算法，并负责具体的计算过程。第二个部分是环境类Context，Context接受客户的算法，随后把请求委托给某一个策略类。要做到这一点，说明Context中需要保存对某个策略对象的引用。

我们先定义一组策略类，将每种绩效的计算规则都封装在对应的策略类中

```javascript
var performanceS = function() {};

performanceS.prototype.calculate = function(salary) {
  return salary * 4;
};

var performanceA = function() {};

performanceA.prototype.calculate = function(salary) {
  return salary * 3;
};

var performanceB = function() {};

performanceB.prototype.calculate = function(salary) {
  return salary * 2;
}
```

然后创建一个Context环境类，它需要保存策略对象的引用。

```javascript
// Bontus就是环境类，它用来保存策略对象的引用
var Bontus = function() {
  this.salary = null //保存金额 这里是额外属性
  this.strategy = null //这个属性用来保存策略对象的引用
}

Bontus.prototype.setSalary = function(salary) {
  this.salary = salary
}

Bontus.prototype.setStrategy = function(strategy) {
  //设置策略对象
  this.strategy = strategy
}

Bontus.prototype.getBonus = function() {
  return this.strategy.calculate(this.strategy)
}
```

使用时，先设置金额，再设置策略对象，最后获取结果

```javascript
var bon = new Bontus()
bon.setSalary(2000) // 设置金额
bon.setStrategy(new performanceS()) // 设置策略对象
bon.getBonus() // 8000

bon.setSalary(10000)
bon.setStrategy(new performanceB())
bon.getBonus() // 20000
```

上面的代码中，我们先创建一个bon对象，并且给他设置一些原始的数据，这里是设置了工资。接下来给他设置一个策略对象，让他内部保存着这个策略对象。当需要计算时，bon对象本身没有计算的能力，而是将计算委托给保存好的策略对象。

策略模式的思想：定义一系列的算法，并将它们挨个封装起来，并且使它们之间可以互相替换。

详细一点就是：定义一系列的算法，把它们各自封装成策略类，算法被封装在策略类内部的方法里。在客户对Context发起请求时，Context总是把请求委托给这些策略对象中间的某一个进行计算。

## 5.2 JavaScript版本的策略模式

上面的代码是模拟传统面向对象语言的实现，我们先创建了一组策略类，然后使用Context类来保存策略对象（strategy）的引用，策略对象是通过策略类创建的。最后把请求委托给策略对象来计算结果。

JavaScript中，策略对象并不需要从各个策略类里面创建，我们直接将其定义成一个对象

```javascript
const strategy = {
  S: function(salary) {
    return salary * 4;
  },
  A: function(salary) {
    return salary * 3;
  },
  B: function(salary) {
    return salary * 2;
  }
}
```

Context类也并不需要通过new Bontus来创建，直接用函数就可以了

```javascript
var calculateBontus = function(performanceLevel, salary) {
  return strategy[performanceLevel](salary)
}

calculateBontus('S',2000) // 8000
```

这种方式比传统类型语言更好理解，也更加简洁。

## 5.3 多态在策略模式中的体现

通过使用策略模式重构代码，我们消除了原来大片的条件分支语句。所有跟奖金有关的计算我们都封装到各个策略对象中，Context没有直接计算奖金的能力，而是把职责交给某个策略对象。每个策略对象负责的算法都被封装在对象内部。

当我们对这些策略对象发出计算奖金的请求时，它们会返回各自不同的计算结果，这是对象多态性的体现。

替换Context中当前保存的策略对象，便能执行不同的算法来得到我们想要的结果。

## 5.5 更广义的算法

策略模式指的是定义一系列的算法，并且把它们封装起来。

从定义上看，策略模式就是用来封装算法的。但如果仅仅把策略模式用来封装算法，未免有点大材小用。实际开发中，我们通常会把算法的含义扩展开来，使策略模式也可以封装一系列的业务规则。只要这些业务规则指向的目标一致，并且可以被替换使用，我们就可以用策略模式来封装它们。

下面是一个用策略模式完成表单校验用户是否输入合法数据的例子。

## 5.6 表单验证

以下是表单验证的校验逻辑：

* 用户名不能为空
* 密码长度不能少于6位
* 手机号码必须符合格式

### 5.6.1 表单校验的第一个版本

```html
    <form action="" id="registerForm" method="post">
      请输入用户名：<input type="text" name="userName"/ > 请输入密码：<input
      type="text" name="password"/ > 请输入手机号码：<input type="text"
      name="phoneNumber"/ >
      <button>提交</button>
```

```javascript
      var registerForm = document.getElementById("registerForm");
      registerForm.onsubmit = function () {
        if (registerForm.userName.value === "") {
          alert("用户名不能为空");
          return false;
        }
        if (registerForm.password.value.length < 6) {
          alert("密码长度不能少于6位");
          return false;
        }
        if (!/(^1[3|5|8][0-9]{9}$)/.test(registerForm.phoneNumber.value)) {
          alert("手机号码格式不正确");
          return false;
        }
      };
```

* registerForm.onsubmit函数包含了很多if-else的语句，这些语句需要覆盖所有校验规则
* 这个函数缺乏弹性，如果想增加一种新的校验规则，或者想要将密码长度的校验从6位修改为8位。我们都需要进入到函数内部去修改内部，这违反了开发-封闭原则
* 这个函数复用性差，无法给其他表单复用

### 5.6.2 用策略模式重构表单校验

- 第一步：将所有策略规则都封装进入策略对象

  ```javascript
  var strategies = {
    isNonEmpty: function(value, errorMsg) { // 不为空
      if (value === '') {
        return errorMsg;
      }
    },
    minLength: function(value, length, errorMsg) { // 限制最小长度
      if (value.length < length) {
        return errorMsg;
      }
    },
    isMobile: function(value, errorMsg) { // 手机号码格式
      if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
        return errorMsg;
      }
    }
  };
  ```

- 第二步：新建一个Context类，这里名叫Validator类。它负责接受用户的请求并委托给strategy对象。

  要写Context类实现代码，最好先设定好用户如何向它发起请求，也就是这个类如何使用，这有助于我们编写Validator类，假定它是这样使用的：

  ```javascript
  var validataFunc = function() {
    var validator = new Validator(); // 创建一个validator对象
  
    /***************添加一些校验规则****************/
    validator.add(registerForm.userName, 'isNonEmpty', '用户名不能为空');
    validator.add(registerForm.password, 'minLength:6', '密码长度不能少于6位');
    validator.add(registerForm.phoneNumber, 'isMobile', '手机号码格式不正确');
  
    var errorMsg = validator.start(); // 获得校验结果
    return errorMsg; // 返回校验结果
  }
  
  var registerForm = document.getElementById('registerForm');
  
  registerForm.onsubmit = function() {
    var errorMsg = validataFunc(); // 如果errorMsg有确切的返回值，说明未通过校验
    if (errorMsg) {
      alert(errorMsg);
      return false; // 阻止表单提交
    }
  };
  ```

  我们通过Validator类来创建一个validator对象，用validator.add来添加校验规则

  validator.add接受三个参数：

  `validator.add(registerForm.password, 'minLength:6', '密码长度不能少于6位');`

  1. 第一个参数为需要校验的内容
  2. 第二个参数表示校验规则，`minLength:6`是一个以冒号隔开的字符串。冒号前面的minLength代表客户挑选的strategy对象，冒号后面的数字6表示在校验过程中所必需的一些参数。'minLength:6’的意思就是校验registerForm.password这个文本输入框的value最小长度为6。如果这个字符串中不包含冒号，说明校验过程中不需要额外的参数信息，比如’isNonEmpty'。
  3. 第三个参数是当校验失败后返回的错误信息

  当添加完校验规则后，我们通过validator.start方法启动校验，如果不成功则返回不成功的信息。

  下面是Validator类的实现

  ```javascript
  class Validator {
    #cache = []; //保存校验规则
    add(dom, rule, errorMessage) {
      // 把校验的步骤用空函数包装起来，并且放入cache
      this.#cache.push(function () {
        const [strategyProperty, ...args] = rule.split(":"); //分割出需要传递给验证函数的参数
        //将验证逻辑委托给策略对象中的验证函数
        return strategies[strategyProperty].apply(dom, [
          dom.value,
          ...args,
          errorMessage
        ]);
      });
    }
    start() {
      for (let validatorFunc of this.#cache) {
        let message = validatorFunc();//调用保存在cache属性中的校验规则函数
        if (message) {
          return message;// 如果有message，则表示验证错误，直接返回
        }
      }
    }
  }
  ```

  在使用策略模式重构代码之后，我们可以通过配置的方式完成一个表单的验证，这些校验规则可以复用在程序的任何地方。

  在修改某个校验规则时，只需要编写或者改写少量的代码。比如我希望将用户名的输入框校验规则改成用户名不少于4个字符，修改起来是毫不费力的。

  ```javascript
   validator.add(registerForm.userName, 'isNonEmpty', '用户名不能为空');
   // 改成：
   validator.add(registerForm.userName, 'minLength:4', '用户名最少4个字');
  ```

### 5.6.3 给某个文本输入框添加多个校验规则

目前上面的代码中一个输入框一次只能验证一种规则，如果我们希望一个输入框能够验证多个规则呢？比如像这样

```javascript
  validator.add(registerForm.userName, [
    ["isNonEmpty", "用户名不能为空"],
    ["minLength:10", "用户名长度不能小于10位"]
  ]);
```

只需要稍微改写一下add并添加一个新的addRules方法就可以了

```javascript
  add(dom, rule, errorMessage) {
    if (rule instanceof Array) {
      return this.addRules(dom, rule);
    }
...
  }
  addRules(dom, rules) {
    for (let [rule, errorMessage] of rules) {
      this.add(dom, rule, errorMessage);
    }
  }
```

> 这段代码并非Javascript设计模式与开发实践中的原代码，由于原代码的实现略麻烦，所以这里做一些修改。

