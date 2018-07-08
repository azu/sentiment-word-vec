// MIT © 2018 azu
"use strict";
const word2vec = require("word2vec");
const fs = require("fs");
const path = require("path");
const vectorPath = path.join(__dirname, "../model/all.vector.txt");
const WORD = process.argv[2];
word2vec.loadModel(vectorPath, function(err, model) {
    console.log(model.mostSimilar(WORD, 30));
});
