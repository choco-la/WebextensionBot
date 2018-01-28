import { Visibility } from '../deftypes'
import { isVisibility } from '../typeguards'

interface ISendToot {
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

interface IFullfilledXHR extends XMLHttpRequest {
  response: IXHRResponce
  status: number
  statusText: string
}

export class WriteAPI {
  protected bearerToken: string
  protected hostName: string
  protected _visibility: Visibility = 'direct'

  constructor (host: string, token: string) {
    this.bearerToken = token
    this.hostName = host
  }

  public set visibility (value: Visibility) {
    if (!isVisibility(value)) return
    this._visibility = value
  }

  public get visibility (): Visibility {
    return this._visibility
  }

  public toot (content: string, visibility?: Visibility, replyToID?: string): void {
    const data = {
      in_reply_to_id: replyToID ? replyToID : null,
      media_ids: [],
      sensitive: false,
      spoiler_text: '',
      status: content,
      visibility: visibility ? visibility : this.visibility
    }
    this.sendToot(data)
    .then((resp) => console.log(resp.status))
    .catch((resp) => console.error(`${resp.status}: ${resp.statusText}`))
  }

  public favourite (id: string): Promise<IFullfilledXHR> {
    return new Promise((resolve: (resp: IFullfilledXHR) => void,
                        reject: (err: IFullfilledXHR) => void) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', `https://${this.hostName}/api/v1/statuses/${id}/favourite`)
      xhr.setRequestHeader('Authorization', `Bearer ${this.bearerToken}`)
      xhr.timeout = 3000
      xhr.responseType = 'json'
      xhr.withCredentials = true

      xhr.onloadend = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr)
        } else {
          reject(xhr)
        }
      }
      xhr.onerror = () => {
        reject(xhr)
      }

      xhr.send()
    })
  }

  protected sendToot (data: ISendToot): Promise<IFullfilledXHR> {
    return new Promise((resolve: (resp: IFullfilledXHR) => void,
                        reject: (err: IFullfilledXHR) => void) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', `https://${this.hostName}/api/v1/statuses`)
      xhr.setRequestHeader('Authorization', `Bearer ${this.bearerToken}`)
      xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
      xhr.timeout = 3000
      xhr.responseType = 'json'
      xhr.withCredentials = true

      xhr.onloadend = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr)
        } else {
          reject(xhr)
        }
      }
      xhr.onerror = () => {
        reject(xhr)
      }

      xhr.send(JSON.stringify(data))
    })
  }
}
