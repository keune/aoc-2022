const fs = require('fs');

const sevenify = rock => {
  let newRock = [];
  for (let line of rock) {
    let newLine = [0, 0, ...line, 0, 0, 0, 0, 0];
    newRock.push(newLine.slice(0, 7));
  }
  return newRock;
}

const rocks = [
  [
    [1,1,1,1]
  ], // horizontal line
  
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ], // plus
  
  [
    [0, 0, 1],
    [0, 0, 1],
    [1, 1, 1],
  ], // reflected L
  
  [
    [1],
    [1],
    [1],
    [1],
  ], // vertical line
  
  [
    [1, 1],
    [1, 1],
  ], // square
].map(rock => sevenify(rock));

const jets = fs.readFileSync('inputs/17.txt', 'utf8').split('').map(s => s == '<' ? -1 : 1);

const getNextJet = () => {
  let nextJet = jets[jetIndex];
  jetIndex = (jetIndex == jets.length-1) ? 0 : jetIndex + 1;
  return nextJet;
}

const copyRock = rock => {
  let newRock = [];
  for (let line of rock) {
    newRock.push(line.slice());
  }
  return newRock;
}

const getNextRock = () => {
  let nextRock = rocks[rockIndex];
  rockIndex = (rockIndex == rocks.length-1) ? 0 : rockIndex + 1;
  return copyRock(nextRock);
}

const getMergeCouples = (rock, towerIndex) => {
  let couples = [], ri = rock.length - 1;
  while (towerIndex >= 0 && ri >= 0) {
    if (tower[towerIndex]) {
      couples.push([ri, towerIndex]);
    }
    towerIndex--;
    ri--;
  }
  return couples;
}

const canMerge = (rockLine, towerLine) => {
  for (let i = 0; i < 7; i++) {
    if (rockLine[i] == 1 && towerLine[i] == 1) {
      return false;
    }
  }
  return true;
}

const canMergeAll = (rock, indexCouples) => {
  for (let indexCouple of indexCouples) {
    let [rockIndex, towerIndex] = indexCouple;
    if (!canMerge(rock[rockIndex], tower[towerIndex]))
      return false;
  }
  return true;
}

const blowRock = (rock, n, towerIndex = -1) => {
  let checkTower = towerIndex > -1
  let canBlow = true;
  for (let i = 0; i < rock.length; i++) {
    let line = rock[i];
    let checkIndex;
    if (n == 1) {
      checkIndex = line.length - 1;
    } else {
      checkIndex = 0;
    }
    if (line[checkIndex] == 1) {
      canBlow = false;
      break;
    } else {
      let checkTowerIndex = towerIndex - rock.length + 1 + i;
      if (checkTower && typeof tower[checkTowerIndex] !== 'undefined') {
        let towerLine = tower[checkTowerIndex];
        let checkTowerLineIndex = n == 1 ? line.lastIndexOf(1) + 1 : line.indexOf(1) - 1;
        if (towerLine[checkTowerLineIndex] == 1) {
          canBlow = false;
          break;
        }
      }
    }
  }

  if (canBlow) {
    let newRock = [];
    for (let line of rock) {
      let newLine;
      if (n == 1) {
        newLine = [0, ...line.slice(0, 6)];
      } else {
        newLine = [...line, 0].slice(1);
      }
      newRock.push(newLine);
    }
    return newRock;
  }
  return rock;
}

const merge = (rock, towerIndex) => {
  let rockIndex = rock.length - 1;
  while (rockIndex >= 0 && towerIndex >= 0) {
    for (let i = 0; i < 7; i++) {
      if (rock[rockIndex][i] == 1) tower[towerIndex][i] = 1;
    }
    rockIndex--;
    towerIndex--;
  }
  let tip = rock.slice(0, rockIndex + 1);
  tower = [...tip, ...tower];
}

const printTower = () => {
  console.log(`Current state of tower of ${tower.length} lines :\n`)
  let str = '';
  for (line of tower) {
    str += line.map(c => c == 1 ? '#' : '.').join('') + "\n"
  }
  console.log(str);
  console.log("\n");
}

const printRock = rock => {
  let str = '';
  for (line of rock) {
    str += line.map(c => c == 1 ? '#' : '.').join('') + "\n"
  }
  console.log(str);
  console.log("\n");
}

let tower = [],
  jetIndex = 0, 
  rockIndex = 0,
  height = 0;

const play = (stopAtRock) => {
  let totalRocks = 0, cache = new Map();
  while (totalRocks < stopAtRock) { 
    totalRocks++;
    let rock = getNextRock();
    
    // first three step is conflict free downwards
    rock = blowRock(rock, getNextJet());
    rock = blowRock(rock, getNextJet());
    rock = blowRock(rock, getNextJet());

    let towerIndex = -1, mergeCouples = [];
    rock = blowRock(rock, getNextJet(), towerIndex);
    while (true) {
      let nextTowerIndex = towerIndex + 1;
      if (!tower[nextTowerIndex]) break;
      let nextMergeCouples = getMergeCouples(rock, nextTowerIndex);
      if (canMergeAll(rock, nextMergeCouples)) {
        mergeCouples = nextMergeCouples;
        towerIndex++;
        rock = blowRock(rock, getNextJet(), towerIndex);
      } else {
        break;
      }
    }

    merge(rock, towerIndex);
    if (tower.length > 2022) {
      let key = tower.slice(-200).map(line => line.join('-')).join('_') + '/' + jetIndex + '_' + rockIndex;
      if (!cache.has(key)) cache.set(key, []);
      let currentCache = cache.get(key);
      currentCache.push([tower.length, totalRocks]);

      if (currentCache.length >= 3) {
        let towerLenInc = currentCache[1][0] - currentCache[0][0];
        let rockInc = currentCache[1][1] - currentCache[0][1];
        let times = Math.floor((stopAtRock - totalRocks) / rockInc);

        height += times * towerLenInc;
        totalRocks += times * rockInc;
      }
    }
  }
}

play(2022);
console.log('Part 1: ' + (tower.length + height));

tower = [];
jetIndex = 0;
rockIndex = 0;
height = 0;

play(1000000000000);
console.log('Part 2: ' + (tower.length + height));
