# 模板语法

## 将数据插入HTML

双大括号文本插值
```javascript
<span>Message: {{ msg }}</span>
```

## 绑定事件

```javascript
  <button @click="increment">Count is: {{ count }}</button>
```

## 插入HTML
```js
<script setup>
import { ref } from 'vue'

const a='<div style="color:red">1123</div>'
</script>

<template>
  <div v-html='a'>
  </div>
</template>
```
## 将 Attribute 属性插入到HTML 中
```js
// v-bind 指令
<div v-bind:id="dynamicId"></div>
// 简写
<div :id="dynamicId"></div>
```

## 布尔值 Attribute
```javascript
<button :disabled="isButtonDisabled">Button</button>
<button :hidden="status">Button</button>
```
如果`isButtonDisabled`和`status`是真值或者空字符串，则表示 true

## 绑定多个 Attribute
```js
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper'
}
```
```js
<div v-bind="objectOfAttrs"></div>
```
## 使用表达式
```js
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div :id="`list-${id}`"></div>
```

## 在模板中使用函数
```js
<span :title="toTitleDate(date)">
  {{ formatDate(date) }}
</span>
```

## 指令
常用指令：

`v-if` 根据某个条件的真假插入/移除该 html

```javascript
<p v-if="seen">Now you see me</p>
```

`v-else`跟`v-if`对应的指令，配合使用

```js
<div v-if="Math.random() > 0.5">
  Now you see me
</div>
<div v-else>
  Now you don't
</div>
```

`v-else-if` 同上

`v-bind` 绑定 Attribute

`v-html`插入 HTML

`v-for`

`v-show` 根据某个条件的真假来给元素加上 `display-none`属性



## 动态参数

```vue
<div :[attributeName]="attr"></div>
<a @[eventName]="doSomething">
```

动态参数的意思就是修改绑定的特性名，比如从` class` 修改成 `id`，把`click`事件改成`focus`事件等。

动态参数值需要时字符串或者是 null。如果是 null 则显式移除该绑定。

动态参数语法上不能用空格和引号，否则会报编译器错误。

```vue
<!-- 这会触发一个编译器警告 -->
<a :['foo' + bar]="value"> ... </a>
```

如果动态参数很复杂，则需要使用计算属性来替换复杂的表达式。

## 修饰符

使用 vue 指令时，可以额外使用一些修饰符来做特殊的处理，比如`.prevent`修饰符表示触发事件时顺便调用`event.preventDefault()`

```vue
<form @submit.prevent="onSubmit">...</form>
```

# 响应式状态

## 声明响应式状态

使用`reactive`声明响应式状态：

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

使用 ts 标注类型，官方不推荐使用泛型，所以我们是将类型写在变量前面：

```js
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 指引' })
```

组件模板中使用状态需要在 setup 函数中定义并返回

```js
import { reactive } from 'vue'

export default {
  // `setup` 是一个专门用于组合式 API 的特殊钩子
  setup() {
    const state = reactive({ count: 0 })
    function increment() {
      state.count++
    }

    // 暴露 state 到模板
    return {
      state
    }
  }
}
```

使用 SFC 的`<script setup>`可以简化上面的样板代码

```vue
<script setup>
import { reactive } from 'vue'

const state = reactive({ count: 0 })

function increment() {
  state.count++
}
</script>

<template>
  <button @click="increment">
    {{ state.count }}
  </button>
</template>
```

## DOM更新时机

当对某一个状态进行更改后，DOM 会自动更新，但是这并不是同步进行的。Vue 将它们缓冲到下一个周期一起更新以便每个组件只需要更新一次。

如果需要等一个状态改变完成后的 DOM 更新完成后做某个操作，则需要使用`nextTick()`这个 API。

```js
import { nextTick } from 'vue'

function increment() {
  state.count++
  nextTick(() => {
    // 访问更新后的 DOM
  })
}
```

## 深层响应

Vue 内部用了 proxy 监听状态改变，在 ES6 中 proxy 是深层监听的，所以任何状态改动都能够被检测到。

```js
import { reactive } from 'vue'

const obj = reactive({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // 以下都会按照期望工作
  obj.nested.count++
  obj.arr.push('baz')
}
```

还可以创建[浅层响应式对象](https://staging-cn.vuejs.org/api/reactivity-advanced.html#shallowreactive)。

## 代理不等于原始对象

响应式状态返回的是proxy 对象，它跟原始对象是不相等的。

```js
const raw = {}
const proxy = reactive(raw)

// 代理和原始对象不是全等的
console.log(proxy === raw) // false
```

只有更改代理才会触发更新，更改原始对象不会触发更新操作。

对同一个对象调用`reactive`会返回同样的代理，对一个已存在的代理调用`reactive`也会返回同样的代理。

```js
// 在同一个对象上调用 reactive() 会返回相同的代理
console.log(reactive(raw) === proxy) // true

// 在一个代理上调用 reactive() 会返回它自己
console.log(reactive(proxy) === proxy) // true
```

## reactive 限制

1. `reactive`只对集合类型有效，即（对象、数组、Map、Set）等，对原始类型无效

2. 不能改变响应式对象的引用

   ```js
   let state = reactive({ count: 0 })
   
   // 这行不通！
   state = reactive({ count: 1 })
   ```

   如果将响应式对象的数据结构出来，或者传递进一个函数，这也是不行的，会失去响应性

   ```js
   const state = reactive({ count: 0 })
   
   // n 是一个局部变量，同 state.count
   // 失去响应性连接
   let n = state.count
   // 不影响原始的 state
   n++
   
   // count 也和 state.count 失去了响应性连接
   let { count } = state
   // 不会影响原始的 state
   count++
   
   // 该函数接收一个普通数字，并且
   // 将无法跟踪 state.count 的变化
   callSomeFunction(state.count)
   ```

   

## ref定义

为了解除`reactive`的限制，Vue 引进了 `ref`来创建任何值类型的响应式 `ref`

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` 从参数中获取到值，将其包装为一个带 `.value` property 的 ref 对象：

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

给 ref 标注类型的两种方式：

```js
// 得到的类型：Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // 成功！
```

```tsx
import { ref, Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // 成功！
```

如果标注了泛型但是没有给出初始值，最后得到的是一个包含`undefined`的联合类型

```tsx
// 推导得到的类型：Ref<number | undefined>
const n = ref<number>()
```

`ref.value`也是响应式的，当值为对象类型时，会用`reactive`自动转换它的`.value`

一个包含对象类型值的 ref 可以响应式地替换整个对象：

```js
const objectRef = ref({ count: 0 })

// 这是响应式的替换
objectRef.value = { count: 1 }
```

ref 被传递给函数或是从一般对象上被解构时，不会丢失响应性：

```js
const obj = {
  foo: ref(1),
  bar: ref(2)
}

// 该函数接收一个 ref
// 需要通过 .value 取值
// 但它会保持响应性
callSomeFunction(obj.foo)

// 仍然是响应式的
const { foo, bar } = obj
```

也就是说 ref 不会丢失响应性，并且能够监听原始类型的变量。

## ref 在模板中的解包

在模板中不需要`.value`，会自动被解包

```js
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }} <!-- 无需 .value -->
  </button>
