# 一、 什么是设计模式

设计模式的定义是：在面向对象软件设计中针对特定问题采取的简洁而优雅的解决方案的一种总结。

通俗一点就是：在某种场合下对某种问题的一种好的解决方案（写了一段好代码），然后取了一个名字。

模式的作用是让人们写出可复用和可维护性高的程序。

所有设计模式都遵循一条原则：寻找程序中可变化的部分，然后封装起来。

# 二、原型模式

在以类为中心的面向对象编程语言中，只能从类创建一个对象。

JavaScript没有提供传统面向对象语言中的类继承，而是通过原型委托的方式来实现对象之间的继承。

在原型编程思想中，类并不是必须的，对象也未必需要从类中创建而来，一个对象是通过克隆另外一个对象所得到的。

原型模式不单单是一种设计模式，也被称为编程泛型。

## 2.1 原型模式的规则

原型模式的实现关键，在于语言本身是否提供了clone方法，ES5提供了`Object.create`这个API来克隆对象。

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

原型模式的真正目的并非在于要创建一个一模一样的对象，而是提供了一种便捷的方式去创建某个类型的对象，克隆只是创建这个对象的过程和手段。

原型编程的重要特性：当某个对象无法响应某个请求时，会把请求委托给它的原型。(JavaScript是给它的构造器的原型)

原型编程至少包含以下规则：

- 所有数据都是对象

  JavaScript绝大多数数据都是对象，JavaScript中也有一个根对象`Object.prototype`，这些对象都来自于这个根对象。

  我们遇到的每个对象，实际上都是从`Object.prototype`中克隆而来。`Object.prototype`就是它们的原型。

  ```javascript
  let obj=new Object()
  let obj2={}
  // 通过Object.getPrototypeOf()这个方法获取原型
  Object.getPrototypeOf(obj)===Object.prototype // true
  Object.getPrototypeOf(obj2)===Object.prototype // true
  ```

- 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它

  - 对象会记住它的原型
  - 如果对象无法响应某个请求，它会把这个请求委托给它自己的原型

  在JavaScript中，我们并不需要关心克隆的细节，这是引擎内部实现的。比如下面的代码

  ```javascript
  const obj={}
  const obj2=new Object()
  ```

   我们只需要显式地调用它，引擎就会从`object.prototype`中克隆一个对象出来。

  如果用new来构造一个对象：

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

  模拟new运算符

  ```javascript
  function myNew(constructorFunc,...rest){
    const obj={}// 从Object.prototype中克隆一个对象
    obj.__proto__=constructorFunc.prototype //把克隆下的对象的__proto__与构造器的原型做连接
    const result=constructorFunc.apply(obj,rest)// 调用构造器函数，this与object绑定
    return typeof result==='object'?result:obj //需要确保返回出一个对象，这是规范
  }
  ```

- 对象会记住它的原型

  请求需要在一个链条中传递，那么每个节点都必须保存它的下一个节点。
  
  Javascript的真正实现上来说，并不能直接说它的对象有原型，而是它的构造器有原型。对于对象把请求委托给它的原型这句话来说，更准确的是对象会把请求委托给它的构造器的原型。
  
  `object.__proto__===Object.prototype`
  
  JavaScript给对象提供了一个`__proto__`的属性，这个隐藏属性会默认指向它的构造器的原型对象。
  
  即

  ```javascript
  xxx.__proto__ === {Constructor}.prototype
  ```

  万能公式：实例的`__proto__`属性指向构造它的函数的原型。
  
  这个属性是对象跟对象构造器的原型进行联系的纽带。对象通过这个属性来记住它的构造器的原型。
  
