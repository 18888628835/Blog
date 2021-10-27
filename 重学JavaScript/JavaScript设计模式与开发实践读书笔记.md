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

     ```
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