</template>
```

顶层 property 才能解包成功，非顶层会解包失败

```js
const object = { foo: ref(1) }
```

下面的表达式会导致解包失败

```js
{{ object.foo + 1 }}
```

解构成顶级的 property 才能解包成功

```js
const { foo } = object
```

```js
{{ foo + 1 }}
```

不写表达式的情况下，正常读取值是能够正常解包的

```js
{{ object.foo }}
```

## 把 ref 写在 reactive 里的解包

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

ref 放在 reactive 里被访问会更改时，自动解包。

将新的 ref 赋值给一个关联了已有 ref 的 property，会替换掉旧的 ref

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// 原始 ref 现在已经和 state.count 失去联系
console.log(count.value) // 1
```



## 数组和集合类型的 ref 解包

当 ref 作为响应式数组或者 Map 这样的原生集合类型的元素被访问时，不会解包

```js
const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```

## ref.value语法糖

使用开发工具编译转换，可以在适当的位置自动添加`.value`来提高开发体验。

[官方教程](https://staging-cn.vuejs.org/guide/extras/reactivity-transform.html)



# 计算属性

## 计算属性的用法

计算属性可以用来简化模板中的表达式逻辑，如果表达式中有非常复杂的逻辑，那么最终可能难以维护。

比如，现在有一个响应式数组里面的内容是这样的：

```js
const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})
```

如果根据`author`在模板中展示一些信息，比如需要根据 books 的数量决定展示什么内容：

```jsx
<p>Has published books:</p>
<span>{{ author.books.length > 0 ? 'Yes' : 'No' }}</span>
```

可以这样简化：

```vue
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// 一个计算属性 ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

使用 `computed`来做属性计算，它会接受一个 getter 函数，返回一个计算属性`ref`。

计算属性会自动追踪依赖的更新，当`author.book`发生改变时，`publishedBooksMessage`会更新，然后所有跟它相关的组件会更新。

## 计算属性的好处

上面的代码逻辑实际上用一个函数也可以解决，比如这样：

```js
// 组件中
function calculateBooksMessage() {
  return author.books.length > 0 ? 'Yes' : 'No'
}
```

```js
<p>{{ calculateBooksMessage() }}</p>
```

当 `author.books`发生改变时，下面的函数也会重新运行，在结果上看都是没有问题的。

不同之处在于计算属性值会基于其对应的响应式依赖被缓存起来，只有在响应式依赖改变时才会重新执行`computed`里面的`getter`函数。

而调用函数总是会在重新渲染发生时再次执行，这样有时候非常消耗性能。

缓存函数也是提升性能的一种手段。

## 可写的计算属性

如果我们希望有些计算属性是可写的，那么就需要通过 `getter` 和 `setter` 来创建一个可写的计算属性。

```js
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // 注意：我们这里使用的是解构赋值语法
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

当写计算属性时，需要根据逻辑反向设置其依赖，也就是说在 `set`内要给其依赖重新设置属性值。

上面的 `set`被调用后，重新设置了`firstName`和`lastName`

## 计算属性注意点

* 计算属性中的计算函数应该只做计算，而不应该有副作用。副作用指的是在计算函数做异步请求或者操作 DOM。计算函数只应该计算和返回计算值。
* 不能直接修改计算属性值。计算属性返回的值是派生状态，是根据源状态而创建的临时快照，更改它是没有意义的，应该更新它的源状态以触发重新计算。



# 绑定 Class 和 Style

使用` v-bind` 可以绑定`Attribute`，`HTML` 的 `Attribute` 都是字符串，但频繁返回字符串容易出错，因此 `Vue` 为 `Class` 和 `Style`设置了`v-bind`的功能增强，可以放字符串或对象或数组。



## 绑定 Class

### 绑定对象

```vue
<div :class="{ active: isActive }"></div>
```

当 `isActive`是真值时，会添加上名叫`active`的类。

`:class`和 原生`class`属性会共存。

```vue
<div
  class="static"
  :class="{ active: isActive }"
></div>
```

上面的模板语法会被渲染成

```vue
<div class="static active"></div>
```

传递给`:class`的需要是一个对象，所以也可以设置一个响应状态

```js
const classObject = reactive({
  active: true,
  'text-danger': false
})
```

```vue
<div :class="classObject"></div>
```

最佳实践是返回一个对象的计算属性

```js
const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))
```

### 绑定数组

使用数组来给模板添加 `class`

```js
const activeClass = ref('active')
const errorClass = ref('text-danger')
```

```js
<div :class="[activeClass, errorClass]"></div>
```

数组中使用三元表达式

```js
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

`errorClass` 会一直存在，但 `activeClass` 只会在 `isActive` 为真时才存在。

数组中也能够使用对象语法

```js
<div :class="[{ active: isActive }, errorClass]"></div>
```

### class 透传

当子组件只有一个根元素，那么在父组件上传递的 `class`会添加到子组件的根元素上，与该元素已有的 `class` 合并。

举例：

```vue
<!-- 子组件模板 -->
<p class="foo bar">Hi!</p>
```

父组件上使用并传递了`class`

```vue
<!-- 在使用组件时 -->
<my-component class="baz boo"></my-component>
```

最后子组件渲染结果为：

```vue
<p class="foo bar baz boo">Hi</p>
```

使用`:class`绑定也是一样的。

```vue
<my-component :class="{ active: isActive }"></my-component>
```

当 `isActive` 为真时，被渲染的 HTML 会是：

```vue
<p class="foo bar active">Hi</p>
```

如果子组件有多个根元素，那么需要用`$attrs`来指定哪个根元素会得到父元素传下去的 `class` 属性。

```vue
<!-- my-component 模板使用 $attrs 时 -->
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
```

## 绑定Style

### 绑定对象

使用`:style`来绑定内联样式，可以传递对象。

```js
const activeColor = ref('red')
const fontSize = ref(30)
```

```vue
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

上面是小驼峰的方式来写样式属性，也可以用原生的`kebab-cased`形式来写

```vue
<div :style="{ 'font-size': fontSize + 'px' }"></div>
```

推荐使用小驼峰。

也可以直接绑定一个样式对象

```js
const styleObject = reactive({
  color: 'red',
  fontSize: '13px'
})
```

```vue
<div :style="styleObject"></div>
```

如果很复杂的话，也推荐使用计算属性。

### 绑定数组

我们还可以给 `:style` 绑定一个包含多个样式对象的数组。这些对象会被合并和应用到同一元素上

```vue
<div :style="[baseStyles, overridingStyles]"></div>
```



### 样式多值

可以对一个样式属性添加上多个不同前缀的值，举例：

```vue
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

数组仅会渲染浏览器支持的最后一个值。也就是说如果浏览器支持`flex`，那么只会渲染`flex`



# 条件渲染

条件渲染需要用到指令：

* `v-if`：当指令上的表达式为真时，才会渲染一个模板

  ```vue
  <h1 v-if="awesome">Vue is awesome!</h1>
  ```

*  `v-if`：可以跟 `v-if`互相配合使用

  ```vue
  <button @click="awesome = !awesome">Toggle</button>
  
  <h1 v-if="awesome">Vue is awesome!</h1>
  <h1 v-else>Oh no 😢</h1>
  ```

* `v-else-if`：跟上面的也可以一起使用

  ```vue
  <div v-if="type === 'A'">
    A
  </div>
  <div v-else-if="type === 'B'">
    B
  </div>
  <div v-else-if="type === 'C'">
    C
  </div>
  <div v-else>
    Not A/B/C
  </div>
  ```

* `template` 上的 `v-if`、`v-else`、`v-else-if`

  这里的`template`不是 `Vue` 的模板语法上的`template`，而是指 HTML 的`<template>`标签，可以在上面添加条件渲染。这只是一个不可见的包装器元素，浏览器不会将`<template>`渲染在上面。

  ```vue
  <template >
  <!-- 下面的是 HTML 标签的 <template> -->
  <template v-if="isActive">
  <div >{{isActive}}</div>
  <button @click="setIsActive">
    设置 isActive
  </button>
  </template>
  
  </template>
  ```

  上面的`template`标签在条件渲染为真时不会渲染到浏览器上。

* `v-show`：跟`v-if`不同的是，`v-show`是切换`display`的CSS 属性，DOM 渲染时，始终保留该元素，而`v-if`是直接从 DOM 中移除，组件会直接销毁或重建。

  不能在`template`上面使用`v-show`

* `v-if`和`v-for`：不推荐同时使用`v-for`和`v-if`，因为这样二者的优先级不明显。当同时存在于一个元素时，优先级是`v-if`更高。



# 列表渲染

## v-for

`v-for`可以用来渲染列表。`v-for`需要特殊的语法`item in items`，其中`items`是源数据的数组，`item`是迭代项别名：

```js
const _items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

```vue
<ul >
  <li v-for="item in _items" :key="item.message">{{ item.message}}</li>
 </ul>
```

`v-for`中拿到`index`

```vue
<ul >
  <li v-for="(item,index) in _items" :key="index">{{ item.message}}</li>
 </ul>
```

`v-for`中解构赋值

```vue
<!-- 有 index 索引时 -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

推荐使用`of`替代`in`，因为这跟 ES6 的迭代器很像

```vue
<div v-for="item of items"></div>
```

## v-for 迭代对象

```js
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})
```

```vue
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