- 如果对象无法响应某个请求，它会把请求委托给它自己的原型

  这条规则是JS继承的精髓所在。

  虽然JS的对象最初都是由Object.prototype克隆而来，但是对象构造器的原型并不限于Object.prototype，而是动态指向其他对象。这样一来，当对象a想要借用对象b的能力（继承），我们可以把a的构造器的原型指向b，这样就可以使用b的能力。

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

  * 遍历对象a的所有属性，但是没找到name
  * 查找name属性的这个请求委托给A.prototype
  * A.prototype事先已经被设置成obj，于是返回obj的name属性

  使用JS的类来模拟继承效果，我们可以用以下代码：

  ```javascript
  var A=function (){}
  A.prototype={name:'qiuyanxi'}
  
  var B=function (){}
  B.prototype=new A()
  // B.prototype =Object.create(A.prototype) 也可以用这个方法
  var b=new B()
  console.log(b.name) // "qiuyanxi"
  ```

  这段代码的执行过程是这样的：

  * 让B的原型与实例a相连接（或者让B的原型跟A的原型互相连接）
  * 实例b访问name属性时，遍历b身上的属性后没有找到，于是请求其构造器B的原型
  * B原型上依然没有，于是继续顺着其`__proto__`继续查找
  * 找到实例a，然后顺着a的`__proto__`，如果是B的原型跟A的原型互相连接则跳过这一步
  * 找到A.prototype，最终返回它身上的name值

  原型链并不是无限长的，根对象`Object.prototype`的`__proto__`指向的是null，说明原型链后面没有节点了。

  如果在根对象上依然没找到属性，那么就返回undefined。

## 2.2 class语法下的原型继承

除了根对象Object.prototype外,任何对象都有一个原型。通过`Object.create(null)`则可以创建一个没有原型的对象。

`Object.create`是原型的天然实现。

ES6带来了新的class语法，让JavaScript看起来像是一门类的语言，但是其背后依然是基于原型机制创建对象。

以下是简单的代码示例：

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
    super(name) //调用一次Animal的constructor方法
  }
  speak() {
    return 'jimi'
  }
}
var dog=new Dog('jimi')

console.log(dog.getName()===dog.speak()) // true
```

原型模式是一种设计模式，它构成了JavaScript这门语言的根本。

## 2.3 小结

1. 原型模式的真正目的在于为创建对象提供了一种便捷的方式，克隆只是创建这个对象的过程和手段。
2. JavaScript下大部分数据都是对象，我们可以使用便捷的语法糖通过克隆来创建对象而不是通过类。
3. 每个对象都会记住该对象的构造函数的原型。
4. 如果对象无法响应某个请求，它就会把请求委托给它的构造器的原型。
5. 原型的根是根对象Object.prototype,它的`__proto__`指向null，代表后面没有节点了。
6. JavaScript模仿Java创建class的语法，但底层依然是沿用原型模式的继承方式。

# 三、this、call和apply

## 3.1 this

JavaScript中的this总是指向一个对象，具体指向哪个对象则是在运行时根据函数的运行环境来确定，而不是声明时的环境。（词法作用域则是根据函数声明时的环境确定的）

this的指向大概分四种：

1. 作为对象的方法的调用
2. 作为普通函数调用
3. 作为构造函数调用
4. 由`Function.prototype.call`或者`Function.prototype.apply`或者`Function.prototype.bind`来显式指定

**当作为对象的方法调用时，指向该对象**

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

事件绑定中的this，一般是指向被点击的对象

```javascript
document.querySelector('#button').onclick = function() {
  console.log(this.id) // button
}
```

**当作为普通函数调用时，一般指向全局对象，浏览器的全局对象是window**

```javascript
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

    var getName = myObject.getName; //此时this丢失，getName变成普通函数
    console.log( getName() );    // globalName
```

当我们在事件函数内部调用callback方法，或者调用setTimeout方法时，这个方法内可能会使用到this，这个this默认指向window

```javascript
document.querySelector('#button').addEventListener('click', function() {
  function callback() {
    console.log(this.id) //undefined
  }
  callback()
})
```

**当作为构造函数调用时，指向被构造的对象**

构造器跟普通对象没有区别，只是我们调用它的方式不同。通过new关键字调用时，该对象的this会默认指向返回的这个对象。

```javascript
        var MyClass = function(){
            this.name = 'sven';
        };

        var obj = new MyClass();// new会新创建一个对象obj，并且让this指向它。相当于obj.name ='sven'
        alert ( obj.name );     // 输出：sven
```

当使用new关键字时，还需要注意一个问题，如果构造器显式返回一个object类型的对象时，最终会返回这个对象，而不是被构造的对象。（还记得如何手写new吗？）

```javascript
        var MyClass = function(){
            this.name = 'sven';
            return {    // 显式地返回一个对象
              name: 'anne'
            }
        };

        var obj = new MyClass(); // 由new关键字创建的并拥有this指向的obj不会被返回了
        alert ( obj.name );     // 输出：anne
