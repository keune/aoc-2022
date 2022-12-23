const fs = require('fs');

const input = fs.readFileSync('inputs/23.txt', 'utf8').split("\n").map(line => line.split(''));

const getDirections = round => {
  let firstIndex = (round - 1) % 4;
  let directions = [
    ['N', 'NE', 'NW'],
    ['S', 'SE', 'SW'],
    ['W', 'NW', 'SW'],
    ['E', 'NE', 'SE'],
  ];
  return directions.slice(firstIndex).concat(directions.slice(0, firstIndex));
};

const getMinMaxRectangle = (elves) => {
  let minI, minJ, maxI, maxJ;
  for (let elve of elves.keys()) {
    let [i, j] = getElvePos(elve);
    if (typeof minI === 'undefined' || i < minI) {
      minI = i;
    }
    if (typeof maxI === 'undefined' || i > maxI) {
      maxI = i;
    }
    if (typeof minJ === 'undefined' || j < minJ) {
      minJ = j;
    }
    if (typeof maxJ === 'undefined' || j > maxJ) {
      maxJ = j;
    }
  }
  return [
    [minI, minJ],
    [maxI, maxJ],
  ];
}

const countEmptyInRectangle = (elves) => {
  let [[minI, minJ], [maxI, maxJ]] = getMinMaxRectangle(elves);
  let total = (maxI - minI + 1) * (maxJ - minJ + 1);
  for (let elve of elves.keys()) {
    let [i, j] = getElvePos(elve);
    if (i >= minI && i <= maxI && j >= minJ && j <= maxJ) {
      total--;
    }
  }
  return total;
}

const getAdj = (elvePos, dir) => {
  let i = 0, j = 0;
  let dirs = dir.split('');
  if (dirs.includes('N')) i--;
  if (dirs.includes('S')) i++;
  if (dirs.includes('W')) j--;
  if (dirs.includes('E')) j++;
  let [elveI, elveJ] = elvePos;
  return [elveI + i, elveJ + j];
}

const get3Adj = (elvePos, dirs) => {
  return dirs.map(dir => getAdj(elvePos, dir));
}

const getElvePos = elve => elve.split('_').map(s => +s);

const getElve = (pos) => pos[0] + '_' + pos[1];

const hasNeighbor = (elvePos, elves) => {
  return ['N', 'E', 'W', 'S', 'NW', 'NE', 'SW', 'SE']
    .map(dir => getAdj(elvePos, dir))
    .some(elvePos => elves.has(getElve(elvePos)));
}

const draw = () => {
  let shape = '';
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[0].length; j++) {
      let char = elves.has(getElve([i, j])) ? '#' : '.';
      shape += char;
    }
    shape += "\n";
  }
  console.log(shape);
}

// init elves
let initialElves = new Map();
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input[0].length; j++) {
    if (input[i][j] == '#') {
      initialElves.set(getElve([i, j]), true);
    }
  }
}

const solve = (part = 1) => {
  let round = 0, elves = new Map(initialElves);
  while (++round) {
    if (part == 1 && round > 10) {
      console.log('Part 1: ' + countEmptyInRectangle(elves));
      break;
    }
    //console.log(`Round ${round}!`);
    let directions = getDirections(round);
    let propositions = new Map();
    for (let elve of elves.keys()) {
      let elvePos = getElvePos(elve);
      if (hasNeighbor(elvePos, elves)) {
        for (let threeDir of directions) {
          let validPoses = get3Adj(elvePos, threeDir);
          if (validPoses) {
            let canMove = validPoses.map(pos => getElve(pos)).some(otherElve => elves.has(otherElve)) == false;
            if (canMove) {
              let newPos = getAdj(elvePos, threeDir[0]);
              let newElve = getElve(newPos);
              if (!propositions.has(newElve)) propositions.set(newElve, []);
              propositions.get(newElve).push(elve);
              break;
            }
          }
        }
      }
    }
    let someoneCanMove = false;
    for (let [newElve, candidates] of propositions) {
      if (candidates.length == 1) {
        elves.set(newElve, true);
        elves.delete(candidates[0]);
        someoneCanMove = true;
      }
    }
    if (part == 2 && !someoneCanMove) {
      console.log(`Part 2: ${round}`);
      break;
    }
  }
}

solve(1);
solve(2);