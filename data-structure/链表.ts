function defaultEquals(a, b) {
  return a === b;
}
class CreateNode {
  element;
  next;
  constructor(element) {
    this.element = element;
    this.next = null;
  }
}
class LinkedList {
  count = 0; //链表的元素数量
  head: any = null; //保存第一个元素的引用
  constructor() {}
  //链表最后元素添加新元素
  push(element) {
    let node = new CreateNode(element);
    let current; //当前引用的指针
    if (!this.head) {
      this.head = node;
    } else {
      current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.count += 1;
  }
  //链表的特定位置插入一个新元素
  insert(index, element) {
    //首先，我们需要验证 index 是否在范围内，即小于 等于节点数，大于等于0。
    if (index <= this.count && index >= 0) {
      let node = new CreateNode(element);
      //我们还需要考虑head节点，当 index 为0时，头节点就要指向新传入的元素，新元素的 next 需要指向原来 head 节点。
      if (index === 0) {
        node.next = this.head;
        this.head = node;
      } else {
        //考虑完头节点，就可以使用写好的`getElementAt`方法将分别获取指定位置的上一个元素节点，以及指定位置的当前元素节点，让上一个元素节点的 next 指向 新创建的 node，新创建的 node节点的 next 指向当前元素节点就完成了插入操作。
        let previous = this.getElementAt(index - 1);
        let current = previous.next;
        previous.next = node;
        node.next = current;
      }
      this.count += 1;
      return true;
    }
    return false;
  }
  //返回链表中特定位置的元素,如果不存在，返回 undefined
  getElementAt(index) {
    if (index >= this.count || index < 0) {
      return undefined;
    }
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current;
  }
  remove(element) {} //删除一个元素
  indexOf(element) {} //返回元素在链表中的索引。如果链表中没有该元素则返回-1。
  //从链表的指定索引移除一个元素。
  removeAt(index) {
    //空链表或者传入位置大于等于链表的节点数量或者小于0，都直接不操作
    if (this.head === null || index >= this.count || index < 0) {
      return null;
    }
    //如果index 是0，则将head 引用直接改为其next
    if (index === 0) {
      this.head = this.head.next;
    } else {
      let current = this.head;
      let previous; //记录要删除元素位置的上一个元素
      for (let i = 0; i < index; i++) {
        previous = current;
        current = current.next;
      }
      previous.next = current.next; //上一个的 next 连接到下一个的 next，current 就没了
      this.count -= 1;
    }
  }
  isEmpty() {
    return this.count === 0;
  } //如果链表中不包含任何元素，返回true，如果链表长度大于0则返回false
  size() {
    return this.count;
  } //返回链表包含的元素个数，与数组的length属性类似。
  toString() {} //返回表示整个链表的字符串。由于列表项使用了Node类，就需要重写继承自JavaScript对象默认的toString方法，让其只输出元素的值
}
let linkedList = new LinkedList();

linkedList.insert(0, 1);
console.log(linkedList);

linkedList.insert(0, 0);
linkedList.insert(2, 2);
console.log(linkedList);

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**删除链表元素
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var removeElements = function (head, val) {
  let root = new ListNode(); //创建一个根节点
  root.next = head; //根节点的后面是头节点
  let previous = root; //指针 previous 指向 root 节点
  let current = head; //指针 current 指向头节点
  //当 current指针一直存在时遍历
  while (current) {
    //   如果当前遍历的节点的 val 等于 val，
    if (current.val === val) {
      // 刚开始时让保存着 root 节点的 previous 的 next 指向下一个
      previous.next = current.next;
    } else {
      //如果判断不成立，那么previous 节点脱离 root 的引用，变成 current 节点
      //当下次循环的时候，previous 就变成了current 节点的上一个节点
      previous = current;
    }
    // current 指针随着遍历一直改变到下一个
    current = current.next;
  }
  return root.next;
};

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**反转链表
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
  let current = head;
  let array = [];
  let root = new ListNode();
  let previous = root;
  while (current) {
    array.push(current);
    current = current.next;
  }
  let len = array.length;
  for (let i = 0; i < len; i++) {
    previous.next = array.pop();
    previous = previous.next;
  }
  previous.next = null;
  return root.next;
};

var reverseList = function (head) {
  let root = null; //创建 root节点，由于链表的末尾元素是 null，这里就是 null
  let current = head;
  while (current) {
    let nextTemp = current.next; //先记住 next 节点以免丢失
    current.next = root; //current.next 指向 root
    root = current; //root指针 往前走一位
    current = nextTemp; //current 指针往前走一位
  }
  return root;
};
