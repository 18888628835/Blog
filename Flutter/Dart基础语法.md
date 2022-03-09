## 1. 一个简单的 Dart 程序

在dart中，我们需要在`main`函数中运行程序，所有代码都需要写到`main`里面才能调用。

```dart
// 定义一个函数.
void printInteger(int aNumber) {
  print('The number is $aNumber.'); // 打印到输出台
}

// 应用开始执行的位置，必须要写
void main() {
  var number = 42; // 声明并初始化一个值
  printInteger(number); // 执行一个函数
}
```

上面的代码中包含了以下内容：

**// ：注释**

 **viod：表示函数没有返回值** 

**var：让 Dart 自动判断类型的声明方式**

**print()：打印内容**

**int：整型数字类型**

**$*variableName*或者${*expression*}：字符串插值，字符串变量中包含变量或表达式**

**main()：特殊且必须的顶级函数，Dart 会从这个函数开始执行**



## 2. 重要概念

1. 所有变量引用的都是对象，每个对象都是一个类的实例。数字、函数以及nulll都是对象。除了null外（如果开启了空安全），所有类都继承于Object类。
2. 尽管Dart是强类型语言，但是在声明变量时可以不指定类型，Dart拥有跟Typescript一样的类型推断。
3. 如果开启了空安全，变量在未声明为可空类型时不能为 null。可以通过类型后加文号(?)将类型声明为可为空。例如 int?声明的变量可以是整数数字也可以是 null。
4. 如果 Dart 认为一个表达式可能为空，但是你明确知道它不可能为空时，可以用断言(!)来表示不为空。例如：int x=nullableButNotNullInt!
5. 如果我们想要显式表示允许任意类型，可以使用 Object?(在开启空安全的情况下)、Object 或者特殊类型 dynamic
6. Dart 支持泛型，比如数组的泛型 `List<int>`表示由 int 对象组成的列表或`List<Object>`表示由任意类型对象组成的列表
7. Dart 支持顶级变量以及定义类或对象的变量（静态和实例变量）。实例变量可以称为属性。
8. Dart 没有 public、protected 和 private 成员访问限定符。想要表示私有的，则用`_`当做标识符放在变量声明前面。
9. 变量声明和其他语言一样，可以用字母或者下划线开头，后面放字符和数字的组合。
10. Datr 的表达式有值，语句没有值。比如条件表达式`expression condition ? expr1 : expr2`中含有值`expr1` `expr2`，`if-else`分支语句则没有值。
11. Dart 工具会显示警告和错误两种类型的问题。警告表示代码有问题但是不会阻止运行；错误分编译错误和运行错误，编译错误代码不能运行，运行错误则会在运行时导致异常。



## 3. 变量声明

变量声明可以用以下方式：

```dart
var str='hello dart';
var num=123;
// 字符串类型
String str='hello dart';
// 数字类型
Int num=123;
```

使用 var 可以自动推断类型，也可以像 Java 一样手动写上类型`String`。

> 强类型语言，建议手动写类型

常量可以用 final 和 const 修饰符来声明

```dart
final name='some name';
const age=20;
```

`final`比`const`功能更加强大，强大的地方在于：

* final 可以一开始不赋值，如果赋值了则只赋值一次。const 一开始就需要赋值
* final不仅有 const 编译时的常量的特性，而且是惰性初始化，即在运行时第一次使用前才初始化

举个例子

```dart
  // const a; 报错了 const一开始就需要赋值  The constant 'a' must be initialized.

  // 报错了 Const variables must be initialized with a constant value.
  // const a = new DateTime.now();调方法赋值时不能用 const

  final b;
  b = new DateTime.now(); // 不会报错
```



## 4. 默认值

未初始化并且可空类型的变量的默认值是 null。

```dart
int? lineCount;
assert(lineCount == null);
```

`assert()` 的调用将会在生产环境的代码中被忽略掉。在开发过程中，`assert(condition)` 将会在 **条件判断** 为 false 时抛出一个异常。

如果启用了空安全，那么一个变量必须在你用它之前初始化

```dart
  int count;
  // The non-nullable local variable 'count' must be assigned before it can be used.不为空的局部变量必须先赋值后使用
  print(count);
```

我们不必在一开始声明时就初始化变量，但是需要在用之前赋值。举个例子，下面的代码是有效的，因为 dart 检测到 count 被传递给 print 函数使用之前是一个已经被赋值的变量

```dart
  int count;
  count = 0;
  print(count);
```

顶级和类变量被懒惰地初始化：初始化代码在首次使用变量时运行。



## 5. 数据类型

数字类型：int 整型和 double 浮点类型

字符串类型：String

布尔类型：bool

数组类型：List

Maps：Map

Sets：Set

Symbols：Symbol

Null：null

Runes：常用于在 `Characters` API 中进行字符替换

### 字符串

其中字符串如果用三个（单/双）引号，就能够跨行。这是用 1 个或者 2 个（单/双）引号所不能实现的功能。

字符串拼接用`$`或者`${}`。



## Late 修饰符

Dart2.12 增加了 late 修饰符，它有两个用途：

* 用来声明一个在声明后初始化的不能为 null 的变量
* 懒初始化变量

Dart 的控制流分析可以检测不可为 null 的变量在使用之前何时设置为非 null 值，但有时分析会失败。两种常见情况是顶级变量和实例变量：Dart通常无法确定它们是否已设置，因此它不会尝试。

如果你确定变量被使用之前已经被设置了，但是 Dart 判断不一致，就可以使用 late 来消除报错

```dart
// The non-nullable variable 'a' must be initialized.
String a;
void main(List<String> args) {
  a = '123';
  print(a);
}
```

上面的代码中， a 是全局变量，Dart 没有办法分析全局变量是否被设置，因此上面的代码会报错。这时候可以用 late 语句来消除错误。

```diff
- String a;
+ late String a;
void main(List<String> args) {
  a = '123';
  print(a);
}
```

如果将变量标记为 late，但在其声明时对其进行初始化，则初始值设定项会在首次使用该变量时运行。这种惰性初始化在以下几种情况下非常方便：

* 变量不一定会被使用，那么这种初始化非常节省内容
* 
