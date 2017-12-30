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

const replyDefault: string[] = [
  'はーい(๑•᎑•๑)♬*',
  'なぁに？(◍•ᴗ•◍)',
  'どしたの？(*´﹃｀*)',
  '悪口はこちらまで => @12@friends.nico'
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
  funny: () => randomArray(funny),
  girl: () => randomArray(girl),
  kiss: () => randomArray(kiss),
  reply: () => randomArray(replyDefault),
  understand: () => randomArray(understand)
}
