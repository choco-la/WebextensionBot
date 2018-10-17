import { IAddon } from './addontypes'
import { basicPublicActions } from './basic/publics'
import { basicReactions } from './basic/reactions'
import { refollow } from './refollow'

export const addon: IAddon = {
  followActions: [
    refollow
  ],
  notificationAction: [],
  publicActions: [
    ...basicPublicActions
  ],
  replyActions: [
    ...basicReactions
  ]
}
