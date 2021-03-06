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

const drawFortune = (): string => {
  const num = Math.round(Math.random() * 100)
  // 10%
  if (num > 90) return '大吉'
  // 15%
  else if (num > 75) return '中吉'
  // 20%
  else if (num > 55) return '小吉'
  // 20%
  else if (num > 35) return '吉'
  // 20%
  else if (num > 15) return '末吉'
  // 10%
  else if (num > 5) return '凶'
  // 5%
  else return'大凶'
}

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

const mom: string[] = [
  'は〜いままでちゅよ〜♡🍼',
  'よしよしいい子いい子♡',
  'どうしたの？よちよち💕'
]

const oxGameThinking: string[] = [
  'ここかな〜(๑>◡<๑)',
  'えいっ(๑•̀ㅁ•́๑)✧',
  'よいしょ(*´˘`*)♡',
  'むむむ(｡ŏ﹏ŏ)'
]

const oxGameYouWin: string[] = [
  'おめでと〜◝(⑅•ᴗ•⑅)◜..°♡',
  'ぅゅゅ。。。つよいね〜(∩´﹏`∩)',
  'うー負けちゃった(｡>﹏<｡)💦'
]

const oxGameYouLose: string[] = [
  'やったー！(๑>◡<๑)',
  'えへへ☆٩(｡•ω<｡)﻿و',
  '勝っちゃった〜!!( ๑>ω•́ )۶'
]

const otoshidama: Array<() => string> = [
  () => `${Math.round(Math.random() * 10) * 100}ぅゅたんポイント`,
  () => `${Math.round(Math.random() * 1000) * 100}ぅゅたんポイント`,
  () => `${Math.round(Math.random() * 10) * 100}ニコニコポイント`,
  () => `${Math.round(Math.random() * 1000) * 100}ニコニコポイント`,
  () => `${Math.round(Math.random() * 10) * 100}円`,
  () => `${Math.round(Math.random() * 1000) * 100}円`,
  () => `${Math.round(Math.random() * 10000) * 1000}円`,
  () => `${Math.round(Math.random() * 10)}億円`,
  () => `${Math.round(Math.random() * 1000) * 100}ドル`,
  () => `${Math.round(Math.random() * 1000) * 100}元`,
  () => `${Math.round(Math.random() * 1000) * 100}ユーロ`,
  () => `${Math.round(Math.random() * 10)}BTC`
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

const greeting: {[key: string]: string[]} = {
  evening: ['こんにちは〜(๑>◡<๑)', 'こんにちわ(ㅅ´ ˘ `)♡'],
  morning: ['おはよ〜( •ᴗ•)*♪', 'おはようございます(๑•̀ㅁ•́๑)✧'],
  night: ['こんばんは(*ｐω-)｡O゜', 'こんばんは(๑•̀ㅂ•́)و✧']
}

const sympathize = [
  'ひょろたんの言うとおり(๑>◡<๑)',
  'うんうんそうだね(ㅅ´ ˘ `)♡',
  'そうだー！(๑•̀ㅂ•́)و✧'
]

const randomArray = <T>(contents: T[]): T => {
  const index = Math.floor(Math.random() * contents.length)
  return contents[index]
}

const characterSlot = (text: string): string => {
  const chars = text.split('')
  const charArray = chars.filter((char, index) => chars.indexOf(char) === index)
  return slotValues(charArray, text.length)
}

const slotValues = (array: string[], length: number = array.length): string => {
  let result = ''
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * array.length)
    result += array[index]
  }
  return result
}

export const randomContent: { [key: string]: () => string } = {
  cheerUp: () => randomArray(cheerUp),
  cute: () => randomArray(cute),
  evening: () => randomArray(greeting.evening),
  fortune: () => drawFortune(),
  funny: () => randomArray(funny),
  girl: () => randomArray(girl),
  kiss: () => randomArray(kiss),
  mom: () => randomArray(mom),
  morning: () => randomArray(greeting.morning),
  night: () => randomArray(greeting.night),
  otoshidama: () => randomArray(otoshidama)(),
  oxGameThinking: () => randomArray(oxGameThinking),
  oxGameYouLose: () => randomArray(oxGameYouLose),
  oxGameYouWin: () => randomArray(oxGameYouWin),
  popteamepic: () => characterSlot('ポプテピピック'),
  reply: () => randomArray(replyDefault),
  sm9: () => randomArray(sm9),
  sympathize: () => randomArray(sympathize),
  understand: () => randomArray(understand)
}
