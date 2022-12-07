const fs = require('fs');

const d = (...args) => {
  console.log(...args);
};

const input = fs.readFileSync('inputs/07.txt', 'utf8').split("\n");

const appendToPath = (path, dirName) => path + '/' + dirName;

class Dir {
  constructor(name, parent, children = [], files = [], size = Infinity) {
    this.name = name;
    this.parent = parent;
    this.children = children;
    this.files = files;
    this.size = size;
  }

  getPath() {
    let path = [this.name];
    let parent = this.parent;
    while (parent) {
      path.push(parent.name);
      parent = parent.parent;
    }
    return path.reverse().join('/');
  }
}

let dirList = new Map();
let root = new Dir('', null);
dirList.set(root.getPath(), root);

let currDir = root;
for (let command of input) {
  if (command[0] == '$') {
    let args = command.split(' ').slice(1);
    if (args[0] == 'cd') {
      let newDirName = args[1];
      if (newDirName == '..') {
        currDir = currDir.parent || currDir;
      } else if (newDirName == '/') {
        currDir = root;
      } else { // cd to a subdir
        let dirPath = appendToPath(currDir.getPath(), newDirName);
        if (!dirList.has(dirPath)) {
          let dir = new Dir(newDirName, currDir);
          dirList.set(dirPath, dir);
          if (!currDir.children.includes(newDirName)) {
            currDir.children.push(newDirName);
          }
        }
        currDir = dirList.get(dirPath);
      }
    }
  } else if (command.substring(0, 3) == 'dir') {
    let dirName = command.split(' ')[1];
    let dirPath = appendToPath(currDir.getPath(), dirName);
    if (!dirList.has(dirPath)) {
      let dir = new Dir(dirName, currDir);
      dirList.set(dirPath, dir);
    }
    if (!currDir.children.includes(dirName)) {
      currDir.children.push(dirName);
    }
  } else {
    // file listing
    let [size, filename] = command.split(' ');
    let file = [filename, +size];
    if (!currDir.files.includes(file)) {
      currDir.files.push(file);
    }
  }
}

const getSize = dir => {
  if (isFinite(dir.size)) return dir.size;
  let total = 0;
  dir.files.forEach(f => total += f[1]);
  let dirPath = dir.getPath();
  dir.children.forEach(dirName => {
    let childPath = appendToPath(dirPath, dirName);
    let childDir = dirList.get(childPath);
    total += getSize(childDir);
  });
  dir.size = total;
  return total;
}

let ans = 0;
let dirSizes = [];
for (let [dirPath, dir] of dirList) {
  let dirSize = getSize(dir);
  if (dirSize <= 100000) ans += dirSize;
  dirSizes.push(dirSize);
}
let diskSize = 70000000,
  requiredSize = 30000000,
  totalUsed = dirList.get('').size,
  freeSpace = diskSize - totalUsed;

let ans2 = dirSizes.sort((a,b) => a - b).filter(size => (size + freeSpace) >= requiredSize)[0];


d(`Part 1: ${ans}`);
d(`Part 2: ${ans2}`);
