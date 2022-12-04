import System.IO
import Data.List
import Data.List.Split (chunksOf)
import Data.Char

getParts line = splitAt (div (length line) 2) line

getCommonChar tuple = head (fst(tuple) `intersect` snd(tuple))

getCommonChar2 group = head ((group !! 0) `intersect` (group !! 1) `intersect` (group !! 2))

getCode c = 
    let n = ord c
    in if n > 97 then n - 96 else n - 38

main = do
    handle <- openFile "inputs/03.txt" ReadMode
    contents <- hGetContents handle
    -- part 1
    let tuples = map getParts (lines contents)
    let commonChars = map getCommonChar tuples
    let charCodes = map getCode commonChars
    putStrLn ("Part 1: " ++ show(sum charCodes))

    -- part 2
    let groups = chunksOf 3 (lines contents)
    let commonChars = map getCommonChar2 groups
    let charCodes = map getCode commonChars
    putStrLn ("Part 2: " ++ show(sum charCodes))
    
    hClose handle
