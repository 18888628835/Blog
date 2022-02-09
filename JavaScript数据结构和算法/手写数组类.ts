/**
 * 一个类，模拟数组的增删改查方法,认识数组的内存排列排列
 */
class myArray<T> {
  public array: Array<T> = [];
  public size: number = 0;
  constructor() {}
  /**
   * 数组末尾添加元素
   * @param arg 需要添加的元素
   */
  Push(arg) {
    this.array[this.size] = arg;
    this.size += 1;
  }
  /**
   * 指定位置添加元素
   * @param specifyIndex 指定索引
   * @param arg 内容
   */
  Insert(specifyIndex: number, arg) {
    if (specifyIndex > this.size) throw new Error("大于数组的最大长度啦");

    if (specifyIndex < 0) throw new Error("位置小于0，无法插入");

    for (let i = this.size - 1; i >= specifyIndex; i--) {
      this.array[i + 1] = this.array[i];
    }
    this.array[specifyIndex] = arg;
    this.size += 1;
  }
  /**
   *开头添加元素
   * @param arg 需要添加的值
   */
  unshift(arg) {
    this.Insert(0, arg);
  }
  /**
   * 查询数组元素
   * @param selectIndex 需要查询的索引
   * @returns 返回对应的值
   */
  get(selectIndex) {
    if (selectIndex >= this.size) throw new Error(`${selectIndex}超出索引范围`);
    return this.array[selectIndex];
  }
  /**
   * 修改数组元素
   * @param updateIndex 需要更新的值的索引
   * @param arg 需要更新的内容
   * @returns 返回整个数组
   */
  set(updateIndex, arg) {
    if (updateIndex >= this.size || updateIndex < 0) {
      throw new Error("index 不正确");
    }
    this.array[updateIndex] = arg;
    return this.array;
  }
  /**
   * 查询是否包含元素
   * @param arg 需要查询的元素
   * @returns 对应的 index，否则返回-1
   */
  include(arg) {
    for (let i = 0; i < this.size; i++) {
      if (this.get(i) === arg) return i;
    }
    return -1;
  }
  remove(deleteIndex) {
    if (deleteIndex >= this.size || deleteIndex < 0)
      throw new Error("索引不正确");
    let current; //记录当前元素
    for (let i = this.size - 1; i > deleteIndex; i--) {
      let last = this.array[i - 1];
      if (i === this.size - 1) {
        this.array[i - 1] = this.array[i];
      } else {
        this.array[i - 1] = current;
      }
      current = last;
    }
    this.array.pop();
    this.size -= 1;
  }
  pop() {
    this.remove(this.size - 1);
  }
}
let a = new myArray();
a.Push(2);
console.assert(a.array[0] === 2 && a.size === 1, "push 方法有问题");
a.unshift(1);
console.assert(a.array[0] === 1 && a.size === 2, "unshift 方法有问题");
a.Insert(0, 0);
console.assert(a.array[0] === 0 && a.size === 3, "Insert 方法有问题");
let result = a.get(0);
console.assert(result === 0, "get 方法有问题");
a.set(2, 22);
console.assert(a.get(2) === 22, "set 方法有问题");
console.assert(a.include(22) === 2, "include方法有问题");
console.assert(a.include(33) === -1, "include方法有问题");
console.log(a);

a.pop();
console.log(a);

a.remove(0);
console.log(a);
