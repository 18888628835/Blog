/* 选择排序算法思路:
比如: [1,3,4,2,6,5]
用循环不断将最小的取出来，排列到额外空间上
*/
const array: number[] = [1, 3, 2, 7, 55, 9, 2, 44, 9, 2, 44, 33, 96, 101];

function selectionSort(args: number[]) {
  let len = args.length;
  let newArray: number[] = [];
  for (let i = 0; i < len; i++) {
    let min = Math.min(...args);
    newArray.push(min);
    let index = args.indexOf(min);
    args.splice(index, 1);
  }
  return newArray;
}
/* 这种方式的空间复杂度是 O(n),因为开辟了新的空间newArray。
时间复杂度是 O(n²)，原因是 Math.min方法跟 for 循环是一样的，整个函数相当于进行了两次 for 循环。 */

/*  下面用双指针来实现原地排序，不用 Math.min 方法了
核心思路就是利用两个指针，当指针i停时，另一个指针j找最小的数。
如果能够找到，就跟当前i 所在位置的数互换。 */
function selectionSort2(args) {
  for (let i = 0; i < args.length; i++) {
    //先取第一个数的 index，当它是数组中最小的
    let minIndex = i;
    //需要用来记找到的更小的数的 index
    //由于是互换机制，每次都会从前到后排列数字。所以只需要每次从 i 的位置开始找就行了
    for (let j = i; j < args.length; j++) {
      if (args[j] < args[minIndex]) {
        minIndex = j;
      }
    }
    //互换一下
    [args[i], args[minIndex]] = [args[minIndex], args[i]];
  }
  return args;
}
