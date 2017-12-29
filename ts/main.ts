import { MastodonAPI } from './api'
import { randomContent } from './botcontents'
import { Auth } from './conf'
import { ITootJSON } from './deftypes'
import { Listener } from './listener'
import { rePattern } from './repattern'
import { Stream } from './stream'

// const hostName: string = 'friends.nico'
const hostName: string = Auth.hostName
// const bearerToken: string = 'ACCESS_TOKEN'
const bearerToken: string = Auth.bearerToken.trim()

const API = new MastodonAPI(hostName, bearerToken)
API.setRateLimit()
API.visibility = 'public'

const funny = (toot: ITootJSON): void => {
  setTimeout(() => API.toot(`@12@friends.nico ${randomContent.funny()}`, toot.id), 1000)
}
const cute = (): void => {
  setTimeout(API.toot(randomContent.cute()), 3000)
}
const wakaru = (): void => {
  setTimeout(() => API.toot(randomContent.understand()), 3000)
}
const reply = (toot: ITootJSON, text?: string): void => {
  const url: URL = new URL(toot.account.url)
  const host: string = url.hostname
  const userName: string = toot.account.username
  const msg: string = text ? text : randomContent.reply()
  setTimeout(() => API.favourite(toot.id), 2000)
  setTimeout(() => API.toot(`@${userName}@${host} ${msg}`, toot.id), 3000)
}
const close = (toot: ITootJSON): void => {
  if (!/^(?:12|friends_nico|mei23)$/.test(toot.account.username)) return
  reply(toot, '終わります(๑•᎑•๑)♬*')
  ltl.close()
  notification.close()
}

const target = '12@friends.nico'

const listener = new Listener()
listener.addUpdateListener(/[wWｗＷ]$/, funny, target)
listener.addUpdateListener(/ぉんなのこ/, cute, target)
listener.addUpdateListener(/^わかる$/, wakaru)
listener.addMentionListener(rePattern.kiss, (toot) => reply(toot, randomContent.kiss()))
listener.addMentionListener(/./, reply)
listener.addMentionListener(rePattern.close, close)

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
