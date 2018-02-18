import { randomContent } from './botcontents'
import { Auth } from './conf'
import { evalCalc } from './evalcalc'
import { MastodonAPI } from './limitapi'
import { Listener } from './listener'
import { OXGame } from './oxgame/gamestate'
import { findCoordinate } from './oxgame/input'
import { rePattern, sholdWipeTL } from './repattern'
import { filterWords } from './secret'
import { Stream } from './stream'
import { tootParser } from './tootparser'
import { IArgumentToot } from './types/apitype'
import { INotifiation, IStatus } from './types/deftype'
import { Coordinate, Mark } from './types/oxgametype'

// const hostName: string = 'friends.nico'
const hostName: string = Auth.hostName
// const bearerToken: string = 'ACCESS_TOKEN'
const bearerToken: string = Auth.bearerToken.trim()

const target = '12@friends.nico'

// OXGame states.
const oxGameStates: {[key: string]: OXGame} = {}

const API = new MastodonAPI(hostName, bearerToken)
API.setRateLimit(1)
API.setCoolTime(90000)
API.write.visibility = 'public'

const after = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  const match = rePattern.after.exec(content)
  if (!match) return
  const sendData: IArgumentToot = {
    status: `${match[1]}おつ(๑>◡<๑)`,
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 6000)
}

const calc = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  const onInvalid = 'わかんないよぉ〜(｡>﹏<｡)'
  const over = '大きすぎる(∩´﹏`∩)💦'
  const input = /(?:calc|計算|けいさん)[:：](?:\n)*(.+)/i.exec(content)
  if (!input) return

  const url: URL = new URL(toot.account.url)
  const host: string = url.hostname
  const userName: string = toot.account.username

  const expression = input[1].trim()
  const result = evalCalc(expression)
  const sendData: IArgumentToot = {
    in_reply_to_id: toot.id,
    status: '',
    visibility: toot.visibility
  }
  if (isNaN(result)) {
    sendData.status = `@${userName}@${host} ${onInvalid}`
  } else if (result.toString().length > 300) {
    sendData.status = `@${userName}@${host} ${over}`
  } else {
    sendData.status = `@${userName}@${host} ん〜。。。\n${result}かな〜？(๑>◡<๑)`
  }
  setTimeout(() => API.write.toot(sendData), 3000)
}

const fortune = (toot: IStatus, ismention?: boolean): void => {
  const content = tootParser.tootContent(toot.content)
  if (!ismention) {
    if (/@12222222[^a-zA-Z0-9_]/.test(content)) return
    if (!rePattern.fortune.test(content)) return
  }
  const url: URL = new URL(toot.account.url)
  const host: string = url.hostname
  const userName: string = toot.account.username
  const sendData: IArgumentToot = {
    in_reply_to_id: toot.id,
    status: '',
    visibility: toot.visibility
  }
  if (/(?:10|１０|十)(?:回|枚|個|連|かい|まい|こ|れん)/.test(content)) {
    // Draw 10 times.
    let msg = `おみくじぽん♪`
    for (let i = 0; i < 10; i++) {
      if (i % 4 === 0) msg += `\n${randomContent.fortune()}`
      else msg += ` ${randomContent.fortune()}`
    }
    sendData.status = `@${userName}@${host} ${msg}`
  } else {
    const msg = `おみくじぽん♪\n${randomContent.fortune()}で〜す◝(⑅•ᴗ•⑅)◜..°♡`
    sendData.status = `@${userName}@${host} ${msg}`
  }
  setTimeout(() => API.write.toot(sendData), 3000)
}

const funny = (toot: IStatus): void => {
  const screenName = tootParser.screenName(toot.account)
  const content = tootParser.tootContent(toot.content)
  if (screenName !== target) return
  if (!/[wWｗＷ]$/.test(content)) return
  const sendData: IArgumentToot = {
    in_reply_to_id: toot.id,
    status: `@12@friends.nico ${randomContent.funny()}`,
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 3000)
}

const otoshidama = (toot: IStatus, ismention?: boolean): void => {
  const content = tootParser.tootContent(toot.content)
  if (!ismention) {
    if (/@12222222[^a-zA-Z0-9_]/.test(content)) return
    if (!rePattern.otoshidama.test(content)) return
  }
  const url: URL = new URL(toot.account.url)
  const host: string = url.hostname
  const userName: string = toot.account.username
  const msg = `お年玉どうぞっ(๑•̀ㅁ•́๑)✧\nっ[${randomContent.otoshidama()}]`
  const sendData: IArgumentToot = {
    in_reply_to_id: toot.id,
    status: `@${userName}@${host} ${msg}`,
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 3000)
}

const reply = (toot: IStatus, text?: string): void => {
  const url: URL = new URL(toot.account.url)
  const host: string = url.hostname
  const userName: string = toot.account.username
  const msg: string = text ? text : randomContent.reply()
  setTimeout(() => API.write.favourite(toot.id), 2000)
  const sendData: IArgumentToot = {
    in_reply_to_id: toot.id,
    status: `@${userName}@${host} ${msg}`,
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 3000)
}

const sm9 = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  if (!/sm9(?:[^0-9]|$)/.test(content)) return
  const sendData: IArgumentToot = {
    status: randomContent.sm9(),
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 6000)
}

