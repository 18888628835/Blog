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

## Numbers

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

## Strings

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



## booleans

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

## Lists

跟 JavaScript 中的数组差不多，Dart 的数组也是封装后的 Object特殊类，并不是传统意义上的数组。

`list`的声明方式

```dart
  var arr = <String>['0', '1', '2', '3']; // 定义数组类型
  var arr1 = [0, 1, 2, 3, 4]; //自动推断
	List arr5 = <String>['0', '1', '2', '3'];// 使用类型的方式定义list
```

* 使用 const 关键字创建编译时变量，不能修改、增加

  ```dart
    var arr2 = const [1, 2, 3, 4]; // 创建一个编译时的常量，不能修改、增加
    arr2.add(5); // Cannot add to an unmodifiable list
  ```

* 创建一个固定长度的集合

  ```dart
  	var arr3 = List.filled(2,'');// 创建一个固定长度的集合
  	var arr4 = List.filled<int>(2,0);// 创建一个固定长度的有类型的集合
  ```

* 扩展操作符对数组的操作

  ```dart
    var list = [1, 2, 3];
    var list2 = [0, ...list]; // 将 list 插入 list2 中
    assert(list2.length == 4);
  ```

* 空感知操作符对数组的操作,如果是 null 则可以避免异常

  ```dart
  var list;
  var list2 = [0, ...?list];
  assert(list2.length == 1);
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

* 在 List 中可以使用 if 或 for

  ```dart
    var nav = ['Home', 'Furniture', 'Plants', if (true) 'Outlet'];
    var listOfInts = [1, 2, 3];
    var listOfStrings = ['#0', for (var i in listOfInts) '#$i'];
    print(listOfStrings); // [#0, #1, #2, #3]
  ```

其他 API 就不废话了，参考官方文档即可。



## Sets

dart 的 set 声明

```dart
  var halogens = {'fluorine', 'chlorine', 'bromine', 'iodine', 'astatine'};
  Set s = <String>{'fluorine', 'chlorine'};
```

在`{}`前加上类型参数可以创建一个空的 Set，或者将`{}`赋值给一个 Set 类型的变量

```dart
  var s = <String>{};
  Set _s = <String>{};
  Set<String> names = {};
  var _names = {}; // 这是一个 map 不是 set
```

* 使用`add`方法或者`addAll`方法可以添加项目

```dart
  var sets = <Object>{};
  sets.add('1');
  sets.addAll([1, 2, 3]);
  print(sets);
```

* 使用`.length`可以获取 Set 中元素的数量

  ```dart
    final sets = {'fluorine', 'chlorine'};
    print(sets.length);
  ```

* Set 变量前添加`const`关键字创建 Set 编译时变量

  ```dart
  final constantSet = const {
    'fluorine',
    'chlorine',
    'bromine',
    'iodine',
    'astatine',
  };
  // constantSet.add('helium'); // This line will cause an error.
  ```

* Set 可以使用扩展操作符和空感知操作符

  ```dart
    final sets = {'fluorine', 'chlorine'};
    var maybeNull;
    final a = <String>{'hello', ...sets};
    final b = <String>{'hello', ...?maybeNull};
    print(a);
    print(b);
  ```

  

## Maps 类型

Dart 中的 Maps 类型类似 JavaScript 中的 Map 数据结构，区别是需要强制在 key 上加引号。Maps 类型在 Dart 中当 object 用。

声明 map，使用 var 能让 Map 自动推断，也可以手动写Map 的类型

```dart
  const a = [1, 2, 3];
  var map = {a: '123'}; // map 当 js 的map 用，key 不用写成[key]
  var map1 = <String,String>{'a': '123'}; // map 当js 的 object用，key需要加引号
  var map2 = Map(); // 创建自由类型的 map,可以加 new
  var map3 = Map<int, String>(); // 创建 map 时定义类型
  map3[1] = '1'; // 给 map 赋值
  print(map);
  print(map1);
  print(map.containsKey(a)); // js的 map.has 方法判断是否有这个 key
