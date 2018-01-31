import { INotifiation, IStatus, NotifyEvent, WSEvent } from './types/deftype'

type updateListener = (recv: IStatus) => void
type deleteListener = (recv: string) => void
type notificationListener = (recv: INotifiation) => void
type mstdnEventListener = updateListener | deleteListener | notificationListener

export class BasicListener {
  protected updateListeners: Array<(toot: IStatus) => void> = []
  protected notificationListeners: Array<(toot: INotifiation) => void> = []
  protected deleteListeners: Array<(toot: string) => void> = []

  protected favouriteListeners: Array<(toot: INotifiation) => void> = []
  protected followListeners: Array<(toot: INotifiation) => void> = []
  protected mentionListeners: Array<(toot: INotifiation) => void> = []
  protected reblogListeners: Array<(toot: INotifiation) => void> = []

  public addEventListener (type: WSEvent | NotifyEvent, func: mstdnEventListener): void {
    switch (type) {
      case 'update':
        this.updateListeners.push(func as updateListener)
        break
      case 'delete':
        this.deleteListeners.push(func as deleteListener)
        break
      case 'notification':
        this.notificationListeners.push(func as notificationListener)
        break
      case 'favourite':
        this.favouriteListeners.push(func as notificationListener)
        break
      case 'follow':
        this.followListeners.push(func as notificationListener)
        break
      case 'mention':
        this.mentionListeners.push(func as notificationListener)
        break
      case 'reblog':
        this.reblogListeners.push(func as notificationListener)
        break
    }
  }

  public onDelete (recv: string): void {
    for (const listener of this.deleteListeners) {
      listener(recv)
    }
  }

  public onNotification (notification: INotifiation): void {
    for (const listener of this.notificationListeners) {
      listener(notification)
    }
  }

  public onUpdate (payload: IStatus): void {
    for (const listener of this.updateListeners) {
      listener(payload)
    }
  }

  public onFavourite (notification: INotifiation): void {
    for (const listener of this.favouriteListeners) {
      listener(notification)
    }
  }

  public onFollow (notification: INotifiation): void {
    for (const listener of this.followListeners) {
      listener(notification)
    }
  }

  public onMention (notification: INotifiation): void {
    for (const listener of this.mentionListeners) {
      listener(notification)
    }
  }

  public onReblog (notification: INotifiation): void {
    for (const listener of this.reblogListeners) {
      listener(notification)
    }
  }
}
