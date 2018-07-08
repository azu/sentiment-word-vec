// MIT © 2018 azu
"use strict";
const word2vec = require("word2vec").word2vec;
const path = require("path");
const inputPath = path.join(__dirname, "../dataset/all.wakati.txt");
const outputPath = path.join(__dirname, "../model/all.vector.txt");
word2vec(inputPath, outputPath, {
    cbow: 1,
    size: 200,
    window: 8,
    negative: 25,
    hs: 0,
    sample: 1e-4,
    threads: 20,
    iter: 30,
    minCount: 2
});
