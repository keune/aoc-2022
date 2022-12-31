const fs = require('fs');

const getMemoKey = (i, j, t) => `${i}_${j}_${t}`;

let state = fs.readFileSync('inputs/24.txt', 'utf8')
  .split("\n")
  .map(
    line => line.split('')
    .map(el => ['#', '.'].includes(el) ? el : [el])
  );

let initStartPos = [0, state[0].indexOf('.')], 
  rowCount = state.length,
  colCount = state[0].length,
  initTargetPos = [rowCount - 1, state[rowCount - 1].indexOf('.')],
  states = [];

while (true) {
  let stateStr = JSON.stringify(state);
  if (states.includes(stateStr)) break;
  states.push(stateStr);

  let newState = [];
  for (let i = 0; i < rowCount; i++) {
    newState[i] = new Array(colCount).fill('.');
  }

  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < colCount; j++) {
      let cell = state[i][j];
      let newCell = newState[i][j];
      if (cell == '#') {
        newState[i][j] = '#';
      } else if (cell != '.') {
        for (let blizzard of cell) {
          let newI = i, newJ = j;
          if (blizzard == '^') {
            newI = i - 1;
            if (newI < 1) newI = rowCount - 2;
          } else if (blizzard == 'v') {
            newI = i + 1;
            if (newI >= rowCount - 1) newI = 1;
          } else if (blizzard == '<') {
            newJ = j - 1;
            if (newJ < 1) newJ = colCount - 2;
          } else if (blizzard == '>') {
            newJ = j + 1;
            if (newJ >= colCount - 1) newJ = 1;
          }
          if (!(newState[newI][newJ] instanceof Array)) {
            newState[newI][newJ] = [];
          }
          newState[newI][newJ].push(blizzard);
        }
      }
    }
  }

  state = newState;
}

states = states.map(s => JSON.parse(s));

const walk = (startPos, targetPos, t) => {
  let memo = new Map();
  let frontier = [
    [startPos[0], startPos[1]]
  ];
  while (frontier.length) {
    let nextStateIndex = (t + 1) % states.length;
    let state = states[nextStateIndex];
    let next = [];
    for (let [i, j] of frontier) {
      if (i == targetPos[0] && j == targetPos[1]) {
        return t;
      }
      let memoKey = getMemoKey(i, j, t);
      if (memo.has(memoKey)) {
        continue;
      }
      memo.set(memoKey, 1);

      let ways = [
        [-1, 0], // up
        [1, 0], // down
        [0, -1], // left
        [0, 1], // right
        [0, 0], // wait
      ];
      ways.forEach(way => {
        let [addI, addJ] = way;
        let newI = i + addI, newJ = j + addJ;
        if (state[newI] && state[newI][newJ] === '.') {
          next.push([newI, newJ]);
        }
      });
    }
    frontier = next;
    t++;
  }

  return Infinity;
};

let part1 = walk(initStartPos, initTargetPos, 0);
console.log(`Part 1: ${part1}`);
let part2 = walk(initTargetPos, initStartPos, part1);
part2 = walk(initStartPos, initTargetPos, part2);
console.log(`Part 2: ${part2}`);
