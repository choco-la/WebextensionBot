import { actions } from './bot/action'
import { homeUpdateListener, localUpdateListener, notifictionListener } from './bot/listener'
import { reaction } from './bot/mention'
import { Auth, Configure } from './conf'
import { getParsedToot, tootParser } from './tootparser'
import { INotification, IParsedToot, IStatus } from './types/deftype'

const onFollow = (recv: INotification): void => {
  actions.refollow(recv)
}

const onMention = (recv: INotification): void => {
  reaction(recv)
}

const updateEvents: Array<(toot: IParsedToot) => void> = [
  actions.fortune,
  actions.funny,
  actions.otoshidama
].concat(actions.publicActions)

const onUpdate = (toot: IStatus) => {
  const tootForReply = getParsedToot(toot)
  for (const updateEvent of updateEvents) {
    updateEvent(tootForReply)
  }
}

homeUpdateListener.addEventListener('update', (toot: IStatus): void => {
  // Exclude local user's public toots.
  if (tootParser.hostName(toot.url) === Auth.hostName && toot.visibility === 'public') return
  onUpdate(toot)
})

localUpdateListener.addEventListener('update', onUpdate)
notifictionListener.addEventListener('mention', onMention)
notifictionListener.addEventListener('follow', onFollow)

Configure.admin.push(Configure.owner)
