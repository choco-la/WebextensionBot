import { API } from '../../bot/api'
import { IArgumentToot } from '../../types/apitype'
import { IParsedToot } from '../../types/deftype'

export const tellCount = (toot: IParsedToot): void => {
  const sendContent = `${toot.status.account.statuses_count}トゥートしてるね〜(๑>◡<๑)`
  const sendData: IArgumentToot = {
    in_reply_to_id: toot.id,
    status: `@${toot.account} ${sendContent}`,
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 3000)
}
