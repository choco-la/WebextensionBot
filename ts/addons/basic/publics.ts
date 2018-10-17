import { API } from '../../bot/api'
import { randomContent } from '../../bot/botcontents'
import { rePattern, sholdWipeTL } from '../../filter/repattern'
import { IArgumentToot } from '../../types/apitype'
import { IParsedToot } from '../../types/deftype'
import { fortune } from '../fortune'
import { otoshidama } from '../otoshidama'
import { funny } from '../praise'

const after = (toot: IParsedToot): void => {
  const match = rePattern.after.exec(toot.content)
  if (!match) return
  const sendData: IArgumentToot = {
    status: `${match[1]}おつ(๑>◡<๑)`,
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 6000)
}

const sm9 = (toot: IParsedToot): void => {
  if (!/sm9(?:[^0-9]|$)/.test(toot.content)) return
  const sendData: IArgumentToot = {
    status: randomContent.sm9(),
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 6000)
}

const favUyu = (toot: IParsedToot): void => {
  if (!/[ぅう][ゅゆ]/.test(toot.content)) return
  setTimeout(() => API.write.favourite(toot.id), 2000)
}

const wipeTL = (toot: IParsedToot): void => {
  if (!sholdWipeTL(toot.content)) return
  const sendData: IArgumentToot = {
    status: 'ふきふき',
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 6000)
}

const mokyu = (toot: IParsedToot): void => {
  if (!/\(\*[´]ω[｀`]\*\)/.test(toot.content)) return
  const sendData: IArgumentToot = {
    status: '(*´ω｀*)ﾓｷｭ',
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 6000)
}

export const basicPublicActions = [
  after,
  favUyu,
  fortune,
  funny,
  mokyu,
  otoshidama,
  sm9,
  wipeTL
]