```

JavaScript 中可以用`new Map()`让普通函数变成构造函数，dart 中则可以省略掉 new，上面的代码使用`Map()`构造函数就可以创建一个 map 对象。

* 添加单个属性和多个属性

  ```dart
    var map = {};
    map['age'] = 20;
    map.addAll({"name": 'qiuyanxi', 1: 2});
    print(map);
  ```

* 如果key 不在 map 中会返回 null

  ```dart
    var map = {};
    assert(map['name'] == null);
  ```

* 获取`.length` 可以获取键值对的数量

  ```dart
    var map = {};
    assert(map.length == 0);
  ```

* 在一个 Map 字面量前添加 `const` 关键字可以创建一个 Map 编译时常量：

  ```dart
  final constantMap = const {
    2: 'helium',
    10: 'neon',
    18: 'argon',
  };
  
  // constantMap[2] = 'Helium'; // This line will cause an error.
  ```

* Map 使用扩展运算符和空感知操作符

  ```dart
    var map = {'name': "qiuyanxi"};
    Map? maybeNull;
    var newMap = {...map};
    var newMap2 = {...?maybeNull};
  ```

# 函数

定义函数，建议定义返回类型

```dart
  String getName() {
    return 'qiuyanxi';
  }
```

只有一个表达式的函数能够使用箭头函数简化

```dart
  String getName() => 'qiuyanxi';
```

* 必要参数

  ```dart
    String getName(String name, int age) => '$name$age';
    getName('qiuyanxi', 10);
  ```

* 使用`[]`表示可选的位置参数

  ```dart
    void printThings([String? str, String str2 = 'default value']) {
      assert(str == null);
      assert(str2 == 'default value');
    }
    printThings();
  ```

* 命名参数

  命名参数默认都为可选参数。如果是必要参数，则需要用`required`

  **定义函数时，使用`{参数 1，参数 2}`来指定命名参数**

  ```dart
    String getName2({required String name, int? age = 10}) => '$name$age';
  ```

  **调用函数时，使用 `参数名:参数值`指定命名参数**

  ```dart
    getName2(name: 'qiuyanxi');
  ```

* 默认参数

  如果一个参数是可选的但是不能是 null，那么需要提供一个默认的值。**没有默认值的情况下参数是 null**

  ```dart
  /// Sets the [bold] and [hidden] flags ...
  void enableFlags({bool bold = false, bool hidden = false}) {...}
  
  // bold will be true; hidden will be false.
  enableFlags(bold: true);
  ```

* 默认值必须为编译时常量

  默认的参数值必须为编译时常量，如以下的参数为默认的 List 和 Map，为了变成编译时常量，需要加上 const 关键字

  ```dart
    void getList([List<int> list = const [1, 2, 3]]) {}
    void getMap([Map<String, String> map = const {"name": "qiuyanxi"}]) {}
  ```

* main函数

  main 函数是每个 Dart 程序必须有的顶级函数，是程序的入口，main 函数返回值是void ，并且有一个`List<String>`类型的可选参数。

  可以通过命令行给 main 函数传递参数

  **hello-world.dart**

  ```dart
  void main(List<String> args) {
    // 在命令行运行以下命令: dart hello-world.dart 1 test
    print(args); //['1', 'test']
    assert(args.length == 2);
    assert(int.parse(args[0]) == 1);
    assert(args[1] == 'test');
  }
  ```

* 匿名函数

  匿名函数被当做参数使用

  ```dart
  const list = ['apples', 'bananas', 'oranges'];
  list.forEach((item) {
    print('${list.indexOf(item)}: $item');
  });
  ```

  使用匿名箭头函数当做参数使用

  ```dart
  const list = ['apples', 'bananas', 'oranges'];
  list.forEach((item) => print('${list.indexOf(item)}: $item'));
  ```

* 词法作用域

  Dart 的作用域是词法作用域，跟 JavaScript 一样，在写代码的时候就确定了。

* 闭包

  闭包也跟 JavaScript 一样，就不多介绍了。

* 返回值

  所有函数都有返回值的，即使返回值是 void。如果没有明确写返回语句，那么默认执行`return null`

  ```dart
  // 这是明确表示返回 void 的函数
    void returnVoid() {
      print('hello');
    }
  
    var a = returnVoid();
    // void 类型的变量不能被使用
    // print(a);
  
  // 这是没有返回语句的函数
    returnNull() {}
    var b = returnNull();
    assert(returnNull() == null); // true
  ```

# 运算符

## 赋值运算符

```dart
  var a = 1;
  int? b;
  b ??= 2; // 如果 b 为空的话就把 2 赋值给 b
  a += 0; // a=a+0
