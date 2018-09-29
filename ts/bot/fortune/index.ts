import { randomContent } from '../../botcontents'
import { rePattern } from '../../filter/repattern'
import { IArgumentToot } from '../../types/apitype'
import { IParsedToot } from '../../types/deftype'
import { API } from '../api'
import { bot } from '../state'

export const fortune = (toot: IParsedToot, ismention?: boolean): void => {
  if (!ismention) {
    const pattern = String.raw`@${bot.username}[^a-zA-Z0-9_]`
    const re = new RegExp(pattern)
    if (re.test(toot.content)) return
    if (!rePattern.fortune.test(toot.content)) return
  }
  const sendData: IArgumentToot = {
    in_reply_to_id: toot.id,
    status: '',
    visibility: toot.visibility
  }
  if (/(?:10|１０|十)(?:回|枚|個|連|かい|まい|こ|れん)/.test(toot.content)) {
    // Draw 10 times.
    let msg = `おみくじぽん♪`
    for (let i = 0; i < 10; i++) {
      if (i % 4 === 0) msg += `\n${randomContent.fortune()}`
      else msg += ` ${randomContent.fortune()}`
    }
    sendData.status = `@${toot.account} ${msg}`
  } else {
    const msg = `おみくじぽん♪\n${randomContent.fortune()}で〜す◝(⑅•ᴗ•⑅)◜..°♡`
    sendData.status = `@${toot.account} ${msg}`
  }
  setTimeout(() => API.write.toot(sendData), 3000)
}
