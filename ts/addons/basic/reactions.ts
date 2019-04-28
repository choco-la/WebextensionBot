import { IReaction } from '../../addons/addontypes'
import { fortune } from '../../addons/fortune'
import { otoshidama } from '../../addons/otoshidama'
import { API } from '../../bot/api'
import { randomContent } from '../../bot/botcontents'
import { streams } from '../../bot/listener'
import { Configure } from '../../conf'
import { rePattern } from '../../filter/repattern'
import { IArgumentToot } from '../../types/apitype'
import { IParsedToot } from '../../types/deftype'
import { calc } from '../calc'
import { playOXGame, resetOXGame } from '../oxgame'
import { findCoordinate } from '../oxgame/input'
import { tellCount } from '../tellcount'

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

export const basicReactions: IReaction[] = [
  {
    case: (toot) => Configure.admin.indexOf(toot.account) > -1 && rePattern.close.test(toot.content),
    reaction: close
  },
  {
    case: (toot) => rePattern.kiss.test(toot.content),
    reaction: (toot) => reply(toot, randomContent.kiss())
  },
  {
    case: (toot) => rePattern.otoshidama.test(toot.content),
    reaction: otoshidama
  },
  {
    case: (toot) => rePattern.fortune.test(toot.content),
    reaction: (toot) => fortune(toot, true)
  },
  {
    case: (toot) => /(?:calc|計算|けいさん)[:：](.+)/i.test(toot.content),
    reaction: calc
  },
  {
    case: (toot) => /ポプテピ|ぽぷてぴ/.test(toot.content),
    reaction: (toot) => reply(toot, randomContent.popteamepic())
  },
  {
    case: (toot) => rePattern.oxgame.test(toot.content),
    reaction: (toot) => resetOXGame(toot, null, '✕', true)
  },
  {
    case: (toot) => findCoordinate(toot.content) !== null,
    reaction: (toot) => playOXGame(toot, findCoordinate(toot.content), '◯', true)
  },
  {
    case: (toot) => rePattern.resetgame.test(toot.content),
    reaction: (toot) => resetOXGame(toot, null, '✕', true)
  },
  {
    case: (toot) => rePattern.morning.test(toot.content),
    reaction: (toot) => reply(toot, randomContent.morning())
  },
  {
    case: (toot) => rePattern.evening.test(toot.content),
    reaction: (toot) => reply(toot, randomContent.evening())
  },
  {
    case: (toot) => rePattern.resetgame.test(toot.content),
    reaction: (toot) => resetOXGame(toot, null, '✕', true)
  },
  {
    case: (toot) => rePattern.night.test(toot.content),
    reaction: (toot) => reply(toot, randomContent.night())
  },
  {
    case: (toot) => rePattern.tellcount.test(toot.content),
    reaction: (toot) => tellCount(toot)
  },
  {
    case: (_) => true,
    reaction: reply
  }
]
