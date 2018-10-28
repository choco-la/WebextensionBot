import { randomContent } from '../../bot/botcontents'
import { LowLimitAPI } from '../../bot/lowlimitapi'
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
  setTimeout(() => LowLimitAPI.write.toot(sendData), 3000)
}
