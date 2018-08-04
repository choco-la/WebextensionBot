import { getSender, ISender } from '../request'

export class FollowAPI {
  protected bearerToken: string
  protected hostName: string
  protected post: ISender

  constructor (host: string, token: string) {
    this.bearerToken = token
    this.hostName = host
    this.post = getSender(this.bearerToken)
  }

  public follow = (id: string) => {
    const url = `https://${this.hostName}/api/v1/accounts/${id}/follow`
    return this.post(url, null)
  }
}
