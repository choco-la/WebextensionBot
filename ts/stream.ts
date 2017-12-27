import { IRecvData, IStreamListener } from './deftypes'

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
    this.ws.addEventListener('message', (msg: IRecvData) => this._listener.onMessage(msg))
  }

  public home (): void {
    const streamQuery: string = `?access_token=${this.bearerToken}&stream=user`
    const webSocketURL: string = `wss://${this.streamURL}${streamQuery}`
    this.ws = new WebSocket(webSocketURL)
    this.ws.addEventListener('message', (msg: IRecvData) => this._listener.onMessage(msg))
  }
}
