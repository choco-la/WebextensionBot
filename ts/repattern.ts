const concatObjValue = (strobj: { [key: string]: string }): string => {
  let pattern = ''
  for (const key in strobj) {
    if (strobj.hasOwnProperty(key)) {
      pattern += strobj[key]
    }
  }
  return pattern
}

const misc: {[key: string]: string} = {
  cheerful: 'っ',
  period: String.raw`。\.`,
  prolong: String.raw`ー〜～\-`,
  // String.raw => [tslint] ter-no-irregular-whitespace
  space: '　 ​'
}

const symbols: {[key: string]: string} = {
  emphasize: String.raw`!！`
}

const emojis: {[key: string]: string} = {
  heart: String.raw`♡❤💔♥💗💓💕💖💞💘💛💙💜💚💝`,
  musicalNote: String.raw`♪🎵♫♬🎶`,
  star: String.raw`★☆`
}

// Used for creating RegExp using new RegExp().
export const rawPattern: { [key: string]: string } = {
  friendlySuffix: String.raw`[${concatObjValue(misc)}${concatObjValue(symbols)}${concatObjValue(emojis)}]`,
  replyPrefix: String.raw`^(?:@[a-zA-Z0-9_]+[\s]*)`
}

const closePat: string[] = [
  String.raw`[終お](?:わり|しまい)`,
  String.raw`シャットダウン|しゃっとだうん|shutdown`,
  String.raw`close`
]

const afterWhat = String.raw`(人生|残業|[お大]?掃除|[お大]?そうじ|学校|幼稚園|保育園|バイト|塾|部活|仕事|しご|試験|勉強|テスト|課題|作業|授業|講義|放送|配信|枠|枠取り)`
const excludeAfter = String.raw`(?!ってない|らない|ったら|れば|れたら|らん|れない|りに|には)`
const afterRe = String.raw`${afterWhat}(?:から|やっと|もう|いま|今)*(?:[終お]わ|しゅうりょう|終了|帰|かえ)${excludeAfter}`
const foodRe = String.raw`([🍕🍺🍵☕])(?:どうぞ|[い淹入][れっ]た)`
const fortuneRe = String.raw`[!！](?:omikuji|[ｏＯ][ｍＭ][ｉＩ][ｋＫ][ｕＵ][ｊＪ][ｉＩ]|おみくじ|[御お]籤|オミクジ)`
const otoshidamaRe = String.raw`[!！](?:otosh?idama|[ｏＯ][ｔＴ][ｏＯ][ｓＳ][ｈＨ]?[ｉＩ][ｄＤ][ａＡ][ｍＭ][ａＡ]|おとしだま|[御お]年玉|オトシダマ)`

const oxgame = String.raw`(?:[◯○oｏOＯ]|まる|マル)(?:[✕☓xｘXＸ]|ばつ|バツ)(?:ゲーム|げーむ|game)`
const resetGame = String.raw`(?:ゲーム|げーむ)(?:リセット|りせっと)|(?:最初|さいしょ)から|やり(?:直|なお)し|もう(?:一回|いっかい)`

// Used for matching.
export const rePattern: { [key: string]: RegExp } = {
  after: new RegExp(`${afterRe}`, 'iu'),
  close: new RegExp(closePat.join('|'), 'iu'),
  food: new RegExp(`${foodRe}`, 'iu'),
  fortune: new RegExp(`${fortuneRe}`, 'iu'),
  kiss: new RegExp(`ちゅ${rawPattern.friendlySuffix}*$`, 'iu'),
  otoshidama: new RegExp(`${otoshidamaRe}`, 'iu'),
  oxgame: new RegExp(`${oxgame}`, 'iu'),
  resetgame: new RegExp(resetGame, 'iu')
}

export const sholdWipeTL = (text: string): boolean => {
  if (text.includes('ﾌﾞﾘ')) return true

  const re = /([ｱ-ﾝｧ-ｮ]ﾞ?)([ｱ-ﾝｧ-ｮ]ﾞ?)(?:\1\2){2,}[^!！]*[!！]+$/g
  // Array like ['ABABABAB!!', 'CDCDCDCD!!'] if maches.
  const matches = text.match(re)
  if (!matches) return false
  for (const match of matches) {
    const capture = re.exec(match)
    if (capture === null) continue
    // Pass if pattern is like 'AAAAAA!!'.
    if (capture[1] === capture[2]) continue
    return true
  }
  return false
}
