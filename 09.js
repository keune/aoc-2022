const fs = require('fs');

const input = fs.readFileSync('inputs/09.txt', 'utf8').split("\n").map(line => line.split(' '));

const xSeparated = (head, tail) => (Math.abs(head.x - tail.x) == 2);
const ySeparated = (head, tail) => (Math.abs(head.y - tail.y) == 2);
const separated = (head, tail) => xSeparated(head, tail) || ySeparated(head, tail);

const saveTailPos = (tail, visited) => {
  let str = tail.x + '_' + tail.y;
  if (!visited.includes(str)) visited.push(str);
}

const solve = (nOfPieces) => {
  let tailVisited = [];
  let pieces = [];
  for (let i = 0; i < nOfPieces; i++) {
    pieces.push({x: 0, y: 0});
  }

  saveTailPos(pieces[pieces.length-1], tailVisited);

  for (let line of input) {
    let [direction, step] = line;
    step = +step
    let theHead = pieces[0];
    let xChanges = 0, yChanges = 0;
    if (['U', 'D'].includes(direction)) {
      yChanges = direction == 'U' ? -1 : 1;
    }
    if (['L', 'R'].includes(direction)) {
      xChanges = direction == 'L' ? -1 : 1;
    }

    for (let i = 1; i <= step; i++) {
      theHead.x += xChanges;
      theHead.y += yChanges;

      for (let headI = 0; headI < pieces.length-1; headI++) {
        let tailI = headI + 1;
        let head = pieces[headI], tail = pieces[tailI];
        let isLastTail = tailI == pieces.length-1;

        // If the head is ever two steps directly up, down, left, or right from the tail, 
        //the tail must also move one step in that direction so it remains close enough
        //Otherwise, if the head and tail aren't touching 
        //and aren't in the same row or column, 
        //the tail always moves one step diagonally to keep up
        if (separated(head, tail)) {
          if (head.x != tail.x && head.y != tail.y) {
            tail.x += (head.x > tail.x ? 1 : -1);
            tail.y += (head.y > tail.y ? 1 : -1);
          } else {
            if (xSeparated(head, tail)) {
              tail.x += (head.x > tail.x ? 1 : -1);
            }
            if (ySeparated(head, tail)) {
              tail.y += (head.y > tail.y ? 1 : -1);
            }
          }
          if (isLastTail) saveTailPos(tail, tailVisited);
        }
      }
    }
  }

  return tailVisited.length;
}

console.log(`Part 1: ${solve(2)}`);
console.log(`Part 2: ${solve(10)}`);