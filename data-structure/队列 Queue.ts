//栈的实现
// 接口
interface Queue<T> {
  capacity: number;
  push: (T) => void;
  unshift: () => void;
  getSize: () => number;
  isEmpty: () => boolean;
}

class ArrayQueue<T> implements Queue<T> {
  constructor(public capacity) {}
  push(T) {}
  unshift() {}
  getSize() {
    return 1;
  }
  isEmpty() {
    return true;
  }
}
