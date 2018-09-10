import { FollowAPI } from './follow'
import { FriendsNicoAPI as WriteAPI } from './instance/friends.nico'
import { ReadAPI } from './read'

export class MastodonAPI {
  public follow: FollowAPI
  public read: ReadAPI
  public write: WriteAPI

  constructor (host: string, token: string) {
    this.follow = new FollowAPI(host, token)
    this.read = new ReadAPI(host, token)
    this.write = new WriteAPI(host, token)
  }
}
