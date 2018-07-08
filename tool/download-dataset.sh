#!/usr/bin/env bash
declare currentDir=$(pwd)
curl -L https://www.rondhuit.com/download/ldcc-20140209.tar.gz | tar zx -C ${currentDir}/../dataset/source/ldcc/
