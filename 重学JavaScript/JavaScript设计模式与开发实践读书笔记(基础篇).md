# 前言

设计模式一开始并非来自于软件开发，而是建筑行业从高质量的建筑结构设计中抽取的相似性，并用“模式”来指代这种相似性。

软件行业受到模式观点的启发，于是总结了常见的软件开发设计模式。

**设计模式的定义是：在面向对象软件设计中针对特定的问题而采用简洁而优雅的解决方案。**

**通俗一点说就是，设计模式是某种场合下对某个问题的一种解决方案。**

**再通俗一点说就是：我写了一段好代码，我要给它取个名字。**

模式的作用是让人们写出可复用和可维护性高的程序。

**所有设计模式的实现都遵循一条原则，即“找出程序中变化的地方，并将变化封装起来”。**

# 第一章 面向对象的JavaScript

JavaScript没有提供传统面向对象语言中的类继承，而是通过原型委托的方式来实现对象之间的继承。

正是因为存在跟传统面向对象语言不一致的地方，我们在学习设计模式之前，需要了解JavaScript在面向对象方面的知识。

## 1.1 动态类型

编程语言按照数据类型大体可以分为两类，一类是静态类型语言，另一类是动态类型语言。

静态类型语言在编译时便已确定变量的类型，而动态类型语言的变量类型要到程序运行的时候，待变量被赋予某个值之后，才会具有某种类型。

**以下是静态类型语言的优缺点**

**优点**

* 在编译时就能发现类型不匹配的错误  
* 如果在程序中明确地规定了数据类型，编译器还可以针对这些信息对程序进行一些优化工作，提高程序执行速度

**缺点**

* 迫使程序员按照契约来书写代码，为每个变量都规定数据类型，归根结底只是辅助我们编写可靠程序的手段，而不是目的。
* 类型的声明也会增加更多的代码，让程序员的精力从思考业务逻辑上分散开来



相对于静态类型的语言，**动态类型语言也存在以下优缺点**：

**优点**

* 编写代码少，看起来更简洁
* 程序员可以把精力更多地放在业务逻辑上

**缺点**

* 无法保证变量的类型，从而导致运行时可能发生类型错误

动态语言对变量类型的宽容给实际编码带来了很大的灵活性。由于无需类型检测，所以我们可以更关注对象的行为而非对象本身。

对于静态类型语言来说，想要实现基于鸭子类型（duck typing）的面向接口编程，需要对抽象类进行向上转型，形成一个超类。

而动态语言则不必借助超类型的帮助。

> 鸭子类型通俗解释：如果它走起路来像鸭子，叫起来也是鸭子，那么它就是鸭子。

## 1.2 多态

多态的含义是，同一操作作用于不同的对象时，可以产生不同的解释和不同的效果。

比如说，Number和Object的原型上都有`toString`方法，这就是多态的。

用一个实际的例子举例，比如有一只鸭子和一只狗，它们都能够叫，但是他们的叫声并不相同。下面用代码来说明

```javascript
function Dog(){}
function Duck(){}
function sound(animal){
  if(animal instanceof Dog){
    alert('汪汪汪')
  }
  if(animal instanceof Duck){
    alert('嘎嘎嘎')
  }
}
sound(new Dog())
sound(new Duck())
```

上面的代码就体现了多态性，即相同的操作作用于不同对象，可以产生不同的效果。

但是这样并不能令人满意，因为如果多加几种动物，那么sound方法就需要写更多的兼容代码，显得非常冗余。

**多态背后的思想是将`做什么`和`谁去做以及怎样做`隔离开来，具体做法就是将不变的隔离起来，可变的就封装起来，给予程序扩展的能力**

首先我们把不变的部分隔离出来，那就是所有的动物都会发出叫声：

```javascript
function Dog() {}

function Duck() {}

function sound(animal) {
  animal.sound()
}
```

然后把可变的部分各自封装起来

```javascript
Dog.prototype.sound = function() {
  alert('汪汪汪')
}
Duck.prototype.sound = function() {
  alert('嘎嘎嘎')
}
```

现在这些动物的原型上都有`sound`方法,我们直接这样调用即可：

```javascript
sound(new Duck())
sound(new Dog())
```

未来如果需要更多动物，直接增加可变部分的代码就可以了，这段代码可扩展性强，而且非常安全。

## 1.3 封装

封装的目的是将信息隐藏。

封装不仅包括封装实现、封装数据，还包括封装类型和封装变化。

### 封装数据

```javascript
        var myObject = (function(){
            var __name = 'sven';    //私有（private）变量
            return {
              getName: function(){    //公开（public）方法
                  return __name;
              }
            }
        })();

        console.log( myObject.getName() );    //输出：sven
        console.log( myObject.__name )     //输出：undefined
```

上面的代码通过函数来将创建作用域，并封装一个私有变量的数据。这是数据层面的封装

### 封装实现

封装应该被视为任何形式的封装，也就是说，封装不仅仅是隐藏数据，还包括隐藏实现细节、设计细节以及隐藏对象的类型等。

封装使得对象内部的变化对其他对象而言是透明的，也就是不可见的。对象对他自己的行为负责。其他对象或者用户都不关心它的内部实现。

封装使得对象之间的耦合变得松散，对象之间只通过暴露的API来通信。当我们修改一个对象时，可以随意地修改它的内部实现，只要对外的接口没有变化，就不会影响到程序的其他功能。

比如：我们写了一个`	each`函数，它的作用时遍历一个聚合对象，使用这个`each`函数的人不用关心它的内部是如何实现的，只要它提供的功能正确就可以了。即使修改了内部源代码，只要对外的接口或者调用方式没有变化，用户就不用关心它的内部实现的改变。

### 封装类型

封装类型是静态类型语言中的一种重要封装方式。一般而言，封装类型是通过抽象类和接口来进行的。

JavaScript目前没有能力，也没必要做得更多。

### 封装变化

从设计模式的角度出发，封装在更重要的层面体现为封装变化。

