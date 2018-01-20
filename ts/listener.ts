import * as path from 'path'
import { INotifiation, IStatus, NotifyEvent } from './deftypes'
import { RegexFilter } from './regexfilter'
import { tootParser } from './tootparser'
import { WordFilter } from './wordfilter'

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

  public addUpdateFilter (func: (recv: IStatus) => void): void {
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

    if (applicationFilter.test(application)) return console.debug(`muted: ${application}`)
    if (accountFilter.test(screenName)) return console.debug(`muted: ${screenName}`)
    if (contentFilter.test(content)) return console.debug(`muted: ${content}`)

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

    if (applicationFilter.test(application)) return console.debug(`muted: ${application}`)
    if (accountFilter.test(screenName)) return console.debug(`muted: ${screenName}`)
    if (contentFilter.test(content)) return console.debug(`muted: ${content}`)

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

const applicationFilter = new WordFilter(path.join(__dirname, '../filter', 'muteclient.txt'))
const accountFilter = new WordFilter(path.join(__dirname, '../filter', 'muteaccount.txt'))
const contentFilter = new RegexFilter(path.join(__dirname, '../filter', 'muteclient.txt'))
