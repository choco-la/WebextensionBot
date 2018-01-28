import { BasicListener } from './basiclistener'
import { RegexFilter } from './regexfilter'
import { secretFilter } from './secret'
import { tootParser } from './tootparser'
import { INotifiation, IStatus } from './types/deftype'
import { WordFilter } from './wordfilter'

type FliterType = 'application' | 'screenname'

export class Listener extends BasicListener {
  private applicationFilter: WordFilter
  private screenNameFilter: WordFilter
  private contentFilter: RegexFilter

  constructor () {
    super()
    this.applicationFilter = new WordFilter(muteApplications)
    this.screenNameFilter = new WordFilter(muteScreenNames)
    this.contentFilter = new RegexFilter(muteContents)
  }

  public mute (type: FliterType, word: string): void {
    switch (type) {
      case 'application':
        this.applicationFilter.add(word)
        break
      case 'screenname':
        this.screenNameFilter.add(word)
        break
    }
  }

  protected onUpdate (payload: IStatus): void {
    const screenName: string = tootParser.screenName(payload.account)
    const content: string = tootParser.tootContent(payload.content)
    const application: string = payload.application ? payload.application.name : ''

    if (this.applicationFilter.test(application)) return console.debug(`muted: ${application}`)
    if (this.screenNameFilter.test(screenName)) return console.debug(`muted: ${screenName}`)
    if (this.contentFilter.test(content)) return console.debug(`muted: ${content}`)
    if (secretFilter.test(content)) return console.debug(`muted: ${content}`)

    for (const listener of this.updateListeners) {
      listener(payload)
    }
  }

  protected onMention (notification: INotifiation): void {
    const payload = notification.status
    const screenName: string = tootParser.screenName(payload.account)
    const content: string = tootParser.tootContent(payload.content)
    const application: string = payload.application ? payload.application.name : ''

    if (this.applicationFilter.test(application)) return console.debug(`muted: ${application}`)
    if (this.screenNameFilter.test(screenName)) return console.debug(`muted: ${screenName}`)
    if (this.contentFilter.test(content)) return console.debug(`muted: ${content}`)
    if (secretFilter.test(content)) return console.debug(`muted: ${content}`)

    for (const listener of this.mentionListeners) {
      listener(notification)
    }
  }
}

const muteApplications = [
  'mastbot'
]
const muteScreenNames = [
  ''
]
const muteContents = [
  String.raw`[死殺]`
]
