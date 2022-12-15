const fs = require('fs');

const doesOverlap = (p1, p2) => {
  if (p1[0] <= p2[0] && p1[1] >= p2[0]-1) return true;
  if (p1[0] >= p2[0] && p1[0] <= p2[1]+1) return true;
  return false;
}

const unify = (p1, p2) => {
  return [Math.min(p1[0], p2[0]), Math.max(p1[1], p2[1])];
}

const fixStrings = (strings) => {
  // unify all overlapping string parts
  let unified;
  do {
    unified = 0
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

const calcManDis = (p1, p2) => {
  return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

const input = fs.readFileSync('inputs/15.txt', 'utf8').split("\n");

let dataLines = [];
for (let line of input) {
  let nums = line.match(/-?\d+/g).map(s => +s);
  let sensor = [nums[0], nums[1]];
  let beacon = [nums[2], nums[3]];
  dataLines.push({sensor: sensor, mandis: calcManDis(sensor, beacon)});
}

roof:
for (let searchY = 0; searchY < 4000000; searchY++) {
  if (searchY % 100000 == 0) console.log(`Row ${searchY}`);
  // for each row from 0 to 4M, check each sensors
  let strings = [];
  for (let line of dataLines) {
    let sensor = line.sensor;
    let mandis = line.mandis;

    // we find a min and max y by spending all our manhattan distance on going north or south
    // if the current row is not between this min and max, this sensor can't mark any columns in this row, pass
    let minY = sensor[1] + mandis*-1;
    let maxY = sensor[1] + mandis;
    if (searchY < minY || searchY > maxY) continue;

    // after reaching the current row from the sensor, we can go west or east with the man.dis. we have left
    // and mark each column between
    // lets represent the adjacent columns we can mark as a 'string' which has a start x and end x
    let leftMandis = mandis - Math.abs(sensor[1] - searchY);
    let newStrStart = sensor[0] - leftMandis;
    let newStrEnd = sensor[0] + leftMandis;

    strings.push([newStrStart, newStrEnd]);
  }

  // we make longer strings from strings that have overlapping parts
  // if the row is completely marked that means we have a single long string
  fixStrings(strings);
  if (strings.length == 2) {
    // distress signal is on a row with a single column that isn't marked, 
    // which means we should have 2 strings for that row
    // flatten and sort asc
    let xes = strings.reduce((a,b) => a.concat([...b])).sort((a,b) => a-b);
    // after sorting, find 2 columns with a single spot empty between them
    // that empty spot is our distress beacon's x coord.
    for (let i = 0; i < xes.length-1; i++) {
      if (xes[i] - xes[i+1] == -2) {
        let x = xes[i+1] - 1;
        console.log(x * 4000000 + searchY);
        break roof;
      }
    }
  }
}