```

如果不显式返回任何数据或者返回对象类型的数据，就不会有问题。

```javascript
        var MyClass = function(){
            this.name = 'sven'
            return 'anne';    // 返回string类型
        };

        var obj = new MyClass();
        alert ( obj.name );     // 输出：sven
```

**被显式指定时，则指向被指定的对象**

使用call、apply和bind可以显式指定this，我们在事件点击函数中，如果想要显式指定this为被点击的对象，则可以这么做

```javascript
document.querySelector('#button').addEventListener('click', function() {
  function callback() {
    console.log(this.id) // button
  }
  callback.call(this)
})
```

也可以保存this的引用来改写callback函数内部的代码

```javascript
document.querySelector('#button').addEventListener('click', function() {
  const that=this
  function callback() {
    console.log(that.id) // button
  }
  callback()
})
```

## 3.2 this丢失问题

```javascript
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

当调用`obj.getName`时，此时getName作为对象的方法被使用，this指向对象obj

当`obj.getName`被赋值给getName2时，此时是普通函数的调用方式，this指向了window。

## 3.3 call和apply

call和apply的作用一模一样，区别只是传参的形式不一样。

apply接收两个参数，第一个参数是指定this的指向，第二个参数是一个数组，也可以是类数组。apply会把第二个参数传递给被调用的函数。

```javascript
const obj = { name: null };

function fn() {
  callback.apply(obj, arguments);
}
function callback() {
  this.name = arguments;
  console.log(this.name); //{0: 1, 1: 2, 2: 3, 3: 4, 4: 5}
}
fn(1, 2, 3, 4, 5);
console.log(obj); //{name:{0: 1, 1: 2, 2: 3, 3: 4, 4: 5}}
```

call是包装在apply上的语法糖，第一个参数也是this指向，从第二个参数开始，所有参数都会被传递给被调用的函数

```javascript
var func=function(a,b,c){
  console.log(a,b,c)
}
func.call(null,1,2,3) // 1 2 3
```

当call和apply的第一个参数是null时，会指向window（严格模式下指向null）

```javascript
        var func = function( a, b, c ){
            alert ( this === window );    // 输出true
        };

        func.apply( null, [ 1, 2, 3 ] );

				// 严格模式下this指向null
        var func = function( a, b, c ){
            "use strict";
            alert ( this === null );     // 输出true
        }

        func.apply( null, [ 1, 2, 3 ] );
```

## 3.4 call和apply的用途

1. 改变this的指向

   常见用途就是改变函数内部的this指向

2. 借用其他对象的方法完成类似于继承的效果

   构造函数模式下的继承就是这样做的

   ```javascript
   function A(name) {
     this.name = name;
   }
   
   function B(name) {
     A.call(this, name);
   }
   const b = new B("qiuyanxi");
   console.log(b.name);
   ```

3. 可以用来模拟bind方法

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

4. 借用其他对象的方法来实现某种功能

   比如Math.max方法接收的是一系列参数，如果想要判断一组数组中的最大值，则可以使用apply方法

   ```javascript
   Math.max.apply(null,[1,2,3,4,5]) //5
   ```

   函数的arguments是一个伪数组，它并没有数组的原型方法，除了用Array.from方法将其变成真正的数组外，还可以用apply、call等方法让arguments借用数组的原型方法。
   
   ```javascript
   function fn() {
     Array.prototype.push.call(arguments, 3)
     console.log(arguments) // [1,2,3]
   }
   fn(1, 2)
   ```
   
   能够使用这个方法让arguments具备数组的能力的原因来自于V8引擎的源码：
   
   ```javascript
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
   
   上面的代码做了以下事情：
   
   1. 获取被push的对象的长度（这里对应例子中的`arguments`为被push的对象，它的长度为2）
   2. 获取push的参数个数（对应例子中的参数3，所以参数个数为1）
   3. 循环遍历被push的参数个数，然后直接在`arguments`的末尾位置挨个插入被push的值，`%_Arguments`用来获取V8源码中的参数对象，`%_Arguments( i )`获取到的是3。
   4. `this[ i + n ] = %_Arguments( i )`就相当于运行`arguments[2]=3`
   5. 改变被push对象的长度(原长度+参数个数)，返回`length`属性
   
   从源码可以看出，V8引擎不在乎调用`push`方法的到底是不是数组,它只需要能够获取调用方法的对象的`length`，然后按照下标依次将参数添加到被push对象上，顺便修改掉`length`属性就可以了。
   
   通过`ArrayPush`函数，我们可以知道想要实现`Array.prototype.push.call`类似的效果，需要具备两个条件：
   
   * 被push对象属性可修改
   * 被push对象具备可读写的`length`属性
   
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
   
   `fn`函数的` length`是形参，只读属性，不可修改，所以报错了

# 四、闭包和高阶函数

## 4.1 闭包

闭包的形成跟变量的作用域和变量的生存周期密切相关。

变量的作用域指的是变量的有效范围，我们主要分函数作用域和全局作用域。

在函数中声明一个变量时，如果没有变量声明关键字，那么这个变量就会成为全局变量。

当使用变量声明，那就是函数作用域

```javascript
        var func = function(){
            var a = 1;
            alert ( a );     // 输出： 1
        };
        func();
        alert ( a );     // 输出：Uncaught ReferenceError: a is not defined
