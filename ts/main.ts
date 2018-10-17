import { addon } from './addons'
import { homeUpdateListener, localUpdateListener, notifictionListener } from './bot/listener'
import { Auth, Configure } from './conf'
import { getParsedToot, tootParser } from './tootparser'
import { INotification, IStatus } from './types/deftype'

const onFollow = (recv: INotification): void => {
  for (const followAction of addon.followActions) {
    followAction(recv)
  }
}

const onMention = (recv: INotification): void => {
  const toot = getParsedToot(recv.status)
  for (const replyAction of addon.replyActions) {
    if (!replyAction.case(toot)) continue
    replyAction.reaction(toot)
    if (!replyAction.isContinue) return
  }
}

const onUpdate = (toot: IStatus) => {
  const tootForReply = getParsedToot(toot)
  for (const publicAction of addon.publicActions) {
    publicAction(tootForReply)
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