```

## 算数运算符

```dart
  print(a + b);
  print(a - b);
  print(a * b);
  print(a / b);
  print(a % b); // 取余
  print(a ~/ b); // 取整
	a ++ // 先运算再自增
  a -- //先运算再自减
  -- a // 先自减再运算
  ++ a // 先自增再运算
```

## 关系运算符

```dart
  print(a == b);
  print(a >= b);
  print(a <= b);
  print(a != b);
```

## 类型判断运算符

| Operator | Meaning                                                      |
| -------- | ------------------------------------------------------------ |
| `as`     | 类型转换（也用作指定 [类前缀](https://dart.cn/guides/language/language-tour#specifying-a-library-prefix))） |
| `is`     | 如果对象是指定类型则返回 true                                |
| `is!`    | 如果对象是指定类型则返回 false                               |

## 逻辑运算符

| 运算符      | 描述                                                      |
| ----------- | --------------------------------------------------------- |
| `!*表达式*` | 对表达式结果取反（即将 true 变为 false，false 变为 true） |
| `||`        | 逻辑或                                                    |
| `&&`        | 逻辑与                                                    |

```dart
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
```

## 表达式

***表达式 1* ?? *表达式 2***

如果表达式1 为 null 则返回表达式 2

```dart
  /* ??运算符 */
  var i;
  var j = i ?? 10; // i 为空则将 10 赋值给 j，同 js 空值合并运算符
  print(j);
```

***条件* ? *表达式 1* : *表达式 2***

```dart
  /* 三目运算符 */
  var flag;
  flag = true;
  var f = flag ? 'true' : 'false';
```

## 级联运算符

级联运算符 (`..`, `?..`) 可以让你在同一个对象上连续调用多个对象的变量或方法。

下面代码

```dart
var paint = Paint()
  ..color = Colors.black
  ..strokeCap = StrokeCap.round
  ..strokeWidth = 5.0;

/* 相当于  */
var paint = Paint();
paint.color = Colors.black;
paint.strokeCap = StrokeCap.round;
paint.strokeWidth = 5.0;

querySelector('#confirm') // Get an object.
  ?..text = 'Confirm' // Use its members.
  ..classes.add('important')
  ..onClick.listen((e) => window.alert('Confirmed!'));

/* 相当于  */
var button = querySelector('#confirm');
button?.text = 'Confirm';
button?.classes.add('important');
button?.onClick.listen((e) => window.alert('Confirmed!'));
```

## 其他运算符

| 运算符 | 名字          | 描述                                                         |
| :----- | :------------ | ------------------------------------------------------------ |
| `()`   | 使用方法      | 代表调用一个方法                                             |
| `[]`   | 访问 List     | 访问 List 中特定位置的元素                                   |
| `?[]`  | 判空访问 List | 左侧调用者不为空时，访问 List 中特定位置的元素               |
| `.`    | 访问成员      | 成员访问符                                                   |
| `?.`   | 条件访问成员  | 与上述成员访问符类似，但是左边的操作对象不能为 null，例如 foo?.bar，如果 foo 为 null 则返回 null ，否则返回 bar |

# 判空

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



# 空安全

Dart 目前支持控安全机制，也就是说除非我们声明它可空，否则它们的值不能为空，这样做的好处是提高了代码的健壮性，在编译的时候就能报错。

> 空安全需要 dart 在 2.12 以上

声明可空的方式就是在类型前面加个问号：

```dart
  int? count;
  count = null;
```

如果没有加问号，那么这个值就不能是空的

```dart
  int count;
  // ❌ A value of type 'Null' can't be assigned to a variable of type 'int'.
  count = null;
```

如果我们知道一个值不可能为空，但是 Dart 判断可能为空，那就用`!`表示非空断言

```diff
  String? getData(String? data) {
    if (data is String) {
      return 'this is string data';
    }
    return null;
  }

-  String a = getData('12131');
+  String a = getData('12131')!;
```



#  流程控制语句

* for 循环

  ```dart
    for (var i = 0; i < 10; i++) {
      print(i);
    }
  ```

  JavaScript 的 var 在 for 循环中只有一个作用域，dart 的 var 不存在这个问题，所以上面的代码能够正常打出 `i`的值。

* for...in 循环

  使用 for..in 遍历可迭代对象，比如 Lists 类型和 Set 类型

  ```dart
    var list = [1, 2, 3];
    var sets = <int>{1, 2, 3};
    for (var value in list) {
      print(value);
    }
    for (var value in sets) {
      print(value);
    }
  ```

  可迭代对象也可以使用`forEach`方法循环

  ```dart
  var collection = [1, 2, 3];
  collection.forEach(print); // 1 2 3
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
  
