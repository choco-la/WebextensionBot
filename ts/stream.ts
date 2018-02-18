import { EventEmitter } from './eventemitter'
import { isDelete, isStatus } from './typeguards'
import { IStreamListener, IWSEvent } from './types//deftype'

export class Stream extends EventEmitter {
  private streamURL: string
  private bearerToken: string
  private ws: WebSocket
  private _listener: IStreamListener

  constructor (host: string, token: string) {
    super()
    this.streamURL = `${host}/api/v1/streaming/`
    this.bearerToken = token
  }

  public set listener (listener: IStreamListener) {
    this._listener = listener

    this.addListener('update', this._listener.onUpdate)
    this.addListener('notification', this._listener.onNotification)
    this.addListener('delete', this._listener.onDelete)

    this.addListener('mention', this._listener.onMention)
    this.addListener('reblog', this._listener.onReblog)
    this.addListener('favourite', this._listener.onFavourite)
    this.addListener('follow', this._listener.onFollow)
  }

  public close = (): void => {
    this.ws.close()
  }

  public local = (): void => {
    const streamQuery: string = `?access_token=${this.bearerToken}&stream=public:local`
    const webSocketURL: string = `wss://${this.streamURL}${streamQuery}`
    this.ws = new WebSocket(webSocketURL)
    this.setUpEventListeners('update')
  }

  public home = (): void => {
    const streamQuery: string = `?access_token=${this.bearerToken}&stream=user`
    const webSocketURL: string = `wss://${this.streamURL}${streamQuery}`
    this.ws = new WebSocket(webSocketURL)
    this.setUpEventListeners('update')
  }

  public notification = (): void => {
    const streamQuery: string = `?access_token=${this.bearerToken}&stream=user`
    const webSocketURL: string = `wss://${this.streamURL}${streamQuery}`
    this.ws = new WebSocket(webSocketURL)
    this.setUpEventListeners('notification')
  }

  private onMessage = <K extends keyof IWSEvent>(type: K, event: MessageEvent) => {
    const recvJSON = JSON.parse(event.data)
    const payload = JSON.parse(recvJSON.payload)
    switch (type) {
      case 'update':
        if (!isStatus(payload)) return
        this.emit('update', payload)
        break
      case 'notification':
        // Emit both 'notification' and the each event.
        this.emit('notification', payload)
        // payload.type: mention|reblog|favourite|follow
        this.emit(payload.type, payload)
        break
      case 'delete':
        if (!isDelete(payload)) return
        this.emit('delete', payload)
        break
    }
  }

  private setUpEventListeners = <K extends keyof IWSEvent>(type: K) => {
    this.ws.addEventListener('open', (_: Event) => this.emit('open'))
    this.ws.addEventListener('close', (_: Event) => this.emit('close'))
    // Emit in onMessage().
    this.ws.addEventListener('message', (msg: MessageEvent) => this.onMessage(type, msg))
  }
}
