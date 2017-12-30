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

const reply = (recv: INotifiation, text?: string): void => {
  const toot = recv.status
  const url: URL = new URL(toot.account.url)
  const host: string = url.hostname
  const userName: string = toot.account.username
  const msg: string = text ? text : randomContent.reply()
  setTimeout(() => API.favourite(toot.id), 2000)
  setTimeout(() => API.toot(`@${userName}@${host} ${msg}`, toot.id, toot.visibility), 3000)
}

const favUyu = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  if (!/[ぅう][ゅゆ]/.test(content)) return
  setTimeout(() => API.favourite(toot.id), 2000)
}

const wipeTL = (toot: IStatus): void => {
  const content = tootParser.tootContent(toot.content)
  if (!/ﾌﾞﾘ/.test(content)) return
  setTimeout(() => API.toot('ふきふき'), 3000)
}

const close = (recv: INotifiation): void => {
  const toot = recv.status
  const content = tootParser.tootContent(toot.content)
  if (!rePattern.close.test(content)) return
  if (!/^(?:12|friends_nico|mei23)$/.test(toot.account.username)) return
  reply(recv, '終わります(๑•᎑•๑)♬*')
  ltl.close()
  notification.close()
}

const kiss = (recv: INotifiation): void => {
  const toot = recv.status
  const content = tootParser.tootContent(toot.content)
  if (!rePattern.kiss.test(content)) return
  reply(recv, randomContent.kiss())
}

const listener = new Listener()
listener.addUpdateFilter(cheerUp)
listener.addUpdateFilter(cute)
listener.addUpdateFilter(favUyu)
listener.addUpdateFilter(funny)
listener.addUpdateFilter(wakaru)
listener.addUpdateFilter(wipeTL)
listener.addNotificationListener('mention', close)
listener.addNotificationListener('mention', kiss)
listener.addNotificationListener('mention', reply)

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
