// MIT © 2018 azu
"use strict";
const kuromojin = require("kuromojin");
const text = `性別、職業、身分、地位、境遇、信条、人種、民族、地域、心身の状態、 病気、身体的な特徴`;
const dict = require("./dict.json");
const { split, Syntax } = require("sentence-splitter");
const NeologdNormalizer = require("neologd-normalizer").default;

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
                .replace(/[『』「」｢｣［］\[\]]/g, " ") // ［］の除去
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

const nodes = split(text).filter(node => node.type === Syntax.Sentence);
nodes.forEach(node => {
    const text = node.raw;
    const cleanedText = cleanText(text);
    if (cleanedText.length < 5) {
        return;
    }
    kuromojin(cleanedText).then(tokens => {
        const hits = [];
        tokens.forEach(token => {
            const pos = token.pos;
            if (pos === "名詞" && token.pos_detail_1 !== "一般") {
                return;
            }
            if (!["名詞", "形容詞", "動詞"].includes(pos)) {
                return;
            }
            const matchWords = dict
                .filter(([word, dist]) => {
                    return token.surface_form === word;
                })
                .sort((a, b) => {
                    return a[1] > b[1];
                });
            if (matchWords.length > 0) {
                hits.push(matchWords[0]);
            }
        });
        const totalPoint = hits.reduce((ac, hit) => {
            return ac + hit[1];
        }, 0);
        if (totalPoint < 0) {
            return;
        }
        console.log("Text:", cleanedText);
        console.log("------------------");
        console.log("Words:", hits.map(([word, dist]) => `${word}(${dist})`).join(", "));
        console.log("Total:", totalPoint);
        console.log("------------------");
    });
});
