import { API } from '../../bot/api'
import { IArgumentToot } from '../../types/apitype'
import { IParsedToot } from '../../types/deftype'
import { evalCalc } from './evalcalc'

export const calc = (toot: IParsedToot): void => {
  const onInvalid = 'わかんないよぉ〜(｡>﹏<｡)'
  const over = '大きすぎる(∩´﹏`∩)💦'
  const input = /(?:calc|計算|けいさん)[:：](?:\n)*(.+)/i.exec(toot.content)
  if (!input) return

  const expression = input[1].trim()
  const result = evalCalc(expression)
  const sendData: IArgumentToot = {
    in_reply_to_id: toot.id,
    status: '',
    visibility: toot.visibility
  }

  if (isNaN(result)) {
    sendData.status = `@${toot.account} ${onInvalid}`
  } else if (result.toString().length > 300) {
    sendData.status = `@@${toot.account} ${over}`
  } else {
    sendData.status = `@${toot.account} ん〜。。。\n${result}かな〜？(๑>◡<๑)`
  }
  setTimeout(() => API.write.toot(sendData), 3000)
}
