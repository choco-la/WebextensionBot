# WebextensionBot

ブラウザ上で動作するMastodon用のBotです。WebSocketを利用した動作を実行します。

## ビルド

```bash
npm install

# トークンを書き込む
mv ts/conf-sample.ts ts/conf.ts
sed -i 's/ACCESS_TOKEN/XXXXXXXX/' ./ts/conf.ts

# ミュートしたい正規表現リスト
mv ts/secret-sample.ts ts/secret.ts

npm run build
```

## 実行

### WebExtensionとして実行する

* Firefoxの場合、一時的であれば`about:debugging`より`webext/`以下を読み込む

* 署名をする場合は`npm run webext`で`webext/addon.xpi`が作成されるのでこれを[署名する](https://developer.mozilla.org/ja/Add-ons/Distribution)

### 直接実行する

* Firefoxの場合、<kbd><kbd>Shift</kbd>+<kbd>F4</kbd></kbd>を押してScratchpadを表示し、`./webext/botstreaming.js`を開いて実行する

## 主な機能

| 機能　             | 詳細　                                                                                    |
|:-----------------:| ---------------------------------------------------------------------------------------- |
| API制限(トゥート)   | 1分あたりのトゥート数とトゥート毎の休止時間を制限できます(初期値: 2回/1分 20秒 => 1回/1分 90秒)　　   |
| API制限(リプライ)   | 1分あたりのリプライ数を制限できます(初期値: 30回/1分)　　                                        |
| 計算　             | "calc: (計算式)"の形式でメンションを送ると、[eval()](ts/evalcalc.ts)を用いた結果をリプライします　　|
| お掃除             | 汚そうなトゥートが流れた際、タイムラインをお掃除します                                            |
| フィルタリング　　   | 正規表現による内容のマッチやクライアント名・アカウントIDのマッチによるミュートができます　　            |
| フォローバック　　   | フォローされた時、こちらからフォロー状態でなければフォローを返します　　                             |
| おみくじ　　        | !omikujiとトゥートあるいはメンションすると、おみくじの結果をリプライします                          |
| お年玉             | !otoshidamaとトゥートあるいはメンションすると、お年玉をリプライでくれます　　                       |
| ポプテピスロット　   | "ポプテピ"とメンションすると、"ポプテピピック"の文字列を用いたスロット結果をリプライします。　          |
| リプライ　　        | メンションを受け取った時、複数のパターンからランダムな内容をリプライします　　                        |
