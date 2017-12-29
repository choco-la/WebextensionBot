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
  star: String.raw`★☆`
}

// "Class" means not the type but strings-class.
// Used for creating RegExp using new RegExp().
export const strClass: { [key: string]: string } = {
  friendlySuffix: String.raw`[${concatObjValue(misc)}${concatObjValue(symbols)}${concatObjValue(emojis)}]`
}

const closePat: string[] = [
  String.raw`[終お](?:わり|しまい)`,
  String.raw`シャットダウン|しゃっとだうん|shutdown`,
  String.raw`close`
]
const replyPrefix = String.raw`^(?:@[a-zA-Z0-9_]+[\s]*)`

// Used for matching.
export const rePattern: { [key: string]: RegExp } = {
  close: new RegExp(closePat.join('|'), 'i'),
  kiss: new RegExp(`${replyPrefix}?ちゅ${strClass.friendlySuffix}*$`)
  // kiss: new RegExp(`ちゅ${strClass.friendlySuffix}*$`)
}