> 考虑你的设计中哪些地方可能变化，这种方式会与关注会导致重新设计的原因相反。它不是考虑什么时候会迫使你的设计改变，而是考虑你怎样才能在不重新设计的情况下进行改变。这里的关键在于封装发生变化的概念，这是许多设计模式的主题。——设计模式

通过封装变化的方式，把系统中稳定不变的部分和容易变化的部分隔离开来，在系统的演变中，我们只需要替换那些容易发生变化的部分，如果这些部分是已经封装好的，那么替换起来也相对容易。这可以最大程度地保证程序的稳定性和可扩展性。

## 1.4 原型模式和基于原型继承的JavaScript对象系统

在以类为中心的面向对象编程语言中，只能从类创建一个对象。

但在原型编程思想中，类并不是必须的，对象也未必需要从类中创建而来，一个对象是通过克隆另外一个对象所得到的。

原型模式不单单是一种设计模式，也被称为编程泛型。

### 1.4.1 使用克隆的原型模式

从设计模式的角度讲，原型模式是用于创建对象的一种模式。创建一个对象，有两种方法：

* 一先指定它的类型，然后通过类来创建这个对象。
* 原型模式选择了另外一种方式，我们不再关心对象的具体类型，而是找到一个对象，然后通过克隆来创建一个一模一样的对象。

原型模式的实现关键，在于语言本身是否提供了clone方法，ES5提供了`Object.create`这个API来克隆对象，比如下面的代码

```javascript
var Plane = function() {
  this.blood = 100;
  this.attackLevel = 1;
  this.defenseLevel = 1;
};

var plane = new Plane();
plane.blood = 500;
plane.attackLevel = 10;
plane.defenseLevel = 7;

var clonePlane = Object.create(plane);
console.log(clonePlane)
console.log(clonePlane.blood) //输出500
console.log(clonePlane.attackLevel) //输出10
console.log(clonePlane.defenseLevel) //输出7
```

> Object.create(targetObject)会新创建一个对象，并把targetObject的属性和方法与新创建对象的`__proto__`做连接。

### 1.4.2 克隆是创建对象的手段

原型模式的真正目的并非在于要创建一个一模一样的对象，而是提供了一种便捷的方式去创建某个类型的对象，克隆只是创建这个对象的过程和手段。

在JavaScript这种类型模糊的语言中，创建对象非常容易，也不像java存在类型耦合的问题。从设计模式的角度来讲，原型模式的意义并不算大。但JavaScript本身是基于原型的面向对象语言。它的对象系统就是使用原型模式来搭建的，在这里称之为原型编程泛型也许更合适。

### 1.4.4 原型编程范型的一些规则

基于原型链的委托机制就是原型继承的本质。

原型编程的重要特性：**当某个对象无法响应某个请求时，会把该请求委托给它自己的原型。**

原型编程至少包含以下规则：

* 所有数据都是对象
* 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它
  * 对象会记住它的原型
  * 如果对象无法响应某个请求，它会把这个请求委托给它自己的原型

### 1.4.5 JavaScript中的原型继承

1. 所有数据都是对象

   按照JavaScript设计者的本意，除了undefined之外，一切都应是对象。为了实现这一目标，number、boolean、string这几种基本类型数据也可以通过“包装类”的方式变成对象类型数据来处理。

   JavaScript绝大多数数据都是对象，JavaScript中也有一个根对象`Object.prototype`，这些对象都来自于这个根对象。

   我们遇到的每个对象，实际上都是从`Object.prototype`中克隆而来。`Object.prototype`就是它们的原型。

   比如下面两个对象

   ```javascript
   let obj=new Object()
   let obj2={}
   // 通过Object.getPrototypeOf()这个方法获取原型
   Object.getPrototypeOf(obj)===Object.prototype // true
   Object.getPrototypeOf(obj2)===Object.prototype // true
   ```

   

2. 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它

   在JavaScript中，我们并不需要关心克隆的细节，这是引擎内部实现的。比如下面的代码

   ```javascript
   const obj={}
   const obj2=new Object()
   ```

   我们只需要显式地调用它，引擎就会从`object.prototype`中克隆一个对象出来。

   下面我们使用new来构造一个对象

   ```javascript
   function Person(name){
     this.name=name
   }
   Person.prototype.getName=function(){
     return this.name
   }
   
   var a=new Person('qiuyanxi')
   console.log(a.getName()) // 'qiuyanxi'
   console.log(Object.getPrototypeOf(a)===Person.prototype) // true
   ```

   在这里Person并不是类，而是一个构造器，JavaScript的函数既可以作为普通函数调用，又可以用来当作构造器。当使用new运算符来调用函数时，此时函数是一个构造器。用new 运算符来创建对象的过程，实际上也只是克隆`Object.prototype`,再进行一些额外的操作。

   下面是模拟一个new运算符

   ```javascript
   function myNew(constructorFunc,...rest){
     const obj={}// 从Object.prototype中克隆一个对象
     obj.__proto__=constructorFunc.prototype //把克隆下的对象的__proto__与构造器的原型做连接
     const result=constructorFunc.apply(obj,rest)// 调用构造器函数，this与object绑定
     return typeof result==='object'?result:obj //需要确保返回出一个对象，这是规范
   }
   ```

   

3. 对象会记住它的原型

   如果请求可以在一个链条中依次往后传递，那么每个节点都必须知道它的下一个节点。

   就JavaScript真正的实现来说，并不能直接说对象有原型，而是它的构造器有原型。对于对象把请求委托给它自己的原型这句话，更好的说法是对象把请求委托给它的构造器的原型。

   对象如何把请求顺利地转交给它的构造器的原型呢？

   JavaScript给对象提供了一个名为`__prototype__`的隐藏属性，这个属性会默认指向它的构造器的原型对象，即`{Constructor}.prototype`。

   `__proto__`就是对象跟“对象构造器的原型”联系起来的纽带。正因为对象要通过`__proto__`属性来记住它的构造器的原型。

   

