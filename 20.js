const fs = require('fs');

const input = fs.readFileSync('inputs/20.txt', 'utf8').split("\n").map(s => +s);

class LL {
  constructor (prev, next, val) {
    this.prev = prev;
    this.next = next;
    this.val = val;
  }
}

const getNth = (n, zeroLL) => {
  let x = zeroLL;
  for (let i = 0; i < n; i++) {
    x = x.next;
  }
  return x.val;
}

const solve = part => {
  let nums = input.slice();
  if (part == 2) nums = nums.map(num => num*811589153);
  let lls = [], len = nums.length, zeroLL;
  for (let i = 0; i < len; i++) {
    let prev = i == 0 ? null : lls[i - 1];
    let ll = new LL(prev, null, nums[i]);
    if (prev) prev.next = ll;
    if (nums[i] == 0) zeroLL = ll;
    lls[i] = ll;
  }
  lls[0].prev = lls[len-1];
  lls[len-1].next = lls[0];

  let loop = part == 2 ? 10 : 1;
  for (let t = 1; t <= loop; t++) {
    for (let i = 0; i < len; i++) {
      let ll = lls[i];
      if (ll.val == 0) continue;
      let go = Math.abs(ll.val);
      if (ll.val < 0) {
        go++;
      } else {
        go--
      }
      go = go % (len-1);

      let oldPrev = ll.prev;
      let oldNext = ll.next;
      oldPrev.next = oldNext;
      oldNext.prev = oldPrev;

      let target1 = oldNext;
      while (go--) {
        if (ll.val < 0) {
          target1 = target1.prev;
        } else {
          target1 = target1.next;
        }
      }
      let target2 = target1.next

      target1.next = ll;
      ll.prev = target1;
      ll.next = target2;
      target2.prev = ll;
    }  
  }

  let a = getNth(1000, zeroLL);
  let b = getNth(2000, zeroLL);
  let c = getNth(3000, zeroLL);
  return (a+b+c);
}

console.log(`Part 1: ${solve(1)}`);
console.log(`Part 2: ${solve(2)}`);