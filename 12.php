<?php

$input = file_get_contents('inputs/12.txt');
$input = explode("\n", $input);
$input = array_map(fn ($el) => str_split($el), $input);

function getKey($i, $j) {
    return $i.'_'.$j;
}

function getVal($i, $j) {
    global $input;
    $char = $input[$i][$j];
    if ($char == 'S') return ord('a');
    if ($char == 'E') return ord('z');
    return ord($char);
}

function getDistances($s) {
    global $nodes;
    $distances = [$s => 0];
    $frontier = [$s];
    while ($frontier) {
        $next = [];
        foreach ($frontier as $u) {
            $neighbors = $nodes[$u];
            foreach ($neighbors as $neighbor) {
                $alt = $distances[$u] + 1;
                if (!isset($distances[$neighbor]) || $alt < $distances[$neighbor]) {
                    $distances[$neighbor] = $alt;
                    $next[] = $neighbor;
                }
            }
            $frontier = $next;
        }
    }
    return $distances;
}

$nodes = [];
$targetKey = null;
$startKey = null;
$startKeys = [];

for ($i = 0; $i < count($input); $i++) {
    for ($j = 0; $j < count($input[0]); $j++) {
        $meVal = getVal($i, $j);
        $meKey = getKey($i, $j);
        $meChar = $input[$i][$j];

        if ($meChar == 'S') $startKey = $meKey;
        if ($meChar == 'a') $startKeys[] = $meKey;
        if ($meChar == 'E') $targetKey = $meKey;

        $neighbors = [];
        $ways = [
            [-1, 0], // up
            [0, -1], // left
            [1, 0], // bottom
            [0, 1], // right
        ];
        foreach ($ways as $way) {
              $newI = $i + $way[0];
              $newJ = $j + $way[1];
              if ($newI >= 0 && $newJ >= 0 && $newI < count($input) && $newJ < count($input[0])) {
                $neighborKey = getKey($newI, $newJ);
                $neighborVal = getVal($newI, $newJ);
        
                if ($meVal - $neighborVal >= -1)
                      $neighbors[] = $neighborKey;
              }
        }
        $nodes[$meKey] = $neighbors;
    }
}

echo 'Part 1: '.getDistances($startKey)[$targetKey]."\n";

$sp = INF;
foreach ($startKeys as $sk) {
  $loopDistances = getDistances($sk);
  $loopSp = $loopDistances[$targetKey] ?? INF;
  if ($loopSp < $sp) $sp = $loopSp;
}
echo 'Part 2: '.(is_finite($sp) ? $sp : 'no answer')."\n";