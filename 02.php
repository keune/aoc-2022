<?php

$input = file_get_contents('inputs/02.txt');
$input = explode("\n", $input);
$input = array_map(fn ($el) => str_replace(' ', '', $el), $input);

$distributions = [
    'AX' => [4, 4],
    'AY' => [1, 8],
    'AZ' => [7, 3],
    'BX' => [8, 1],
    'BY' => [5, 5],
    'BZ' => [2, 9],
    'CX' => [3, 7],
    'CY' => [9, 2],
    'CZ' => [6, 6],
];

$score = 0;
foreach ($input as $hand) {
    $score += $distributions[$hand][1];
}
echo "Part 1: $score\n";

// part 2
$score = 0;
$keys = array_keys($distributions);
foreach ($input as $hand) {
    $oppo = $hand[0];
    $you = $hand[1];
    $pick = null;
    foreach ($keys as $key) {
        if ($key[0] == $oppo) {
            $dist = $distributions[$key];
            if ($you == 'X' && $dist[1] < $dist[0]) $pick = $dist;
            if ($you == 'Y' && $dist[1] == $dist[0]) $pick = $dist;
            if ($you == 'Z' && $dist[1] > $dist[0]) $pick = $dist;
        }
    }
    $score += $pick[1];
}
echo "Part 2: $score\n";
