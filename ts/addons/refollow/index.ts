import { API } from '../../bot/api'
import { INotification } from '../../types/deftype'

export const refollow = (recv: INotification) => {
  const account = recv.account.id
  API.read.relationships([account])
  .then((relationships) => {
    const isFollowing: boolean = relationships[0].following
    const id = relationships[0].id
    if (isFollowing) return
    API.follow.follow(id)
    .then(() => console.log(`follow: ${id}`))
    .catch((err) => console.error(err))
  })
  .catch((err) => console.error(err))
}
