import { IFullfilledXHR } from '../types/apitype'

export class FollowAPI {
  protected bearerToken: string
  protected hostName: string

  constructor (host: string, token: string) {
    this.bearerToken = token
    this.hostName = host
  }

  public follow (id: string): Promise<IFullfilledXHR> {
    return new Promise((resolve: (resp: IFullfilledXHR) => void,
                        reject: (err: IFullfilledXHR) => void) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', `https://${this.hostName}/api/v1/accounts/${id}/follow`)
      xhr.setRequestHeader('Authorization', `Bearer ${this.bearerToken}`)
      xhr.timeout = 3000
      xhr.responseType = 'json'
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

      xhr.send()
    })
  }
}
