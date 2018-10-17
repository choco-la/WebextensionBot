import { INotification, IParsedToot } from '../types/deftype'

export type Action = (toot: IParsedToot) => void
type CaseTester = (toot: IParsedToot) => boolean
type IsContinue = boolean

export type OnNotification = (notification: INotification) => void

export interface IReaction {
  case: CaseTester
  reaction: Action
  isContinue?: IsContinue
}

export interface IAddon {
  publicActions: Action[]
  notificationAction: OnNotification[]
  replyActions: IReaction[]
  followActions: OnNotification[]
}