4. 如果对象无法响应某个请求，它会把这个请求委托给它自己的原型

   这条规则是原型继承的精髓所在。

   虽然JavaScript的对象最初都是由`Object.prototype`克隆而来，但对象构造器的原型并不限于`Object.prototype`，而是动态地指向其他对象。这样一来，当对象a需要借用对象b的能力时，可以有选择地把对象a的构造器的原型指向对象b，从而达到继承的效果。

   ```javascript
   var obj = {
     name: 'qiuyanxi'
   }
   var A = function() {}
   A.prototype = obj // 将函数的原型指向obj
   var a = new A() // 构造器A构造对象a
   console.log(a.name) // a通过.__proto__ 访问到A.prototype
   ```

   这段代码是这样做的：

   * 遍历对象a的所有属性，但是没用找到`name`属性
   * 查找`name`属性这个请求委托给对象a的构造器A的原型，也就是A.prototype
   * `A.prototype`被设置成obj，所以返回`obj`的name

   当我们希望一个“类”（实际上是构造器）继承另一个类时，往往会用下面的代码来模拟

   ```javascript
   var A=function (){}
   A.prototype={name:'qiuyanxi'}
   
   var B=function (){}
   B.prototype=new A()
   // B.prototype =Object.create(A.prototype) 也可以用这个方法
   var b=new B()
   console.log(b.name) // "qiuyanxi"
   ```

   这段代码是这样做的：

   * 让B的原型等于A的实例，这样B的原型就可以通过`__proto__`访问到A的原型
   * 当b需要访问name时，遍历b身上的属性发现没有，于是请求委托顺着`__proto__`去访问构造器B的原型
   * 此时`B.prototype`是个空对象，于是继续顺着`__proto__`去访问构造器A的原型
   * `A.prototype`身上具有name属性，于是返回它的值

原型链并不是无限长的，根对象`Object.prototype.__proto__`是`null`,说明原型链后面已经没有节点了。

如果请求委托在根对象上依然找不到属性，最终会返回`undefined`

### 1.4.6 原型继承的未来

除了根对象`Object.prototype`外，任何对象都会有一个原型。而通过Object.create( null )可以创建出没有原型的对象。

`Object.create()`是原型模式的天然实现。

ES6带来了新的class语法，让JavaScript看起来像一门基于类的语言，但其背后依然是基于原型机制创建对象。

以下是简单的代码示例

```javascript
class Animal {
  constructor(name) {
    this.name = name
  }
  getName() {
    return this.name
  }
}
class Dog extends Animal {
  constructor(name) {
    super(name)
  }
  speak() {
    return 'jimi'
  }
}
var dog=new Dog('jimi')

console.log(dog.getName()===dog.speak()) // true
```

### 1.4.7 小结

原型模式是一种设计模式，也是一种编程泛型。它构成了JavaScript这门语言的根本。

原型模式在于克隆，克隆是便捷创建对象的一种手段。

原始的克隆是直接按照根对象`Object.prototype`来克隆出一个新的对象，新对象的`__proto__`属性会访问到它的原型，即根对象。

JavaScript中的原型还可以根据构造函数来指定原型，通过请求委托的方式来实现原型的继承，每个请求都会通过对象的`__proto__`属性委托给它的原型处理，形成一个原型链条。

原型链条并不是无限长的，它的终点指向null，表示链表节点的结束。



# 第二章 this、call和apply

本章主要理解`this`关键字、`Function.prototype.call`和`Function.prototype.apply`的概念

## 2.1 this

JavaScript中的this总是指向一个对象，具体指向哪个对象则是在运行时基于函数的运行环境来动态绑定的，而不是函数声明时的环境（词法作用域则是根据函数声明时的环境生成的）。

## 2.1.1 this的指向

this的指向大概可以分为以下4种：

* 作为对象的方法调用
* 作为普通函数调用
* 作为构造函数调用
* `Function.prototype.call`或者`Function.prototype.apply`调用

1. 当作为对象的方法调用时，this指向该对象

```javascript
    var obj = {
        a: 1,
        getA: function(){
          alert ( this === obj );    // 输出：true
          alert ( this.a );    // 输出： 1
        }
    };

    obj.getA();
```

2. 当作为普通函数调用时，指向全局对象，浏览器环境下的全局对象是window

```JavaScript
    window.name = 'globalName';

    var getName = function(){
        return this.name;
    };

    console.log( getName() );    // 输出：globalName
```

或者

```javascript
    window.name = 'globalName';

    var myObject = {
        name: 'sven',
        getName: function(){
          return this.name;
        }
    };

    var getName = myObject.getName;
    console.log( getName() );    // globalName
```

有时候我们需要在事件函数内部使用一个callback方法，这个方法内可能需要用到this，我们希望它指向触发点击事件的节点，可以这么做

```html
<div id='div'>
  我是一个div
</div>
```

```javascript
div.addEventListener('click', function() {
  const that = this // 使用一个变量保存this
  function callback() {
    console.log(this.id) //undefined
    console.log(that.id) // div
  }
  callback()
})
```

否则`callback`就是普通函数调用，默认this指向window。

在严格模式下，普通函数调用规定不会指向window，而是undefined。

```javascript
  function callback() {
    'use strict'
    console.log(this) //undefined
  }
```

3. 构造器调用

构造器跟普通函数没有区别，只是我们调用它的方式不同。当使用new运算符调用时，该函数会返回一个对象。默认情况下，this会指向返回的这个对象。

```javascript
        var MyClass = function(){
            this.name = 'sven';
        };

        var obj = new MyClass();// new会新创建一个对象obj，并且让this指向它。相当于obj.name ='sven'
        alert ( obj.name );     // 输出：sven
```

当使用new关键字时，还需要注意一个问题，如果构造器显式返回一个object类型的对象，那么最终会返回这个对象。而不是this原指向的对象。

```JavaScript
        var MyClass = function(){
            this.name = 'sven';
            return {    // 显式地返回一个对象
              name: 'anne'
            }
        };

        var obj = new MyClass(); // 由new关键字创建的并拥有this指向的obj不会被返回了
        alert ( obj.name );     // 输出：anne
```

如果构造器不显式地返回任何数据或者不返回对象类型的数据，那么就不会有问题

```JavaScript
        var MyClass = function(){
            this.name = 'sven'
            return 'anne';    // 返回string类型
        };

        var obj = new MyClass();
        alert ( obj.name );     // 输出：sven
```

