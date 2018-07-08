#!/usr/bin/env node
"use strict";
const NeologdNormalizer = require("neologd-normalizer").default;
const globby = require("globby");
const fs = require("fs");
const path = require("path");
const datasetPath = path.join(__dirname, "..", "dataset");
const outputPath = path.join(__dirname, "..", "dataset", "all.txt");

/**
 * @param {string} text
 * @return {string}
 * @see https://qiita.com/Hironsan/items/2466fe0f344115aff177
 * @see https://github.com/Hironsan/natural-language-preprocessings/blob/master/preprocessings/ja/cleaning.py
 */
function cleanText(text) {
    return text
        .split("\n")
        .map(line => {
            const replacedText = NeologdNormalizer.normalize(line.toLowerCase())
                .replace(/[【】]/g, " ") // 【】の除去
                .replace(/[（）()]/g, " ") // （）の除去
                .replace(/[「」［］\[\]]/g, " ") // ［］の除去
                .replace(/!！?？/g, "") // 感嘆符の除去
                .replace(/=\^\|~#\$%/g, " ") // 記号の除去
                .replace(/[@＠]\w+/g, "") // メンションの除去
                .replace(/(?:https?|ftp):\/\/[^\s　]+/g, "") // URLの除去
                .replace(/\d{4}-\d{2}-\d{2}t\d+:\d+:\d+\+\d+/g, "") // 日付を削除
                .replace(/　/g, " "); // 全角空白の除去
            return replacedText;
        })
        .join("\n");
}

function main() {
    const dataList = globby.sync([`${datasetPath}/source/*/**/*.txt`, "!README.txt", "!CHANGES.txt", "!LICENSE.txt"]);
    // delete concat file
    try {
        fs.unlinkSync(outputPath);
    } catch (err) {}
    dataList.forEach(filePath => {
        const content = fs.readFileSync(filePath, "utf-8");
        const normalizedContent = cleanText(content);
        try {
            fs.appendFileSync(outputPath, normalizedContent, "utf-8");
            console.log("Append: " + filePath);
        } catch (err) {}
    });
}

main();
