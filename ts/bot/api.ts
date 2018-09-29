import { Auth } from '../conf'
import { MastodonAPI } from '../limitapi'

export const API = new MastodonAPI(Auth.hostName, Auth.bearerToken)
API.setRateLimit(1, 12)
API.setCoolTime(90000)
API.write.visibility = 'public'