4. Function.prototype.call或Function.prototype.apply调用

使用Function.prototype.call或Function.prototype.apply可以动态地改变传入函数的this

```JavaScript
        var obj1 = {
            name: 'sven',
            getName: function(){
              return this.name;
            }
        };

        var obj2 = {
            name: 'anne'
        };

        console.log( obj1.getName() );     // 输出： sven
        console.log( obj1.getName.call( obj2 ) );    // 输出：anne
```

## 2.1.2 丢失的this

```JavaScript
        var obj = {
            myName: 'sven',
            getName: function(){
              return this.myName;
            }
        };

        console.log( obj.getName() );    // 输出：'sven'

        var getName2 = obj.getName;
        console.log( getName2() );    // 输出：undefined
```

当调用obj.getName时，getName方法是作为obj对象的属性被调用的，此时的this指向obj对象。

当用另外一个变量getName2来引用obj.getName，此时是普通函数调用方式，this是指向全局window的，所以程序的执行结果是undefined。

再来看一个例子，比如我希望封装一个函数来获取ID以替代`document.getElementByid()`的写法，我封装的函数是这样的：

```javascript
function getId(id){
  return document.getElementById(id)
}

getId('div')
```

这种方式没问题。

如果换成这样不是更简单吗？

```javascript
const getId=document.getElementById
getId('div')
```

**当运行一下，就会发现这样的代码会抛出异常**。

原因是`document.getElementByid`内部使用了this。

当`getElementById`方法作为`document`对象的属性被调用时，方法内部的`this`确实是指向`document`的

但当用`getId`来引用`document.getElementById`之后，再调用`getId`，此时就成了普通函数调用，函数内部的`this`指向了`window`，而不是原来的`document`。

我们可以尝试使用`call`或者`apply`或者`bind`来将this绑定到`document`上，这样就可以运行`getId`了

```javascript
const getId=document.getElementById.bind(document)
getId('div')
console.log(getId('div').id) // 'div'
```

## 2.2 call和apply

`Function.prototype`中有两个方法，它们分别是`call`和`apply`，在函数式风格的代码中，它们尤为有用。

### 2.2.1 call和apply的区别

call和apply的作用一模一样，区别只在于传参形式的不同。

apply接受两个参数，第一个参数指定函数体内的this指向，第二个参数是一个数组，也可以是类数组。apply把第二个参数传递给被调用的函数。

```JavaScript
var func=function(a,b,c){
  console.log(a,b,c)
}
func.apply(null,[1,2,3]) // 1 2 3
```

`call`是包装在`apply`上面的语法糖，第一个参数也指定函数体内的this指向，从第二个参数开始，所有参数都会被传递给被调用的函数。

```javascript
var func=function(a,b,c){
  console.log(a,b,c)
}
func.call(null,1,2,3) // 1 2 3
```

当`call`和`apply`的第一个参数是null时，函数内的`this`默认指向`window`。

```JavaScript
        var func = function( a, b, c ){
            alert ( this === window );    // 输出true
        };

        func.apply( null, [ 1, 2, 3 ] );
```

如果是严格模式，那么`this`指向`null`

```JavaScript
        var func = function( a, b, c ){
            "use strict";
            alert ( this === null );     // 输出true
        }

        func.apply( null, [ 1, 2, 3 ] );
```

有时候我们使用`call`或者`apply`的目的是借用其他对象的方法，而不是指定`this`的指向那么我们可以传递`null`来替代某个具体的对象

```javascript
Math.max.apply(null,[1,2,3,4,5]) // 5
```

### 2.2.2 call和apply的用途

1. 改变`this`指向

   `call`和`apply`最常见的用途就是改变函数内部的`this`指向。

   

2. 模拟`Function.prototype.bind`

   ```javascript
   Function.prototype.myBind = function(context,...rest) {
     const thisFuc = this // 这里的this为调用bind的函数
     return function() {
       //调用call时让函数内部的this指向context
       return thisFuc.call(context, ...rest)
     }
   }
   const getName = function() {
     console.log(this.name)
   }
   const obj = {
     name: 'qiuyanxi',
   }
   getName.myBind(obj)()
   ```

3. 借用其他对象的方法

   * 通过借用构造函数的方法，可以实现继承的效果

     ```JavaScript
             var A = function( name ){
                 this.name = name;
             };
     
             var B = function(){
                 A.apply( this, arguments );
             };
     
             B.prototype.getName = function(){
                 return this.name;
             };
     
             var b = new B( 'sven' );
             console.log( b.getName() );  // 输出： 'sven'
     ```

   * 通过借用其他对象的方法，可以实现某些功能

     函数的`arguments`是一个伪数组，它并没有数组的原型方法，除了使用`Array.from`将其变成真正的数组外，还可以使用`call`或者`apply`来借用数组的方法

     ```javascript
     function fn() {
       Array.prototype.push.call(arguments, 3)
       console.log(arguments) // [1,2,3]
     }
     fn(1, 2)
     ```

     **能够使用这种方法让arguments具备数组的能力的原因来自于V8的引擎源码：**

     ```JavaScript
             function ArrayPush() {
                 var n = TO_UINT32( this.length );    // 被push的对象的length
                 var m = %_ArgumentsLength();     // push的参数个数
                 for (var i = 0; i < m; i++) {
                   this[ i + n ] = %_Arguments( i );   // 复制元素     (1)
                 }
                 this.length = n + m;      // 修正length属性的值    (2)
                 return this.length;
             };
     ```

     结合例子分析一下源码：

     * 先获取被push对象的长度，对应例子中的`arguments`为被push的对象，它的长度为2
     * 获取push的参数个数，对应例子中的参数3
     * 循环遍历被push的参数个数，然后直接在`arguments`的末尾位置挨个插入被push的值，`%_Arguments`用来获取V8源码中的参数对象，`%_Arguments( i )`获取到的是3。
     * `this[ i + n ] = %_Arguments( i )`就相当于运行`arguments[2]=3`
     * 返回`length`属性

     从源码可以看出，V8源码不在乎调用`push`方法的是否为真实的数组,它只需要能够获取调用方法的对象的`length`属性，然后按照下标依次添加到被`push`对象上面，顺便修改掉`length`属性就可以了。

     

     通过`ArrayPush`函数，我们可以知道想要实现`Array.prototype.push.call`类似的效果，需要具备两个条件：

     1. 被`push`对象属性可修改

     2. 被`push`对象属性具有可读写的`length`属性

     验证一下：

     ```javascript
     const obj = {
       length: 0
     }
     const n = 1
     
     function fn(a) {
       console.log(a)
     }
     
     Array.prototype.push.call(obj, 1)
     console.log(obj) // {0:1,length:1} 
     
     Array.prototype.push.call(n, 3)
     console.log(n) // 1
     
     Array.prototype.push.call(fn, 3) //"TypeError: Cannot assign to read only property 'length' of function
     ```

     `obj`对象属性可存取，所以push成功了

     `n`不是对象，属性不可存取，所以push不成功

     `fn`函数的`	length`是形参，只读属性，不可修改，所以报错了

