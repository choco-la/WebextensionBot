import { IAccount } from './deftypes'
import { isHTMLElem } from './typeguards'

const getTootContent = (rawdom: string): string => {
  const parser: DOMParser = new DOMParser()
  const dom = rawdom.replace(/<br(?: \/)?>/g, '\n')
  const parsedDOM: HTMLDocument = parser.parseFromString(dom, 'text/html')
  if (!isHTMLElem(parsedDOM.activeElement)) return ''
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

export const tootParser = {
  hostName: getHostName,
  screenName: getScreenName,
  tootContent: getTootContent
}
