import { Listener } from './api/stream/listener'
import { Stream } from './api/stream/stream'
import { API } from './bot/api'
import { playOXGame, resetOXGame } from './bot/oxgame'
import { publicActions } from './bot/public'
import { randomContent } from './botcontents'
import { Auth, Configure } from './conf'
import { evalCalc } from './evalcalc'
import { rePattern } from './filter/repattern'
import { filterWords } from './filter/secret'
import { findCoordinate } from './oxgame/input'
import { tootParser } from './tootparser'
import { IArgumentToot } from './types/apitype'
import { INotification, IParsedToot, IStatus } from './types/deftype'

const bot = {
  // username@example.com
  ID: '',
  username: ''
}

const getParsedToot = (toot: IStatus): IParsedToot => ({
  account: tootParser.screenName(toot.account),
  content: tootParser.tootContent(toot.content),
  id: toot.id,
  visibility: toot.visibility
})

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

const close = (toot: IParsedToot): void => {
  reply(toot, '終わります(๑•᎑•๑)♬*')
  streams.map((stream) => stream.close())
}

const onFollow = (recv: INotification): void => {
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

const onMention = (recv: INotification): void => {
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
  else if (rePattern.oxgame.test(content)) return resetOXGame(tootForReply, null, '✕', true)
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

const enquete = (status: string): void => {
  const questionPart = /(.+)[?？](.+)[:：](.+)/.exec(status)
  if (questionPart === null) return
  const sendEnquete = {
    enquete_items: questionPart.slice(2, 4),
    isEnquete: true,
    status: questionPart[1]
  }
  API.write.takeInstantEnquete(sendEnquete)
}

const updateEvents: Array<(toot: IParsedToot) => void> = [
  fortune,
  funny,
  otoshidama
].concat(publicActions)

const onUpdate = (toot: IStatus) => {
  const tootForReply = getParsedToot(toot)
  for (const updateEvent of updateEvents) {
    updateEvent(tootForReply)
  }
}

const homeUpdateListener = new Listener()
homeUpdateListener.addEventListener('update', (toot: IStatus): void => {
  // Exclude local user's public toots.
  if (tootParser.hostName(toot.url) === Auth.hostName && toot.visibility === 'public') return
  onUpdate(toot)
})

const home = new Stream(Auth.hostName, Auth.bearerToken, 'home')
home.addListener('open', () => console.log('opened home'))
home.addListener('close', () => console.log('closed home'))
home.listener = homeUpdateListener

const localUpdateListener = new Listener()
localUpdateListener.addEventListener('update', onUpdate)

const ltl = new Stream(Auth.hostName, Auth.bearerToken, 'local')
ltl.addListener('open', () => console.log('opened ltl'))
ltl.addListener('close', () => console.log('closed ltl'))
ltl.listener = localUpdateListener

const notifictionListener = new Listener()
notifictionListener.addEventListener('mention', onMention)
notifictionListener.addEventListener('follow', onFollow)

const notification = new Stream(Auth.hostName, Auth.bearerToken, 'notification')
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
listeners.map((listener) => listener.filterBot(true))

Configure.admin.push(Configure.owner)