# 第三章 闭包和高阶函数

## 3.1 闭包

**闭包的形成与变量的作用域以及变量的生存周期密切相关**

### 3.1.1 变量的作用域

变量的作用域指的是变量的有效范围。我们最常提到的是函数中声明的变量作用域。

当在函数中声明一个变量时，如果没有`var`关键字，那么这个变量就会变成全局变量。

当拥有`var`关键字时，这时候的变量是局部变量，只有在函数内部才能访问得到。

```JavaScript
        var func = function(){
            var a = 1;
            alert ( a );     // 输出： 1
        };
        func();
        alert ( a );     // 输出：Uncaught ReferenceError: a is not defined
```

函数可以创造函数作用域。此时函数外面访问不到函数内部的变量，函数内部可以访问函数外部的变量。

这是因为当在函数内搜索一个变量时，如果该函数内没有声明这个变量，那么此次搜索就会顺着代码执行环境所创建的作用域链往外层搜索，一直搜索到全局变量为止。变量的搜索是从内到外的。

就像下面这段代码

```JavaScript
var a = 1
var func1 = function() {
  var b = 2
  var func2 = function() {
    var c = 3
    alert(a)//输出1
    alert(b)//输出2
  }
  func2()
  alert(c)//"ReferenceError: c is not defined
}
func1()
```

### 3.1.2 变量的生存周期

全局变量的生存周期是永久的，除非我们主动销毁这个全局变量。

但对于在函数内使用`var`关键字声明的局部变量来说，当退出函数时，这些局部变量就失去了它们的价值，它们会随着函数的调用结束而销毁。

```JavaScript
        var func = function(){
            var a = 1;      // 退出函数后局部变量a将被销毁
            alert ( a );
        };

        func();
```

如果把这段代码修改一下：

```JavaScript
        var func = function(){
            var a = 1;
            return function(){
              a++;
              alert ( a );
            }
        };

        var f = func();

        f();    // 输出：2
        f();    // 输出：3
        f();    // 输出：4
        f();    // 输出：5
```

从结论中可以发现`a`变量并没有销毁掉，而是一直存在于内存中。

这是因为`var f =func()`时，`f`保存了一个匿名函数的引用，它可以访问到`func()`被调用时产生的环境，而局部变量`a`则一直存在于这个环境内。如果说局部环境内所在的局部变量依然能被外界所访问，那么这个局部变量就有了不被销毁的理由。

下面看关于闭包的经典应用

```html
<div>1</div>
<div>2</div>
<div>3</div>
<div>4</div>
<div>5</div>
<div>6</div>
```

```javascript
var nodes = document.querySelectorAll('div')
for (var i = 0; i < nodes.length; i++) {
  nodes[i].onclick = function() {
    alert(i)
  }
}
```

上面的代码经过测试，不管点击哪个`div`，都会打印`6`。

这是因为`div`节点的`onclick`事件是异步的，当事件触发时，`for`循环已结束。此时i为5，所以div的onclick事件顺着作用域链找变量`i`时，查找到的值永远是`6`。

解决的方法是使用闭包，用一个立即执行函数把每次循环的i值给包起来。这样当事件函数内的代码顺着作用域链从内到外查找变量`i`时，会找到闭包环境中的`i`，如果有6个`div`，那么就有6个`i`，这里分别是0，1，2，3，4，5

```javascript
var nodes = document.querySelectorAll('div')
for (var i = 0; i < nodes.length; i++) {
  (function(i) {
    nodes[i].onclick = function() {
      alert(i)
    }
  })(i)
}
```

### 3.1.3 闭包的更多作用

1. 封装变量

   闭包可以将一些不需要暴露在全局的变量给封装成“私有变量”。

   比如做“函数缓存”：

   ```javascript
   var mult = (function() {
     var cache = {}
     return function(arg) {
       console.log(cache)
       if (String(arg) in cache) {
         return cache[arg]
       }
       return cache[arg] = arg * arg
     }
   })()
   
   console.log(mult(2))
   ```

   mult这个函数是用来计算平方数的，对于一些相同的参数来说，每次计算可能都是一次性能浪费，可以加入缓存机制来提高这个函数的性能。

   处理的手段就是运用一个cache的对象来保存键（传入的参数）值（第一次计算后的结果）。

   由于cache仅仅在mult函数中使用，所以运用闭包的技巧将cache变量封闭在mult函数内部，可以减少代码中的全局变量，还可以避免这个变量在其他地方被不小心修改而引发错误。

   提炼函数是代码重构的一种常见技巧。如果一个大函数中有一些代码块能够独立出来，我们将这些代码封装在独立的小函数中，独立出来的小函数有助于代码复用，这些小函数本身也可能起到注释的作用，我们也可以将这些小函数用闭包给封闭起来。

   上面的代码还可以这样修改

   ```javascript
   var mult = (function() {
     var cache = {}
   
     function calculate(number) { //计算逻辑
       return number * number
     }
   
     return function(arg) {
       if (String(arg) in cache) {
         console.log(cache)
         return cache[arg]
       }
       return cache[arg] = calculate(arg)
     }
   })()
   
   console.log(mult(2))
   console.log(mult(2))
   ```

