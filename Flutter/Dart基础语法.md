在dart中，我们需要在`main`函数中运行程序，所有代码都需要写到`main`里面才能调用。

```dart
// 定义一个函数.
void printInteger(int aNumber) {
  print('The number is $aNumber.'); // 打印到输出台
}

// 应用开始执行的位置，必须要
void main() {
  var number = 42; // 声明并初始化一个值
  printInteger(number); // 执行一个函数
}
```



所有变量引用的都是对象，每个对象都是一个类的实例。数字、函数以及nulll都是对象。除了null外，所有类都继承于Object类。

Dart是强类型语言，但是在声明变量时可以不指定类型，Dart拥有跟Typescript一样的类型推断。

如果在Dart config中设置了空安全，那么变量在未声明为空类型时不能为null。如果我们需要表示变量也可以是null，那就需要加问号。

```dart
int? a
```

