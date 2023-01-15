const fs = require('fs');

const input = fs.readFileSync('inputs/22.txt', 'utf8').split("\n\n");

const instructions = input[1].match(/(\d+|[RL])/g).map(el => ['L','R'].includes(el) ? el : +el);

const map = input[0].split("\n").map(line => line.split(''));

const CUBE_SIZE = 50;
const wraps = {
  1: {
    'up': [6, 'right', 'u-w', 1],
    'down': [3, 'down', 'i-j',1],
    'left': [4, 'right', 'm-o', -1],
    'right': [2, 'right', 'e-g', 1],
  },
  2: {
    'up': [6, 'up', 'w-x', 1],
    'down': [3, 'left', 'j-l', 1],
    'left': [1, 'left', 'b-d', 1],
    'right': [5, 'left', 'r-t', -1],
  },
  3: {
    'up': [1, 'up', 'c-d', 1],
    'down': [5, 'down', 'q-r', 1],
    'left': [4, 'down', 'm-n', 1],
    'right': [2, 'up', 'g-h', 1],
  },
  4: {
    'up': [3, 'right', 'i-k', 1],
    'down': [6, 'down', 'u-v', 1],
    'left': [1, 'right', 'a-c', -1],
    'right': [5, 'right', 'q-s', 1],
  },
  5: {
    'up': [3, 'up', 'k-l', 1],
    'down': [6, 'left', 'v-x', 1],
    'left': [4, 'left', 'n-p', 1],
    'right': [2, 'left', 'f-h', -1],
  },
  6: {
    'up': [4, 'up', 'o-p', 1],
    'down': [2, 'down', 'e-f', 1],
    'left': [1, 'down', 'a-b', 1],
    'right': [5, 'up', 's-t', 1],
  }
}

const cubesNorthWest = [];
for (let i = 0; i < map.length; i += CUBE_SIZE) {
  let row = map[i];
  let c = 0;
  while (true) {
    let start = row.indexOf('.', c);
    let start2 = row.indexOf('#', c);
    if (start2 > c && start2 < start) start = start2;
    if (start > -1) {
      cubesNorthWest.push([i, start]);
      c = start + CUBE_SIZE;
    } else {
      break;
    }
  }
}

const cubesNorthWestStr = cubesNorthWest.map(rc => rc.join('_'));

const turn = (myDirection, way) => {
  let ways = ['up', 'right', 'down', 'left'];
  let ci = ways.indexOf(myDirection);
  if (way == 'R') ci = (ci+1) % 4;
  if (way == 'L') ci--;
  if (ci == -1) ci = 3;
  return ways[ci];
}

const translate = (way) => {
  if (way == 'up') return [-1, 0];
  if (way == 'right') return [0, 1];
  if (way == 'down') return [1, 0];
  if (way == 'left') return [0, -1];
}

const isNotVoid = (row, col) => {
  return typeof map[row] !== 'undefined' && ['#', '.'].includes(map[row][col]);
}

const getCubeEdge = (cubeNorthWest, i) => {
  if (i == 0) return [...cubeNorthWest];
  let [r, c] = cubeNorthWest;
  if (i == 1) return [r, c + CUBE_SIZE - 1];
  if (i == 2) return [r + CUBE_SIZE - 1, c];
  if (i == 3) return [r + CUBE_SIZE - 1, c + CUBE_SIZE - 1];
}

const getCubeIndex = (r, c) => {
  let northWest = [r - (r % CUBE_SIZE), c - (c % CUBE_SIZE)];
  let nwStr = northWest.join('_');
  return cubesNorthWestStr.indexOf(nwStr);
}

const isOnEdge = (x) => {
  for (let i = 0; i < 6; i++) {
    let rowStart = i * CUBE_SIZE, rowEnd = rowStart + CUBE_SIZE - 1;
    if (rowStart == x || rowEnd == x) return true;
  }
  return false;
}

