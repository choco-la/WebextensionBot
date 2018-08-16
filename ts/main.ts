import { FriendsNicoAPI } from './api/instance/friends.nico'
import { randomContent } from './botcontents'
import { Auth, Configure } from './conf'
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

const bot = {
  // username@example.com
  ID: '',
  username: ''
}

interface IParsedToot {
  account: string
  content: IStatus['content']
  id: IStatus['id']
  visibility: IStatus['visibility']
}

// const hostName: string = 'friends.nico'
const hostName: string = Auth.hostName
// const bearerToken: string = 'ACCESS_TOKEN'
const bearerToken: string = Auth.bearerToken.trim()

// OXGame states.
const oxGameStates: {[key: string]: OXGame} = {}

const API = new MastodonAPI(hostName, bearerToken)
API.setRateLimit(1, 12)
API.setCoolTime(90000)
API.write.visibility = 'public'

const getParsedToot = (toot: IStatus): IParsedToot => ({
  account: tootParser.screenName(toot.account),
  content: tootParser.tootContent(toot.content),
  id: toot.id,
  visibility: toot.visibility
})

const after = (toot: IParsedToot): void => {
  const match = rePattern.after.exec(toot.content)
  if (!match) return
  const sendData: IArgumentToot = {
    status: `${match[1]}おつ(๑>◡<๑)`,
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 6000)
}

