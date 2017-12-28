import { INotifiation, IRecvData, IRecvPayload, IStreamListener, ITootJSON } from './deftypes'

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

  private onUpdate = (msg: IRecvData): void => {
    const recvJSON: IRecvPayload = JSON.parse(msg.data)
    const payload = JSON.parse(recvJSON.payload)
    if (!isToot(payload)) return
    this._listener.onUpdate(payload)
  }

  private onNotification = (msg: IRecvData): void => {
    const recvJSON: IRecvPayload = JSON.parse(msg.data)
    const payload = JSON.parse(recvJSON.payload)
    if (!isNofification(payload)) return
    this._listener.onNotification(payload)
  }
}

const isNofification = (recv: any): recv is INotifiation => {
  const types = /^(?:mention|reblog|favourite|follow)$/
  return recv !== null && recv !== undefined && types.test(recv.type)
}

const isToot = (recv: any): recv is ITootJSON => {
  return recv !== null && recv !== undefined && recv.content !== undefined
}
