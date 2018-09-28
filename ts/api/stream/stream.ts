import { IStreamListener, StreamingType } from '../../types/deftype'
import { isNofification } from '../../types/typeguards'
import { EventEmitter } from './__base__/eventemitter'

export class Stream extends EventEmitter {
  private streamURL: string
  private bearerToken: string
  private ws: WebSocket
  private _listener?: IStreamListener

  constructor (host: string, token: string, streamType: StreamingType) {
    super()
    this.streamURL = `${host}/api/v1/streaming/`
    this.bearerToken = token

    const url = (() => {
      switch (streamType) {
        case 'home': {
          return `wss://${this.streamURL}?access_token=${this.bearerToken}&stream=user`
        }
        case 'local': {
          return `wss://${this.streamURL}?access_token=${this.bearerToken}&stream=public:local`
        }
        case 'federated': {
          return `wss://${this.streamURL}?access_token=${this.bearerToken}&stream=public`
        }
        case 'notification': {
          return `wss://${this.streamURL}?access_token=${this.bearerToken}&stream=user`
        }
        default: {
          const check: never = streamType
          throw new Error(check)
        }
      }
    })()
    this.ws = new WebSocket(url)
    this.ws.addEventListener('open', (_: Event) => this.emit('open'))
    this.ws.addEventListener('close', (_: Event) => this.emit('close'))

    if (streamType === 'notification') {
      this.ws.addEventListener('message', this.emitNotification)
    } else {
      this.ws.addEventListener('message', this.emitUpdate)
    }
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