* switch和 case

* 断言——assert

  ```dart
    assert(1 < 2);
    assert(1 > 2, '1>2 is wrong');
  ```

# 异常捕获

Dart 提供 Exception 和 Error 两种类型的异常以及一些子类。我们可以自己定义异常类型，也可以将任何非 null 对象作为异常抛出。

* 抛出异常

```dart
  throw new Exception('这是一个异常报错');
  throw '这是一个异常报错';
```

* 捕获异常

  ```dart
    try {
      // throw Error();
      throw Exception('this is exception error');
    } on Exception catch (e) {
      print('this is Unknown exception $e');
    } catch (e,s) {
      print('No specified type, handles all error $e');
      print('Stack trace:\n $s');
    }
  ```

  上面的代码使用 on 和 catch 来捕获异常，on 来指定异常的类型，catch 则用来捕获对象。当抛出的错误并不是 on 指定的异常类型时，则走最后面的 catch 兜底。

  catch 方法有两个参数，第一个参数是抛出的异常对象，第二个参数是栈信息。

* rethrow 再次抛出异常 

  当我们在捕获到一个异常时，还可以再次将这个异常抛出。

  下面的例子将内层函数捕获的异常抛出到外部作用域让 main 函数里的代码捕获到。

  ```dart
  void misbehave() {
    try {
      dynamic foo = true;
      print(foo++); // Runtime error
    } catch (e) {
      print('misbehave() partially handled ${e.runtimeType}.');
      rethrow; // Allow callers to see the exception.
    }
  }
  
  void main() {
    try {
      misbehave();
    } catch (e) {
      print('main() finished handling ${e.runtimeType}.');
    }
  }
  ```

  上面的代码会打印出如下信息：

  ```dart
  misbehave() partially handled NoSuchMethodError.
  main() finished handling NoSuchMethodError.
  ```

* Finally 

  无论是否抛出异常，都会执行 finally 语句。

  ```dart
    try {
      throw Error();
    } catch (e) {
      print('i will catch this error');
    } finally {
      print('finally print this message');
    }
  ```



# 类

Dart 是支持基于 mixin 继承机制的语言（JavaScript 是基于原型的），所有对象都是一个类的实例，而除了 null 以外所有的类都继承自 Object 类。

## 定义类的属性和方法

```dart
// 类的定义不能写在 main 函数里
class Person {
  String? name; // Declare instance variable name, initially null.
  int age = 0; // Declare y, initially 0.
  void getInfo() {
    print('${this.name} ------ ${this.age}');
  }
  void setName(String name) {
    this.name=name;
  }
}
void main(List<String> args) {
  var p = new Person();// 可以省略 new
  p.getInfo();
  p.setName('my name');
  p.getInfo();
}
```

实例属性如果没有初始化的话，默认是 null。

所有实例变量都会隐式声明 Getter 方法。可以修改的实例变量和 late final声明但是没有初始化的变量还会隐式声明一个 Setter 方法，我们可以通过 getter 和 setter 读取或设置实例对象。

```dart
class Person {
  String? name;
  int age = 0;
  late final int height;
}

void main(List<String> args) {
  var p = new Person();
  p.name = 'my name';// setter
  p.height = 180;// setter
  print(p.name);// getter
  print(p.height);// getter
  p.height = 190; // Field 'height' has already been initialized.
}
```

实例变量可以是 final 的，在这种情况下只能被set 一次。



## 构造函数

用一个**与类名一样的函数**就可以创建构造函数，还有一种命名式构造函数。

```dart
class Point {
  double x = 0;
  double y = 0;
  // Point(double x, double y) {
  //   this.x = x;
  //   this.y = y;
  // }
  // 上面构造函数的语法糖可以写成这样
  Point(this.x, this.y);
  // 命名式构造函数——使用初始化列表
  Point.origin(double xOrigin, double yOrigin):x=xOrigin,y=yOrigin
  // 命名式构造函数还可以这么写
  // Point.origin(double this.x, double this.y);
}
// 在 main 中使用
void main(List<String> args) {
  // 使用命名构造函数
  var p1 = new Point.origin(10, 20);
  var p2 = Point(10, 20);
}
```

> 使用 `this` 关键字引用当前实例。

如果没有声明构造函数，Dart 会自动生成一个没有参数的构造函数并且这个构造函数会调用其父类的无参数构造方法。