```

函数可以创造一个作用域，此时函数外部访问不到函数内部的变量，而函数内部可以访问到外部。

这是因为当在函数内搜索变量时，如果该函数没有，那就会顺着作用域链往外层搜索，一直搜索到全局变量为止。

变量的搜索是由内到外的。

### 4.1.1 闭包的生存周期

全局变量的生存周期是永久的，除非我们主动销毁这个全局变量。

在函数内声明局部变量后，当退出函数时，这些局部变量就会随着函数的调用结束而被销毁。

```javascript
        var func = function(){
            var a = 1;      // 退出函数后局部变量a将被销毁
            alert ( a );
        };

        func();
```

但是如果稍做修改

```javascript
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

我们可以发现变量`a`并没有被销毁掉，而是一直存在内存当中。

这是因为当`var f = func()`时，外部变量f一直保存着匿名函数的引用，它可以访问到`func()`被调用时产生的环境，而局部变量a一直存在于这个环境中。如果局部环境中的变量依然能够被外界所访问，那么这个局部变量就有了不被销毁的理由。

下面是一个经典的闭包问题

```javascript
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

上面的代码不管点击哪个div，都会打印6。

这是因为onclick事件是异步的，当事件触发时，for循环早已结束，此时i为6。

从作用域的角度看，for循环跟var享受了同一个作用域，当div被点击时，当前作用域下的`i`就是for循环结束后的那个6。

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

### 4.1.2 闭包的更多应用

1. 封装变量

   闭包可以将一些不需要暴露在全局的变量给封装成“私有变量”

   比如 函数缓存

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

   函数缓存的处理手段就是使用闭包变量cache来保存键值，键是传入的参数，值是第一次计算的结果。

   对于相同的参数来说，每次计算都是性能的浪费，加入缓存机制可以减少这种浪费。

   cache封闭在函数内部，可以减少代码中的全局变量，避免这个变量在其他地方被不小心修改而引发错误。

2. 延续局部变量的寿命

   ```javascript
           var report = function( src ){
               var img = new Image();
               img.src = src;
           };
   
           report( 'http://xxx.com/getUserInfo' );
   ```

   因为一些低版本浏览器的实现存在bug，在浏览器下使用report函数进行数据上报时会丢失30%左右的数据，也就是说，report函数并不是每一次都成功发起http请求。丢失数据的原因是img是report函数的局部变量，当report函数的调用结束后，img局部变量就被销毁了，此时或者还没来得及发送http请求，所以这次请求会丢失。

   现在我们用闭包的原理将img变量给封闭起来，就可以解决请求丢失的问题。

   ```javascript
           var report = (function(){
             var imgs = [];
             return function( src ){
                 var img = new Image();
                 imgs.push( img );
                 img.src = src;
             }
          })();
   ```

### 4.1.3 闭包和面向对象设计

使用闭包可以实现通常面向对象才能完成的功能。

比如

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

使用闭包可以这样完成

```javascript
function func(){
  let value=1
  return function(){
    value+=1
    console.log(value)
  }
}
let call =func()
call() //2
call() //3
call() //4
```

### 4.1.4 闭包和内存管理

人们对闭包有一种误解：闭包会造成内存泄漏，所以要减少闭包的使用。

局部变量应该在函数退出时解除引用，如果局部变量在闭包形成的环境里，那么局部变量会一直生存下去，这些数据也无法被及时销毁。

但使用闭包的原因是开发者在以后可能还要用到这些数据，把这些数据放到全局环境下对内存的影响是一致的，所以不能说是内存泄漏。

唯一跟内存泄漏有关系的是，使用闭包时，比较容易形成循环引用。

如果闭包的作用域链中保存着一些DOM节点，这时候可能造成内存泄漏。究其原因是早起IE浏览器中，由于DOM和BOM的对象是用C++以COM对象的方式实现的，而COM对象的垃圾收集机制采用引用计数策略。

```javascript
//假设这是一段基于计数策略的代码
function fn(){
  var a=1 //当变量a保存着数据1的引用时，计数+1
  var b=a //当变量b保存变量a的引用时，a被记成2次引用
}
fn() 
```

在基于计数策略的垃圾回收机制中，如果两个对象形成了循环引用，那么两个对象都无法被回收。循环引用造成的内存泄漏本质上并非闭包造成的，也并不是JS造成的。

如果我们想要解决循环引用带来的内存泄漏问题，只需要把循环引用中的变量设置为null即可，这意味着**切断变量与它引用的值之间的连接。当这些值不能被访问到时，垃圾回收器在运行时就会删除这些值并回收它们占用的内存**。

## 4.2 高阶函数

具备以下任一条件的就是高阶函数

* 参数是函数
* 返回值是函数

### 4.2.1 高阶函数实现判断类型

除了使用`instanceof`关键字、isArray方法判断类型外，比较好的方法是用`Object.prototype.toString.call`

```javascript
console.log(Object.prototype.toString.call([1,2,3])) // "[object Array]"
console.log(Object.prototype.toString.call(1)) // "[object Number]"
console.log(Object.prototype.toString.call('1')) // "[object String]"
console.log(Object.prototype.toString.call(function(){})) // "[object Function]"
console.log(Object.prototype.toString.call(null)) // "[object Null]"
console.log(Object.prototype.toString.call(undefined)) // "[object Undefined]"
```

我们可以这样封装

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

这些函数大部分的逻辑都是一样的，区别只是`[object xxx]`的不同，我们可以封装一个isType函数，然后将这些字符传递给isType函数

```javascript
function isType(type){
  return (obj)=>Object.prototype.toString.call(obj) === `[object ${type}]`
}
isType('String')('123')
isType('Array')([1,2,3])
isType('Number')(1)
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