2. 延续局部变量的寿命

   ```JavaScript
           var report = function( src ){
               var img = new Image();
               img.src = src;
           };
   
           report( 'http://xxx.com/getUserInfo' );
   ```

   因为一些低版本浏览器的实现存在bug，在浏览器下使用report函数进行数据上报时会丢失30%左右的数据，也就是说，report函数并不是每一次都成功发起http请求。丢失数据的原因是img是report函数的局部变量，当report函数的调用结束后，img局部变量就被销毁了，此时或者还没来得及发送http请求，所以这次请求会丢失。

   现在我们用闭包的原理将img变量给封闭起来，就可以解决请求丢失的问题。

   ```JavaScript
           var report = (function(){
             var imgs = [];
             return function( src ){
                 var img = new Image();
                 imgs.push( img );
                 img.src = src;
             }
          })();
   ```

### 3.1.4 闭包和面向对象设计

运用闭包能实现通常面向对象才能够实现的功能。

比如下面这段代码

```javascript
 const obj = {
  value: 1,
  call: function() {
    this.value += 1
    console.log(this.value)
  }
}
obj.call() // 2
obj.call() // 3
obj.call() // 4
```

使用闭包也可能过实现

```javascript
function fnc() {
  let value = 1
  return function() {
    value++
    console.log(value)
  }
}
const call = fnc()
call() // 2
call() // 3
call() // 4
```

### 3.1.5 用闭包实现命令模式

命令模式的意图是将请求封装为对象，从而分离请求的发起者和请求执行者之间的耦合关系。在命令被执行之前，可以预先往命令对象中植入命令的接受者。

比如下面示例

```html
  <button id="execute">点击我执行命令</button>
  <button id="undo">点击我执行命令</button>
```

```javascript
var Tv = { // 命令接收者：它具备所有要做的操作
  open: function() {
    console.log('打开电视机');
  },
  close: function() {
    console.log('关上电视机');
  }
};
//命令对象构造器
var OpenTvCommand = function(receiver) { // 命令会被这个构造器所构造的命令对象当作属性保存起来
  this.receiver = receiver;
};

OpenTvCommand.prototype.execute = function() { // 命令对象的命令放在原型上
  this.receiver.open(); // 执行命令，打开电视机
};

OpenTvCommand.prototype.undo = function() {
  this.receiver.close(); // 撤销命令，关闭电视机
};
//设置命令-接收一个命令对象
var setCommand = function(command) {
  document.getElementById('execute').onclick = function() {
    command.execute(); // 输出：打开电视机
  }
  document.getElementById('undo').onclick = function() {
    command.undo(); // 输出：关闭电视机
  }
};

setCommand(new OpenTvCommand(Tv));
```

上面的代码可以使用**函数**而不是普通对象来封装命令请求，这样更加自然。如果需要往函数对象中预先植入命令的接收者，那么闭包就可以完成这个工作。

```javascript
var Tv = {
  open: function() {
    console.log('打开电视机');
  },
  close: function() {
    console.log('关上电视机');
  }
};

// 创建命令的函数，传入命令接收者返回一个命令对象
const createCommand = function(receiver) {
  const execute = function() {
    receiver.open()
  }
  const undo = function() {
    receiver.close()
  }

  return {
    execute,
    undo
  }
}


var setCommand = function(command) {
  document.getElementById('execute').onclick = function() {
    command.execute(); // 输出：打开电视机
  }
  document.getElementById('undo').onclick = function() {
    command.undo(); // 输出：关闭电视机
  }
};

setCommand(createCommand(Tv));
```

在面向对象版本的命令模式中，预先植入的命令接收者被当成**对象的属性保存起来**。而在闭包版本的命令模式中，命令的接收者则会被**封闭在闭包形成的环境**中。

### 3.1.6 闭包与内存管理

 闭包是非常强大的特性，人们对它有一种误解：闭包会造成内存泄漏，所以要尽量减少闭包的使用。

局部变量本来应该在函数退出时被解除引用。如果局部变量在闭包形成的环境里，那么这个局部变量的确可以一直生存下去，这些数据也无法被及时销毁。

但使用闭包的一个原因是开发者可能以后还需要用到这些变量，把这些变量放在闭包环境中还是全局环境中对内存的影响是一致的。所以不能说是内存泄漏。

唯一跟内存泄漏有关系的是，使用闭包时，比较容易形成循环引用。如果闭包的作用域链中保存着一些DOM节点，这时候就可能造成内存泄漏。这本身的原因并非JavaScript或者闭包的问题。而是由于早期IE浏览器中，由于BOM和DOM对象是使用C++以COM对象的方式实现的，而COM对象的垃圾收集机制采用的是引用计数策略。在基于技术策略的垃圾回收机制中，如果两个对象之间形成了循环引用，那么两个对象都无法被回收。循环引用造成的内存泄漏在本质上也并非闭包造成的。

如果我们想要解决循环引用带来的内存泄漏问题，只需要把循环引用中的变量设置为null即可，这意味着切断变量与它引用的值之间的连接。当这些值不能被访问到时，垃圾回收器在运行时就会删除这些值并回收它们占用的内存。

## 3.2 高阶函数

高阶函数是具备以下任一条件的函数：

* 函数作为参数被输入
* 函数作为返回值被输出

下面介绍高阶函数的应用场景

### 3.2.1 函数作为参数传递