构造函数不会被继承，也就是说子类没办法继承父类的构造函数。命名式构造函数也不能被继承。

命名构造函数可以有多个，当实例化时根据需要直接调用就行了。

**初始化列表**

在构造函数运行之前，有一个初始化列表的概念。可以初始化实例变量

```dart
class Rect {
  int height;
  int width;
  Rect()
      : width = 10,
        height = 10 {
    print("${this.width}---${this.height}");
  }
  Rect.create(int width, int height)
      : width = width,
        height = height {
    print("${this.width}---${this.height}");
  }
}

void main(List<String> args) {
  var p1 = Rect(); // 10---10

  var p2 = Rect.create(100, 200); // 100---200
}
```

当使用 `Rect` 构造时，会给 width 和 height 初始化为 10。

当使用`Rect.create`构造时，用传入的值来初始化。



## 实例的私有属性/方法

将类抽离成一个文件，并在属性或者方法前加`_`就能定义实例对象的私有变量。

**lib/Person.dart**

```dart
class Person {
  String? name; // Declare instance variable name, initially null.
  int _age = 0; // Declare y, initially 0.
  void getInfo() {
    print('${this.name} ------ ${this._age}');
  }
}
```

**main.dart**

```dart
import 'lib/Person.dart';

void main(List<String> args) {
  var p = Person();
  // print(p._age); 无效
  p.getInfo();
}
```

## Getter 和 Setter

构造函数自动会设置实例变量的 getter 和 setter ，我们也可以手动指定。

```dart
class Rect {
  int height;
  int width;
  Rect(this.width, this.height);
  // 手动指定 getter 的写法
  get area {
    return this.height * this.width;
  }
  // 手动指定 setter 的写法
  set h(int value) {
    this.height = value;
  }

  set w(int value) {
    this.width = value;
  }
}

void main(List<String> args) {
  var p = Rect(10, 20);
  print(p.area);// getter
  p.h = 100;// setter
  p.w = 100;
  print(p.area);
}
```

## 静态成员

跟 TS 一样，使用 static 来声明静态成员。

```dart
class Rect {
  static int height = 10;
  static int width = 10;
  static getArea() {
    print(height * width);
  }
}

void main(List<String> args) {
  Rect.getArea();
}
```

有两点需要注意:

* 静态成员不能访问实例变量

  ```dart
  class Rect {
    int height = 10;
    static int width = 10;
    static getArea() {
      print(this.height * width); // 报错了 不能访问 实例属性 height
    }
  }
  ```

* 实例方法可以访问静态成员

  ```dart
  class Rect {
    int height;
    static int width = 10;
    Rect(this.height);
    getArea() {
      print(this.height * width);// 如果访问实例属性，推荐加上 this。
    }
  }
  
  void main(List<String> args) {
    new Rect(10).getArea();
  }
  ```

## 继承

构造函数不能被继承，使用 `extends` 和 `super` 关键字来继承父类的属性和方法。



**纯继承父类**

```dart
class Animal {
  String name;
  void sound(voice) {
    print(voice);
  }

  Animal(this.name);
}

class Dog extends Animal {
  Dog([String name = 'dog']) : super(name);
}

void main(List<String> args) {
  var dog = new Dog();
  print(dog.name); // dog
  dog.sound('汪汪'); // 汪汪
}
```

其中`Dog([String name = 'dog']) : super(name);`需要解释一下：

* `: super(name)`这种语法是用初始化列表在构造 Dog 时调用其父类的构造函数来设置 `name`
* `Dog([String name = 'dog'])`这种语法是调用`new Dog()`时`name` 是可选的，默认值为`dog`



**扩展子类的属性和方法**

```dart
class Animal {
  String name;
  void sound(voice) {
    print(voice);
  }

  Animal.create(this.name);
}

class Dog extends Animal {
  String sex;
  Dog(this.sex, [String name = 'dog']) : super.create(name);
  void run() {
    print('${this.name} runrun');
  }
}
```



**重写父类的属性和方法**

```dart
class Animal {
  String name;
  void sound(voice) {
    print(voice);
  }

  Animal.create(this.name);
}

class Dog extends Animal {
  String sex;
  Dog(this.sex, [String name = 'dog']) : super.create(name);
  void run() {
    print('${this.name} runrun');
  }

  @override
  void sound(voice) {
    print('${this.name} $voice');
  }
}

void main(List<String> args) {
  var dog = new Dog('雄');
  print(dog.name); // dog
  dog.sound('汪汪'); //dog 汪汪
}
```

