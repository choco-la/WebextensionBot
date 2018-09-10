import { Visibility } from './deftype'

export interface IArgumentToot {
  in_reply_to_id?: string | null,
  media_ids?: number[],
  sensitive?: boolean,
  spoiler_text?: string,
  status: string
  visibility?: Visibility
}

export interface ISendToot {
  in_reply_to_id: string | null,
  media_ids: number[],
  sensitive: boolean,
  spoiler_text: string,
  status: string
  visibility: Visibility
}
