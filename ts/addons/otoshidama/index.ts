import { API } from '../../bot/api'
import { randomContent } from '../../bot/botcontents'
import { bot } from '../../bot/state'
import { rePattern } from '../../filter/repattern'
import { IArgumentToot } from '../../types/apitype'
import { IParsedToot } from '../../types/deftype'

export const otoshidama = (toot: IParsedToot, ismention?: boolean): void => {
  if (!ismention) {
    const pattern = String.raw`@${bot.username}[^a-zA-Z0-9_]`
    const re = new RegExp(pattern)
    if (re.test(toot.content)) return
    if (!rePattern.otoshidama.test(toot.content)) return
  }
  const msg = `お年玉どうぞっ(๑•̀ㅁ•́๑)✧\nっ[${randomContent.otoshidama()}]`
  const sendData: IArgumentToot = {
    in_reply_to_id: toot.id,
    status: `@${toot.account} ${msg}`,
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 3000)
}
