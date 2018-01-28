export interface IAccount {
  acct: string
  display_name: string
  followers_count: number
  following_count: number
  id: string
  statuses_count: number
  url: string
  username: string
}

export interface IJSONDict {
  [key: string]: string | number | boolean | this
}

export interface IRecvEvent extends Event {
  data: string
}

export interface IRecvData {
  [key: string]: any,
  event: string,
  payload: string
}

export interface IMedia {
  id: string
  type: 'image' | 'video' | 'gifv' | 'unknown'
  url: string
  description: string | null
  text_url: string | null
}

export interface INotifiation {
  account: IAccount
  created_at: string
  id: string
  status: IStatus
  type: 'mention' | 'reblog' | 'favourite' | 'follow'
}

export interface IRelationship {
  blocking: boolean
  domain_blocking: boolean
  followed_by: boolean
  following: boolean
  id: string
  muting_notifications: boolean
  muting: boolean
  requested: boolean
}

export interface IStatus {
  account: IAccount
  application: { name: string , website: string | null }
  content: string
  favourited: boolean
  id: string
  in_reply_to_account_id: string | null
  in_reply_to_id: string | null
  media_attachments: IMedia[]
  reblogged: boolean
  sensitive: boolean
  spoiler_text: string
  tags: Array<{name: string, url: string}>
  uri: string
  url: string
  visibility: Visibility
}

export interface IStreamListener {
  onDelete: (recv: string) => void
  onNotification: (recv: INotifiation) => void
  onUpdate: (recv: IStatus) => void
}

export type NotifyEvent = 'favourite' | 'follow' | 'mention' | 'reblog'
export type Visibility = 'public' | 'unlisted' | 'private' | 'direct'