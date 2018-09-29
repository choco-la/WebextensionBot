import { randomContent } from '../../botcontents'
import { Configure } from '../../conf'
import { IArgumentToot } from '../../types/apitype'
import { IParsedToot } from '../../types/deftype'
import { API } from '../api'

export const funny = (toot: IParsedToot): void => {
  if (toot.account !== Configure.owner) return
  if (!/[wWｗＷ]$/.test(toot.content)) return
  const sendData: IArgumentToot = {
    in_reply_to_id: toot.id,
    status: `@12@friends.nico ${randomContent.funny()}`,
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 3000)
}
