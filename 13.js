const fs = require('fs');

let input = fs.readFileSync('inputs/13.txt', 'utf8').split("\n")
  .map(line => line ? JSON.parse(line) : '').filter(el => el !== '');

const compareInts = (a, b) => {
  if (a < b) return 1;
  if (a > b) return -1;
  return 0;
}

const compareLists = (a,b) => {
  for (let i = 0; i < a.length; i++) {
    if (typeof b[i] == 'undefined') break;
    let ci = compare(a[i], b[i]);
    if (ci != 0) return ci;
  }
  if (a.length < b.length) return 1;
  if (a.length > b.length) return -1;
  return 0;
}

const compare = (a,b) => {
  let res = 0;
  if ((a instanceof Array && typeof b == 'number') || (b instanceof Array && typeof a == 'number')) {
    let x, y;
    if (typeof b == 'number') {
      x = a;
      y = [b];
    } else {
      x = [a];
      y = b
    }
    res = compareLists(x, y);
  } else if (a instanceof Array && b instanceof Array) {
    res = compareLists(a,b);
  } else {
    res = compareInts(a,b);
  }
  return res;
}


let ans = 0;
for (let i = 0, pair = 1; i <= input.length-1; i += 2, pair++) {
  let a = input[i];
  let b = input[i+1];
  let res = compare(a, b);
  if (res == 1) ans += pair;
}
console.log(`Part 1: ${ans}`);

input = input.concat([ [[2]], [[6]] ]);
input = input.sort(compare).reverse();
let stringified = input.map(el => JSON.stringify(el));
let ans2 = ((stringified.indexOf('[[2]]')+1) * (stringified.indexOf('[[6]]')+1));
console.log(`Part 2: ${ans2}`);