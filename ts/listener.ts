import { INotifiation, IStatus, NotifyEvent } from './deftypes'
import { secretFilter } from './secret'
import { tootParser } from './tootparser'

export class Listener {
  private deleteListeners: Array<(toot: string) => void> = []
  private favouriteListeners: Array<(toot: INotifiation) => void> = []
  private followListeners: Array<(toot: INotifiation) => void> = []
  private mentionListeners: Array<(toot: INotifiation) => void> = []
  private reblogListeners: Array<(toot: INotifiation) => void> = []
  private updateListeners: Array<(toot: IStatus) => void> = []

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

  public onDelete (recv: string): void {
    for (const listener of this.deleteListeners) {
      listener(recv)
    }
  }

  public onNotification (recv: INotifiation): void {
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

  public onUpdate (payload: IStatus): void {
    const screenName: string = tootParser.screenName(payload.account)
    const content: string = tootParser.tootContent(payload.content)
    const application: string = payload.application ? payload.application.name : ''

    if (muteFilter.screenname(screenName)) return console.debug(`muted: ${screenName}`)
    if (muteFilter.content(content)) return console.debug(`muted: ${content}`)
    if (muteFilter.application(application)) return console.debug(`muted: ${application}`)
    if (secretFilter.test(content)) return console.debug(`muted: ${content}`)

    for (const listener of this.updateListeners) {
      listener(payload)
    }
  }

  private onFavourite (notification: INotifiation): void {
    for (const listener of this.favouriteListeners) {
      listener(notification)
    }
  }

  private onFollow (notification: INotifiation): void {
    for (const listener of this.followListeners) {
      listener(notification)
    }
  }

  private onMention (notification: INotifiation): void {
    const payload = notification.status
    const screenName: string = tootParser.screenName(payload.account)
    const content: string = tootParser.tootContent(payload.content)
    const application: string = payload.application ? payload.application.name : ''

    if (muteFilter.screenname(screenName)) return console.debug(`muted: ${screenName}`)
    if (muteFilter.content(content)) return console.debug(`muted: ${content}`)
    if (muteFilter.application(application)) return console.debug(`muted: ${application}`)
    if (secretFilter.test(content)) return console.debug(`muted: ${content}`)

    for (const listener of this.mentionListeners) {
      listener(notification)
    }
  }

  private onReblog (notification: INotifiation): void {
    for (const listener of this.reblogListeners) {
      listener(notification)
    }
  }
}

const muteFilter: { [key: string]: (arg: string) => boolean } = {
  application: (application: string): boolean => {
    const mutes: Set<string> = new Set()
    mutes.add('mastbot')
    if (mutes.has(application)) return true
    return false
  },
  content: (content: string): boolean => {
    if (/[死殺]/.test(content)) return true
    return false
  },
  screenname: (screenname: string): boolean => {
    const mutes: Set<string> = new Set()
    mutes.add('12222222@friends.nico')
    if (mutes.has(screenname)) return true
    return false
  }
}
