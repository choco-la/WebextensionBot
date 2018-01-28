import { Visibility } from '../deftypes'

export interface ISendToot {
  in_reply_to_id: string | null,
  media_ids: number[],
  sensitive: boolean,
  spoiler_text: string,
  status: string
  visibility: Visibility
}

interface IXHRResponce {
  text: string
}

export interface IFullfilledXHR extends XMLHttpRequest {
  response: IXHRResponce
  status: number
  statusText: string
}
