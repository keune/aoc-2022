const fs = require('fs');

let input = fs.readFileSync('inputs/21.txt', 'utf8').split("\n").map(line => line.split(': '));
let finished = new Map();

while (finished.size < input.length) {
  for (let i = 0; i < input.length; i++) {
    let line = input[i];
    let [monkey, equation] = line;
    if (/^\d+$/.test(equation)) {
      finished.set(monkey, +equation);
    } else {
      let [op1, operation, op2] = equation.split(' ');
      let [op1Org, op2Org] = [op1, op2];
      if (finished.has(op1)) op1 = finished.get(op1);
      if (finished.has(op2)) op2 = finished.get(op2);
      if (/^\d+$/.test(op1) && /^\d+$/.test(op2)) {
        finished.set(monkey, eval(op1 + operation + op2));
      } else {
        equation = equation.replace(op1Org+' ', op1+' ').replace(op2Org, op2);
        input[i][1] = equation;
      }
    }
  }
}

console.log(finished.get('root'));