import { INotifiation, IStatus, NotifyEvent } from './types/deftype'

export class BasicListener {
  protected deleteListeners: Array<(toot: string) => void> = []
  protected favouriteListeners: Array<(toot: INotifiation) => void> = []
  protected followListeners: Array<(toot: INotifiation) => void> = []
  protected mentionListeners: Array<(toot: INotifiation) => void> = []
  protected reblogListeners: Array<(toot: INotifiation) => void> = []
  protected updateListeners: Array<(toot: IStatus) => void> = []

  public addDeleteListener (func: (recv: string) => void): void {
    this.deleteListeners.push(func as (toot: string) => void)
  }

  public addNotificationListener (type: NotifyEvent, func: (recv: INotifiation) => void): void {
    switch (type) {
      case 'favourite':
        this.favouriteListeners.push(func as (toot: INotifiation) => void)
        break
      case 'follow':
        this.followListeners.push(func as (toot: INotifiation) => void)
        break
      case 'mention':
        this.mentionListeners.push(func as (toot: INotifiation) => void)
        break
      case 'reblog':
        this.reblogListeners.push(func as (toot: INotifiation) => void)
        break
    }
  }

  public addUpdateListener (func: (recv: IStatus) => void): void {
    this.updateListeners.push(func as (toot: IStatus) => void)
  }

  protected onDelete (recv: string): void {
    for (const listener of this.deleteListeners) {
      listener(recv)
    }
  }

  protected onNotification (recv: INotifiation): void {
    switch (recv.type) {
      case 'favourite':
        this.onFavourite(recv)
        break
      case 'follow':
        this.onFollow(recv)
        break
      case 'mention':
        this.onMention(recv)
        break
      case 'reblog':
        this.onReblog(recv)
        break
    }
  }

  protected onUpdate (payload: IStatus): void {
    for (const listener of this.updateListeners) {
      listener(payload)
    }
  }

  protected onFavourite (notification: INotifiation): void {
    for (const listener of this.favouriteListeners) {
      listener(notification)
    }
  }

  protected onFollow (notification: INotifiation): void {
    for (const listener of this.followListeners) {
      listener(notification)
    }
  }

  protected onMention (notification: INotifiation): void {
    for (const listener of this.mentionListeners) {
      listener(notification)
    }
  }

  protected onReblog (notification: INotifiation): void {
    for (const listener of this.reblogListeners) {
      listener(notification)
    }
  }
}