const favUyu = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  if (!/[ぅう][ゅゆ]/.test(content)) return
  setTimeout(() => API.write.favourite(toot.id), 2000)
}

const wipeTL = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  if (!sholdWipeTL(content)) return
  const sendData: IArgumentToot = {
    status: 'ふきふき',
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 6000)
}

const playOXGame = (toot: IStatus, oxCoordinate: Coordinate | null, mark: Mark, ismention?: boolean): void => {
  const url: URL = new URL(toot.account.url)
  const host: string = url.hostname
  const userName: string = toot.account.username
  const nameKey = `${userName}@${host}`

  // Setup
  if (!oxGameStates[nameKey]) {
    const newGame = new OXGame(mark)
    oxGameStates[nameKey] = newGame
  }

  const state = oxGameStates[nameKey]
  let result = null
  if (oxCoordinate) result = state.move(oxCoordinate)
  else result = state.initMove()
  const nowState = state.stateView()
  if (result === '◯' || result === '✕' || result === 'draw') {
    delete oxGameStates[nameKey]
  } else if (result === 'invalid') {
    const invalid = 'そこゎ置けないょ(∩´﹏`∩)💦'
    const sendDataOnInvalid: IArgumentToot = {
      status: `@${userName}@${host} ${invalid}`,
      visibility: toot.visibility
    }
    if (ismention) sendDataOnInvalid.in_reply_to_id = toot.id
    setTimeout(() => API.write.toot(sendData), 3000)
    return
  }

  const playerMark = state.player
  const botMark = state.bot

  let prefixMsg = ''
  switch (result) {
    // Player wins.
    case playerMark:
      prefixMsg = randomContent.oxGameYouWin()
      break
    case botMark:
      prefixMsg = randomContent.oxGameYouLose()
      break
    case null:
      prefixMsg = randomContent.oxGameThinking()
      break
    case 'draw':
      prefixMsg = '引き分けだね〜(๑>◡<๑)'
      break
  }

  const stateMsg = `あなた: ${playerMark} ぅゅ: ${botMark}`
  const msg = `${prefixMsg}\n${nowState}\n${stateMsg}`
  const sendData: IArgumentToot = {
    status: `@${userName}@${host} ${msg}`,
    visibility: toot.visibility
  }
  if (ismention) sendData.in_reply_to_id = toot.id
  setTimeout(() => API.write.toot(sendData), 3000)
}

const close = (toot: IStatus): void => {
  reply(toot, '終わります(๑•᎑•๑)♬*')
  ltl.close()
  notification.close()
}

const onFollow = (recv: INotifiation): void => {
  const account = recv.account.id
  API.read.relationships([account])
  .then((relationships) => {
    const isFollowing: boolean = relationships[0].following
    const id = relationships[0].id
    if (isFollowing) return
    API.follow.follow(id)
    .then(() => console.log(`follow: ${id}`))
    .catch((err) => console.error(err))
  })
  .catch((err) => console.error(err))
}

const onMention = (recv: INotifiation): void => {
  const toot = recv.status
  const content = tootParser.tootContent(toot.content)
  const admin = /^(?:12|friends_nico|mei23|sisyo)$/
  if (admin.test(toot.account.username) && rePattern.close.test(content)) close(toot)

  const oxCoordinate = findCoordinate(content)

  if (rePattern.kiss.test(content)) return reply(toot, randomContent.kiss())
  else if (rePattern.otoshidama.test(content)) return otoshidama(toot, true)
  else if (rePattern.fortune.test(content)) return fortune(toot, true)
  else if (/(?:calc|計算|けいさん)[:：](.+)/i.test(content)) return calc(toot)
  else if (/ポプテピ|ぽぷてぴ/.test(content)) return reply(toot, randomContent.popteamepic())
  else if (rePattern.oxgame.test(content)) playOXGame(toot, null, '✕', true)
  else if (oxCoordinate) return playOXGame(toot, oxCoordinate, '◯', true)
  else return reply(toot)
}

const updateListener = new Listener()
updateListener.addEventListener('update', after)
updateListener.addEventListener('update', favUyu)
updateListener.addEventListener('update', fortune)
updateListener.addEventListener('update', funny)
updateListener.addEventListener('update', otoshidama)
updateListener.addEventListener('update', sm9)
updateListener.addEventListener('update', wipeTL)

const ltl = new Stream(hostName, bearerToken)
ltl.local()
ltl.addListener('open', () => console.log('opened ltl'))
ltl.addListener('close', () => console.log('closed ltl'))
ltl.listener = updateListener

const notifictionListener = new Listener()
notifictionListener.addEventListener('mention', onMention)
notifictionListener.addEventListener('follow', onFollow)

const notification = new Stream(hostName, bearerToken)
notification.notification()
notification.addListener('open', () => console.log('opened notification'))
notification.addListener('close', () => console.log('closed notification'))
notification.listener = notifictionListener

// Ignore self.
API.read.verifyCredentials()
.then((account) => {
  const me = tootParser.screenName(account)
  updateListener.mute('screenname', me)
  notifictionListener.mute('screenname', me)
})

updateListener.mute('application', 'mastbot')
notifictionListener.mute('application', 'mastbot')

for (const filterWord of filterWords) {
  updateListener.mute('content', filterWord)
  notifictionListener.mute('content', filterWord)
}