const move = (me, myDirection) => {
  let [changeX, changeY] = translate(myDirection);
  let newRow = me[0] + changeX, newCol = me[1] + changeY;

  if (!isNotVoid(newRow, newCol)) {
    if (myDirection == 'up') {
      for (let i = map.length - 1; i > me[0]; i--) {
        if (isNotVoid(i, me[1])) {
          newRow = i;
          break;
        }
      }
    } else if (myDirection == 'down') {
      for (let i = 0; i < me[0]; i++) {
        if (isNotVoid(i, me[1])) {
          newRow = i;
          break;
        }
      }
    } else if (myDirection == 'left') {
      for (let i = map[me[0]].length - 1; i > me[1]; i--) {
        if (isNotVoid(me[0], i)) {
          newCol = i;
          break;
        }
      }
    } else if (myDirection == 'right') {
      for (let i = 0; i < me[1]; i++) {
        if (isNotVoid(me[0], i)) {
          newCol = i;
          break;
        }
      }
    }
  }
  if (isNotVoid(newRow, newCol)) {
    x = map[newRow][newCol];
    if (x == '.') {
      return [true, newRow, newCol, myDirection];
    }
  }
  
  return [false, newRow, newCol, myDirection];
}

const move2 = (me, myDirection) => {
  let newRow, newCol, changeDirection;
  let willWrap = false;
  if (isOnEdge(me[0]) || isOnEdge(me[1])) {
    let nwOfCube = cubesNorthWest[getCubeIndex(me[0], me[1])];
    if (myDirection == 'up') {
      if (me[0] == nwOfCube[0]) willWrap = true;
    } else if (myDirection == 'left') {
      if (me[1] == nwOfCube[1]) willWrap = true;
    } else if (myDirection == 'right') {
      let edge = getCubeEdge(nwOfCube, 1);
      if (me[1] == edge[1]) willWrap = true;
    } else if (myDirection == 'down') {
      let edge = getCubeEdge(nwOfCube, 2);
      if (me[0] == edge[0]) willWrap = true;
    }
  }
  if (willWrap) {
    let wrapData = wraps[getCubeIndex(me[0], me[1]) + 1][myDirection];
    let [newCubeNum, newDirection, newEdge, startFrom] = wrapData;
    let newCubeIndex = newCubeNum - 1;
    changeDirection = newDirection;
    let [edgePoint1, edgePoint2] = newEdge.split('-').map(s => (s.charCodeAt(0) - 97) % 4);
    let newCubeNorthWest = cubesNorthWest[newCubeIndex];

    edgePoint1 = getCubeEdge(newCubeNorthWest, edgePoint1);
    edgePoint2 = getCubeEdge(newCubeNorthWest, edgePoint2);

    let diff = 0;
    if (['up', 'down'].includes(myDirection)) {
      diff = me[1] % CUBE_SIZE;
    } else {
      diff = me[0] % CUBE_SIZE;
    }

    if (edgePoint1[0] == edgePoint2[0]) {
      newRow = edgePoint1[0];
      if (startFrom == 1) {
        newCol = edgePoint1[1] + diff;
      } else {
        newCol = edgePoint2[1] - diff;
      }
    } else {
      newCol = edgePoint1[1];
      if (startFrom == 1) {
        newRow = edgePoint1[0] + diff;
      } else {
        newRow = edgePoint2[0] - diff;
      }
    }
  } else {
    let [changeX, changeY] = translate(myDirection);
    newRow = me[0] + changeX, newCol = me[1] + changeY;
  }

  let x = map[newRow][newCol];
  if (x == '.') {
    if (changeDirection) {
      myDirection = changeDirection;
    }
    return [true, newRow, newCol, myDirection];
  }
  
  return [false, newRow, newCol, myDirection];
}

const solve = part => {
  let myDirection = 'right';
  let me = [0, map[0].indexOf('.')];
  let moveFn = part == 1 ? move : move2;

  for (let instruction of instructions) {
    //console.log('instruction: ', instruction)
    if (['L', 'R'].includes(instruction)) {
      myDirection = turn(myDirection, instruction);
    } else {
      for (let i = 0; i < instruction; i++) {
        let [didMove, newRow, newCol, newDirection] = moveFn(me, myDirection);
        if (didMove) {
          me = [newRow, newCol];
          myDirection = newDirection;
        } else {
          break;
        }
      }
    }
  }

  let facing = 0;
  if (myDirection == 'down') facing = 1;
  if (myDirection == 'left') facing = 2;
  if (myDirection == 'up') facing = 3;
  console.log(`Part ${part}:`);
  console.log('row: ' + me[0] + 1);
  console.log('col: ' + me[1] + 1);
  console.log('facing: ' + facing);
  let pass = 1000 * (me[0] + 1) + 4 * (me[1] + 1) + facing;
  console.log(pass);
}

solve(1);
console.log();
solve(2);