1. 回调函数

   当我们想在ajax请求返回时做一些操作，但又不知道请求返回的时间时，可以传递一个回调函数给调用ajax的方法，等到请求完成后调用回调函数。

   ```javascript
   var getUserInfo = function(userId, callback) {
     $.ajax('http://xxx.com/getUserInfo? ' + userId, function(data) {
       if (typeof callback === 'function') {
         callback(data);
       }
     });
   }
   
   getUserInfo(13157, function(data) {
     alert(data.userName);
   });
   ```

   回调函数除了用于异步请求外，目前更多的场景是应用于拆分业务逻辑，通过封装互相关系并不大的代码，降低代码之间的耦合，使之可读性更高。比如说下面将一个拆分出逻辑的函数当作参数传递给另一个函数，来委托它执行。

   ```javascript
   var appendDiv = function(callback) {
     for (var i = 0; i < 100; i++) {
       var div = document.createElement('div');
       div.innerHTML = i;
       document.body.appendChild(div);
       if (typeof callback === 'function') {
         callback(div)
       }
     }
   };
   
   const hiddenElement = function(element) {
     element.style.display = 'none'
   }
   appendDiv(hiddenElement);
   ```

   将元素隐藏的逻辑跟添加元素的逻辑代码关联并不大，所以我们将其拆分出来，通过callback的形式传递给appendDiv，这样appendDiv函数的复用性要强很多。

2. Array.prototype.sort

   Array.prototype.sort接受一个函数当作参数，这个函数里面封装了数组元素的排序规则。从它的使用来看，我们的目的是对数组排序，这是不可变的部分，而如何排序，这属于可变部分。把可变部分封装到函数参数中，动态传递给sort函数，使sort函数变成一个非常灵活的方法

   ```javascript
   var numbers = [4, 2, 5, 1, 3];
   numbers.sort((a, b) => a - b);
   console.log(numbers);
   
   // [1, 2, 3, 4, 5]
   ```

### 3.2.2 函数作为返回值输出

将函数作为返回值输出的场景比函数作为参数的场景更多。

1. 判断数据的类型

   判断数据是否为数组有很多种方法，比如使用i`nstanceOf`关键字、`isArray`方法，比较好的方法是用`Object.prototype.toString.call`

   ```javascript
   console.log(Object.prototype.toString.call([1,2,3])) // "[object Array]"
   console.log(Object.prototype.toString.call(1)) // "[object Number]"
   console.log(Object.prototype.toString.call('1')) // "[object String]"
   console.log(Object.prototype.toString.call(function(){})) // "[object Function]"
   console.log(Object.prototype.toString.call(null)) // "[object Null]"
   console.log(Object.prototype.toString.call(undefined)) // "[object Undefined]"
   ```

   我们可以封装一个专用于判断类型的函数

   ```javascript
   var isString = function(obj) {
     return Object.prototype.toString.call(obj) === '[object String]';
   };
   
   var isArray = function(obj) {
     return Object.prototype.toString.call(obj) === '[object Array]';
   };
   
   var isNumber = function(obj) {
     return Object.prototype.toString.call(obj) === '[object Number]';
   };
   ```

   这些函数大部分逻辑都是一样的，区别只是`[objct xxx]`字符串的值。我们可以将封装一个`isType`函数，然后将这些不同的字符串当成参数传递给`isType`函数

   ```javascript
   function isType(type){
     return (obj)=> Object.prototype.toString.call(obj) === `[object ${type}]`
   }
   const isString=isType('String')
   const isArray=isType('Array')
   const isNumber=isType('Number')
   
   console.log(isNumber(1))
   console.log(isString('1'))
   console.log(isArray([1,2,3]))
   ```

   仔细看，`isType`函数的调用也重复写了很多次，所以我们还可以封装一下来自动注册`isType`函数

   ```javascript
   const Type = {};
   ['String', 'Array', 'Number'].map((type) => {
     Type[`is${type}`] = (obj) => Object.prototype.toString.call(obj) === `[object ${type}]`
   })
   
   console.log(Type.isString('123'))
   console.log(Type.isArray([1,2,3]))
   console.log(Type.isNumber(123))
   ```

2. getSingle

   下面是一个单例模式的例子，它接受一个函数作为参数，又让函数执行返回另外一个函数

   ```javascript
   var getSingle = function(fn) {
     var ret;
     return function() {
       return ret || (ret = fn.apply(this, arguments))
     }
   }
   var getScript = getSingle(function() {
     return document.createElement('script')
   })
   var script1 = getScript()
   var script2 = getScript()
   console.log(script1 === script2) // true
   ```

   这个单例模式传递一个函数，并返回一个函数，当调用返回的这个函数时，拿到的都是闭包中的变量。

### 3.2.3 高阶函数实现AOP

AOP(面向切面编程)的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，这些跟业务逻辑无关的功能通常包括日志统计、安全控制、异常处理等。把这些功能抽离出来后，再通过动态织入的方式掺入业务逻辑模块中。这样做的好处是保持业务逻辑模块的纯净和高内聚性，其次是可以方便复用。

比如目前有一个业务模块是需要实现以下的代码效果：

```javascript
function func2() {
  console.log(2)
  return 888
}

const action=func2.before(() => {
  console.log(1)
}).after(() => {
  console.log(3)
})
const result=action() // 1 2 3
result // 888
```

在javascript中实现AOP，都是把一个函数动态织入另一个函数之中，这里通过扩展`Function.prototype`来做到这一点。

```javascript
Function.prototype.before = function(beforeFunc) {
  const _self = this
  return function() {
    beforeFunc.apply(this, arguments)
      //返回主函数的结果
    return _self.apply(this, arguments)
  }
}

Function.prototype.after = function(afterFunc) {
  const _self = this
  return function() {
    const result = _self.apply(this, arguments)
    afterFunc.apply(this, arguments)
      //返回主函数的结果
    return result
  }
}
```

这种AOP的方式给函数添加职责，也是JavaScript语言中一种非常特别和巧妙的装饰者模式的实现，这种模式在实际开发中非常有用。

### 3.2.4 高阶函数的其他应用

1. currying

   函数柯里化又称部分求值。一个柯里化函数首先会接受一些参数，接受这些参数后，该函数不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中被保存起来。等到函数真正需要求值的时候，之前传入的所有参数都会被用于一次性求值。

   比如，我每天都将开销传入一个函数，直到某天我想查看所有开销：

   ```javascript
   cost(100); // 未真正求值
   cost(200); // 未真正求值
   cost(300); // 未真正求值
   
   console.log(cost()); // 求值并输出：600
   ```

   我们可以利用柯里化的思想来帮助我们完成cost函数

   ```javascript
   const cost = (function() {
     const args = []
     return function() {
       if (arguments.length === 0) {
         const result = args.reduce((pre, cur) => pre + cur, 0)
         return result
       }
       args.push.apply(args, arguments)
       return args
     }
   })()
   
   cost(100); // 未真正求值
   cost(200); // 未真正求值
   cost(300); // 未真正求值
   
   console.log(cost()); //600
   ```

