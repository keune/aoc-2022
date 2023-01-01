const fs = require('fs');

let input = fs.readFileSync('inputs/21.txt', 'utf8').split("\n").map(line => line.split(': '));
let finished = new Map();

const isNum = n => /^\d+$/.test(n + '');

// calculate monkeys whose values are (x +-*/ someNumber) if we know the value of x 
for (let q = 0; q < input.length; q++) {
  for (let i = 0; i < input.length; i++) {
    let line = input[i];
    let [monkey, equation] = line;
    if (monkey == 'humn') {
      continue;
    }
    if (isNum(equation)) {
      finished.set(monkey, +equation);
    } else {
      let [op1, operation, op2] = equation.split(' ');
      let [op1Org, op2Org] = [op1, op2];
      if (finished.has(op1)) op1 = finished.get(op1);
      if (finished.has(op2)) op2 = finished.get(op2);
      if (isNum(op1) && isNum(op2)) {
        let evald = eval(op1 + operation + op2);
        finished.set(monkey, evald);
        input[i][1] = evald;
      } else {
        if (monkey == 'root') {
          equation = equation.replace(/[\+\-\*\/]/, '==');
        }
        equation = equation.replace(op1Org+' ', op1+' ').replace(op2Org, op2);
        input[i][1] = equation;
      }
    }
  }
}

// start with root, calculate using the value we have at root
let rootLine = input.filter(el => el[0] == 'root')[0];
let [equation, answer] = rootLine[1].split(' == ');
answer = +answer;
finished.set('root', answer);

let line = rootLine;
while (finished.size < input.length) {
  let [op1, operation, op2] = line[1].split(' ');
  let monkey, value;
  if (isNum(op1)) {
    monkey = op2;
    value = +op1;
  } else {
    monkey = op1;
    value = +op2;
  }
  if (operation == '+') {
    value = answer - value
  } else if (operation == '-') {
    if (op1 == monkey) {
      value = answer + value;
    } else {
      value = value - answer;
    }
  } else if (operation == '*') {
    value = answer / value;
  } else if (operation == '/') {
    if (op1 == monkey) {
      value = value * answer;
    } else {
      value = answer / value;
    }
  }
  finished.set(monkey, value);
  answer = value;
  let unfinishedLines = input.filter(el => el[0] == monkey);
  line = unfinishedLines ? unfinishedLines[0] : null;
}

console.log(finished.get('humn'));
