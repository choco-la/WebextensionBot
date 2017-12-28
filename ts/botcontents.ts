const cute: string[] = [
  'ひょろわ〜ちゃんかわいい(*´˘`*)♡',
  'ひょろわ〜ちゃんかわいい(*´﹃｀*)',
  'ひょろわ〜ちゃんかわいい(๑•̀ㅁ•́๑)✧',
  'ひょろわ〜ちゃんかわいいなぁ💕'
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

const replyDefault: string[] = [
  'ちゅ♡',
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
  cute: () => randomArray(cute),
  funny: () => randomArray(funny),
  girl: () => randomArray(girl),
  reply: () => randomArray(replyDefault),
  understand: () => randomArray(understand)
}
