import { MastodonAPI } from './api'
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

const laugh = (toot: ITootJSON): void => API.toot('@12@friends.nico ひょろわ〜ちゃん面白い💕', toot.id)
const cute = (): void => API.toot('ひょろわ〜ちゃんかわいい💕')
const wakaru = (): void => API.toot('わかる〜(ㅅ´ ˘ `)♡')
const reply = (toot: ITootJSON): void => {
  const url: URL = new URL(toot.account.url)
  const host: string = url.hostname
  const userName: string = toot.account.username
  API.favourite(toot.id)
  API.toot(`@${userName}@${host} ちゅ♡`, toot.id)
}
const close = (toot: ITootJSON): void => {
  if (!/12|friends_nico|mei23/.test(toot.account.username)) return
  stream.close()
}

const target = '12@friends.nico'

const listener = new Listener()
listener.addUpdateListener(/[wWｗＷ]$/, laugh, target)
listener.addUpdateListener(/ぉんなのこ/, cute, target)
listener.addUpdateListener(/^わかる$/, wakaru)
listener.addMentionListener(/./, reply)
listener.addMentionListener(/[終お](?:わり|しまい)|シャットダウン|しゃっとだうん|close|shutdown/i, close)

const stream = new Stream(hostName, bearerToken)
stream.home()
// stream.local()
stream.addEventListener('open', () => console.log('opened'))
stream.addEventListener('close', () => console.log('closed'))
stream.listener = listener
