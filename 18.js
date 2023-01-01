const fs = require('fs');

const getKey = cube => cube.join('_');
const getCube = key => key.split('_').map(s => +s);

const isAdjacent = (a, b) => {
  let xDiff = Math.abs(a[0] - b[0]);
  let yDiff = Math.abs(a[1] - b[1]);
  let zDiff = Math.abs(a[2] - b[2]);
  return (xDiff + yDiff + zDiff) <= 1;
}

const cubes = fs.readFileSync('inputs/18.txt', 'utf8').split("\n").map(line => line.split(',').map(s => +s));
const cubeKeys = cubes.map(cube => getKey(cube));

let minX = Infinity, minY = Infinity, minZ = Infinity;
let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
for (let cube of cubes) {
  let [x,y,z] = cube;
  if (x < minX) minX = x;
  if (y < minY) minY = y;
  if (z < minZ) minZ = z;
  if (x > maxX) maxX = x;
  if (y > maxY) maxY = y;
  if (z > maxZ) maxZ = z;
}
minX--;
minY--;
minZ--;
maxX++;
maxY++;
maxZ++;

const part1 = () => {
  let totAdj = 0;
  for (let i = 0; i < cubes.length-1; i++) {
    for (let j = i + 1; j < cubes.length; j++) {
      let c1 = cubes[i], c2 = cubes[j];
      if (isAdjacent(c1, c2)) {
        totAdj++;
      }
    }
  }

  return (cubes.length * 6 - totAdj * 2);
}

const part2 = () => {
  let queue = [
    getKey([0, 0, 0])
  ];
  let visited = [], res = 0;
  while (queue.length) {
    let cubeKey = queue.shift();
    visited.push(cubeKey);
    let cube = getCube(cubeKey);
    let ways = [
      [0 , -1, 0], // up
      [0 , 1, 0], // down
      [-1 , 0, 0], // left
      [1 , 0, 0], // right
      [0 , 0, -1], // front
      [0 , 0, 1], // back
    ];
    for (let way of ways) {
      let checkCube = [cube[0] + way[0], cube[1] + way[1], cube[2] + way[2]];
      let checkCubeKey = getKey(checkCube);
      let [x, y, z] = checkCube;
      if (
        x >= minX && x <= maxX && y >= minY && y <= maxY && z >= minZ && z <= maxZ 
        && !visited.includes(checkCubeKey) && !queue.includes(checkCubeKey)
      ) {
        if (cubeKeys.includes(checkCubeKey)) res++;
        else queue.push(checkCubeKey);
      }
    }
  }
  return res;
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