Vue 内部会调用`Object.keys`得到枚举顺序，所以顺序可能不一致。

## v-for 使用值范围

可以直接传给 `v-for` 一个整数值。在这种用例中，会将该模板基于 `1...n` 的取值范围重复多次。

```vue
<span v-for="n in 10">{{ n }}</span>
```

注意此处 `n` 的初值是从 `1` 开始而非 `0`。



## 在 template 上用 v-for

```vue
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```



## v-if和 v-for

不推荐两者一起使用，由于` v-if` 优先级更高，所以`v-if`的条件无法访问到`v-for`作用域内定义的变量别名

```vue
<!--
 这会抛出一个错误，因为属性 todo 此时
 没有在该实例上定义
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

在外新包装一层 `<template>` 再在其上使用 `v-for` 可以解决这个问题 (这也更加明显易读)：

```vue
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

## key 

在虚拟 DOM 比较时，需要传入一个 `key`来给列表渲染的每个节点打标记，这样有利于跟踪元素的变化。默认情况下 `Vue`使用就地更新的策略。

```vue
<div v-for="item in items" :key="item.id">
  <!-- 内容 -->
</div>
```

推荐在任何使用`v-for`的地方绑定一个`key`。`key`需要使用基础类型的值，不要用复杂类型。

## 组件使用 v-for

可以直接在组件上使用 `v-for`

```vue
<my-component v-for="item in items" :key="item.id"></my-component>
```

如果要给组件传递数据，那么需要才采用 props 的方式：

```vue
<my-component
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
></my-component>
```

## 数组变化侦测

vue 包装以下侦听数组的变更方法，当使用以下方法时会触发视图更新。

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

有一些没被包装过的数组方法会返回新的数组，比如`filter`、`concat`、`slice`等等，这些都不会更改源数组，而是返回一个新的数组。那么如果需要使用这些时，需要将旧的数组换成新的

```json
// _items 是 ref 对象
_items.value=_items.value.filter((item)=>item.message!=='Bar')
```

## 计算属性做数组过滤

用计算属性来完成数组过滤或排序等操作，主要是用计算属性新定义一个派生状态，这样做的好处是可以不改变原数组

```js
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
  return numbers.value.filter((n) => n % 2 === 0)
})
```

```vue
<li v-for="n in evenNumbers">{{ n }}</li>
```

多重嵌套的 `v-for`中可以定义一个方法来替代计算属性。

```js
const sets = ref([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
])

function even(numbers) {
  return numbers.filter((number) => number % 2 === 0)
}
```

```vue
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)">{{ n }}</li>
</ul>
```

计算属性中不要使用`reverse`和`sort`，因为这两个方法会改变原始数组。

计算属性的目的在于生成一个新的派生状态，而不是修改原始状态。如果在计算属性中的操作会改变原始数组，那么要创建一个原数组的副本，再返回出去。

```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```

# 事件处理

`v-on`或者`@`能够监听 DOM事件，写法是`v-on:click="methodName"` 和 `@click="handler"`。

事件处理器的值可以有两种：

1. 内联事件处理器
2. 方法事件处理器

内联这样写：

```vue
<button @click="count++">Add 1</button>
```

方法这样写

```vue
<!-- `greet` 是定义过的方法名 -->
<button @click="greet">Greet</button>
```

