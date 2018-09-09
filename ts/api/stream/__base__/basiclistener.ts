import { Delete, INotifiation, IStatus, IWSEvent, NotifyEvent } from '../../..//types/deftype'

export class BasicListener {
  protected updateListeners: Array<(toot: IStatus) => void> = []
  protected notificationListeners: Array<(toot: INotifiation) => void> = []
  protected deleteListeners: Array<(toot: Delete) => void> = []

  protected favouriteListeners: Array<(toot: INotifiation) => void> = []
  protected followListeners: Array<(toot: INotifiation) => void> = []
  protected mentionListeners: Array<(toot: INotifiation) => void> = []
  protected reblogListeners: Array<(toot: INotifiation) => void> = []

  public addEventListener = <K extends keyof IWSEvent>(type: K | NotifyEvent, func: (e: IWSEvent[K]) => void): void => {
    switch (type) {
      case 'update':
        this.updateListeners.push(func)
        break
      case 'delete':
        this.deleteListeners.push(func)
        break
      case 'notification':
        this.notificationListeners.push(func)
        break
      case 'favourite':
        this.favouriteListeners.push(func)
        break
      case 'follow':
        this.followListeners.push(func)
        break
      case 'mention':
        this.mentionListeners.push(func)
        break
      case 'reblog':
        this.reblogListeners.push(func)
        break
    }
  }

  public onDelete = (recv: Delete): void => {
    for (const listener of this.deleteListeners) {
      listener(recv)
    }
  }

  public onNotification = (notification: INotifiation): void => {
    for (const listener of this.notificationListeners) {
      listener(notification)
    }
  }

  public onUpdate = (payload: IStatus): void => {
    for (const listener of this.updateListeners) {
      listener(payload)
    }
  }

  public onFavourite = (notification: INotifiation): void => {
    for (const listener of this.favouriteListeners) {
      listener(notification)
    }
  }

  public onFollow = (notification: INotifiation): void => {
    for (const listener of this.followListeners) {
      listener(notification)
    }
  }

  public onMention = (notification: INotifiation): void => {
    for (const listener of this.mentionListeners) {
      listener(notification)
    }
  }

  public onReblog = (notification: INotifiation): void => {
    for (const listener of this.reblogListeners) {
      listener(notification)
    }
  }
}
