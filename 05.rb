file = File.open("inputs/05.txt")
input = file.read.split("\n\n")
stackRows = input[0].split("\n")
moves = input[1].split("\n")
numOfStacks = (stackRows.pop().strip().split(/\s+/).pop()).to_i

[1, 2].each do |part|
	stacks = Hash.new
	for row in stackRows
		j = 0
		1.upto(numOfStacks) do |i|
			if row[j] == "["
				stacks[i] = [] unless stacks.key?(i)
				stacks[i].push(row[j+1])
			end
			j += 4
		end
	end

	for move in moves
		n, from, to = move.scan(/\d+/).map { |str| str.to_i }
		items = stacks[from].slice(0, n)
		stacks[from] = stacks[from].slice(n, stacks[from].length)
		stacks[to] = (part == 1 ? items.reverse() : items).concat(stacks[to])
	end

	str = ""
	1.upto(numOfStacks) do |i|
		str += stacks[i][0]
	end
	puts "Part #{part}: #{str}"
end
