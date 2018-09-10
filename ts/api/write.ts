import { getSender, ISender } from '../request'
import { IArgumentToot, ISendToot } from '../types/apitype'
import { Visibility } from '../types/deftype'
import { isVisibility } from '../types/typeguards'

export class WriteAPI {
  protected bearerToken: string
  protected hostName: string
  protected _visibility: Visibility = 'direct'
  protected post: ISender

  constructor (host: string, token: string) {
    this.bearerToken = token
    this.hostName = host
    this.post = getSender(this.bearerToken)
  }

  public set visibility (value: Visibility) {
    if (!isVisibility(value)) return
    this._visibility = value
  }

  public get visibility (): Visibility {
    return this._visibility
  }

  public toot = (toot: IArgumentToot): void => {
    const {
      in_reply_to_id = null,
      media_ids = [],
      sensitive = false,
      spoiler_text = '',
      status,
      visibility = this.visibility
    } = toot

    const data = {
      in_reply_to_id,
      media_ids,
      sensitive,
      spoiler_text,
      status,
      visibility
    }
    this.sendToot(data)
    .then((resp) => console.log(resp.status))
    .catch((resp) => console.error(`${resp.status}: ${resp.statusText}`))
  }

  public favourite = (id: string) => {
    const url = `https://${this.hostName}/api/v1/statuses/${id}/favourite`
    return this.post(url, null)
  }

  protected sendToot = (data: ISendToot) => {
    const url = `https://${this.hostName}/api/v1/statuses`
    return this.post(url, JSON.stringify(data))
  }
}
