const fs = require('fs');

const input = fs.readFileSync('inputs/16.txt', 'utf8').split("\n");

const getMemoKey = (startValveName, timeLeft, opened) => startValveName + '_' + timeLeft + opened.sort().join(',');

const diff = (a1, a2) => a1.filter(el => !a2.includes(el));

const combination = (arr, len) => {
  let res = [];

  const walk = (i, p) => {
    if (p.length == len) {
      res.push(p);
    } else {
      for (let j = i; j < arr.length; j++) {
        let newP = [...p, arr[j]];
        walk(j+1, newP);
      }
    }
  };

  walk(0, []);
  return res;
};

let memo = new Map(),
  valveNames = [],
  positiveValveNames = [],
  valves = new Map(),
  distances = new Map();
for (let line of input) {
  let matches = line.match(/Valve ([A-Z]{2}).+?(\d+).+valves? (.+)/);
  let name = matches[1];
  let rate = +(matches[2]);
  if (rate > 0) positiveValveNames.push(name);
  valveNames.push(name);
  let adjacents = matches[3].split(', ');
  valves.set(name, {rate: rate, adj: adjacents});
}

// fill distance matrix
for (let i = 0; i < valveNames.length; i++) {
  let from = valveNames[i];
  if (!distances.has(from)) distances.set(from, new Map());
  for (let j = 0; j < valveNames.length; j++) {
    if (i == j) distances.get(from).set(from, 0);
    let to = valveNames[j];
    if (!distances.get(from).has(to)) {
      distances.get(from).set(to, Infinity);
    }
  }
}
// optimize distance matrix
for (let i = 0; i < valveNames.length; i++) {
  let Q = [];
  let v = valveNames[i];
  Q.push(v);
  while (Q.length) {
    let u = Q.shift();
    let curDis = distances.get(v).get(u);
    valves.get(u).adj.forEach(w => {
      if (!isFinite(distances.get(v).get(w))) {
        distances.get(v).set(w, curDis + 1);
        Q.push(w);
      }
    });
  }
}

const solve = (startValveName, timeLeft, opened) => {
  if (timeLeft <= 0) return 0;
  
  let memoKey = getMemoKey(startValveName, timeLeft, opened);
  if (memo.has(memoKey)) return memo.get(memoKey);

  let startValve = valves.get(startValveName);

  // open
  let shouldOpen = startValve.rate > 0 && !opened.includes(startValveName);
  let case1Opened = [...opened, startValveName];
  let case1TimeLeft = timeLeft - 1;  
  let case1Pressure = case1TimeLeft * startValve.rate;

  let maxP = 0;
  if (shouldOpen) maxP = case1Pressure;

  let myDistances = distances.get(startValveName);
  for (let [vn, distance] of myDistances) {
    if (vn == startValveName) continue;
    let valve = valves.get(vn);
    if (valve.rate > 0) {
      
      if (shouldOpen && case1TimeLeft >= distance) {
        let test1 = solve(vn, case1TimeLeft-distance, [...case1Opened]) + case1Pressure;
        if (test1 > maxP) maxP = test1;
      }

      if (timeLeft >= distance) {
        let test2 = solve(vn, timeLeft-distance, [...opened]);
        if (test2 > maxP) maxP = test2;
      }
    }
  }
  
  memo.set(memoKey, maxP);
  return maxP;
};

console.log(`Part 1: ${solve('AA', 30, [])}`);

let max = 0;
for (let i = 0; i <= positiveValveNames.length; i++) {
  let combinations = combination(positiveValveNames, i);
  console.log(`Combination of ${i}`);
  for (let set1 of combinations) {
    let set2 = diff(positiveValveNames, set1);
    let candidate = solve('AA', 26, set1) + solve('AA', 26, set2);
    if (candidate > max) {
      max = candidate;
    }
  }
}

console.log(`Part 2: ${max}`);
