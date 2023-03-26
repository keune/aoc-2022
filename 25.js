const fs = require('fs');

const numbers = fs.readFileSync('inputs/25.txt', 'utf8').split("\n");

const toSnafu = n => {
  let remainders = [], carry = 0;
  while (n > 2) {
    let remainder = n % 5;
    n = Math.floor(n / 5);
    if (remainder > 2) {
      carry = 1;
      remainder = (5 - remainder == 1) ? '-' : '=';
    }
    remainders.unshift(remainder);
    n += carry;
    carry = 0;
  }
  if (n) remainders.unshift(n);
  return remainders.join('');
}

let sum = 0;
for (let n of numbers) {
  let val = 0;
  for (let i = n.length-1, p = 1; i >= 0; i--, p *= 5) {
    let c = n[i];
    if (c == '-') {
      val -= p;
    } else if (c == '=') {
      val -= p * 2;
    } else {
      val += (+c) * p;
    }
  }
  sum += val;
}

console.log(sum, toSnafu(sum));