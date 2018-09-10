import { Delete, INotification, IStatus, Visibility } from './deftype'

export const isDelete = (recv: any): recv is Delete => {
  return recv !== null && recv !== undefined && typeof(recv) === 'number'
}

export const isHTMLElem = (arg: any): arg is HTMLElement => {
  return arg !== null && arg !== undefined && arg.tagName.length > 0
}

export const isNofification = (recv: any): recv is INotification => {
  const types = /^(?:mention|reblog|favourite|follow)$/
  return recv !== null && recv !== undefined && types.test(recv.type)
}

export const isStatus = (recv: any): recv is IStatus => {
  return recv !== null && recv !== undefined && recv.content !== undefined
}

export const isVisibility = (arg: string): arg is Visibility => {
  return arg !== null && arg !== undefined && /^(?:public|unlisted|private|direct)$/.test(arg)
}
