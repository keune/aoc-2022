const fs = require('fs');

let input = fs.readFileSync('inputs/15.txt', 'utf8').split("\n");

const calcManDis = (p1, p2) => {
  return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

const doesOverlap = (p1, p2) => {
  if (p1[0] <= p2[0] && p1[1] >= p2[0]-1) return true;
  if (p1[0] >= p2[0] && p1[0] <= p2[1]+1) return true;
  return false;
}

const unify = (p1, p2) => {
  return [Math.min(p1[0], p2[0]), Math.max(p1[1], p2[1])];
}

const fixStrings = () => {
  let unified;
  do {
    unified = 0;
    for (let i = 0; i < strings.length-1; i++) {
      for (let j = i+1; j <strings.length; j++) {
        let p1 = strings[i], p2 = strings[j];
        if (doesOverlap(p1, p2)) {
          strings.splice(i, 1, unify(p1, p2));
          strings.splice(j, 1);
          unified++;
        }
      }
    }
  } while (unified);
}

let searchY = 2000000;
let beaconCols = [];
let strings = [];

for (let line of input) {
  let nums = line.match(/-?\d+/g).map(s => +s);
  let beacon = [nums[2], nums[3]]
  if (beacon[1] == searchY && !beaconCols.includes(beacon[0])) beaconCols.push(beacon[0]);
}

for (let line of input) {
  let nums = line.match(/-?\d+/g).map(s => +s);
  let sensor = [nums[0], nums[1]]
  let beacon = [nums[2], nums[3]]

  let mandis = calcManDis(sensor, beacon);

  let minY = sensor[1] + mandis*-1;
  let maxY = sensor[1] + mandis;
  if (searchY < minY || searchY > maxY) continue;

  let leftMandis = mandis - Math.abs(sensor[1] - searchY);
  let newStrStart = sensor[0] - leftMandis;
  let newStrEnd = sensor[0] + leftMandis;

  strings.push([newStrStart, newStrEnd]);  
}

fixStrings();
let ans = strings.map(str => str[1] - str[0] + 1).reduce((a, b) => a + b, 0);
beaconCols.forEach(bc => {
  strings.forEach(str => {
    if (bc >= str[0] && bc <= str[1]) {
      ans--;
    }
  });
});

console.log(ans);