### 4.2.2 高阶函数实现AOP

AOP(面向切面编程)的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，这些跟业务逻辑无关的功能通常包括日志统计、安全控制、异常处理等。把这些功能抽离出来后，再通过动态织入的方式掺入业务逻辑模块中。这样做的好处是保持业务逻辑模块的纯净和高内聚性，其次是可以方便复用。

比如目前一个业务模块实现以下效果

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

在JavaScript中实现AOP，都是把一个函数动态织入另一个函数中，这里是通过`Function.prototype`来实现这一点。

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

### 4.2.3 高阶函数实现防抖和节流

防抖和节流多用于函数被频繁调用的场景，比如用户频繁点击按钮触发事件绑定函数，`window.onresize`事件等。

防抖可以理解为网络游戏中的打断CD，比如魔兽里每次法师的施法前都会做一套动作，可以看作是延迟施法，如果法师施法被打断了，想要继续使用技能就得重新读秒。

以下是实现

```javascript
      function debounce(handler, delay) {
        var timer = null;
        return function () {
          const context = this;
          clearTimeout(timer);
          timer = setTimeout(function () {
            handler.apply(context, arguments);
            clearTimeout(timer);
          }, delay);
        };
      }
```

防抖实际上就是每次触发函数时，都将上一次的定时器任务给取消掉，新开一个定时器。

跟防抖刚好相反，节流是每次都是只触发第一次被调用的回调，不管从第二次开始手动触发多少次，请求都会被过滤掉。

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

节流主要用于函数被触发的频率太高的问题。很多时候，我们并不需要频繁调用这些函数，这就需要我们按照时间来忽略掉某些函数处理的过程。我们可以借助`setTimeout`来完成这件事。

throttle函数的原理是，将即将被执行的函数用setTimeout延迟一段时间执行。如果该次延迟执行还没有完成，则忽略接下来调用该函数的请求。

### 4.2.4 高阶函数实现分时函数

节流函数是采用限制频繁调用函数的方式来优化性能，下面有一种新的需求，我们不得不频繁调用函数。

比如我需要创建用户列表，一次性创建10000个节点，浏览器很有可能就吃不消了。

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

### 4.2.5 高阶函数实现懒加载函数

