inFile = open('inputs/01.txt', 'r')
elves = []
elve = 0
for line in inFile:
    line = line.strip()
    if (line == ''):
        elves.append(elve)
        elve = 0
    else:
        elve += int(line)

print("Part 1:", max(elves))

elves.sort(reverse=True)
print('Part 2:', sum(elves[0:3]))
