const fs = require('fs');

const lines = fs.readFileSync('inputs/19.txt', 'utf8').split("\n");

const blueprints = [];
lines.forEach(line => {
  let [blueprintNum, robotCosts] = line.split(": ");
  let blueprint = {
    ore: [],
    clay: [],
    obsidian: [],
    geode: [],
  };
  robotCosts = robotCosts.split(/\s?Each\s/).slice(1);
  robotCosts = robotCosts.map(robotCostRaw => {
    let matches = robotCostRaw.match(/(.+) robot costs (.+)./)
    let robotName = matches[1], y = {};
    let costs = matches[2].split(' and ').map(s => {
      let [num, name] = s.split(' ');
      y[name] = +num;
    });
    blueprint[robotName] = y;
  });
  
  blueprints.push(blueprint);
});

const getMemoKey = state => state.time + '_' + JSON.stringify(state.robots) + '_' + JSON.stringify(state.inventory);

const solve = (blueprint, initialTime) => {
  let memo = new Map();

  let maxSpends = {};
  for (let robotName in blueprint) {
    for (let costName in blueprint[robotName]) {
      if (!maxSpends[costName]) {
        maxSpends[costName] = 0;
      }
      maxSpends[costName] = Math.max(maxSpends[costName], blueprint[robotName][costName]);
    }
  }

  let globalMax = 0;
  const getMax = (state) => {
    if (state.time == 0) {
      return state.inventory.geode;
    }
    let memoKey = getMemoKey(state);
    if (memo.has(memoKey)) return memo.get(memoKey);

    let inventory = state.inventory;
    let robots = state.robots;
    let time = state.time;

    let max = inventory.geode + robots.geode * time;

    let possibleMax = max + ((time * (time)) / 2);
    let skip = possibleMax < globalMax;

    for (let robotName in blueprint) {
      if (skip) continue;
      if (time == 1) continue;
      if (robotName != 'geode') {
        if (time == 2) continue;
        if (robots[robotName] > maxSpends[robotName]) continue;
      }

      let timeNeeded = 0;
      for (let resource in blueprint[robotName]) {
        if (!robots[resource]) {
          timeNeeded = Infinity;
          break;
        }
        let x = blueprint[robotName][resource] - (inventory[resource] | 0);
        x /= robots[resource];
        timeNeeded = Math.max(timeNeeded, Math.ceil(x));
      }

      let remTime = time - timeNeeded - 1;
      if (remTime > 0) {
        let newInventory = {...inventory};
        for (let robot in robots) {
          newInventory[robot] += robots[robot] * (timeNeeded + 1);
        }
        for (let resource in blueprint[robotName]) {
          newInventory[resource] -= blueprint[robotName][resource];
        }
        let newRobots = {...robots};
        for (let resource in newInventory) {
          if (resource == 'geode') continue;
          newInventory[resource] = Math.min(newInventory[resource], maxSpends[resource] * remTime);
        }
        newRobots[robotName]++;
        let newState = {
          time: remTime,
          robots: newRobots,
          inventory: newInventory
        };
        max = Math.max(max, getMax(newState));
      }
    }

    globalMax = Math.max(globalMax, max);
    memo.set(memoKey, max);
    return max;
  };

  let initialState = {
    time: initialTime,
    inventory: {ore: 0, clay: 0, obsidian: 0, geode: 0},
    robots: {ore: 1, clay: 0, obsidian: 0, geode: 0}
  };

  return getMax(initialState);
};


let part1 = 0;
for (let i = 0; i < blueprints.length; i++) {
  console.log(`Doing blueprint #${i+1}`);
  part1 += (i + 1) * solve(blueprints[i], 24);
}
console.log(`Part 1: ${part1}`);

let part2 = 1;
for (let i = 0; i < 3; i++) {
  console.log(`Doing blueprint #${i+1}`);
  part2 *= solve(blueprints[i], 32);
}
console.log(`Part 2: ${part2}`);
