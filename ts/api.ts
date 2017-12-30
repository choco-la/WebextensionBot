import { Visibility } from './deftypes'
import { isVisibility } from './typeguards'

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

export class MastodonAPI {
  private bearerToken: string
  private hostName: string
  // Ratelimit per 30s.
  private _rateLimitDefault: number = 3
  private rateLimit: number
  // Wait ${_coolTime} seconds per toot.
  private _coolTime: number
  private isCoolTime: boolean
  private hasRateLimit: boolean = false
  private _visibility: Visibility = 'direct'

  constructor (host: string, token: string) {
    this.bearerToken = token
    this.hostName = host
  }

  public setRateLimit (value?: number): void {
    if (value) this._rateLimitDefault = value
    this.hasRateLimit = true
    this.rateLimit = this._rateLimitDefault
    setInterval(() => this.rateLimit = this._rateLimitDefault, 30000)
    console.log(`rateLimit: ${this.rateLimit}`)
  }

  public setCoolTime (value: number): void {
    this._coolTime = value
    setInterval(() => this.isCoolTime = false, this._coolTime)
    console.log(`coolTime: ${this._coolTime}`)
  }

  public set visibility (value: string) {
    if (!isVisibility(value)) return
    this._visibility = value
  }

  public toot (content: string, replyToID?: string, visibility?: Visibility): void {
    if (this.hasRateLimit && this.rateLimit <= 0) return console.log(`rateLimit: ${this.rateLimit}`)
    if (this.isCoolTime) return console.log(`coolTime: ${this._coolTime}`)
    const data = {
      in_reply_to_id: replyToID ? replyToID : null,
      media_ids: [],
      sensitive: false,
      spoiler_text: '',
      status: content,
      visibility: visibility ? visibility : this._visibility
    }
    this.sendToot(data)
    .then((resp) => console.log(resp.status))
    .catch((resp) => console.error(`${resp.status}: ${resp.statusText}`))
    if (this.hasRateLimit) {
      this.rateLimit--
      console.log(`rateLimit: ${this.rateLimit}`)
    }
    if (this._coolTime !== undefined) this.isCoolTime = true
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

  private sendToot (data: ISendToot): Promise<IFullfilledXHR> {
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
