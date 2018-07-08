# データセットの作成

## [livedoor ニュースコーパス](https://www.rondhuit.com/download.html#ldcc)をダウンロード

[livedoor ニュースコーパス](https://www.rondhuit.com/download.html#ldcc)をデータ・セットとして利用する

```
bash tool/download-dataset.sh
```

## データセットを1つのtxtにする

データセットを[前処理](https://qiita.com/Hironsan/items/2466fe0f344115aff177)を行いながらひとつの`all.txt`を作成する

    node tool/normalize-concat-text.js

## 分かち書きしたデータを作成

`all.txt`をmecab + mecab-ipadic-neologdを使った分かち書きデータ(`all.wakati.txt`)を作成する。

以下を参考にmecab-ipadic-neologdを使える状態にする

- [mecab-ipadic-neologd/README.ja.md at master · neologd/mecab-ipadic-neologd](https://github.com/neologd/mecab-ipadic-neologd/blob/master/README.ja.md)
- [word2vecで吉川英治本の感情分析をしてみた - Qiita](https://qiita.com/TakahiroYamamoto/items/8efaae49ea4ff4f7eeec#%E8%A9%A6%E3%81%97%E3%81%A6%E3%81%BF%E3%82%8B)

```
$ echo `mecab-config --dicdir`"/mecab-ipadic-neologd"
/usr/local/lib/mecab/dic/mecab-ipadic-neologd
```

となればOK(パスは個人で違うかも)

以下でmecabによる`all.txt`から`all.wakati.txt`を作成できる

    bash tool/create-wakati.sh
    
