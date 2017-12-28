import { MastodonAPI } from './api'
import { randomContent } from './botcontents'
import { Auth } from './conf'
import { ITootJSON } from './deftypes'
import { Listener } from './listener'
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
  setTimeout(API.toot(randomContent.cute()), 1000)
}
const wakaru = (): void => {
  setTimeout(() => API.toot(randomContent.understand()), 1000)
}
const reply = (toot: ITootJSON): void => {
  const url: URL = new URL(toot.account.url)
  const host: string = url.hostname
  const userName: string = toot.account.username
  setTimeout(() => API.favourite(toot.id), 2000)
  setTimeout(() => API.toot(`@${userName}@${host} ${randomContent.reply()}`, toot.id), 3000)
}
const close = (toot: ITootJSON): void => {
  if (!/12|friends_nico|mei23/.test(toot.account.username)) return
  stream.close()
}

const target = '12@friends.nico'

const listener = new Listener()
listener.addUpdateListener(/[wWｗＷ]$/, funny, target)
listener.addUpdateListener(/ぉんなのこ/, cute, target)
listener.addUpdateListener(/^わかる$/, wakaru)
listener.addMentionListener(/./, reply)
listener.addMentionListener(/[終お](?:わり|しまい)|シャットダウン|しゃっとだうん|close|shutdown/i, close)

const stream = new Stream(hostName, bearerToken)
stream.notification()
stream.local()
stream.addEventListener('open', () => console.log('opened'))
stream.addEventListener('close', () => console.log('closed'))
stream.listener = listener