方法作为事件处理器会自动接收原生 DOM 事件并触发执行，我们可以拿到`event`对象

```js
const name = ref('Vue.js')

function greet(event) {
  alert(`Hello ${name.value}!`)
  // `event` 是 DOM 原生事件
  if (event) {
    alert(event.target.tagName)
  }
}
```

## 内联处理器中调用方法

```js
function say(message) {
  alert(message)
}
```

```vue
<button @click="say('hello')">Say hello</button>
<button @click="say('bye')">Say bye</button>
```

模板编译器会自动判断`say()`或者`count++`为内联处理器。

## 内联处理器中访问事件

```vue
<!-- 使用特殊的 $event 变量 -->
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

<!-- 使用内联箭头函数 -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>
```

建议统一使用内联箭头函数和方法事件处理器来处理事件。

## 事件修饰符

事件修饰符可以帮我们在处理事件时加上某些额外的行为，比如调用`event.preventDefault`或者`event.stopPropagation`阻止事件继续传递。

事件修饰符相当于 `addEventListener` 的某些语法糖

* `.stop`：阻止事件继续传递

* `.prevent`：阻止默认行为

* `.self`：仅当 `event.target` 是元素本身时才会触发事件处理器

* `.capture`：用捕获的方式处理事件程序

* `.once` ：只调用一次事件后删除

* `.passive`：承诺不会阻止默认行为，移动设备的滚动事件会滚屏，但可以用`event.preventDefault`阻止滚动，浏览器在滚动前会检查事件处理程序里面是不是有设置阻止默认行为，这个过程就会造成卡顿。使用`.passive`则是表示不会阻止默认行为，浏览器就可以放心滚动。

  ```vue
  <!-- 单击事件将停止传递 -->
  <a @click.stop="doThis"></a>
  
  <!-- 提交事件将不再重新加载页面 -->
  <form @submit.prevent="onSubmit"></form>
  
  <!-- 修饰语可以使用链式书写 -->
  <a @click.stop.prevent="doThat"></a>
  
  <!-- 也可以只有修饰符 -->
  <form @submit.prevent></form>
  
  <!-- 仅当 event.target 是元素本身时才会触发事件处理器 -->
  <!-- 例如：事件处理器不来自子元素 -->
  <div @click.self="doThat">...</div>
  
  <!-- 添加事件监听器时，使用 `capture` 捕获模式 -->
  <!-- 例如：指向内部元素的事件，在被内部元素处理前，先被外部处理 -->
  <div @click.capture="doThis">...</div>
  
  <!-- 点击事件最多被触发一次 -->
  <a @click.once="doThis"></a>
  
  <!-- 滚动事件的默认行为 (scrolling) 将立即发生而非等待 `onScroll` 完成 -->
  <!-- 以防其中包含 `event.preventDefault()` -->
  <div @scroll.passive="onScroll">...</div>
  ```

使用修饰符时需要注意调用顺序，因为相关代码是以相同的顺序生成的。因此使用 `@click.prevent.self` 会阻止元素内的**所有点击事件**而 `@click.self.prevent` 则只会阻止对元素本身的点击事件。

请勿同时使用 `.passive` 和 `.prevent`。

## 按键修饰符

监听键盘事件时，经常需要判断用户按下的按键，`Vue`也给了语法糖，通过监听按键事件添加按键修饰符可以简化这个过程。

```vue
<!-- 仅在 `key` 为 `Enter` 时调用 `vm.submit()` -->
<input @keyup.enter="submit" />
```

也可以用原生`KeyboardEvent.key`给的按键名称作为修饰符，一定需要用 **kebab-case** 形式。

```vue
<input @keyup.page-down="onPageDown" />
```

上面的意思是当`$event.key`为`PageDown`时调用事件。

按键别名：

- `.enter`
- `.tab`
- `.delete` (捕获“Delete”和“Backspace”两个按键)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

系统按键修饰符

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

其中 `meta`键在`mac`电脑上是 `Command`,`window` 电脑上是 `win` 键。

```vue
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + 点击 -->
<div @click.ctrl="doSomething">Do something</div>
```

请注意，系统按键修饰符和常规按键不同。与 `keyup` 事件一起使用时，该按键必须在事件发出时处于按下状态。换句话说，`keyup.ctrl` 只会在你仍然按住 `ctrl` 但松开了另一个键时被触发。若你单独松开 `ctrl` 键将不会触发。

## .exact 修饰符

`.exact` 修饰符允许控制触发一个事件所需的确定组合的系统按键修饰符。

```vue
<!-- 当按下 Ctrl 时，即使同时按下 Alt 或 Shift 也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 仅当按下 Ctrl 且未按任何其他键时才会触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 仅当没有按下任何系统按键时触发 -->
<button @click.exact="onClick">A</button>
```



## 鼠标按键修饰符

- `.left`
- `.right`
- `.middle`



# 表单输入绑定

Vue 中的表单输入绑定是这样的

```typescript
let text = ref<string>('');

const handleInput=(e:Event)=>{
    text.value=(e.target as HTMLInputElement).value
};
```

```vue
<input type="text" :value="text" @input="handleInput">
```

上面的代码这样写略麻烦，所以 Vue 给了语法糖

```vue
<input v-model="text">
```

对于`v-model`还可以用于`<textarea>`，`<select>`等元素。它会根据所使用的的元素自动扩展到不同的 DOM 属性和事件的组合：

1. `<input>`和`<textarea>`就使用 `value` 属性和 `input` 事件
2. `<input type="checkbox">`和`<input type="radio">`就是使用`checked`属性和`change`事件
3. `<select>`就是用 `value`，`change` 为事件

如果绑定了 `v-model`，那么使用初始的`value`或者`checked`属性就会被忽略。

用`v-model`时，如果用输入法打中文，会发现没有按下空格键是不会触发状态更新的，这点跟 React 不同，只要绑定好受控状态，React 会马上更新。

## 值绑定

单选、复选、选择器选项，`v-model`绑定的一般是静态字符串，或者复选框也可以绑定布尔值。

```vue
<!-- `picked` 在被选择时是字符串 "a" -->
<input type="radio" v-model="picked" value="a" />

<!-- `toggle` 只会为 true 或 false -->
<input type="checkbox" v-model="toggle" />

<!-- `selected` 在第一项被选中时为字符串 "abc" -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

使用`v-bind`能够让我们将选项绑定为非字符串类型

**复选框**

`true-value` 和 `false-value` 是 Vue 特有的 attributes 且仅会在 `v-model` 存在时工作。这里 `toggle` 属性的值会在选中时被设为 `'yes'`，取消选择时设为 `'no'`。

```vue
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no" />
```

也可以用`v-bind`绑定到其他动态值上面。

```vue
<input
  type="checkbox"
  v-model="toggle"
  :true-value="dynamicTrueValue"
  :false-value="dynamicFalseValue" />
