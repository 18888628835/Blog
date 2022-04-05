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

   

## ref定义原始类型

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