推荐使用`@override`来重写父类的属性和方法



**子类中调用父类的方法**

通过 `super `来调用父类的方法

```dart
class Dog extends Animal {
  String sex;
  Dog(this.sex, [String name = 'dog']) : super.create(name);
  void run() {
    super.sound('汪汪');
    print('${this.name} runrun');
  }
}
```



# 抽象类

抽象类主要用于定义标准，抽象类不能被实例化，只有继承它的子类才可以被实例化。

使用`abstract`关键字表示这是抽象类。

比如下面定义一个 Animal 的抽象类，这里面有所有动物的标准。

```dart
abstract class Animal {
  sound(); // 抽象方法
  print() {} // 普通方法
}

// 子类中必须写同样的抽象方法
class Dog extends Animal {
  @override
  sound() {}
}
```

# 多态

多态就是同一操作作用于不同的对象时，可以产生不同的解释和不同的效果。

在 JavaScript 中是用原型链的方式来实现多态的，比如 Object 和 Array 的原型上都有 `toString `方法，本质上是在`Array.prototype`写了一个`toString`来覆盖`Object.prototype`的原型上的`toString`

`Dart`中的多态是通过子类重写父类定义的方法，这样每个子类都有不同的表现。

**使用抽象类的话就只需要定义父类的方法而不用实现，让继承它的子类去实现，每个子类就是多态的。**

```dart
abstract class Animal {
  sound(); // 抽象方法
}

class Dog extends Animal {
  @override
  sound() {
    print('汪汪');
  }

  run() {}
}

class Cat extends Animal {
  @override
  sound() {
    print('喵喵');
  }

  run() {}
}

void main(List<String> args) {
  var dog = new Dog();
  var cat = new Cat();
  print(dog.sound());
  print(cat.run());
  // 下面两个不能调 run 方法
  Animal _dog = new Dog();
  Animal _cat = new Cat();
}
```



# 接口

dart 中没有 interface，我们使用**抽象类**来定义接口，使用`implements`来让类匹配接口。

## 类匹配单个接口

比如下面使用抽象类来封装统一的 增删改查 功能

```dart
abstract class Db {
  String uri;
  add();
  remove();
  save();
  select();
}
```

使用`implements`匹配接口

```dart
class MySql implements Db {
  @override
  add() {}

  @override
  remove() {}

  @override
  save() {}

  @override
  select() {}
}
```

上面的代码也可以用 extends 关键字来继承后重写。一般情况下我们这么用：

* 如果需要有共同的方法复用，我们用 extends

* 如果需要一个规范约束，那就使用 implements

  

## 类匹配多个接口

```dart
abstract class A {
  late String name;
  getA();
}

abstract class B {
  getB();
}

class C implements A, B {
  @override
  getA() {}

  @override
  getB() {}

  @override
  late String name;
}
```



# mixins混入

使用 mixins 可以实现类似多继承的功能，mixins 用关键字 with

```dart
mixin A {
  void getA() {}
}

mixin B {
  void getB() {}
}

class C with A, B {}

void main(List<String> args) {
  var c = new C();
  c.getA();
  c.getB();
}
```

上面的代码混入（mixins）了多个类的实例方法。

* **被 mixins 的类**只能继承自 Object，不能继承其他类。

  ```dart
  class A {
    void getA() {}
  }
  
  class B extends A { 
    void getB() {}
  }
  
  class C with A, B {} // ❌报错，B 是被 mixins 的类，不能继承
  ```

  为了让 mixins 类更加直观，推荐使用 mixin 关键字来定义` mixin` 类

  ```
  mixin A {
    void getA() {}
  }
  
  mixin B extends A { // ❌报错，B 是被 mixins 的类，不能继承
    void getB() {}
  }
  
  class C with A, B {} 
  ```

* **被 mixins 的类**不能有构造函数

  ```dart
  mixin A {
    void getA() {}
  }
  
  mixin B {
    B(); // ❌报错 B 是被 mixins 的类，不能有构造函数
    void getB() {}
  }
  
  class C with A, B {} 
  ```

* 一个类可以 mixins **多个 mixins 类**

* 一个类可以继承某个类再 mixins 一些 mixins 类

  ```dart
  class A {
    void getA() {}
  }
  
  class B {
    void getB() {}
  }
  
  class C extends A with B {}
  ```

