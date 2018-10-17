# WebextensionBot

ブラウザ上で動作するMastodon用のBotです。WebSocketを利用した動作を実行します。

## ビルド

```bash
npm install

# トークンを書き込む
mv ts/conf-sample.ts ts/conf.ts
sed -i 's/ACCESS_TOKEN/XXXXXXXX/' ./ts/conf.ts

# ミュートしたい正規表現リスト
mv ts/filter/secret-sample.ts ts/filter/secret.ts

# addonの読み込み
mv ts/addons/index-sample.ts ts/addons/index.ts

npm run build
```

## 実行

### WebExtensionとして実行する

* Firefoxの場合、一時的であれば`about:debugging`より`webext/`以下を読み込む

* 署名をする場合は`npm run webext`で`webext/addon.xpi`が作成されるのでこれを[署名する](https://developer.mozilla.org/ja/Add-ons/Distribution)

### 直接実行する

* Firefoxの場合、<kbd><kbd>Shift</kbd>+<kbd>F4</kbd></kbd>を押してScratchpadを表示し、`webext/botstreaming.js`を開いて実行する

## 主な機能

| 機能　               | 詳細　                                                                                                             |
|:-------------------:| ----------------------------------------------------------------------------------------------------------------- |
| API制限<br>(トゥート) | 1分間あたりのトゥート数とトゥート毎の休止時間を制限できます<br>(初期値: 2回/1分 20秒 => 設定値: 1回/1分 90秒)　                 |
| API制限<br>(リプライ) | 1分間あたりのリプライ数を制限できます(初期値: 30回/1分)　                                                                 |
| 計算　               | `calc: 計算式`の形式(例: `calc: 1 + 1`)でメンションを送ると、計算結果をリプライします                                       |
| お掃除               | 汚そうなトゥートが流れた際、タイムラインをお掃除します                                                                     |
| フィルタリング　　     | アカウントID・クライアント名のマッチや、<br>正規表現での内容のマッチによるミュートができます　　                                 |
| フォローバック　　     | フォローされた時、こちらからフォロー状態でなければフォローを返します　　                                                      |
| おみくじ　　          | `!omikuji`とトゥートあるいはメンションすると、おみくじの結果をリプライします                                                 |
| お年玉               | `!otoshidama`とトゥートあるいはメンションすると、お年玉をリプライでお渡しします                                              |
| ◯✕ゲーム　          | `マルバツゲーム`とメンションするとゲームを開始します。`1-A`のように座標をメンションするとこちらが先行でゲームが始まります            |
| ポプテピスロット　     | `ポプテピ`とメンションすると、`ポプテピピック`の文字列のスロット結果をリプライします　　                                        |
| リプライ　　          | メンションを受け取った時、複数のパターンからランダムな内容をリプライします　　                                                 |

## 動作アカウント

[ぅゅたんぼっと♡](https://friends.nico/@12222222)
