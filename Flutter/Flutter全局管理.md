全局状态管理是声明式 UI 框架必不可少的，flutter 官方推荐了两种全局管理的方式：

1. inheritedWidget
2. provider

## inheritedWidget

`inheritedWidget`跟 react 的 context 功能类似，可以实现跨组件的数据共享。

使用步骤：

1. 定义一个共享数据的 `ContextWidget`，继承自`inheritedWidget`
2. 将需要共享数据的组件包在 child 属性里
2. 将数据定义在`ContextWidget`的某个属性里
2. 子组件通过`ContextWidget.of(context).xxx`来接受数据

具体案例如下：

```dart
import 'package:flutter/material.dart';
import 'pages/main/main.dart';

void main(List<String> args) {
  return runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: HYHomePage(),
    );
  }
}

class HYHomePage extends StatefulWidget {
  const HYHomePage({Key? key}) : super(key: key);

  @override
  State<HYHomePage> createState() => _HYHomePageState();
}

class _HYHomePageState extends State<HYHomePage> {
  // ContextWidget里的 state 不能改变，所以在这里定义一个 state，传给 ContextWidget
  int count = 100;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('inherited')),
      // 这里将所有需要共享数据的组件包起来
      // 由于数据需要更改，所以在更高级的`State`中将数据传给 ContextWidget
      body: ContextWidget(
          count: count,
          child: Column(
            children: [
              ShowData01(),
              ShowData02(),
            ],
          )),
      floatingActionButton: FloatingActionButton(
          child: Icon(Icons.edit),
          onPressed: () {
            setState(() {
              count += 1;
            });
          }),
    );
  }
}

class ContextWidget extends InheritedWidget {
  // 定义状态,接受到上层给的数据
  final int count;
  // 定义构造方法
  ContextWidget({required this.count, required Widget child})
      : super(child: child);
  // 定义方法
  static ContextWidget? of(BuildContext context) {
    // 沿着 Element 树找到最近的 ContextElement 取出 widget 对象
    return context.dependOnInheritedWidgetOfExactType();
  }

// 如果返回 true，会执行依赖当前InheritedWidget的 state 中的didChangeDependencies
  @override
  bool updateShouldNotify(ContextWidget oldWidget) {
    return oldWidget.count != count;
  }
}

class ShowData01 extends StatefulWidget {
  const ShowData01({Key? key}) : super(key: key);

  @override
  State<ShowData01> createState() => _ShowData01State();
}

class _ShowData01State extends State<ShowData01> {
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    print('updateShouldNotify返回 true 则会调用我');
  }

  @override
  Widget build(BuildContext context) {
    // 这里接受数据
    int? count = ContextWidget.of(context)?.count;
    return Container(
      color: Colors.red,
      child: Text('当前计数是：$count'),
    );
  }
}

class ShowData02 extends StatelessWidget {
  const ShowData02({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 这里接受数据
    int? count = ContextWidget.of(context)?.count;
    return Card(
      color: Colors.blue,
      child: Text('当前计数是：$count'),
    );
  }
}
```



## Provider

官方目前推荐的全局状态管理工具,由官方维护。

安装依赖：

```bash
 $ flutter pub add provider
```

使用：

```dart
import 'package:provider/provider.dart';
```

Provider三个概念：

* ChangeNotifier

  真正数据（状态）存放的地方

* ChangeNotifierProvider

  Widget树中提供数据（状态）的地方，会在其中创建对应的ChangeNotifier

* Consumer

  Widget树中需要使用数据（状态）的地方

使用步骤：

1. **创建`ChangeNotifier`**

   这里创建两个`ChangeNotifier`

   **count_model.dart**

   ```dart
   import 'package:flutter/material.dart';
   
   // 1.创建需要共享的数据
   class CountVModel extends ChangeNotifier {
     int _counter = 100;
     int get counter => _counter;
     set counter(int val) {
       _counter = val;
       notifyListeners();
     }
   }
   ```

   **user_model.dart**

   ```dart
   import 'package:flutter/material.dart';
   
   // 1.创建需要共享的数据
   class UserVModel extends ChangeNotifier {
     String _userName = 'qiuyanxi';
     int _age = 20;
     String get userName => _userName;
     String getUserInfo() {
       return "姓名：$userName 年龄$_age";
     }
   }
   ```

   