const calc = (toot: IParsedToot): void => {
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

const fortune = (toot: IParsedToot, ismention?: boolean): void => {
  if (!ismention) {
    const pattern = String.raw`@${bot.username}[^a-zA-Z0-9_]`
    const re = new RegExp(pattern)
    if (re.test(toot.content)) return
    if (!rePattern.fortune.test(toot.content)) return
  }
  const sendData: IArgumentToot = {
    in_reply_to_id: toot.id,
    status: '',
    visibility: toot.visibility
  }
  if (/(?:10|１０|十)(?:回|枚|個|連|かい|まい|こ|れん)/.test(toot.content)) {
    // Draw 10 times.
    let msg = `おみくじぽん♪`
    for (let i = 0; i < 10; i++) {
      if (i % 4 === 0) msg += `\n${randomContent.fortune()}`
      else msg += ` ${randomContent.fortune()}`
    }
    sendData.status = `@${toot.account} ${msg}`
  } else {
    const msg = `おみくじぽん♪\n${randomContent.fortune()}で〜す◝(⑅•ᴗ•⑅)◜..°♡`
    sendData.status = `@${toot.account} ${msg}`
  }
  setTimeout(() => API.write.toot(sendData), 3000)
}

const funny = (toot: IParsedToot): void => {
  if (toot.account !== Configure.owner) return
  if (!/[wWｗＷ]$/.test(toot.content)) return
  const sendData: IArgumentToot = {
    in_reply_to_id: toot.id,
    status: `@12@friends.nico ${randomContent.funny()}`,
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 3000)
}

const otoshidama = (toot: IParsedToot, ismention?: boolean): void => {
  if (!ismention) {
    const pattern = String.raw`@${bot.username}[^a-zA-Z0-9_]`
    const re = new RegExp(pattern)
    if (re.test(toot.content)) return
    if (!rePattern.otoshidama.test(toot.content)) return
  }
  const msg = `お年玉どうぞっ(๑•̀ㅁ•́๑)✧\nっ[${randomContent.otoshidama()}]`
  const sendData: IArgumentToot = {
    in_reply_to_id: toot.id,
    status: `@${toot.account} ${msg}`,
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 3000)
}

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

const playOXGame = (toot: IParsedToot, oxCoordinate: Coordinate | null, mark: Mark, ismention?: boolean): void => {
  // Setup
  if (!oxGameStates[toot.account]) {
    const newGame = new OXGame(mark)
    oxGameStates[toot.account] = newGame
  }

  const state = oxGameStates[toot.account]
  let result = null
  if (oxCoordinate) result = state.move(oxCoordinate)
  else result = state.initMove()
  const nowState = state.stateView()
  if (result === '◯' || result === '✕' || result === 'draw') {
    delete oxGameStates[toot.account]
  } else if (result === 'invalid') {
    const invalid = 'そこゎ置けないょ(∩´﹏`∩)💦'
    const sendDataOnInvalid: IArgumentToot = {
      status: `@${toot.account} ${invalid}`,
      visibility: toot.visibility
    }
    if (ismention) sendDataOnInvalid.in_reply_to_id = toot.id
    setTimeout(() => API.write.toot(sendDataOnInvalid), 3000)
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

  const msg = `${prefixMsg}\n${nowState}`
  const sendData: IArgumentToot = {
    spoiler_text: `あなた: ${playerMark} ぅゅ: ${botMark}`,
    status: `@${toot.account} ${msg}`,
    visibility: toot.visibility
  }
  if (ismention) sendData.in_reply_to_id = toot.id
  setTimeout(() => API.write.toot(sendData), 3000)
}

const resetOXGame = (toot: IParsedToot, oxCoordinate: Coordinate | null, mark: Mark, ismention?: boolean): void => {
  const newGame = new OXGame(mark)
  oxGameStates[toot.account] = newGame

  playOXGame(toot, oxCoordinate, mark, ismention)
}

const close = (toot: IParsedToot): void => {
  reply(toot, '終わります(๑•᎑•๑)♬*')
  streams.map((stream) => stream.close())
}

const mokyu = (toot: IParsedToot): void => {
  if (!/\(\*[´]ω[｀`]\*\)/.test(toot.content)) return
  const sendData: IArgumentToot = {
    status: '(*´ω｀*)ﾓｷｭ',
    visibility: toot.visibility
  }
  setTimeout(() => API.write.toot(sendData), 6000)
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

  const tootForReply = getParsedToot(toot)
  const content = tootForReply.content

  if (Configure.admin.indexOf(tootForReply.account) > -1 && rePattern.close.test(content)) {
    close(tootForReply)
    return
  }

  const oxCoordinate = findCoordinate(content)

  if (rePattern.kiss.test(content)) return reply(tootForReply, randomContent.kiss())
  else if (rePattern.otoshidama.test(content)) return otoshidama(tootForReply, true)
  else if (rePattern.fortune.test(content)) return fortune(tootForReply, true)
  else if (/(?:calc|計算|けいさん)[:：](.+)/i.test(content)) return calc(tootForReply)
  else if (/ポプテピ|ぽぷてぴ/.test(content)) return reply(tootForReply, randomContent.popteamepic())
  else if (rePattern.oxgame.test(content)) return playOXGame(tootForReply, null, '✕', true)
  else if (oxCoordinate) return playOXGame(tootForReply, oxCoordinate, '◯', true)
  else if (rePattern.resetgame.test(content)) return resetOXGame(tootForReply, null, '✕', true)
  else if (rePattern.morning.test(content)) return reply(tootForReply, randomContent.morning())
  else if (rePattern.evening.test(content)) return reply(tootForReply, randomContent.evening())
  else if (rePattern.night.test(content)) return reply(tootForReply, randomContent.night())

  if (tootParser.screenName(recv.account) === Configure.owner) {
    const pattern = String.raw`^(?:@${bot.username}[^a-zA-Z0-9_]+)?(?:\n)*(?:enquete|あんけ(?:ーと)?|アンケ(?:ート)?)[:：]`
    const re = new RegExp(pattern, 'i')
    if (re.test(content)) return enquete(content)
  }

  return reply(tootForReply)
}

const nicofreAPI = new FriendsNicoAPI(hostName, bearerToken)
nicofreAPI.visibility = 'public'
const enquete = (status: string): void => {
  const questionPart = /(.+)[?？](.+)[:：](.+)/.exec(status)
  if (questionPart === null) return
  const sendEnquete = {
    enquete_items: questionPart.slice(2, 4),
    isEnquete: true,
    status: questionPart[1]
  }
  nicofreAPI.takeInstantEnquete(sendEnquete)
}

const updateEvents: Array<(toot: IParsedToot) => void> = [
  after,
  favUyu,
  fortune,
  funny,
  otoshidama,
  sm9,
  wipeTL,
  mokyu
]

const onUpdate = (toot: IStatus) => {
  const tootForReply = getParsedToot(toot)
  for (const updateEvent of updateEvents) {
    updateEvent(tootForReply)
  }
}

const homeUpdateListener = new Listener()
homeUpdateListener.addEventListener('update', (toot: IStatus): void => {
  // Exclude local user's public toots.
  if (tootParser.hostName(toot.url) === hostName && toot.visibility === 'public') return
  onUpdate(toot)
})

const home = new Stream(hostName, bearerToken)
home.home()
home.addListener('open', () => console.log('opened home'))
home.addListener('close', () => console.log('closed home'))
home.listener = homeUpdateListener

const localUpdateListener = new Listener()
localUpdateListener.addEventListener('update', onUpdate)

const ltl = new Stream(hostName, bearerToken)
ltl.local()
ltl.addListener('open', () => console.log('opened ltl'))
ltl.addListener('close', () => console.log('closed ltl'))
ltl.listener = localUpdateListener

const notifictionListener = new Listener()
notifictionListener.addEventListener('mention', onMention)
notifictionListener.addEventListener('follow', onFollow)

const notification = new Stream(hostName, bearerToken)
notification.notification()
notification.addListener('open', () => console.log('opened notification'))
notification.addListener('close', () => console.log('closed notification'))
notification.listener = notifictionListener

const streams = [
  home,
  ltl,
  notification
]

const listeners = [
  localUpdateListener,
  homeUpdateListener,
  notifictionListener
]

// Ignore self.
API.read.verifyCredentials()
.then((account) => {
  bot.ID = tootParser.screenName(account)
  bot.username = account.username

  listeners.map((listener) => listener.mute('screenname', bot.ID))
})

listeners.map((listener) => listener.mute('application', 'mastbot'))

const joinedFilterWords = filterWords.join('|')
listeners.map((listener) => listener.mute('content', joinedFilterWords))

Configure.admin.push(Configure.owner)
