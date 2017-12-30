import { INotifiation, IRecvData, IRecvEvent, IStatus, IStreamListener } from './deftypes'

export class Stream {
  private streamURL: string
  private bearerToken: string
  private ws: WebSocket
  private _listener: IStreamListener
  constructor (host: string, token: string) {
    this.streamURL = `${host}/api/v1/streaming/`
    this.bearerToken = token
  }

  public set listener (listener: IStreamListener) {
    this._listener = listener
  }

  public addEventListener (etype: string, func: (event: Event) => void) {
    switch (etype) {
      case 'open':
        this.ws.addEventListener('open', func)
        break
      case 'message':
        this.ws.addEventListener('message', func)
        break
      case 'close':
        this.ws.addEventListener('close', func)
        break
      default:
        return console.error(`unknown event type: ${etype}`)
    }
  }

  public close (): void {
    this.ws.close()
  }

  public local (): void {
    const streamQuery: string = `?access_token=${this.bearerToken}&stream=public:local`
    const webSocketURL: string = `wss://${this.streamURL}${streamQuery}`
    this.ws = new WebSocket(webSocketURL)
    this.ws.addEventListener('message', this.onUpdate)
    if (!isEventListener(this.onDelete)) return
    this.ws.addEventListener('delete', this.onDelete)
  }

  public home (): void {
    const streamQuery: string = `?access_token=${this.bearerToken}&stream=user`
    const webSocketURL: string = `wss://${this.streamURL}${streamQuery}`
    this.ws = new WebSocket(webSocketURL)
    this.ws.addEventListener('message', this.onUpdate)
  }

  public notification (): void {
    const streamQuery: string = `?access_token=${this.bearerToken}&stream=user`
    const webSocketURL: string = `wss://${this.streamURL}${streamQuery}`
    this.ws = new WebSocket(webSocketURL)
    this.ws.addEventListener('message', this.onNotification)
  }

  private onDelete = (msg: IRecvEvent): void => {
    const recvJSON: IRecvData = JSON.parse(msg.data)
    const payload = JSON.parse(recvJSON.payload)
    if (!isDelete(payload)) return
    this._listener.onDelete(payload)
  }

  private onNotification = (msg: IRecvEvent): void => {
    const recvJSON: IRecvData = JSON.parse(msg.data)
    const payload = JSON.parse(recvJSON.payload)
    if (!isNofification(payload)) return
    this._listener.onNotification(payload)
  }

  private onUpdate = (msg: IRecvEvent): void => {
    const recvJSON: IRecvData = JSON.parse(msg.data)
    const payload = JSON.parse(recvJSON.payload)
    if (!isToot(payload)) return
    this._listener.onUpdate(payload)
  }
}

const isEventListener = (recv: any): recv is EventListener => {
  return 'detail' in recv
}

const isDelete = (recv: any): recv is string => {
  return recv !== null && recv !== undefined && typeof(recv) === 'string'
}

const isNofification = (recv: any): recv is INotifiation => {
  const types = /^(?:mention|reblog|favourite|follow)$/
  return recv !== null && recv !== undefined && types.test(recv.type)
}

const isToot = (recv: any): recv is IStatus => {
  return recv !== null && recv !== undefined && recv.content !== undefined
}
