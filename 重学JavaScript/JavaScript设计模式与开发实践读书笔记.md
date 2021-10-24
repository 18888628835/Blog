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

## 动态类型

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

## 多态

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

## 封装

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



## JavaScript中的原型模式

原型模式不单单是一种设计模式，也被称为编程泛型。

在以类为中心的面向对象编程语言中，只能从类创建一个对象。

但在原型编程思想中，类并不是必须的，对象也未必需要从类中创建而来。

从设计模式的角度讲，原型模式是用于创建对象的一种模式，如果我们想要创建一个对象，一种方法是先指定它的类型，然后通过类来创建这个对象。原型模式选择了另外一种方式，我们不再关心对象的具体类型，而是找到一个对象，然后通过克隆来创建一个一模一样的对象。

ES5提供了`Object.create`这个API来克隆对象，比如下面的代码

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

