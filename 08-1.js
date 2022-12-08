const fs = require('fs');

const input = fs.readFileSync('inputs/08.txt', 'utf8').split("\n").map(line => line.split('').map(s => +s));

let ans1 = 0;

let edgeIndexes = [0, input[0].length-1];
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input[0].length; j++) {
    if (edgeIndexes.includes(i) || edgeIndexes.includes(j)) {
      ans1++;
    } else {
      let me = input[i][j];
      let failed = false, ci, cj;

      // up
      ci = i;
      while (ci > 0 && !failed)
        if (input[--ci][j] >= me) failed = true;
      if (!failed) {
        ans1++;
        continue;
      }

      // left
      failed = false;
      cj = j;
      while (cj > 0 && !failed)
        if (input[i][--cj] >= me) failed = true;
      if (!failed) {
        ans1++;
        continue;
      }

      // down
      failed = false;
      ci = i;
      while (ci < input.length-1 && !failed)
        if (input[++ci][j] >= me) failed = true;
      if (!failed) {
        ans1++;
        continue;
      }

      // right
      failed = false;
      cj = j;
      while (cj < input[0].length-1 && !failed)
        if (input[i][++cj] >= me) failed = true;
      if (!failed) {
        ans1++;
      }
    }
  }
}

console.log(ans1);