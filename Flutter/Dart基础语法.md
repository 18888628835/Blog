#  一个简单的 Dart 程序

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



# 重要概念

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



# 变量声明

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

> 首选自动推断,来自 Dart 语言官方的高效指南建议

如果一个对象的引用可以是任意类型，就跟 TS 的 any 一样，那么可以指定 Object 或 dynamic 类型

```dart
  Object a = 'blob';
  a = 123;
  a = [];
  dynamic b = 'blob';
  b = 123;
  b = [];
```

**常量**可以用 final 和 const 修饰符来声明,这两个关键字可以替代 var或者加在类型前面。

```dart
final name='some name';
const age=20;
const int age = 123;
final List list = [];
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

const 变量是编译时常量。如果使用 const 修饰类中的变量，则必须加上 static 关键字，即 `static const`。

在声明 const 变量时可以直接为其赋值，也可以使用其它的 const 变量为其赋值。

```dart
const bar = 1000000; // Unit of pressure (dynes/cm2)
const double atm = 1.01325 * bar; // Standard atmosphere
```

const 关键字不仅仅用来定义常量，还可以用来创建常量值，该常量值可以赋予给任何变量。也可以将构造函数声明为 const，这种类型的构造函数创建的对象是不可改变的。

```dart
  var foo = const [];
  final bar = const [];
  const baz = []; // 相当于`const []`
```

使用初始化表达式为常量赋值就可以省略掉关键字 const，比如常量 bar 的赋值就省略掉了 const。

# 默认值

未初始化并且可空类型的变量的默认值是 null。

```dart
int? lineCount;
assert(lineCount == null);
var a;
assert(a == null);
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

# 数据类型

* Numbers类型：int 整型和 double 浮点类型

* Strings类型：String

* Booleans类型：bool

* Lists类型：List

* Maps类型：Map类型

* Sets类型：Set

* Symbols类型：Symbol

* Null：null

* Runes：常用于在 `Characters` API 中进行字符替换

Dart 中每个变量引用都指向对象，通常也可以使用构造器来初始化变量。一些内置的类型有自己的构造器，比如使用`Map()`创建一个`map`对象。

在 Dart 中有一些特殊作用的类型：

1. Object：是除了 Null 类型以外所有类型的超类
2. Future和 Stream：用于异步
3. Iterable：用于 for-in 循环和同步的 generator 构造器
4. Never：象征表达式永远无法被到达。多用于函数抛出例外。
5. dynamic：如果需要禁止静态检查，可以使用这个类型。平常可以用 Object 或者 Object?代替。
6. void：多用于表示没有返回值

### Numbers

int 为整型，double 为浮点数类型。

