import { MastodonAPI } from './api'
import { randomContent } from './botcontents'
import { Auth } from './conf'
import { INotifiation, IStatus } from './deftypes'
import { evalCalc } from './evalcalc'
import { Listener } from './listener'
import { rePattern, sholdWipeTL } from './repattern'
import { Stream } from './stream'
import { tootParser } from './tootparser'

// const hostName: string = 'friends.nico'
const hostName: string = Auth.hostName
// const bearerToken: string = 'ACCESS_TOKEN'
const bearerToken: string = Auth.bearerToken.trim()

const target = '12@friends.nico'

const API = new MastodonAPI(hostName, bearerToken)
API.setRateLimit(1)
API.setCoolTime(90000)
API.visibility = 'public'

const after = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  const match = rePattern.after.exec(content)
  if (!match) return
  setTimeout(() => API.toot(`${match[1]}おつ(๑>◡<๑)`, toot.visibility), 6000)
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
  if (isNaN(result)) {
    setTimeout(() => API.toot(`@${userName}@${host} ${onInvalid}`, toot.visibility, toot.id), 3000)
  } else if (result.toString().length > 300) {
    setTimeout(() => API.toot(`@${userName}@${host} ${over}`, toot.visibility, toot.id), 3000)
  } else {
    setTimeout(() => API.toot(`@${userName}@${host} ん〜。。。\n${result}かな〜？(๑>◡<๑)`, toot.visibility, toot.id), 3000)
  }
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
  if (/(?:10|１０|十)(?:回|枚|個|連|かい|まい|こ|れん)/.test(content)) {
    // Draw 10 times.
    let msg = `おみくじぽん♪`
    for (let i = 0; i < 10; i++) {
      if (i % 4 === 0) msg += `\n${randomContent.fortune()}`
      else msg += ` ${randomContent.fortune()}`
    }
    setTimeout(() => API.toot(`@${userName}@${host} ${msg}`, toot.visibility, toot.id), 3000)
  } else {
    const msg = `おみくじぽん♪\n${randomContent.fortune()}で〜す◝(⑅•ᴗ•⑅)◜..°♡`
    setTimeout(() => API.toot(`@${userName}@${host} ${msg}`, toot.visibility, toot.id), 3000)
  }
}

const funny = (toot: IStatus): void => {
  const screenName = tootParser.screenName(toot.account)
  const content = tootParser.tootContent(toot.content)
  if (screenName !== target) return
  if (!/[wWｗＷ]$/.test(content)) return
  setTimeout(() => API.toot(`@12@friends.nico ${randomContent.funny()}`, toot.visibility, toot.id), 3000)
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
  setTimeout(() => API.toot(`@${userName}@${host} ${msg}`, toot.visibility, toot.id), 3000)
}

const reply = (toot: IStatus, text?: string): void => {
  const url: URL = new URL(toot.account.url)
  const host: string = url.hostname
  const userName: string = toot.account.username
  const msg: string = text ? text : randomContent.reply()
  setTimeout(() => API.favourite(toot.id), 2000)
  setTimeout(() => API.toot(`@${userName}@${host} ${msg}`, toot.visibility, toot.id), 3000)
}

const sm9 = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  if (!/sm9(?:[^0-9]|$)/.test(content)) return
  setTimeout(() => API.toot(randomContent.sm9(), toot.visibility), 6000)
}

const favUyu = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  if (!/[ぅう][ゅゆ]/.test(content)) return
  setTimeout(() => API.favourite(toot.id), 2000)
}

const wipeTL = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  if (!sholdWipeTL(content)) return
  setTimeout(() => API.toot('ふきふき', toot.visibility), 6000)
}

const close = (toot: IStatus): void => {
  reply(toot, '終わります(๑•᎑•๑)♬*')
  ltl.close()
  notification.close()
}

const onFollow = (recv: INotifiation): void => {
  const account = recv.account.id
  API.relationships([account])
  .then((relationships) => {
    const isFollowing: boolean = relationships[0].following
    const id = relationships[0].id
    if (isFollowing) return
    API.follow(id)
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

  if (rePattern.kiss.test(content)) return reply(toot, randomContent.kiss())
  else if (rePattern.otoshidama.test(content)) return otoshidama(toot, true)
  else if (rePattern.fortune.test(content)) return fortune(toot, true)
  else if (/(?:calc|計算|けいさん)[:：](.+)/i.test(content)) return calc(toot)
  else if (/ポプテピ|ぽぷてぴ/.test(content)) return reply(toot, randomContent.popteamepic())
  else return reply(toot)
}

const listener = new Listener()
listener.addUpdateListener(after)
listener.addUpdateListener(favUyu)
listener.addUpdateListener(fortune)
listener.addUpdateListener(funny)
listener.addUpdateListener(otoshidama)
listener.addUpdateListener(sm9)
listener.addUpdateListener(wipeTL)
listener.addNotificationListener('mention', onMention)
listener.addNotificationListener('follow', onFollow)

const ltl = new Stream(hostName, bearerToken)
ltl.local()
ltl.addEventListener('open', () => console.log('opened ltl'))
ltl.addEventListener('close', () => console.log('closed ltl'))
ltl.listener = listener

const notification = new Stream(hostName, bearerToken)
notification.notification()
notification.addEventListener('open', () => console.log('opened notification'))
notification.addEventListener('close', () => console.log('closed notification'))
notification.listener = listener
