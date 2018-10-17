import { API } from '../../bot/api'
import { randomContent } from '../../bot/botcontents'
import { Configure } from '../../conf'
import { IArgumentToot } from '../../types/apitype'
import { IParsedToot } from '../../types/deftype'

export const funny = (toot: IParsedToot): void => {
  if (toot.account !== Configure.owner) return
  if (!/[wWｗＷ]$/.test(toot.content)) return
  const sendData: IArgumentToot = {
    in_reply_to_id: toot.id,
    status: `@${Configure.owner} ${randomContent.funny()}`,
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 3000)
}