```

**单选按钮**

```vue
<input type="radio" v-model="pick" :value="first" />
<input type="radio" v-model="pick" :value="second" />
```

`pick` 会在第一个按钮选中时被设为 `first`，在第二个按钮选中时被设为 `second`。

**选择器选项**

```vue
<select v-model="selected">
  <!-- 内联对象字面量 -->
  <option :value="{ number: 123 }">123</option>
</select>
```

`v-model` 同样也支持非字符串类型的值绑定！在上面这个例子中，当某个选项被选中，`selected` 会被设为该对象字面量值 `{ number: 123 }`。

## 修饰符

**.lazy**

添加`last`修饰符可以让 `input` 在 `change`事件后更新状态

```vue
<!-- 在 "change" 事件后同步更新而不是 "input" -->
<input v-model.lazy="msg" />
```

**.number**

添加`.number`可以让用户输入自动转换为数字

```vue
<input v-model.number="age" />
```

这个用法会内部调用`parseFloat`,如果输入的值没办法被`parseFloat`处理的话会返回原值

**.trim**

自动去除用户输入内容中两端的空格，则可以使用`.trim`修饰符

```vue
<input v-model.trim="msg" />
```

# 生命周期

生命周期钩子就是一系列的回调函数，在 vue 组件实例初始化的过程中vue 会调用这些钩子，这样开发者就可以在里面写代码，让 vue 在特定的阶段调用它。

这些阶段可以分为：挂载实例到 DOM 上、数据侦听时、编译模板时、数据改变时等。

**常见生命周期**

* `onMounted`：组件完成初始渲染并创建 DOM 节点后运行
* `onUpdated`：状态更新导致 DOM 更新之后调用
* `onUnmounted`：组件被卸载之后调用

[官方图例](https://staging-cn.vuejs.org/guide/essentials/lifecycle.html#lifecycle-diagram)

[API说明](https://staging-cn.vuejs.org/api/composition-api-lifecycle.html)



# 侦听器

`computed`允许我们声明一个派生状态，有些情况下，我们并不需要它。

`Vue`用`watch`函数来监听状态改变，然后触发回调函数。

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';

let input = ref<string>('');
  // 直接侦听某个 ref
watch(input, async (newInput, oldInput) => {
  console.log(newInput);
  console.log(oldInput);
});
</script>

<template>
  <input v-model="input" />
  <div>{{ input }}</div>
</template>
```

## 侦听来源

`watch`的第一个参数可以有很多种：`ref`（以及它的`computed`状态）、一个响应式对象、一个`getter`函数、多个来源组成的数组：

```js
const x = ref(0)
const y = ref(0)

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

不能侦听响应式对象的`property`，比如：

```js
const obj = reactive({ count: 0 })

// 这不起作用，因为你是向 watch() 传入了一个 number
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})
```

而是用`getter`侦听：

```js
// 提供一个 getter 函数
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)
```

## deep选项

直接给`watch`传入一个响应式对象，会隐式创建一个深层侦听器——该回调函数在所有嵌套的变更时都会被触发。

```js
import { reactive, ref, watch } from 'vue';

let _ref = ref({ count: 0 });
const obj = reactive({ count: 0 });

watch(_ref.value, (newInput, oldInput) => {
  // 嵌套的 property 变更时触发
  // 两个对象相等，因为是一个引用
  console.log(newInput === oldInput); // true
});

watch(obj, (newInput, oldInput) => {
  console.log(newInput === oldInput); // true
});
_ref.value.count++;
obj.count++;
```

跟返回响应式对象的`getter`不同，如果是`getter`函数，那么只有在返回的对象变了才会触发回调：

```js
let _ref = ref({ count: 0, name: '123' });
// 只有 ref.value 整个变了才会触发，也就是引用地址改变才会触发
watch(
  () => _ref.value,
  newInput => {
    console.log(newInput);
  }
);
_ref.value.count++;
```

但是如果想要上面的函数能起作用，可以添加`deep`选项,这样就可以创建深层侦听器。

```js
watch(
  () => _ref.value,
  newInput => {
    console.log(newInput);
  },
  { deep: true }
);
```

使用`deep`选项会遍历侦听对象的所有嵌套属性，如果数据量很大，那么开销也很大。

## watchEffect

当侦听源发生变化，那么`watch`会执行回调函数。有时我们希望在创建侦听器的时候立即执行一遍回调。

比如，下面的例子是一个 `url`，每次 `url` 变化了，都需要动态改变某个 `data`。但我们希望`url` 第一次创建时也调用一次函数给`ref`一个初始值,如果仅仅用 `watch`写，需要这样写：

```js
const url = ref('https://...')
const data = ref(null)

async function fetchData() {
  const response = await fetch(url.value)
  data.value = await response.json()
}

// 立即获取
fetchData()
// ...再侦听 url 变化
watch(url, fetchData)
```

上面的代码可以用`watchEffect`函数简化。它会立即调用一遍回调函数，如果这时函数产生副作用，Vue 会自动追踪副作用的依赖关系，自动分析出响应源。

```js
watchEffect(async () => {
  const response = await fetch(url.value)
  data.value = await response.json()
})
```

这个例子中，回调会立即执行。在执行期间，它会自动追踪 `url.value` 作为依赖（近似于计算属性）。每当 `url.value` 变化时，回调会再次执行。

> `watchEffect` 仅会在其**同步**执行期间，才追踪依赖。在使用异步回调时，只有在第一个 `await` 正常工作前访问到的 property 才会被追踪。

## watch 和 watchEffect

`watch`和`watchEffect`都能响应式执行有副作用的回调。它们之间的主要区别是追踪响应式依赖的方式：

- `watch` 只追踪明确侦听的源。它不会追踪任何在回调中访问到的东西。另外，仅在响应源确实改变时才会触发回调。`watch` 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。
- `watchEffect`，则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式 property。这更方便，而且代码往往更简洁，但其响应性依赖关系不那么明确。

## 侦听器回调顺序

当更改了响应式状态，它可能会同时触发 Vue 组件更新和侦听器回调。

默认情况下，侦听器回调会在Vue 组件更新前被调用，这就代表侦听器回调中如果访问 DOM 则是被 Vue 更新前的状态。

如果希望在侦听器回调中能访问被 Vue更新后的 DOM，需要`flush:'post'`选项：

```js
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

后置刷新的 `watchEffect()` 有个更方便的别名 `watchPostEffect()`：