* mixins 不是继承，也不是接口，当使用 mixins 后，相当于创建了一个超类，能够兼容下所有类

  ```dart
  class A {
    void getA() {}
  }
  
  mixin B {
    void getB() {}
  }
  
  class C extends A with B {}
  
  void main(List<String> args) {
    var c = new C(); 
    print(c is A);// true
    print(c is B);// true
    print(c is C);// true
  }
  ```

* 使用 on 关键字可以指定哪些类可以使用该 Mixin 类

  ```dart
  class A {
    void getA() {}
  }
  
  mixin B on A {
    void getB() {}
  }
  
  // class C with B {}     ❌这样写是报错的
  class C extends A with B {}
  ```



# 泛型

跟 TS 一样，Dart 也支持泛型，泛型就是泛用的类型，是一种将指定权交给用户的不特定类型。

比如下面的函数就由用户指定传入的类型。

```dart
  T getData<T>(T data) {
    return data;
  }

// 调用者可以指定类型
  getData<String>('123');
  getData<num>(123);
	getData<List>([1, 2, 3]);
```

## 泛型类

在实例化一个类时可以通过泛型来指定实例对象的类型。

下面就是实例化 List 后指定了List 对象属性值的类型。

```dart
  List l1 = new List<int>.filled(2, 1);
  List l2 = new List<String>.filled(2, '');
```

* **定义泛型类**

  ```dart
  class A<T> {
    T age;
    A(T this.age);
    T getAge() {
      return this.age;
    }
  }
  
  ```

* 使用泛型类

  ```dart
  void main(List<String> args) {
    // 使用泛型类
    var a = new A<int>(12);
    var b = A<String>('12');
  }
  ```

## 泛型接口

泛型接口的定义方式就是接口跟泛型类的集合体，可以这么定义

```dart
// 泛型接口
abstract class Cache<T> {
  void setKey(String key, T value);
}
// 类匹配这个接口
class FileCache<T> implements Cache<T> {
  @override
  void setKey(String key, T value) {}
}

class MemoryCache<T> implements Cache<T> {
  @override
  void setKey(String key, T value) {}
}
```

使用时指定泛型的具体类型

```dart
  var f = new FileCache<String>();// 指定 String
  f.setKey('key', 'string');
  var m = new MemoryCache<int>();// 指定 int
  m.setKey('key', 123);
```



## 限制泛型

跟 Typescript 一样，泛型约束使用 extends 关键字。

```dart
abstract class Cache<T> {
  void setKey(String key, T value);
}
// 这里约束MemoryCache只能为 int
class MemoryCache<T extends int> implements Cache<T> {
  @override
  void setKey(String key, T value) {}
}
void main(List<String> args) {
  // var m = new MemoryCache<String>(); 这里就不能是 String 类型了
  var m = new MemoryCache<int>();
  m.setKey('key', 123);
}
```



# Late 修饰符

Dart2.12 增加了 late 修饰符，它有两个用途：

* 用来声明一个在声明后才初始化的且不能为 null 的变量
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

* 变量不一定会被使用，那么这种初始化非常节省内存

  ```dart
  // This is the program's only call to _readThermometer().
  late String temperature = _readThermometer(); // Lazily initialized.
  ```

  上面的代码中，如果`temperature`变量一直没有被使用，那么`_readThermometer`函数不会被调用

* 实例变量没有被初始化，但是又需要访问实例变量的时候添加 late

  ```dart
  class Cache {
    late String name;
    void setName(String name) {
      this.name = name;
    }
  }
  ```

  上面的代码中，由于没有构造函数，那么实例时，name 属性并不会被初始化，这时候访问它会报错

  ```dart
    var m = new Cache();
    // ❌LateInitializationError: Field 'name' has not been initialized.
    print(m.name);
  ```



# 库

使用 `import` 来指定命名空间以便其它库可以访问。

`import` 的唯一参数是用于指定代码库的 URI。

对于 Dart 内置的库，使用 `dart:xxxxxx` 的形式。

对于其它的库，你可以使用一个文件系统路径或者以 `package:xxxxxx` 的形式。 `package:xxxxxx` 指定的库通过包管理器（比如 pub 工具）来提供。

```dart
import 'dart:math'; // 引入内置 math 库
import 'package:test/test.dart'; // 引入包管理器中的库
import 'lib/test.dart'; // 引入自己写的库
```

