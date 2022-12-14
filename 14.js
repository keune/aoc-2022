const fs = require('fs');

let input = fs.readFileSync('inputs/14.txt', 'utf8')
  .split("\n")
  .map(line => line.split(' -> ').map(couple => couple.split(',').map(s => +s)));


let cave = [], bottomRow = 0;
for (let line of input) {
  let prev = null;
  for (let i = 0; i < line.length; i++) {
    let couple = line[i];
    let [x, y] = couple;
    if (!cave[y]) cave[y] = [];
    if (y > bottomRow) bottomRow = y;
    cave[y][x] = '#';
    if (prev) {
      let [prevX, prevY] = prev;
      if (x == prevX) {
        for (let q = Math.min(y, prevY); q <= Math.max(y, prevY); q++) {
          if (!cave[q]) cave[q] = [];
          cave[q][x] = '#';
        }
      } else if (y == prevY) {
        for (let q = Math.min(x, prevX); q <= Math.max(x, prevX); q++) {
          cave[y][q] = '#';
        }
      }
    }
    prev = couple;
  }
}

const isOccupied = (x, y) => {
  if (typeof cave[y] === 'undefined') return false;
  return ['#', 'o'].includes(cave[y][x]);
}

const advance = (x, y) => {
  if (typeof cave[y] === 'undefined')
    cave[y] = [];

  if (!isOccupied(x, y+1)) // down
    return [x, y+1];
  
  if (!isOccupied(x-1, y+1)) // down-left
    return [x-1, y+1];
  
  if (!isOccupied(x+1, y+1)) // down-right
    return [x+1, y+1];

  return false;
}

let startPos = [500, 0], ans = 0;

label:
while (true) {
  let [x, y] = startPos;
  
  let totalMove = 0
  while (true) {
    let nextPos = advance(x, y);
    if (y > bottomRow) break label;
    if (nextPos !== false) {
      totalMove++;
      [x,y] = nextPos;
    } else {
      break;
    }
  }

  if (totalMove == 0) break;
  cave[y][x] = 'o';
  ans++;
}

console.log(ans);
