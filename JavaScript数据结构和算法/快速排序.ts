/* 排序过程:
1.在数组中，选择一个元素作为基准 pivot
2.所有小于基准的元素，都放到基准的左边；所有大于基准的元素，都移到基准右边
3.对基准左边和右边的两个子集，不断重复第一步和第二步，直到只剩下一个元素位置 */

function quickSort(arr) {
  //如果数组的长度在1个以内，就不需要排序了直接返回
  if (arr.length < 1) {
    return arr;
  }
  let pivotIndex = Math.floor(arr.length / 2); // 选择基准
  let pivot = arr.splice(pivotIndex, 1)[0]; //把基准拿出来
  let left: unknown[] = []; //放比基准小的元素
  let right: unknown[] = []; //放比基准大的元素
  //循环遍历，把元素放到对应的子集数组中
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  //左右再来一遍并递归合并
  return quickSort(left).concat([pivot], quickSort(right));
}
console.log(quickSort([1, 2, 6, 7, 3, 8, 5, 9, 4, 10]));
