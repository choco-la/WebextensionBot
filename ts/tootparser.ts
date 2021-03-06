import * as URL from 'url'
import { DOMParser } from 'xmldom'
import { IAccount, IParsedToot, IStatus } from './types/deftype'

const getTootContent = (rawdom: string): string => {
  const dom = rawdom.replace(/<br(?: \/)?>/g, '\n')
  // Return blank string or new line.
  if (/^\n*$/.test(dom)) return dom
  const parser: DOMParser = new DOMParser()
  const parsedDOM: HTMLDocument = parser.parseFromString(dom, 'text/html')
  const textContent = parsedDOM.documentElement.textContent
  return textContent ? textContent : ''
}

const getHostName = (url: string | null): string => {
  if (!url) {
    return window.location.hostname
  }
  const parsedURL = URL.parse(url)
  return parsedURL.hostname || window.location.hostname
}

const getScreenName = (account: IAccount): string => {
  const userName: string = account.username
  const hostName: string = getHostName(account.url)
  return `${userName}@${hostName}`
}

export const tootParser = {
  hostName: getHostName,
  screenName: getScreenName,
  tootContent: getTootContent
}

export const getParsedToot = (toot: IStatus): IParsedToot => ({
  account: tootParser.screenName(toot.account),
  content: tootParser.tootContent(toot.content),
  id: toot.id,
  status: toot,
  visibility: toot.visibility
})
