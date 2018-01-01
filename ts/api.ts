import { IRelationship, Visibility } from './deftypes'
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

const APIRateLimit = {
  // Wait ${coolTime} seconds per toot.
  coolTime: 20000,
  isCoolTime: false,
  // Ratelimit per 1min.
  rateLimitPublic: 2,
  rateLimitReply: 30,
  remainingPublic: 0,
  remainingReply: 0

}

export class MastodonAPI {
  private bearerToken: string
  private hostName: string
  private limit = APIRateLimit
  private _visibility: Visibility = 'direct'
  // Number of setInterval() that resets ratelimit.
  private resetPublicRateLimitID: number
  private resetReplyRateLimitID: number
  // Number of setInterval() that resets cooltime.
  private resetCoolTimeID: number

  constructor (host: string, token: string) {
    this.bearerToken = token
    this.hostName = host
  }

  public set rateLimitPublic (value: number) {
    if (!this.limit) return
    if (value <= 0) return
    this.limit.rateLimitPublic = value
  }

  public get rateLimitPublic (): number {
    return this.limit.rateLimitPublic
  }

  public set rateLimitReply (value: number) {
    if (!this.limit) return
    if (value <= 0) return
    this.limit.rateLimitReply = value
  }

  public get rateLimitReply (): number {
    return this.limit.rateLimitReply
  }

  public set visibility (value: Visibility) {
    if (!isVisibility(value)) return
    this._visibility = value
  }

  public get visibility (): Visibility {
    return this._visibility
  }

  public relationships (idarray: string[]): Promise<IRelationship[]> {
    return new Promise((resolve: (resp: IRelationship[]) => void,
                        reject: (err: IFullfilledXHR) => void) => {
      const query: string = `id[]=${idarray.join('&id[]=')}`
      const xhr = new XMLHttpRequest()
      xhr.open('GET', `https://${this.hostName}/api/v1/accounts/relationships?${query}`)
      xhr.setRequestHeader('Authorization', `Bearer ${this.bearerToken}`)
      xhr.timeout = 3000
      xhr.responseType = 'json'
      xhr.withCredentials = true

      xhr.onloadend = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response)
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

  public setRateLimit (pubvalue?: number, repvalue?: number): void {
    if (!this.limit) this.limit = APIRateLimit

    if (pubvalue) this.rateLimitPublic = pubvalue
    this.limit.remainingPublic = this.rateLimitPublic

    if (repvalue) this.rateLimitReply = repvalue
    this.limit.remainingReply = this.rateLimitReply

    // Reset remaining values to default value per 1min.
    if (!this.resetPublicRateLimitID) {
      this.resetPublicRateLimitID = setInterval(() => this.limit.remainingPublic = this.rateLimitPublic, 60000)
    }
    if (!this.resetReplyRateLimitID) {
      this.resetReplyRateLimitID = setInterval(() => this.limit.remainingReply = this.rateLimitReply, 60000)
    }
    console.log(`rateLimitPublic: ${this.rateLimitPublic}`)
    console.log(`rateLimitReply: ${this.rateLimitReply}`)
  }

  public setCoolTime (value?: number): void {
    if (!this.limit) this.setRateLimit()
    if (value) this.coolTime = value

    if (!this.resetCoolTimeID) {
      this.resetCoolTimeID = setInterval(() => this.limit.isCoolTime = false, this.limit.coolTime)
    }
    console.log(`coolTime: ${this.limit.coolTime}`)
  }

  private set coolTime (value: number) {
    if (value <= 0) return
    this.limit.coolTime = value
  }

  public toot (content: string, visibility?: Visibility, replyToID?: string): void {
    if (replyToID) {
      if (this.limit && this.rateLimitReply <= 0) return console.log(`rateLimitReply: ${this.limit.remainingReply}`)
    } else {
      if (this.limit && this.rateLimitPublic <= 0) return console.log(`rateLimitPublic: ${this.limit.remainingPublic}`)
      if (this.limit.isCoolTime) return console.log(`coolTime: ${this.limit.coolTime}`)
    }

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

    if (!this.limit) return
    if (replyToID) {
      this.rateLimitReply--
      console.log(`rateLimitReply: ${this.rateLimitReply}`)
    } else {
      this.rateLimitPublic--
      console.log(`rateLimitPublic: ${this.rateLimitPublic}`)
      this.limit.isCoolTime = true
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

  public follow (id: string): Promise<IFullfilledXHR> {
    return new Promise((resolve: (resp: IFullfilledXHR) => void,
                        reject: (err: IFullfilledXHR) => void) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', `https://${this.hostName}/api/v1/accounts/${id}/follow`)
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
