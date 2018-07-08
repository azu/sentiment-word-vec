// MIT © 2018 azu
"use strict";
const word2vec = require("word2vec");
const fs = require("fs");
const path = require("path");
// TODO dict
const dictPath = path.join(__dirname, "./model/pn_ja.dic");
const vectorPath = path.join(__dirname, "./model/all.vector.txt");
const outputPath = path.join(__dirname, "./model/output.txt");
const dictData = fs.readFileSync(dictPath, "utf-8");
const getParams = (model, word) => {
    return {
        喜び: model.similarity("喜び", word),
        信頼: model.similarity("信頼", word),
        不安: model.similarity("不安", word),
        驚き: model.similarity("驚き", word),
        悲しみ: model.similarity("悲しみ", word),
        嫌悪: model.similarity("嫌悪", word),
        怒り: model.similarity("怒り", word),
        予測: model.similarity("予測", word)
    };
};
word2vec.loadModel(vectorPath, function(err, model) {
    // delete concat file
    try {
        fs.unlinkSync(outputPath);
    } catch (err) {}
    dictData.split("\n").forEach(dic => {
        const words = dic.split(":");
        const params = getParams(model, words[0]);
        try {
            fs.appendFileSync(outputPath, `${dic}\n${JSON.stringify(params, null, 2)}\n`, "utf-8");
            console.log("Append: " + dic);
        } catch (err) {}
    });
});
