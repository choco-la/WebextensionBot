import { BasicListener } from './basiclistener'
import { RegexFilter } from './regexfilter'
import { tootParser } from './tootparser'
import { INotifiation, IStatus } from './types/deftype'
import { WordFilter } from './wordfilter'

type FliterType = 'application' | 'screenname' | 'content'

export class Listener extends BasicListener {
  private applicationFilter: WordFilter
  private screenNameFilter: WordFilter
  private contentFilter: RegexFilter

  constructor () {
    super()
    this.applicationFilter = new WordFilter()
    this.screenNameFilter = new WordFilter()
    this.contentFilter = new RegexFilter()
  }

  public mute = (type: FliterType, word: string): void => {
    switch (type) {
      case 'application':
        this.applicationFilter.add(word)
        break
      case 'screenname':
        this.screenNameFilter.add(word)
        break
      case 'content':
        this.contentFilter.add(word)
        break
    }
  }

  public onUpdate = (payload: IStatus): void => {
    const screenName: string = tootParser.screenName(payload.account)
    const content: string = tootParser.tootContent(payload.content)
    const application: string = payload.application ? payload.application.name : ''

    if (this.applicationFilter.test(application)) return console.debug(`muted: ${application}`)
    if (this.screenNameFilter.test(screenName)) return console.debug(`muted: ${screenName}`)
    if (this.contentFilter.test(removeAvoidFilterChar(content))) return console.debug(`muted: ${content}`)

    for (const listener of this.updateListeners) {
      listener(payload)
    }
  }

  public onMention = (notification: INotifiation): void => {
    const payload = notification.status
    const screenName: string = tootParser.screenName(payload.account)
    const content: string = tootParser.tootContent(payload.content)
    const application: string = payload.application ? payload.application.name : ''

    if (this.applicationFilter.test(application)) return console.debug(`muted: ${application}`)
    if (this.screenNameFilter.test(screenName)) return console.debug(`muted: ${screenName}`)
    if (this.contentFilter.test(removeAvoidFilterChar(content))) return console.debug(`muted: ${content}`)

    for (const listener of this.mentionListeners) {
      listener(notification)
    }
  }
}

const removeAvoidFilterChar = (text: string): string => {
  return text.replace('​', '')
}
