const fs = require('fs');

const input = fs.readFileSync('inputs/10.txt', 'utf8').split("\n");

let X = 1, cycle = 0, crtWidth = 40, ans1 = 0;

// fill crt with whitespace
let crt = [];
for (let i = 0; i < 6; i++) {
  crt.push(new Array(crtWidth).fill(' '));
}

const checkCycle = () => {
  let checkPoints = [20, 60, 100, 140, 180, 220];
  for (let cp of checkPoints) {
    if (cycle == cp) {
      ans1 += X * cp;
    }
  }
}

const draw = () => {
  let drawable = [X-1, X, X+1], index = cycle - 1;
  let row = Math.floor(index / crtWidth);
  let col = index % crtWidth;
  if (drawable.includes(col)) {
    crt[row][col] = '#';
  }
}

const doCycle = () => {
  checkCycle();
  draw();
}

for (let command of input) {
  if (command == 'noop') {
    cycle++;
    doCycle();
  } else {
    let [_, add] = command.split(' ');
    add = +add;
    cycle++;
    doCycle();
    cycle++;
    doCycle();
    X += add;
  }
}

console.log(`Part 1: ${ans1}`);
console.log("\nPart 2:\n" + crt.map(line => line.join('')).join("\n"));