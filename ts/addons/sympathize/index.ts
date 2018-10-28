import { randomContent } from '../../bot/botcontents'
import { NoLimitAPI } from '../../bot/nolimitapi'
import { Configure } from '../../conf'
import { IArgumentToot } from '../../types/apitype'
import { IParsedToot } from '../../types/deftype'

export const sympathize = (toot: IParsedToot): void => {
  if (toot.account !== Configure.owner) return
  if (!/(?:ねー?)[うぅ][ゆゅ]ぼ[ー〜-][?？]/.test(toot.content)) return
  const sendData: IArgumentToot = {
    status: `${randomContent.sympathize()}`,
    visibility: toot.visibility
  }
  setTimeout(() => NoLimitAPI.write.toot(sendData), 3000)
}
