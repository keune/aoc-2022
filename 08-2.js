const fs = require('fs');

const input = fs.readFileSync('inputs/08.txt', 'utf8').split("\n").map(line => line.split('').map(s => +s));

let ans = 0, maxScore = 0, edgeIndexes = [0, input[0].length-1];
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input[0].length; j++) {
    
    let me = input[i][j];
    let visible = 0, visibles = [];

    // up
    visible = 0;
    let ci = i;
    while (ci > 0) {
      visible++;
      if (input[--ci][j] >= me) {
        break;
      }
    }
    visibles.push(visible);

    // left
    visible = 0;
    cj = j;
    while (cj > 0) {
      visible++;
      if (input[i][--cj] >= me) break;
    }
    visibles.push(visible);

    // down
    visible = 0;
    ci = i;
    while (ci < input.length-1) {
      visible++;
      if (input[++ci][j] >= me) break;
    }
    visibles.push(visible);

    // right
    visible = 0;
    cj = j;
    while (cj < input[0].length-1) {
      visible++
      if (input[i][++cj] >= me) break;
    }
    visibles.push(visible);

    let score = visibles.reduce((a,b) => a*b, 1);
    maxScore = Math.max(maxScore, score);
  }
}

console.log(maxScore);