import { MastodonAPI as _MastodonAPI } from './api'
import { Visibility } from './deftypes'
import { isVisibility } from './typeguards'

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

export class MastodonAPI extends _MastodonAPI {
  private limit = APIRateLimit
  // Timer of setInterval() that resets ratelimit.
  private resetPublicRateLimitID: NodeJS.Timer
  private resetReplyRateLimitID: NodeJS.Timer
  // Timer of setInterval() that resets cooltime.
  private resetCoolTimeID: NodeJS.Timer

  constructor (host: string, token: string) {
    super(host, token)
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
      const msg = `rateLimitReply: ${this.limit.remainingReply}`
      if (this.limit && this.limit.remainingReply <= 0) return console.log(msg)
    } else {
      const msg = `rateLimitPublic: ${this.limit.remainingPublic}`
      if (this.limit && this.limit.remainingPublic <= 0) return console.log(msg)
      if (this.limit.isCoolTime) return console.log(`coolTime: ${this.limit.coolTime}`)
    }

    super.toot(content, visibility, replyToID)

    if (!this.limit) return
    if (replyToID) {
      this.limit.remainingReply--
      console.log(`remainingReply: ${this.limit.remainingReply}`)
    } else {
      this.limit.remainingPublic--
      console.log(`remainingPublic: ${this.limit.remainingPublic}`)
      this.limit.isCoolTime = true
    }
  }
}