import { IAccount, INotifiation, ITootJSON } from './deftypes'
import guards from './typeguards'

export class Listener {
  private updateListener: Array<{ regex: RegExp, func: (toot: ITootJSON) => void, account?: string }> = []
  private mentionListener: Array<{ regex: RegExp, func: (toot: ITootJSON) => void, account?: string }> = []

  public addUpdateListener (regex: RegExp, func: (toot: ITootJSON) => void, account?: string) {
    this.updateListener.push({ regex, func, account })
  }

  public addMentionListener (regex: RegExp, func: (toot: ITootJSON) => void, account?: string) {
    this.mentionListener.push({ regex, func, account })
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
    return console.log(recv)
  }

  public onDelete (recv: string): void {
    console.log(`deleted: ${recv}`)
  }

  public onUpdate (payload: ITootJSON): void {
    const screenName: string = getScreenName(payload.account)
    const content: string = getTootContent(payload.content)
    const application: string = payload.application ? payload.application.name : ''

    if (muteFilter.screenname(screenName)) return console.log(`muted: ${screenName}`)
    if (muteFilter.content(content)) return console.log(`muted: ${content}`)
    if (muteFilter.application(application)) return console.log(`muted: ${application}`)

    for (const listener of this.updateListener) {
      const { regex, func, account } = listener
      if (regex.test(content)) {
        if (account === undefined) func(payload)
        else if (screenName === account) func(payload)
      }
    }
  }

  private onFavourite (notification: INotifiation): void {
    const account = notification.account
    const from = getScreenName(account)
    console.log(`favourite: ${from}`)
  }

  private onFollow (notification: INotifiation): void {
    const account = notification.account
    const from = getScreenName(account)
    console.log(`follow: ${from}`)
  }

  private onMention (notification: INotifiation): void {
    const payload = notification.status
    const screenName: string = getScreenName(payload.account)
    const content: string = getTootContent(payload.content)
    const application: string = payload.application ? payload.application.name : ''

    if (muteFilter.screenname(screenName)) return console.log(`muted: ${screenName}`)
    if (muteFilter.content(content)) return console.log(`muted: ${content}`)
    if (muteFilter.application(application)) return console.log(`muted: ${application}`)

    for (const listener of this.mentionListener) {
      const { regex, func, account } = listener
      if (regex.test(content)) {
        if (account === undefined) func(payload)
        else if (screenName === account) func(payload)
      }
    }
  }

  private onReblog (notification: INotifiation): void {
    const account = notification.account
    const from = getScreenName(account)
    console.log(`reblog: ${from}`)
  }
}

const getTootContent = (dom: string): string => {
  const parser: DOMParser = new DOMParser()
  const parsedDOM: HTMLDocument = parser.parseFromString(dom, 'text/html')
  if (!guards.isHTMLElem(parsedDOM.activeElement)) return ''
  const element: HTMLElement = parsedDOM.activeElement
  // Not nullable.
  return element.innerText
}

const getHostName = (url: string): string => {
  const parsedURL: URL = new URL(url)
  return parsedURL.hostname
}

const getScreenName = (account: IAccount): string => {
  const userName: string = account.username
  const hostName: string = getHostName(account.url)
  return `${userName}@${hostName}`
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