## package 包

下载`package`使用需要在根目录手动创建`pubspec.yaml`文件，类似 npm 的 `package.json`,这是用来管理包的版本和依赖的。

创建后根据提示写入以下内容：

```yaml
name: my_app
environment:
  sdk: '>=2.12.0 <3.0.0'
```

然后可以去[这个网站](https://pub.dev/packages)查可以使用的包。

以 http 模块为例：

**下载包**

只有 dart 就用这个命令

```bash
$ dart pub add http
```

有 flutter 就用这个命令

```bash
$ flutter pub add http
```

上面的命令会在`pubspec.yaml`中增加版本依赖，并且隐式运行`dart pub get` or `flutter pub get`

```yaml
dependencies: 
  http: ^0.13.4
```

**使用包**

```dart
import 'package:http/http.dart' as http;
```

## 库冲突

如果导入的两个代码库有同样的命名，则可以使用指定前缀`as`。比如如果 library1 和 library2 都有 Element 类，那么可以这么处理：

```dart
import 'package:lib1/lib1.dart';
import 'package:lib2/lib2.dart' as lib2;

// Uses Element from lib1.
Element element1 = Element();

// Uses Element from lib2.
lib2.Element element2 = lib2.Element();
```



## 部分导入

如果只想使用代码库的一部分，可以使用部分导入。

```dart
// Import only foo.
import 'package:lib1/lib1.dart' show foo;

// Import all names EXCEPT foo.
import 'package:lib2/lib2.dart' hide foo;
```



## 延迟加载

**延迟加载**（也常称为 **懒加载**）是有需要的时候再去加载。

> **目前只有 dart2js 支持延迟加载** Flutter、Dart VM 以及 DartDevc 目前都不支持延迟加载

使用 `deferred as` 关键字来标识需要延时加载的代码库

```dart
import 'package:greetings/hello.dart' deferred as hello;
```

当实际需要使用库的 API 时先调用`loadLibrary`函数加载库：

```dart
Future<void> greet() async {
  await hello.loadLibrary();
  hello.printGreeting();
}
```

使用 `await` 关键字暂停代码执行直到库加载完成。`loadLibrary` 函数可以调用多次也没关系，代码库只会被加载一次。

当你使用延迟加载的时候需要牢记以下几点：

- 延迟加载的代码库中的常量需要在代码库被加载的时候才会导入，未加载时是不会导入的。
- 导入文件的时候无法使用延迟加载库中的类型。如果你需要使用类型，则考虑把接口类型转移到另一个库中然后让两个库都分别导入这个接口库。
- Dart会隐式地将 `loadLibrary()` 导入到使用了 `deferred as *命名空间*` 的类中。 `loadLibrary()` 函数返回的是一个 [Future](https://dart.cn/guides/libraries/library-tour#future)。

# 异步

## Future

Future 跟 JavaScript 的Promise 差不多，要使用`async`和`await`来让代码变成异步的。必须在带有 async 关键字的 **异步函数** 中使用 `await`：

```dart
Future<void> checkVersion() async {
  var version = await lookUpVersion();
  // Do something with version
}
```

上面的代码会等到`lookUpVersion`处理完成，再执行下一步操作。

> await 表达式的返回值通常是一个 Future 对象；如果不是的话也会自动将其包裹在一个 Future 对象里。 Future 对象代表一个“承诺”， `await 表达式`会阻塞直到需要的对象返回。



**async关键字**

跟 JavaScript 的规则差不多，单单使用`async`只能生成 Future 对象，并不会让代码变成异步的。举个🌰

```dart
  Future<void> checkVersion() async {
    print(123);
  }
	checkVersion();
  print(456);
	// 123
	// 456
```

上面的代码并不会让`checkVersion`变成异步代码，因为 `123` 在 `456` 前面打印了。

如果加上 `await` 就可以对代码进行阻塞，使其变成真正的异步代码。

```dart
  Future<int> getVersion() async => 123;

  Future<void> checkVersion() async {
    print(0); //这里还是同步代码
    var res = await getVersion(); //这里开始变成异步
    print(res);
  }

  checkVersion();
  print(456);
```

上面的结果是

```zsh
0
456
123
```



**异常处理**

使用 `try`、`catch` 以及 `finally` 来处理使用 `await` 导致的异常：

```dart
try {
  version = await lookUpVersion();
} catch (e) {
  // React to inability to look up the version
}
```
