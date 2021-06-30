function bubbleSort(nums) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums.length - i - 1; j++) {
      if (nums[j] > nums[j + 1]) {
        [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
      }
    }
  }
}

let nums: number[] = [];
for (let i = 0; i < 20; i++) {
  nums[i] = parseInt((Math.random() * 100).toString());
}
bubbleSort(nums);
console.log(nums);
