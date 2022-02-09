//线性查找法
function LinearSearch<T>(data: Array<T>, target: T) {
  for (let i = 0; i < data.length; i++) {
    if (data[i] === target) return i;
  }
  return -1;
}
console.log(LinearSearch<number>([1, 2, 3, 4, 5], 6));
console.log(LinearSearch<string>(["1", "2", "3", "4", "5"], "4"));
