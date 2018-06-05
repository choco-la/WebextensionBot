import { IArgumentToot, IFullfilledXHR, ISendToot } from '../../../types/apitype'
import { WriteAPI } from '../../write'
interface IArgumentTootWithToot extends IArgumentToot {
  enquete_items: string[],
  isEnquete: boolean | undefined
}

interface ISendTootWithEnquete extends ISendToot {
  enquete_items: string[],
  isEnquete: boolean,
}

export class FriendsNicoAPI extends WriteAPI {
  public takeInstantEnquete = (toot: IArgumentTootWithToot): void => {
    const {
      enquete_items = [],
      in_reply_to_id = null,
      isEnquete = false,
      media_ids = [],
      sensitive = false,
      spoiler_text = '',
      status,
      visibility = this.visibility
    } = toot

    const data = {
      enquete_items,
      in_reply_to_id,
      isEnquete,
      media_ids,
      sensitive,
      spoiler_text,
      status,
      visibility
    }
    this.enquete(data)
    .then((resp) => console.log(resp.status))
    .catch((resp) => console.error(`${resp.status}: ${resp.statusText}`))
  }

  private enquete = (data: ISendTootWithEnquete): Promise<IFullfilledXHR> => {
    return new Promise((resolve: (resp: IFullfilledXHR) => void,
                        reject: (err: IFullfilledXHR) => void) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', `https://${this.hostName}/api/v1/statuses`)
      xhr.setRequestHeader('Authorization', `Bearer ${this.bearerToken}`)
      xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
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

      xhr.send(JSON.stringify(data))
    })
  }
}
