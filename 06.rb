file = File.open("inputs/06.txt")
input = file.read.split("\n")

for line in input
	[4, 14].each_with_index do |len, p|
		ans = 0
		0.upto(line.length-len-1) do |i|
			part = line.slice(i, len)
			if (part.split("").uniq().length == len)
				ans += i + len
				break
			end
		end
		puts "Part #{p+1}: #{ans}"
	end
end
