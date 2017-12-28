import { isVisibility } from './guards'

interface ISendToot {
  in_reply_to_id: string | null,
  media_ids: number[],
  sensitive: boolean,
  spoiler_text: string,
  status: string
  visibility: 'public' | 'unlisted' | 'private' | 'direct'
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
  private _rateLimitDefault: number = 3
  private rateLimit: number
  private hasRateLimit: boolean = false
  private _visibility: 'public' | 'unlisted' | 'private' | 'direct' = 'direct'

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

  public set visibility (value: string) {
    if (!isVisibility(value)) return
    this._visibility = value
  }

  public toot (content: string, reply?: string): void {
    if (this.hasRateLimit && this.rateLimit <= 0) return console.log(`rateLimit: ${this.rateLimit}`)
    const replyToId = reply || null
    const data = {
      in_reply_to_id: replyToId,
      media_ids: [],
      sensitive: false,
      spoiler_text: '',
      status: content,
      visibility: this._visibility
    }
    this.sendToot(data)
    .then((resp) => console.log(resp.status))
    .catch((resp) => console.error(`${resp.status}: ${resp.statusText}`))
    if (this.hasRateLimit) {
      this.rateLimit--
      console.log(`rateLimit: ${this.rateLimit}`)
    }
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
