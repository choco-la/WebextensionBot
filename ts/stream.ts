import { EventEmitter } from 'events'
import { isDelete, isNofification, isStatus } from './typeguards'
import { IRecvData, IStreamListener } from './types//deftype'

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

    this.on('update', this._listener.onUpdate)
    this.on('notification', this._listener.onNotification)
    this.on('delete', this._listener.onDelete)

    this.on('mention', this._listener.onMention)
    this.on('reblog', this._listener.onReblog)
    this.on('favourite', this._listener.onFavourite)
    this.on('follow', this._listener.onFollow)
  }

  public close (): void {
    this.ws.close()
  }

  public local (): void {
    const streamQuery: string = `?access_token=${this.bearerToken}&stream=public:local`
    const webSocketURL: string = `wss://${this.streamURL}${streamQuery}`
    this.ws = new WebSocket(webSocketURL)
    this.setUpEventListeners()
  }

  public home (): void {
    const streamQuery: string = `?access_token=${this.bearerToken}&stream=user`
    const webSocketURL: string = `wss://${this.streamURL}${streamQuery}`
    this.ws = new WebSocket(webSocketURL)
    this.setUpEventListeners()
  }

  public notification (): void {
    const streamQuery: string = `?access_token=${this.bearerToken}&stream=user`
    const webSocketURL: string = `wss://${this.streamURL}${streamQuery}`
    this.ws = new WebSocket(webSocketURL)
    this.setUpEventListeners()
  }

  private onMessage (event: MessageEvent) {
    const recvJSON: IRecvData = JSON.parse(event.data)
    const payload = JSON.parse(recvJSON.payload)
    switch (recvJSON.event) {
      case 'update':
        if (!isStatus(payload)) return
        this.emit('update', payload)
        break
      case 'notification':
        if (!isNofification(payload)) return
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

  private setUpEventListeners () {
    this.ws.addEventListener('open', (_: Event) => this.emit('open'))
    this.ws.addEventListener('close', (_: Event) => this.emit('close'))
    // Emit in onMessage().
    this.ws.addEventListener('message', this.onMessage)
  }
}