2. 使用**ChangeNotifierProvider** 

   **main.dart**

   ```dart
   List<SingleChildWidget> providers = [
     ChangeNotifierProvider(create: (context) => CountVModel()),
     ChangeNotifierProvider(create: (context) => UserVModel())
   ];
   ```

   这里为了便于多个状态管理，所以将`ChangeNotifierProvider`都放进数组里，传给`MultiProvider`

   ```dart
   void main(List<String> args) {
     //2.顶层使用MultiProvider包裹,实现多个ChangeNotifierProvider的结合
     return runApp(MultiProvider(
       providers: providers,
       child: MyApp(),
     ));
   }
   ```

   用`MultiProvider`包裹，一般选择在全局包裹，这里在最顶层 `runApp` 里使用。

3. 用 **select**、**Consumer**、**Provider.of** 读取数据

   ```dart
   class MyApp extends StatelessWidget {
     const MyApp({Key? key}) : super(key: key);
   
     @override
     Widget build(BuildContext context) {
       return MaterialApp(
         home: HYHomePage(),
       );
     }
   }
   
   class HYHomePage extends StatelessWidget {
     const HYHomePage({Key? key}) : super(key: key);
   
     @override
     Widget build(BuildContext context) {
       int count = Provider.of<CountVModel>(context).counter;
   
       return Scaffold(
         appBar: AppBar(title: Text('全局管理')),
         body: Center(
           child: Column(
             mainAxisAlignment: MainAxisAlignment.center,
             children: [
               ShowData01(),
               ShowData02(),
               ShowData03(),
             ],
           ),
         ),
         // 5.如果不依赖数据，则使用 Selector修改数据,
         floatingActionButton: Selector<CountVModel, CountVModel>(
           builder: (context, vModel, child) => FloatingActionButton(
             child: child,
             onPressed: () {
               vModel.counter += 1;
             },
           ),
           selector: (context, vModel) => vModel, //这里可以转换数据
           shouldRebuild: (pre, now) => false,// 是否需要重新构建，返回 false 不再需要重新构建
           child: Icon(Icons.add), // 不需要重新 builder 的icon，可以放child 里传进去
         ),
       );
     }
   }
   
   class ShowData01 extends StatelessWidget {
     const ShowData01({Key? key}) : super(key: key);
   
     @override
     Widget build(BuildContext context) {
       // 3. 使用Provider.of读取数据
       int count = Provider.of<CountVModel>(context).counter;
       return Container(
         color: Colors.red,
         child: Text(
           '当前计数是：${count}',
           style: TextStyle(fontSize: 20),
         ),
       );
     }
   }
   
   class ShowData02 extends StatelessWidget {
     const ShowData02({Key? key}) : super(key: key);
     // 4.使用 Consumer读取,也可以修改数据
     @override
     Widget build(BuildContext context) {
       return Card(
           color: Colors.blue,
           child: Consumer<CountVModel>(
               builder: (context, vmodel, child) => Text(
                     '当前计数是：${vmodel.counter}}',
                     style: TextStyle(fontSize: 20),
                   )));
     }
   }
   
   class ShowData03 extends StatelessWidget {
     const ShowData03({Key? key}) : super(key: key);
     // 4.使用 Consumer2读取全部数据,也可以修改数据
     @override
     Widget build(BuildContext context) {
       return Card(
           color: Colors.yellow,
           child: Consumer2<CountVModel, UserVModel>(
               builder: (context, countVmodel, userVmodel, child) => Column(
                     children: [
                       Text(
                         '当前计数是：${countVmodel.counter}}',
                         style: TextStyle(fontSize: 20),
                       ),
                       Text(
                         '用户信息是：${userVmodel.getUserInfo()}}',
                         style: TextStyle(fontSize: 20),
                       ),
                     ],
                   )));
     }
   }
   ```

   

   