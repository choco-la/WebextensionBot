import { MastodonAPI } from './api'
import { randomContent } from './botcontents'
import { Auth } from './conf'
import { INotifiation, IStatus } from './deftypes'
import { Listener } from './listener'
import { rePattern } from './repattern'
import { Stream } from './stream'
import { tootParser } from './tootparser'

// const hostName: string = 'friends.nico'
const hostName: string = Auth.hostName
// const bearerToken: string = 'ACCESS_TOKEN'
const bearerToken: string = Auth.bearerToken.trim()

const target = '12@friends.nico'

const API = new MastodonAPI(hostName, bearerToken)
API.setRateLimit()
API.setCoolTime(3000)
API.visibility = 'public'

const after = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  const match = rePattern.after.exec(content)
  if (!match) return
  setTimeout(() => API.toot(`${match[1]}おつ(๑>◡<๑)`), 3000)
}

const cheerUp = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  if (!/辛い|つらい/.test(content)) return
  setTimeout(() => API.toot(randomContent.cheerUp()), 3000)
}

const cute = (toot: IStatus): void => {
  const screenName = tootParser.screenName(toot.account)
  const content = tootParser.tootContent(toot.content)
  if (screenName !== target) return
  if (!/ぉんなのこ/.test(content)) return
  setTimeout(() => API.toot(randomContent.cute()), 3000)
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
  const msg = `おみくじぽん♪\n${randomContent.fortune()}で〜す◝(⑅•ᴗ•⑅)◜..°♡`
  setTimeout(() => API.toot(`@${userName}@${host} ${msg}`, toot.id, toot.visibility), 3000)
}

const funny = (toot: IStatus): void => {
  const screenName = tootParser.screenName(toot.account)
  const content = tootParser.tootContent(toot.content)
  if (screenName !== target) return
  if (!/[wWｗＷ]$/.test(content)) return
  setTimeout(() => API.toot(`@12@friends.nico ${randomContent.funny()}`, toot.id), 1000)
}

const wakaru = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  if (!/^わかる$/.test(content)) return
  setTimeout(() => API.toot(randomContent.understand()), 3000)
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
  setTimeout(() => API.toot(`@${userName}@${host} ${msg}`, toot.id, toot.visibility), 3000)
}

const reply = (toot: IStatus, text?: string): void => {
  const url: URL = new URL(toot.account.url)
  const host: string = url.hostname
  const userName: string = toot.account.username
  const msg: string = text ? text : randomContent.reply()
  setTimeout(() => API.favourite(toot.id), 2000)
  setTimeout(() => API.toot(`@${userName}@${host} ${msg}`, toot.id, toot.visibility), 3000)
}

const sm9 = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  if (!/sm9/.test(content)) return
  setTimeout(() => API.toot(randomContent.sm9()), 3000)
}

const favUyu = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  if (!/[ぅう][ゅゆ]/.test(content)) return
  setTimeout(() => API.favourite(toot.id), 2000)
}

const wipeTL = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  if (!/(?:[ｱ-ﾝ]ﾞ?[ｱ-ﾝ]ﾞ?){3,}.*[!！]|ﾌﾞﾘ/.test(content)) return
  setTimeout(() => API.toot('ふきふき'), 3000)
}

const close = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  if (!rePattern.close.test(content)) return
  if (!/^(?:12|friends_nico|mei23|sisyo)$/.test(toot.account.username)) return
  reply(toot, '終わります(๑•᎑•๑)♬*')
  ltl.close()
  notification.close()
}

const onMention = (recv: INotifiation): void => {
  const toot = recv.status
  const content = tootParser.tootContent(toot.content)
  if (/^(?:12|friends_nico|mei23|sisyo)$/.test(toot.account.username)) close(toot)

  if (rePattern.kiss.test(content)) return reply(toot, randomContent.kiss())
  else if (rePattern.otoshidama.test(content)) return otoshidama(toot, true)
  else if (rePattern.fortune.test(content)) return fortune(toot, true)
  else return reply(toot)
}

const listener = new Listener()
listener.addUpdateFilter(after)
listener.addUpdateFilter(cheerUp)
listener.addUpdateFilter(cute)
listener.addUpdateFilter(favUyu)
listener.addUpdateFilter(fortune)
listener.addUpdateFilter(funny)
listener.addUpdateFilter(otoshidama)
listener.addUpdateFilter(sm9)
listener.addUpdateFilter(wakaru)
listener.addUpdateFilter(wipeTL)
listener.addNotificationListener('mention', onMention)

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