```js
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* 在 Vue 更新后执行 */
})
```

## 停止侦听器

使用同步语句创建的侦听器，会自动绑定到组件宿主组件实例上，并且会在宿主组件卸载时自动停止。

侦听器在异步创建时，不会绑定到当前组件上，我们必须手动停止它，以防内存泄露。

```js
<script setup>
import { watchEffect } from 'vue'

// 它会自动停止
watchEffect(() => {})

// ...这个则不会！
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

要手动停止一个侦听器，请调用 `watch` 或 `watchEffect` 返回的函数：

```js
const unwatch = watchEffect(() => {})

// ...当该侦听器不再需要时
unwatch()
```

，需要异步创建侦听器的情况很少，请尽可能选择同步创建。如果需要等待一些异步数据，你可以使用条件式的侦听逻辑：

```js
// 需要异步请求得到的数据
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // 数据加载后执行某些操作...
  }
})
```

# 模板 ref

如果需要直接访问底层 DOM 元素，需要使用`ref`attribute：

```html
<input ref="input">
```

`ref`是一个特殊的`attribute`，我们可以用它获取一个 DOM 元素或子组件被挂载后的直接引用。

## 访问模板 ref

访问模板 ref，需要声明一个同名的 ref：

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 声明一个 ref 来存放该元素的引用
// 必须和模板 ref 同名
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

只有在组件**被挂载**后才能访问ref。

如果要用侦听器观察一个模板`ref`的变化情况，需要考虑到`ref` 的值可能为 `null`：

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // 此时还未挂载，或此元素已经被卸载（例如通过 v-if 控制）
  }
})
```

## 模板 ref 标注类型

模板 ref 需要通过一个显式指定的泛型参数和一个初始值 `null` 来创建：

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>
```

注意为了严格的类型安全，有必要在访问 `el.value` 时使用可选链或类型守卫。这是因为直到组件被挂载前，这个 ref 的值都是初始的 `null`，并且在由于 `v-if` 的行为将引用的元素卸载时也可以被设置为 `null`。

## v-for 中的 ref

当 `ref` 在 `v-for` 中使用时，相应的 ref 中包含的值是一个数组，它将在元素被挂载后填充：

```vue
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

ref 数组**不能**保证与源数组相同的顺序。

## 函数型 ref

除了使用字符串值作名字，`ref` attribute 还可以绑定为一个函数，会在每次组件更新时都被调用。函数接受该元素引用作为第一个参数：

```vue
<input :ref="(el) => { /* 将 el 分配给 property 或 ref */ }">
```

如果你正在使用一个动态的 `:ref` 绑定，我们也可以传一个函数。当元素卸载时，这个 `el` 参数会是 `null`。你当然也可以使用一个方法而不是内联函数。



## 组件上的ref

`ref` 也可以被用在一个子组件上。此时 ref 中引用的是组件实例

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value 是 <Child /> 组件的实例
})
</script>

<template>
  <Child ref="child" />
</template>
```

如果一个子组件使用的是选项式 API 或没有使用 `<script setup>`，被引用的组件实例和该子组件的 `this` 完全一致，这意味着父组件对子组件的每一个属性和方法都有完全的访问权。这使得在父组件和子组件之间创建紧密耦合的实现细节变得很容易，当然也因此，应该只在绝对需要时才使用组件引用。大多数情况下，你应该首先使用标准的 props 和 emit 接口来实现父子组件交互。

有一个例外的情况，使用了 `<script setup>` 的组件是**默认私有**的：一个父组件无法访问到一个使用了 `<script setup>` 的子组件中的任何东西，除非子组件在其中通过 `defineExpose` 宏显式暴露：

```html
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

当父组件通过模板 ref 获取到了该组件的实例时，得到的实例类型为 `{ a: number, b: number }` (ref 都会自动解包，和一般的实例一样)。

## 组件 ref 定义类型

```vue
<!-- child.vue -->
<script setup lang="ts">
import { ref } from 'vue';

const a = 1;
const b = ref(2);
defineExpose({
  a,
  b,
});
</script>
```

```vue
<!-- parent.vue -->
<script setup lang="ts">
import Child from './child.vue';
import { onMounted, ref } from 'vue';

let _ref = ref<InstanceType<typeof Child> | null>(null);
onMounted(() => {
  console.log(_ref.value?.a);
  console.log(_ref.value?.b);
});
</script>

<template>
  <Child ref="_ref" />
</template>
```



# 组件基础

## 定义组件

定义一个SFC（单文件组件）

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

不适用 SFC 时，导出一个JS 对象来定义：

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
  // 或者 `template: '#my-template-element'`
}
```

这里的模板是一个内联的 JS 字符串，Vue会编译它。

上面的所有方式都会默认导出它自己。

## 使用组件

要使用一个子组件，我们需要在父组件中导入它。

```vue
<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

通过 `<script setup>`，导入的组件都在模板中直接可用。

每当你使用一个组件，就创建了一个新的**实例**。每一个组件都维护着自己的状态。

## 传递 props

props 是一种特殊的`attributes`,父组件可以传递属性给子组件。

```vue
<script setup lang="ts">
import { ref } from 'vue';
import Child from './child.vue';
const count = ref(0);
function addCount() {
  count.value++;
}
</script>

<template>
  <Child :count="count" :addCount="addCount" />
</template>
```

子组件使用则需要使用`defineProps`声明

```vue
<script setup lang="ts">
defineProps(['count', 'addCount']);
</script>

<template>
  <h1>{{ count }}</h1>
  <h1>count:{{ count }}</h1>
  <button @click="addCount">add</button>
</template>
```

**`props` 和`v-for`结合**

```vue
<script setup lang="ts">
import { ref } from 'vue';
import Child from './child.vue';
const count = ref([
  { id: 1, title: 'book1' },
  { id: 2, title: 'book2' },
  { id: 3, title: 'book3' },
]);
</script>

<template>
  <Child v-for="{ title, id } of count" :title="title" :key="id" />
</template>
```

```vue
<!-- child.vue -->
<script setup lang="ts">
defineProps(['title']);
</script>

<template>
  <h1>{{ title }}</h1>
</template>
```

## 监听事件

除了直接将事件函数传递给子组件使用以外，还可以通过让父组件监听子组件事件，让子组件通过触发父组件里的方法。

具体做法：

1. 父组件在子组件上设置监听某个事件

   ```js
   const addCount = () => count.value.push({ id: 4, title: 'book4' });
   ```

   ```vue
     <Child
       v-for="{ title, id } of count"
       :title="title"
       :key="id"
       @addCount="addCount"
     />
   ```

   