函数懒加载又称惰性加载函数，多用于单次条件判断，本质上就是对函数的重新赋值。

比如为了兼容新老版本浏览器，下面是一段封装过的绑定事件的代码

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

这个函数有个缺点，我们每次绑定事件都需要判断一下，虽然对性能没多大影响，但能不能优化一下？

我们可以用立即执行函数，将判断的逻辑提取出来，然后返回新的事件绑定函数，这样一来判断只需要一次即可完成。

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

## 4.3 小结

由于JavaScript语言的特点，它的设计模式的实现跟传统面向对象语言差别非常大。

在JavaScript中，很多设计模式都是借助闭包和高阶函数来完成的，闭包和高阶函数的应用非常多。

相对于其实现过程，我们更应该关注设计模式可以帮助我们完成什么。

# 五、单例模式

单例模式的定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点。

单例模式是一种常用的模式，有一些对象我们往往只需要一个，比如全局缓存，浏览器中的window对象等。

传统的单例模式并不适用于 JavaScript，在JavaScript中，创建对象非常简单，我们也不需要先创建一个类。

单例模式的核心是确保只有唯一的一个实例并能够提供给全局访问。

全局对象虽然不是单例模式，但是我们可以当成单例来使用

```javascript
var global = {}
```

全局对象既可以是唯一的，又可以提供给全局访问，这就满足了单例模式的两个条件。

但是全局变量也有缺陷：造成全局命名空间污染。

## 5.1 动态创建全局命名空间

使用namespace可以降低全局变量带来的污染：

最简单的方式就是采用对象字面量的方式：

```javascript
var namespace = { a: function () {}, b: function () {} };
```

把需要的变量都定义成namespace的属性，这样可以有效减少变量和全局作用域打交道的机会。

除此之前，还可以动态创建全局命名空间。

```javascript
const myApp = {
  namespace(name, value) {
    let current = this;
    let key = name.split(".");
    key.forEach((k, index) => {
      if (!current[k]) {
        current[k] = {};
      }
      if (index === key.length - 1) {
        current[k] = value;
      }
      current = current[k];
    });
  }
};
myApp.namespace("dom.style.classname", { data: 123 });

//上面的代码会创建这样的对象
const myApp = {
  dom: {
    style: {
      classname: { data: 123 }
    }
  }
};
```

## 5.2 单例模式创建登录框

假设我们目前在QQ列表面板中，当点击登录按钮时，会弹出一个登录面板让用户登录。

版本1:我们可以预先创建好登录框，但登录框是隐藏的，当用户点击登录按钮后，它才显示出来。

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

这种方式的缺点在于该节点一开始就创建好了，如果用户没有点击登录按钮，那么创建该节点的操作就浪费了。

下面的方式倒是可以在点击按钮时创建，但是并不是单例模式，而且每次都会创建多个登录框。

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

下面我们用javascript版本的单例模式来完成这个需求。

在JavaScript中，我们可以使用闭包来完成单例模式。

要实现一个单例模式，只需要用一个变量来标识当前是否已为某个类创建过对象，如果是，则在下一次获取该类的实例时，直接返回之前创建的对象。

```javascript
var createLoginLayer = (function () {
  var div;
  return function () {
    if (!div) {
      div = document.createElement("div");
      div.innerHTML = "我是登录浮窗";
      div.style.display = "none";
      document.body.appendChild(div);
    }
    return div;
  };
})();
document.getElementById('loginBtn').onclick = function() {
  const LoginLayer = createLoginLayer() 
  LoginLayer.style.display = 'block';
};
```

## 5.3 通用的单例模式

上面的单例模式有明显的缺点：

1. 代码违背了单一原则，所有代码逻辑都放在createLoginLayer上，它又完成单例模式，又创建div
2. 立即执行函数使得代码读起来非常不舒服
3. 无法给其他用得到单例模式的场景复用

我们可以将处理单例模式的代码抽离出来，封装成singleton函数

```javascript
var singleton = function(handler) {
  var result;
  return function() {
    if (!result) {
      result = handler.apply(this, arguments)
    }
    return result;
  };
};
```

再改写一下创建登录框的函数

```javascript
var createLoginLayer = function() {
  var div = document.createElement('div');
  div.innerHTML = '我是登录浮窗';
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
};
```

最后直接使用即可

