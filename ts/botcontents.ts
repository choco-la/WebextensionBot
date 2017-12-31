const cute: string[] = [
  'ひょろわ〜ちゃんかわいい(*´˘`*)♡',
  'ひょろわ〜ちゃんかわいい(*´﹃｀*)',
  'ひょろわ〜ちゃんかわいい(๑•̀ㅁ•́๑)✧',
  'ひょろわ〜ちゃんかわいいなぁ💕'
]

const cheerUp: string[] = [
  '元気出して!!( ๑>ω•́ )۶',
  'ふぁいお♡',
  '大丈夫？(╥﹏╥)',
  'つらいのとんでけ〜◝(⑅•ᴗ•⑅)◜..°',
  '元気出るびーむっ(∩｡•ｏ•｡)っ.ﾟ☆｡･'
]

const fortune: string[] = [
  '大吉',
  '中吉',
  '小吉',
  '吉',
  '末吉',
  '凶',
  '大凶'
]

const funny: string[] = [
  'ひょろわ〜ちゃん面白い(๑•᎑•๑)♬*',
  'ひょろわ〜ちゃんｗｗｗ',
  'わろたｗｗｗｗ'
]

const girl: string[] = [
  'ぉぢじゃないよ！',
  'ひょろたんぉんなのこっ◝(⑅•ᴗ•⑅)◜..°♡',
  'ひょろわ〜ちゃんぉんなのこ(ㅅ´ ˘ `)♡',
  'ひょろわ〜ちゃん女の子だよ!!( ๑>ω•́ )۶'
]

const kiss: string[] = [
  'ちゅ♡',
  '٩(๛ ˘ ³˘)۶♥',
  'んーまっ♡',
  'ぶっちゅ〜💕',
  'ちゅっちゅお！♡'
]

const otoshidama: string[] = [
  `${Math.round(Math.random() * 10) * 100}ぅゅたんポイント`,
  `${Math.round(Math.random() * 1000) * 100}ぅゅたんポイント`,
  `${Math.round(Math.random() * 10) * 100}ニコニコポイント`,
  `${Math.round(Math.random() * 1000) * 100}ニコニコポイント`,
  `${Math.round(Math.random() * 10) * 100}円`,
  `${Math.round(Math.random() * 1000) * 100}円`,
  `${Math.round(Math.random() * 10000) * 1000}円`,
  `${Math.round(Math.random() * 10)}億円`,
  `${Math.round(Math.random() * 1000) * 100}ドル`,
  `${Math.round(Math.random() * 1000) * 100}元`,
  `${Math.round(Math.random() * 1000) * 100}ユーロ`
]

const replyDefault: string[] = [
  'はーい(๑•᎑•๑)♬*',
  'なぁに？(◍•ᴗ•◍)',
  'どしたの？(*´﹃｀*)',
  '悪口はこちらまで => @12@friends.nico'
]

const sm9: string[] = [
  'どーまんせーまん( •ᴗ•)*♪',
  '悪霊退散(∩｡•ｏ•｡)っ.ﾟ☆｡･',
  '助けてもらお〜おんみょうじ〜 レッツゴー!!( ๑>ω•́ )۶'
]

const understand: string[] = [
  'わかる〜(ㅅ´ ˘ `)♡',
  'わかるよその気持ち(๑>◡<๑)',
  'うんうん！( •ᴗ•)*♪'
]

const randomArray = (contents: string[]): string => {
  const index = Math.floor(Math.random() * contents.length)
  return contents[index]
}

export const randomContent: { [key: string]: () => string } = {
  cheerUp: () => randomArray(cheerUp),
  cute: () => randomArray(cute),
  fortune: () => randomArray(fortune),
  funny: () => randomArray(funny),
  girl: () => randomArray(girl),
  kiss: () => randomArray(kiss),
  otoshidama: () => randomArray(otoshidama),
  reply: () => randomArray(replyDefault),
  sm9: () => randomArray(sm9),
  understand: () => randomArray(understand)
}
