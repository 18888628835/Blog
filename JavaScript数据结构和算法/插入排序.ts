function insertionSort(array: Array<number>) {
  for (let i = 0; i < array.length; i++) {
    //记录当前元素的下标
    //由于每次 j 自动-1，就相当于更新了元素的新下标
    for (let j = i; j >= 0; j--) {
      if (array[j] < array[j - 1]) {
        //互换位置
        [array[j], array[j - 1]] = [array[j - 1], array[j]];
      } else {
        //如果不符合要求，需要让内层循环停下
        break;
      }
    }
  }
  return array;
}
console.log(insertionSort([88, 11, 3, 2, 1, 87, 21, 3]));
