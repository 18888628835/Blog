// 递归实现数组求和
//递归求和的重点：1.找到最小问题，2.调用自身
function sum(nums) {
  function sum2(nums, len) {
    if (len === nums.length) {
      //这里就是基线条件
      return 0;
    }
    return nums[len] + sum2(nums, len + 1); //调用自身
  }
  return sum2(nums, 0);
}
// 递归解决阶乘问题
function factorial(n) {
  function factorial2(current) {
    if (current === 1) {
      return 1;
    } else {
      return current * factorial2(current - 1);
    }
  }
  return factorial2(n);
}

function fibonacci(n) {
  if (n === 0 || n === 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}
function memorizeFibonacci(n) {
  let cache = [0, 1];
  function fibonacci(n) {
    if (n === 1 || n === 0) {
      return n;
    }
    if (cache[n]) {
      return cache[n];
    }
    let result = fibonacci(n - 1) + fibonacci(n - 2);
    cache[n] = result;
    return result;
  }
  return fibonacci(n);
}

console.log(memorizeFibonacci(0));
