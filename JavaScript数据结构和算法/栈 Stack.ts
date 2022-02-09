//栈的实现
// 接口
interface Stack<T> {
  capacity: number;
  push: (T) => void;
  pop: () => void;
  getSize: () => number;
  isEmpty: () => boolean;
}

class ArrayStack<T> implements Stack<T> {
  constructor(public capacity) {}
  push(T) {}
  pop() {}
  getSize() {
    return 1;
  }
  isEmpty() {
    return true;
  }
}
