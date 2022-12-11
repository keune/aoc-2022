import re
import math
import functools
import copy

inFile = open('inputs/11.txt', 'r')
input = inFile.read()
input = map(lambda s: s.split("\n"), input.split("\n\n"))

class Monkey():
	def __init__(self, num, items, operation, test, ifTrue, ifFalse):
		self.num = num
		self.items = items
		self.operation = operation
		self.test = test
		self.ifTrue = ifTrue
		self.ifFalse = ifFalse
		self.totalInspect = 0

initialMonkeys = []
for monkeyLines in input:
	monkeyNum = re.search("\d+", monkeyLines[0]).group()
	monkeyNum = int(monkeyNum)

	items = re.findall("\d+", monkeyLines[1])
	items = list(map(int, items))
	
	operation = monkeyLines[2]
	operation = operation.replace('Operation: new = old ', '').strip().split(' ')
	
	test = re.search("(\d+)", monkeyLines[3]).group()
	test = int(test)
	
	ifTrue = re.search("\d+", monkeyLines[4]).group()
	ifTrue = int(ifTrue)

	ifFalse = re.search("\d+", monkeyLines[5]).group()
	ifFalse = int(ifFalse)
	
	monkey = Monkey(monkeyNum, items, operation, test, ifTrue, ifFalse)
	initialMonkeys.append(monkey)

divisors = []
for monkey in initialMonkeys:
  if (monkey.test not in divisors):
  	divisors.append(monkey.test)

# since they're all prime numbers, we're safe to use their product as smallest common multiple
scm = functools.reduce(lambda x,y: x*y, divisors)

def solve(loop):
	monkeys = copy.deepcopy(initialMonkeys)
	
	for i in range(1, loop + 1):
		for monkey in monkeys:
			for item in monkey.items:
				monkey.totalInspect += 1
				operation, operand = monkey.operation
				operand = item if operand == "old" else int(operand)
				if (operation == '*'):
					item = item * operand
				else:
					item = item + operand

				if (loop == 20):
					item = math.floor(item/3)
				elif (item > scm):
					times = math.floor(item/scm)
					item -= scm*times
				throwMonkeyNum = monkey.ifTrue if (item % monkey.test == 0) else monkey.ifFalse
				monkeys[throwMonkeyNum].items.append(item)

			monkey.items = []

	for monkey in monkeys:
		print("Monkey %d inspected items %d times." % (monkey.num, monkey.totalInspect))

	x = sorted(monkeys, key=lambda monki: monki.totalInspect, reverse=True)[:2]
	x = [monki.totalInspect for monki in x]
	x = functools.reduce(lambda a, b: a * b, x, 1)
	print("Part %d: %d" % (1 if loop == 20 else 2, x))

solve(20)
print("\n")
solve(10000)