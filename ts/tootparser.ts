import { URL } from 'url'
import { DOMParser } from 'xmldom'
import { IAccount } from './deftypes'

const getTootContent = (rawdom: string): string => {
  const dom = rawdom.replace(/<br(?: \/)?>/g, '\n')
  // Return blank string or new line.
  if (/^\n*$/.test(dom)) return dom
  const parser: DOMParser = new DOMParser()
  const parsedDOM: HTMLDocument = parser.parseFromString(dom, 'text/html')
  const textContent = parsedDOM.documentElement.textContent
  return textContent ? textContent : ''
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

export const tootParser = {
  hostName: getHostName,
  screenName: getScreenName,
  tootContent: getTootContent
}
