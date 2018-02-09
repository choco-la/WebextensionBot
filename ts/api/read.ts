import { IFullfilledXHR } from '../types/apitype'
import { IAccount, IRelationship } from '../types/deftype'

export class ReadAPI {
  protected bearerToken: string
  protected hostName: string

  constructor (host: string, token: string) {
    this.bearerToken = token
    this.hostName = host
  }

  public relationships = (idarray: string[]): Promise<IRelationship[]> => {
    return new Promise((resolve: (resp: IRelationship[]) => void,
                        reject: (err: IFullfilledXHR) => void) => {
      const query: string = `id[]=${idarray.join('&id[]=')}`
      const xhr = new XMLHttpRequest()
      xhr.open('GET', `https://${this.hostName}/api/v1/accounts/relationships?${query}`)
      xhr.setRequestHeader('Authorization', `Bearer ${this.bearerToken}`)
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

  public verifyCredentials = (): Promise<IAccount> => {
    return new Promise((resolve: (resp: IAccount) => void,
                        reject: (err: IFullfilledXHR) => void) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', `https://${this.hostName}/api/v1/accounts/verify_credentials`)
      xhr.setRequestHeader('Authorization', `Bearer ${this.bearerToken}`)
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
}