数字类型是 num 的子类。num 定义了一些基本的运算符和方法。还可以查看 [dart:math](https://api.dart.cn/stable/dart-math) 库中的 API。

double 类型可以兼容整型，即 double 既可以是整型也可以是浮点数型。

如果想要声明一个类型是数字类型，既可以是整型也可以是浮点数，则可以用`num`类型

```dart
  num x = 1;
  x += 2.5;
  print(x); // 3.5
```

如果声明一个 double 类型，但是值是整型的话，会自动转换成浮点数。

```dart
  double a = 1;
  print(a); // 1.0
```

**数字转字符串：`toString()`**

```dart
  int a = 123;
  double b = 123.23;
  String _a = a.toString();
  assert(_a == '123');
  String _b = b.toStringAsFixed(1);
  assert(_a == '123.2');
```

**字符串转数字：`parse`**

```dart
  String a = '123';
  String b = '123.23';
  int _a = int.parse(a);
  assert(_a == 123);
  double _b = double.parse(b);
  assert(_b == 123.23);
```

建议都用 `double.parse` 转换成数字



### Strings

字符串可以用单/双引号，在双引号中使用单引号可以不用转义，反过来也是一样。

```dart
var s1 = '使用单引号创建字符串字面量。';
var s2 = "双引号也可以用于创建字符串字面量。";
var s3 = '使用单引号创建字符串时可以使用斜杠来转义那些与单引号冲突的字符串：\'。';
var s4 = "而在双引号中则不需要使用转义与单引号冲突的字符串：'";
```

字符串拼接用`$`或者`${}`或`+`,具体用法是`${表达式}`，如果是单变量，则可以省略`{}`.如果表达式的结果是一个对象，那么 Dart 会自动调用该对象的 toString 方法获取一个字符串。

```dart
  var s = 'this is string';
  var map = {"name": "qiuyanxi"};
  print('s 的值是：${s.toUpperCase()} map的值是$map');
  // s 的值是：THIS IS STRING map的值是{name: qiuyanxi}
```

使用三个单引号或者三个双引号能创建多行字符串。

```dart
var s1 = '''
You can create
multi-line strings like this one.
''';

var s2 = """This is also a
multi-line string.""";
```

如果希望字符串中的内容不会被做任何处理（比如转义），则可以在字符串前面加上 r 来创建 raw 字符串。

```dart
var s = r'在 raw 字符串中，转义字符串 \n 会直接输出 “\n” 而不是转义为换行。';
```

如果字符串是const 声明的编译时常量，编译时常量 (null、数字、字符串、布尔) 才可以作为该字符串字面量的插值表达式。

```dart
// 这些在 const 声明的字符串常量中能用
const aConstNum = 0;
const aConstBool = true;
const aConstString = 'a constant string';

// 这些在 const 字符串中不能用，用 var 声明的才有用
var aNum = 0;
var aBool = true;
var aString = 'a string';
const aConstList = [1, 2, 3];

const validConstString = '$aConstNum $aConstBool $aConstString';
// const invalidConstString = '$aNum $aBool $aString $aConstList';
var invalidConstString = '$aNum $aBool $aString $aConstList';
```

### booleans

bool 表示布尔类型

Dart 的条件判断跟 JavaScript 不太一样，JavaScript 可以用 falsy值或 truthy 值做条件判断返回布尔值

```javascript
0、‘’、false、undefined、null、-0、NaN // javascript 的 falsy 值

// 比如：
let a;
if (!a) {
  console.log(`a为${a}`); // a为undefined
}
```

dart 需要用 bool 型或者返回 bool 型的值才可以做条件判断。

**bool 型**

```dart
  String? a = null;
  // Conditions must have a static type of 'bool'.Try changing the condition
  // ❌  条件必须是bool 类型
/*   if (a) {
    print(a);
  } else {
    print(a);
  } */
  /* 下面代码才是正确的 */
  bool b;
  bool getResult() {
    return true;
  }

  b = getResult();
  if (b) {
    print(b);
  } else {
    print(b);
  }
```

**返回 bool 型的值**

```dart
// dart 版本 判断是否是空字符串、是否是 NaN、是否是 null、是否是0 
// Check for an empty string.
var fullName = '';
assert(fullName.isEmpty);

// Check for zero.
var hitPoints = 0;
assert(hitPoints == 0);

// Check for null.
var unicorn;
assert(unicorn == null);

// Check for NaN.
var iMeantToDoThis = 0 / 0;
assert(iMeantToDoThis.isNaN);
```



### Lists 类型

跟 JavaScript 中的数组差不多，Dart 的数组也是封装后的 Object特殊类，并不是传统意义上的数组。

```dart
  var arr = <String>['0', '1', '2', '3']; // 定义数组类型
  var arr1 = [0, 1, 2, 3, 4]; //自动推断
  var arr2 = const [1, 2, 3, 4]; // 创建一个编译时的常量，不能修改、增加
	var arr3 = List.filled(2,'');// 创建一个固定长度的集合
	var arr4 = List.filled<int>(2,0);// 创建一个固定长度的有类型的集合
	List arr5 = <String>['0', '1', '2', '3'];// 使用类型的方式定义list
  arr2.add(5); // Cannot add to an unmodifiable list
```

* 获取数组长度

  ```dart
    var arr = <String>['0', '1', '2', '3']; 
  	arr.length
  ```

* 判断是否为空

  ```dart
    var arr = <String>['0', '1', '2', '3']; 
    arr.isEmpty
    arr.isNotEmpty
  ```

* 翻转数组

  ```dart
    var arr = ['1', '2'];
    var newArr = arr.reversed.toList();
    print(newArr);
  ```

其他 API 就不废话了，参考官方文档即可。

### Maps 类型

Dart 中的 Maps 类型类似 JavaScript 中的 Map 数据结构，区别是需要强制在 key 上加引号。

```dart
  const a = [1, 2, 3];
  var map = {a: '123'}; // map 当 js 的map 用，key 不用写成[key]
  var map1 = {'a': '123'}; // map 当js 的 object用，key需要加引号
  var map2 = Map(); // 创建自由类型的 map,可以加 new
  var map3 = Map<int, String>(); // 创建 map 时定义类型
  map3[1] = '1'; // 给 map 赋值
  print(map);
  print(map1);
  print(map.containsKey(a)); // js的 map.has 方法判断是否有这个 key
```



### is 关键字判断类型

```dart
  Object a = 1;
  dynamic b = 'string';
  if (a is int) {
    print('a 是 数字类型');
  }
  if (b is String) {
    print('b 是字符串类型');
  }
```

# 运算符

```dart
  //赋值运算符
  var a = 1;
  int? b;
  b ??= 2; // 如果 b 为空的话就把 2 赋值给 b
  a += 0; // a=a+0
	a ++ // 先运算再自增
  a -- //先运算再自减
  -- a // 先自减再运算
  ++ a // 先自增再运算
  // 算数运算符
  print(a + b);
  print(a - b);
  print(a * b);
  print(a / b);
  print(a % b); // 取余
  print(a ~/ b); // 取整
  // 关系运算符
  print(a == b);
  print(a >= b);
  print(a <= b);
  print(a != b);
  // 逻辑运算符
  var c = false;
  var d = true;
  /* 取反 */
  if (!c) {
    print(c);
  }
  /* && 并且 */
  if (c && d) {}
  /* || 或 */
  if (c || d) {}

  /* 条件表达式 */
  var str = '123';
  switch (str) {
    case '111':
      print('111');
      break;
    default:
      print('123');
  }
  /* 三目运算符 */
  var flag;
  flag = true;
  var f = flag ? 'true' : 'false';

  /* ??运算符 */
  var i;
  var j = i ?? 10; // i 为空则将 10 赋值给 j，同 js 空值合并运算符
  print(j);
```

# 类型转换



**其他类型转布尔类型判断**

* 判断字符串是否为空

  ```dart
    var str = '';
    if (str.isEmpty) {
      print(' 判断为空字符串');
    }
  ```

* 判断是否为 null

  ```dart
    var _null = null;
    if (_null == null) {
      print('判断为 null');
    }
  ```

* 判断是否为 NaN

  ```dart
    var _nan = 0 / 0;
    if (_nan.isNaN) {
      print('是 NaN');
    }
  ```

#  循环语句

* for 循环

  ```dart
    for (var i = 0; i < 10; i++) {
      print(i);
    }
  ```

* while 循环

  ```dart
    var i = 10;
    while (i > 0) {
      print(i);
      i--;
    }
  ```

* do while 循环

  ```dart
    do {
      print(i);
      i--;
    } while (i > 0);
  ```

  do while 跟 while 的区别是即使不满足条件，do while 循环也会 do 一次；while 循环不会

  ```dart
    var i = 0;
    do {
      print(i); //这段代码执行了
      i--;
    } while (i > 0);
  
    while (i > 0) {
      print(i);// 永远不会执行
      i--;
    }
  ```

* break，continue 语句

  break 跳出循环，continue 跳过本轮循环

# Late 修饰符

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