2. 子组件声明需要抛出的事件

   ```js
   defineEmits(['addCount']);
   ```

   

3. 通过内置的`$emit`抛出事件

   ```vue
     <button @click="$emit('addCount')">addCount</button>
   ```

4. 由于父组件事先监听`addCount`，所以当子组件抛出后，父组件会捕获到这一事件并最终调用该方法。

## 插槽

插槽的概念类似于 `React` 的 `children`,`Vue`里用的是`<slot>`

父组件里这么用：

```vue
  <Child>
    <div>this is slot</div>
  </Child>
```

子组件中把`<slot>`插到想要插入的位置

```vue
<template>
  <div class="slot">
    <slot />
  </div>
</template>
```

## 组件切换

有些需求需要在多个组件间切换，可以用`<component>`元素和`is`attribute 实现。

案例：

两个子组件内容：

```vue
<script setup>
const title = '组件 1';
</script>
<template>
  <h1 class="slot">
    {{ title }}
  </h1>
</template>
```

```vue
<script setup>
const title = '组件 2';
</script>
<template>
  <h1 class="slot">
    {{ title }}
  </h1>
</template>
```

父组件里这样用：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import Child1 from './child1.vue';
import Child2 from './child2.vue';
let currentTab = ref('Child1');
const tabs = { Child1, Child2 };
function checkCurrentTab() {
  if (currentTab.value === 'Child1') {
    currentTab.value = 'Child2';
  } else {
    currentTab.value = 'Child1';
  }
}
</script>

<template>
  <div>
    <component :is="tabs[currentTab]"></component>
    <button @click="checkCurrentTab">check tab</button>
  </div>
</template>
```

被传给 `:is` 的值可以是以下几种：

* 被注册的组件名
* 导入的组件对象

也可以使用 `is` attribute 来创建一般的 HTML 元素。

当使用`<component :is='...'`来给多个组件切换时，组件会在被切换后卸载。我们可以换成`<KeepAlive>`组件来强制让不活跃的组件保持存活状态。

```vue
<!-- 非活跃的组件将会被缓存！ -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

# 组件注册

## 全局注册

`app.component()`方法让组件全局可用。

在`main`文件中使用`app.component`来全局注册组件

```js
import { createApp } from 'vue';
import App from './App.vue';
import ChildA from './child1.vue';
import ChildB from './child2.vue';

const app = createApp(App);
app.component('ChildA', ChildA).component('ChildB', ChildB);
```

在其他地方就可以直接用：

```
<!-- 这在当前应用的任意组件中都可用 -->
<ComponentA/>
<ComponentB/>
```

全局注册的组件即使没用也不会被`tree-shaking`删除，同时由于全局注册的组件不需要引入也可以使用，这就使得依赖关系不是很明确。

## 局部注册

局部注册就是通过`import`来引入子组件。

```vue
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```

# Props

子组件需要显式声明 prop，除了使用字符串数组外，还可以使用对象的形式

```js
defineProps({ title: String });
defineProps(['title']);
```

对象形式声明中的每个属性，key 是 prop 的名称，而值应该是预期类型的构造函数。

使用 TypeScript 的类型标注：

```js
const props = defineProps<{ title: string }>();

{{ props.title }}
```

## 传递 prop 细节

* props 属性名应使用小驼峰形式

* 动态 prop 使用`v-bind`或者`:`绑定

* 使用动态 prop传递字符串时需要带引号，否则会被认为是 number 类型

* 传递true 时可以简写 `<BlogPost is-published />`

* 可以用一个对象来传递多个 prop

  ```vue
  <Child1 v-bind="{ title, name }" />
  ```

  等价于：

  ```vue
  <Child1 :title="title" :name="name" />
  ```


  ## 单项数据

  所有的 prop 都遵循着**单向绑定**原则，prop 因父组件的更新而变化，自然地将新的状态向下流往子组件，而不会逆向传递。这避免了子组件意外修改了父组件的状态，不然应用的数据流就会变得难以理解了。

  子组件不能更改 prop，因为 prop 是只读的。（但是可以更改引用类型内部的值）

  如果子组件想要更改 prop，可以这么做：

  1. prop 用于被传入初始值，子组件定义一个新的局部属性，将 prop 当做初始值

     ```js
     const props = defineProps(['initialCounter'])
     
     // 计数器只是将 props.initialCounter 作为初始值
     // 像下面这样做就使 prop 和后续更新无关了
     const counter = ref(props.initialCounter)
     ```

  2. 子组件使用计算属性，而依赖则使用父组件传递下来的 prop

     ```js
     const props = defineProps(['size'])
     
     // 该 prop 变更时计算属性也会自动更新
     const normalizedSize = computed(() => props.size.trim().toLowerCase())
     ```

  由于 prop 可以传递引用类型，所以其实可以更改引用类型内部的值，但是这样会使得数据变得难以推理，所以不要这么做，如果真的想改，则应该调用事件通知父组件更改。

# 组件事件

`$emit`触发组件自定义事件

```vue
<!-- MyComponent -->
<button @click="$emit('someEvent')">click me</button>
```

父组件监听

```vue
<MyComponent @some-event="callback" />
```

自定义事件支持修饰符

```vue
<MyComponent @some-event.once="callback" />
```

Vue会自动将小驼峰方式转化成`kebab-case`,所以上面的示例中子组件使用`someEvent`触发，父组件则使用`@some-event`来监听。

> 组件事件不会冒泡

## 事件参数

子组件通过`$emit`传递参数

```vue
<button @click="$emit('increaseBy', 1)">
  Increase by 1
</button>
```

父组件接收

```vue
<MyButton @increase-by="(n) => count += n" />
```

> 所有传入 `$emit()` 的额外参数都会被直接传向监听器。举个例子，`$emit('foo', 1, 2, 3)` 触发后，监听器函数将会收到这三个参数值。

## 声明触发的事件

子组件处声明：

```js
const emit = defineEmits(['inFocus', 'submit'])
```

使用`TypeScript`来标注类型

```js
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

如果一个原生事件的名字 (例如 `click`) 被定义在 `emits` 选项中，则监听器只会监听组件触发的 `click` 事件而不会再响应原生的 `click` 事件。



## 配合 v-model

子组件写法：

```vue
<script setup lang="ts">
defineProps<{ modelValue: string }>();
defineEmits(['update:modelValue']);
</script>
<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target?.value)"
  />
</template>
```

父组件写法：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import Child1 from './child1.vue';
const modelValue = ref<string>('');
</script>

<template>
  <div>
    <Child1 v-model="modelValue" />
    modelValue: {{ modelValue }}
  </div>
</template>
```

父组件的这行代码：

