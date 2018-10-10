import { addon } from '../../addons/index'
import { randomContent } from '../../botcontents'
import { rePattern, sholdWipeTL } from '../../filter/repattern'
import { IArgumentToot } from '../../types/apitype'
import { IParsedToot } from '../../types/deftype'
import { API } from '../api'

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

export const publicActions = [
  after,
  sm9,
  favUyu,
  wipeTL,
  mokyu,
  ...addon.publicActions
]
