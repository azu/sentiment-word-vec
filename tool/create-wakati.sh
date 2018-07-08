#!/usr/bin/env bash
set -x
declare currentDir=$(pwd)
declare neologdDic=$(mecab-config --dicdir)"/mecab-ipadic-neologd"
mecab -b 81920 -O wakati ${currentDir}/../dataset/all.txt > ${currentDir}/../dataset/all.wakati.txt