```vue
    <Child1 v-model="modelValue" />
```

相当于

```vue
    <Child1
      :modelValue="modelValue"
      @update:modelValue="(value:string) => (modelValue = value)"
    />
```



### v-model传参

默认情况下，`v-model` 在组件上都是使用 `modelValue` 作为 prop，以 `update:modelValue` 作为对应的事件。我们可以通过给 `v-model` 指定一个参数来更改这些名字：

```vue
<MyComponent v-model:title="bookTitle" />
```

在这个例子中，子组件应该有一个 `title` prop，并在变更时向父组件发射 `update:title` 事件

```vue
<!-- MyComponent.vue -->
<script setup>
defineProps(['title'])
defineEmits(['update:title'])
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```



### 多个 v-model

使用 v-model 参数配合来传递多个 v-model

```vue
<UserName
  v-model:first-name="firstName"
  v-model:last-name="lastName"
/>
```



### 处理v-model 修饰符

默认的修饰符通过`modelModifiers`这个 `props`属性传递给子组件。

比如以下代码：

```vue
<script setup lang="ts">
const props = defineProps(['modelValue', 'modelModifiers']);

const emit = defineEmits(['update:modelValue']);

function input(e: Event) {
  let value = e?.target?.value as string;
  if (props.modelModifiers.capitalize) {
    value = value[0].toUpperCase() + value.slice(1);
  }
  emit('update:modelValue', value);
}
</script>
<template>
  <input type="text" :value="modelValue" @input="input" />
</template>
```

上面的代码是子组件通过`modelModifiers`里面有没有`capitalize`来将首字母大写。

`capitalize`是父组件传递过来的修饰符。

父组件是这样传递修饰符的

```vue
    <Child1 v-model.capitalize="value" />
```

对于又有参数又有修饰符的 `v-model` 绑定，生成的 prop 名是 `arg + "Modifiers"`。举个例子：

父组件里传递：

```vue
    <Child1 v-model:value.capitalize="value" />
```

那么子组件里就应该是这样的：

```js
const props = defineProps(['value', 'valueModifiers']);

const emit = defineEmits(['update:value']);
console.log(props.titleModifiers) // { capitalize: true }
```



# 透传 Attribute

## Attribute 继承

“透传 attribute”是传递给组件的 attribute 或者 `v-on` 事件监听器，但并没有显式地声明在所接收组件的 [props](https://staging-cn.vuejs.org/guide/components/props.html) 或 [emits](https://staging-cn.vuejs.org/guide/components/events.html#defining-custom-events) 上。最常见的例子就是 `class`、`style` 和 `id`。

举个例子，一个子组件的模板是这样写的：

```html
<!-- <MyButton> 的模板 -->
<button>click me</button>
```

父组件使用了这个组件：

```vue
<MyButton class="large" />
```

最后渲染出的 DOM 结果是：

```html
<button class="large">click me</button>
```

如果子组件的根元素有了 `class`或者`style`，就会跟父组件上继承过来的值互相合并。

```html
<!-- <MyButton> 的模板 -->
<button class="btn">click me</button>
```

最后渲染出来的是这样：

```html
<button class="btn large">click me</button>
```

**`v-on`监听器继承**

同样的规则也适用于 `v-on` 事件监听器：

```vue
<MyButton @click="onClick" />
```

监听器 `click` 会被添加到 `<MyButton>` 的根元素，即那个原生的 `<button>` 元素之上。当原生的 `<button>` 被点击，会触发父组件的 `onClick` 方法。如果原生 `button` 元素已经通过 `v-on` 绑定了一个事件监听器，则这些监听器都会被触发。

## 深层组件继承

如果一个组件在根节点上渲染另一个组件,即这样的：

```vue
<!-- <MyButton/> 的模板，只是渲染另一个组件 -->
<BaseButton />
```

此时 `<MyButton>` 接收的透传 attribute 会直接传向 `<BaseButton>`。

* 透传的 attribute 不会包含 `<MyButton>` 上声明过的 props 或是针对 `emits` 声明事件的 `v-on` 侦听函数，换句话说，声明过的 props 和侦听函数被 `<MyButton>`“消费”了。
* 透传的 attribute 若符合声明，也可以作为 props 传入 `<BaseButton>`。



## 禁用 Attribute 继承

如果你**不想要**一个组件自动地继承 attribute，你可以在组件选项中设置 `inheritAttrs: false`。

如果你使用了 `<script setup>`，你需要一个额外的 `<script>` 块来书写这个选项声明：

```js
<script>
// 使用一个简单的 <script> to declare options
export default {
  inheritAttrs: false
}
</script>

<script setup>
// ...setup 部分逻辑
</script>
```

最常见的需要禁用 attribute 继承的场景就是 attribute 需要应用在根节点以外的其他元素上。通过设置 `inheritAttrs` 选项为 `false`，你可以完全控制透传进来的 attribute 如何应用。

这些透传进来的 attribute 可以在模板的表达式中直接用 `$attrs` 访问到。

```vue
<span>Fallthrough attribute: {{ $attrs }}</span>
```

这个 `$attrs` 对象包含了除组件的 `props` 和 `emits` 属性外的所有其他 attribute，例如 `class`，`style`，`v-on` 监听器等等。

- 和 props 有所不同，透传 attributes 在 JavaScript 中保留了它们原始的大小写，所以像 `foo-bar` 这样的一个 attribute 需要通过 `$attrs['foo-bar']` 来访问。
- 像 `@click` 这样的一个 `v-on` 事件监听器将在此对象下被暴露为一个函数 `$attrs.onClick`。

有时候我们可能为了样式，需要在 `<button>` 元素外包装一层 `<div>`：

```vue
<div class="btn-wrapper">
  <button class="btn">click me</button>
</div>
```

我们想要所有像 `class` 和 `v-on` 监听器这样的透传 attribute 都应用在内部的 `<button>` 上而不是外层的 `<div>` 上。我们可以通过设定 `inheritAttrs: false` 和使用 `v-bind="$attrs"` 来实现：

```vue
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">click me</button>
</div>
```

[没有参数的 `v-bind`](https://staging-cn.vuejs.org/guide/essentials/template-syntax.html#dynamically-binding-multiple-attributes) 会将一个对象的所有属性都作为 attribute 应用到目标元素上。

## 多根节点的 Attribute 继承

和单根节点组件有所不同，有着多个根节点的组件没有自动 attribute 透传行为。

如果 `$attrs` 被显式绑定，则不会有警告：

```vue
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

 

## 查看组件中所有透传的attribute

可以在 `<script setup>` 中使用 `useAttrs()` API 来访问一个组件的所有透传 attribute：

```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```