2. 节流

   在有些情况下，函数会被频繁调用，造成性能问题。常见的场景分三种：

   * window.onresize事件

     我们给window绑定了resize事件，当浏览器窗口被拖动而改变时，这个事件函数触发的频繁非常高，如果我们在里面放一些DOM节点相关的操作，那么浏览器可能会吃不消而卡顿。

   * mousemove事件

     我们给一个div绑定拖拽事件，当div被拖动时，也会频繁触发事件函数

   * 上传进度

     微云的上传功能使用了公司提供的一个浏览器插件。该浏览器插件在真正开始上传文件之前，会对文件进行扫描并随时通知JavaScript函数，以便在页面中显示当前的扫描进度。但该插件通知的频率非常之高，大约一秒钟10次，很显然我们在页面中不需要如此频繁地去提示用户。

   节流主要用于函数被触发的频率太高的问题。很多时候，我们并不需要频繁调用这些函数，这就需要我们按照时间来忽略掉某些函数处理的过程。我们可以借助`setTimeout`来完成这件事。

   下面的throttle函数的原理是，将即将被执行的函数用setTimeout延迟一段时间执行。如果该次延迟执行还没有完成，则忽略接下来调用该函数的请求

   ```javascript
   function throttle(handle, delay) {
     var flag = false //开关
     var timer //定时器id
     return function() {
       const _self = this //谁调用这个函数
       if (flag) {
         return
       }
       flag = true
       timer = setTimeout(() => {
         handle.apply(_self, arguments)
         flag = false
         clearTimeout(timer)
       }, delay)
     }
   }
   ```

3. 分时函数

   上面的节流函数时采用限制频繁调用函数的方式来优化性能，下面有一种新的需求，我不得不频繁调用函数。

   比如我需要创建用户列表，一次性创建1000个节点的话，浏览器很有可能就吃不消了。

   ```javascript
     let array = []
     for (let i = 0; i < 1000; i++) {
       array.push(i) //这里的i假设为用户数据
     }
   
     function renderList() {
       for (let data of array) {
         const div = document.createElement('div')
         div.innerHTML = data
         document.body.appendChild(div)
       }
     }
     renderList()
   ```

   这个问题的解决方案之一是封装一个`timeChunk`函数，每次都让创建节点的函数分批进行，而不是一次性渲染完成，比如每隔200毫秒来渲染8个节点。

   ```javascript
     let array = []
     for (let i = 0; i < 1000; i++) {
       array.push(i) //这里的i假设为用户数据
     }
   
     function renderItem(data) {
       const div = document.createElement('div')
       div.innerHTML = data
       document.body.appendChild(div)
     }
   
     function timeChunk(array, handler, count) {
       let data
       let timer
   
       function start() {
         for (let i = 0; i < count; i++) {
           data = array.shift()
           handler(data)
         }
       }
       timer = setInterval(function() {
         if (array.length === 0) {
           return clearInterval(timer)
         }
         start()
       }, 200)
     }
     timeChunk(array, renderItem, 8)
   ```

   上面的代码是将原来的renderList函数里面的循环逻辑提炼出来，只专注于渲染节点（renderItem），将渲染次数交给timechunk函数来处理，这个timechunk函数的特点是会间隔一段时间不断调用renderItem函数。

   可以看出分时函数跟节流函数的关注点大相径庭，分时函数注重的是将函数执行次数的单位周期拉长，而节流函数注重将函数的执行次数减短。

4. 惰性加载函数

   为了兼容新老版本浏览器，下面是一段封装过的绑定事件的代码

   ```javascript
   var addEvent = function(target, type, handler) {
     if (window.addEventListener) {
       return target.addEventListener(type, handler, false)
     }
     if (window.attachEvent) {
       return target.attachEvent(`on${type}`, handler)
     }
   }
   ```

   这个函数有个缺点，每次绑定事件时都会执行if语句，虽然没多大影响，但是能不能优化一下呢？

   我直接写一个立即执行函数，然后在里面做判断，再返回一个新的绑定事件函数不就可以了？这样的话条件判断就只是执行了一次。

   ```javascript
   var addEvent = (function() {
     if (window.addEventListener) {
       return function(target, type, handler) {
         target.addEventListener(type, handler, false)
       }
     }
     if (window.attachEvent) {
       return function(target, type, handler) {
         target.attachEvent(`on${type}`, handler)
       }
     }
   })()
   ```

   但是这个问题可能还有问题，假设我从来没绑定过事件，那么这个函数立即执行一次就没有任何意义。

   是不是能封装一个更高级的函数？

   答案是惰性加载函数。

   惰性加载函数的原理是，在函数内部重写这个函数，重写的方式就是将变量名的引用连接到一个新函数上。

   重写之后的函数就是我们期望的函数，而且还已经帮助我们做好了条件判断。

   ```javascript
   var addEvent = function(target, type, handler) {
     if (window.addEventListener) {
       addEvent = function(target, type, handler) {
         target.addEventListener(type, handler)
       }
   
     } else if (window.attachEvent) {
       addEvent = function(target, type, handler) {
         target.attachEvent(`on${type}`, handler)
       }
     }
     // 第一次调用时需要执行一次
     addEvent(target, type, handler)
   }
   console.log(addEvent) // 没执行前依然是原函数
   addEvent(window, 'click', function() {}) // 原函数依然执行了一次
   console.log(addEvent) // 执行一次后就重写了这个函数
   ```

## 3.3 小结

由于JavaScript语言的特点，它的设计模式的实现跟传统面向对象语言差别非常大。

在JavaScript中，很多设计模式都是借助闭包和高阶函数来完成的，闭包和高阶函数的应用非常多。

相对于其实现过程，我们更应该关注设计模式可以帮助我们完成什么。



