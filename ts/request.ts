import { IFullfilledXHR } from './types/apitype'

export type ISender = (url: string, data: string | null) => Promise<IFullfilledXHR>
export type IFetcher = <T>(url: string) => Promise<T>

const post = (url: string, token: string, data: string | null): Promise<IFullfilledXHR> => {
  return new Promise((resolve: (resp: IFullfilledXHR) => void,
                      reject: (err: IFullfilledXHR) => void) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.timeout = 3000
    xhr.responseType = 'json'
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    xhr.withCredentials = true

    xhr.onloadend = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr)
      } else {
        reject(xhr)
      }
    }
    xhr.onerror = () => {
      reject(xhr)
    }

    xhr.send(data)
  })
}

const get = <T>(url: string, token: string): Promise<T> => {
  return new Promise((resolve: (resp: T) => void,
                      reject: (err: IFullfilledXHR) => void) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.timeout = 3000
    xhr.responseType = 'json'
    xhr.withCredentials = true

    xhr.onloadend = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response)
      } else {
        reject(xhr)
      }
    }
    xhr.onerror = () => {
      reject(xhr)
    }

    xhr.send()
  })
}

export const getSender = (token: string): ISender => {
  return (url: string, data: string | null) => post(url, token, data)
}

export const getFetcher = (token: string): IFetcher => {
  return (url: string) => get(url, token)
}
