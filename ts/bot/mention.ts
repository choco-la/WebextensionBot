import { randomContent } from '../botcontents'
import { Configure } from '../conf'
import { rePattern } from '../filter/repattern'
import { findCoordinate } from '../oxgame/input'
import { getParsedToot, tootParser } from '../tootparser'
import { IArgumentToot } from '../types/apitype'
import { INotification, IParsedToot } from '../types/deftype'
import { actions } from './action'
import { API } from './api'
import { streams } from './listener'
import { bot } from './state'

const reply = (toot: IParsedToot, text?: string): void => {
  const msg: string = text ? text : randomContent.reply()
  setTimeout(() => API.write.favourite(toot.id), 2000)
  const sendData: IArgumentToot = {
    in_reply_to_id: toot.id,
    status: `@${toot.account} ${msg}`,
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 3000)
}

const close = (toot: IParsedToot): void => {
  reply(toot, '終わります(๑•᎑•๑)♬*')
  streams.map((stream) => stream.close())
}

export const reaction = (recv: INotification): void => {
  const toot = recv.status

  const tootForReply = getParsedToot(toot)
  const content = tootForReply.content

  if (Configure.admin.indexOf(tootForReply.account) > -1 && rePattern.close.test(content)) {
    close(tootForReply)
    return
  }

  const oxCoordinate = findCoordinate(content)

  if (rePattern.kiss.test(content)) return reply(tootForReply, randomContent.kiss())
  else if (rePattern.otoshidama.test(content)) return actions.otoshidama(tootForReply, true)
  else if (rePattern.fortune.test(content)) return actions.fortune(tootForReply, true)
  else if (/(?:calc|計算|けいさん)[:：](.+)/i.test(content)) return actions.calc(tootForReply)
  else if (/ポプテピ|ぽぷてぴ/.test(content)) return reply(tootForReply, randomContent.popteamepic())
  else if (rePattern.oxgame.test(content)) return actions.resetOXGame(tootForReply, null, '✕', true)
  else if (oxCoordinate) return actions.playOXGame(tootForReply, oxCoordinate, '◯', true)
  else if (rePattern.resetgame.test(content)) return actions.resetOXGame(tootForReply, null, '✕', true)
  else if (rePattern.morning.test(content)) return reply(tootForReply, randomContent.morning())
  else if (rePattern.evening.test(content)) return reply(tootForReply, randomContent.evening())
  else if (rePattern.night.test(content)) return reply(tootForReply, randomContent.night())

  if (tootParser.screenName(recv.account) === Configure.owner) {
    const pattern = String.raw`^(?:@${bot.username}[^a-zA-Z0-9_]+)?(?:\n)*(?:enquete|あんけ(?:ーと)?|アンケ(?:ート)?)[:：]`
    const re = new RegExp(pattern, 'i')
    if (re.test(content)) return actions.enquete(content)
  }

  return reply(tootForReply)
}
