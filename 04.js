const fs = require('fs');

const doesContain = (p1, p2) => {
  return (p1[0] <= p2[0] && p1[1] >= p2[1]);
}

const doesOverlap = (p1, p2) => {
  if (p1[0] <= p2[0] && p1[1] >= p2[0]) return true;
  if (p1[0] >= p2[0] && p1[0] <= p2[1]) return true;
  return false;
}

const input = fs.readFileSync('inputs/04.txt', 'utf8').split("\n");

let sum = 0, sum2 = 0;
for (let line of input) {
  let parts = line.split(',');
  parts = parts.map(l => l.split('-').map(el => +el));
  if (doesContain(parts[0], parts[1]) || doesContain(parts[1], parts[0])) {
    sum++;
  }
  if (doesOverlap(parts[0], parts[1]) || doesOverlap(parts[1], parts[0])) {
    sum2++;
  }
}
console.log('Part 1: ' + sum);
console.log('Part 2: ' + sum2);