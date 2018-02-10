type Callback = (arg?: any) => void

export class EventEmitter {
  private listeners: {[key: string]: Callback[]}
  constructor () {
    this.listeners = {}
  }

  public emit = (event: string, ...arg: any[]): void => {
    if (!this.listeners[event]) return
    for (const listener of this.listeners[event]) {
      if (arg.length > 0) listener(...arg)
      else listener()
    }
  }

  public addListener = (event: string, callback: Callback): void => {
    if (!this.listeners.hasOwnProperty(event)) this.listeners[event] = []
    this.listeners[event].push(callback)
  }
}