```javascript
const createSingletonLoginLayer = singleton(createLoginLayer);

btn.onclick = function() {
  const div = createSingletonLoginLayer();
  div.style.display = "block";
};
```

由于result始终在闭包中，所以它不会被销毁。

我们将创建对象的职责和管理单例的职责分离开放在两个方法里，这两个方法可以独立变化不受影响，当它们连接在一起时，就完成了创建唯一单例对象的功能。

单例模式的应用不止创建一个唯一的对象，也可以用在只处理一遍的业务场景上。

jquey 有一个 one 方法，它可以为元素添加处理函数。处理函数在每个元素上每种事件类型都只处理一次。

```javascript
$('#foo').one('click', function () {
  alert('This will be displayed only once.');
});
```

使用 getSingleton 也可以达到一样的效果

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
document.getElementById('loginBtn').onclick = bindEvent;
```

# 校验器(策略模式)

```javascript
// strategy策略对象
var strategies = {
  isNonEmpty: function (value, errorMsg) {
    // 不为空
    if (value === "") {
      return errorMsg;
    }
  },
  minLength: function (value, length, errorMsg) {
    // 限制最小长度
    if (value.length < length) {
      return errorMsg;
    }
  },
  isMobile: function (value, errorMsg) {
    // 手机号码格式
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
      return errorMsg;
    }
  }
};

// Context类
class Validator {
  #cache = []; //保存校验规则
  add(dom, rule, errorMessage) {
    if (rule instanceof Array) {
      return this.addRules(dom, rule);
    }
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
    for (let itemFunc of this.#cache) {
      let message = itemFunc();
      if (message) {
        return message;
      }
    }
  }
  addRules(dom, rules) {
    for (let [rule, errorMessage] of rules) {
      this.add(dom, rule, errorMessage);
    }
  }
}

var validator = new Validator(); 
validator.add(registerForm.phoneNumber, "isMobile", "手机号码格式不正确");
validator.add(registerForm.userName, [
    ["isNonEmpty", "用户名不能为空"],
    ["minLength:10", "用户名长度不能小于10位"]
  ]);
```

# 预加载图片(代理模式)

```javascript
var myImage = (function() {
  var imgNode = document.createElement('img');
  document.body.appendChild(imgNode);

  return {
    setSrc: function(src) {
      imgNode.src = src;
    }
  }
})();

var proxyImage = (function() {
  const img = new Image()
  img.onload = function() { // 3. 代理的src加载完成，会触发onload事件
    myImage.setSrc(this.src) // 4. 此时再重新给被代理的节点设置src属性
  }
  return {
    setSrc(src) {
      myImage.setSrc('loading.png')//1.先让node节点预先加载loading图
      img.src = src //2.设置代理的src属性
    }
  }
})()

proxyImage.setSrc('http://xxxx') // proxyImage代理了myImage的访问，并且加入额外的预加载操作
```

# 缓存代理(代理模式)

```javascript
var mult = function(...rest) {
  let a = 1
  mult = function(...rest) {
    for (let i of rest) {
      console.log("这里是复杂的计算")
      a *= i
    }
    return a
  }
  return mult(...rest)
}


var proxyMult = (function() {
  let cache = {}
  return function(...rest) {
    let property = rest.join(',')
    if (property in cache) {
      return cache[property]
    }
    return cache[property] = mult(...rest)
  }
})()

console.log(proxyMult(1, 2, 3))
console.log(proxyMult(1, 2, 3))
```

# 发布订阅模式

```javascript
class eventHub {
  #cache = {};
  //订阅事件
  listen(key, fn) {
    if (key in this.#cache === false) {
      this.#cache[key] = [];
    }
    this.#cache[key].push(fn);
  }
  // 发布事件
  trigger(key, ...rest) {
    if (!this.#cache[key] || this.#cache[key].length === 0) {
      return false;
    }
    for (let fn of this.#cache[key]) {
      fn.call(this, ...rest);
    }
  }
  //删除订阅事件
  remove(key, fn) {
    if (!key) {
      return false;
    }
    //如果没传递指定的函数，则删除全部订阅
    if (!fn) {
      this.#cache[key] = [];
    }
    const len = this.#cache[key].length;
    // 遍历cache，删除指定的函数
    for (let i = 0; i < len; i++) {
      let _fn = this.#cache[key][i];
      if (fn === _fn) {
        this.#cache[key].splice(i, 1);
        break;
      }
    }
  }
}
```

