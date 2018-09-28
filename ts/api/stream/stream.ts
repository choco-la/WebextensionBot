import { IStreamListener } from '../../types//deftype'
import { isNofification } from '../../types/typeguards'
import { EventEmitter } from './__base__/eventemitter'

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
    const streamQuery = `?access_token=${this.bearerToken}&stream=public:local`
    const webSocketURL = `wss://${this.streamURL}${streamQuery}`
    this.setUpWebSocket(webSocketURL)

    this.ws.addEventListener('message', this.emitUpdate)
  }

  public home = (): void => {
    const streamQuery = `?access_token=${this.bearerToken}&stream=user`
    const webSocketURL = `wss://${this.streamURL}${streamQuery}`
    this.setUpWebSocket(webSocketURL)

    this.ws.addEventListener('message', this.emitUpdate)
  }

  public federated = (): void => {
    const streamQuery = `?access_token=${this.bearerToken}&stream=public`
    const webSocketURL = `wss://${this.streamURL}${streamQuery}`
    this.setUpWebSocket(webSocketURL)

    this.ws.addEventListener('message', this.emitUpdate)
  }

  public notification = (): void => {
    const streamQuery = `?access_token=${this.bearerToken}&stream=user`
    const webSocketURL = `wss://${this.streamURL}${streamQuery}`
    this.setUpWebSocket(webSocketURL)

    this.ws.addEventListener('message', this.emitNotification)
  }

  private setUpWebSocket = (url: string): void => {
    this.ws = new WebSocket(url)
    this.ws.addEventListener('open', (_: Event) => this.emit('open'))
    this.ws.addEventListener('close', (_: Event) => this.emit('close'))
  }

  private emitNotification = (msg: MessageEvent): void => {
    const recvJSON = JSON.parse(msg.data)
    const type = recvJSON.event
    const payload = JSON.parse(recvJSON.payload)
    if (!isNofification(payload)) return
    // Emit both 'notification' and the each event.
    this.emit(type, payload)
    // payload.type: mention|reblog|favourite|follow
    this.emit(payload.type, payload)
  }

  private emitUpdate = (msg: MessageEvent): void => {
    const recvJSON = JSON.parse(msg.data)
    const type = recvJSON.event
    const payload = JSON.parse(recvJSON.payload)
    if (isNofification(payload)) return
    this.emit(type, payload)
  }
}
