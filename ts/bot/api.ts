import { Auth } from '../conf'
import { APIRateLimit, MastodonAPI } from '../limitapi'

const rateLimit = APIRateLimit()
export const API = new MastodonAPI(Auth.hostName, Auth.bearerToken, rateLimit)
API.setRateLimit(1, 12)
API.setCoolTime(90000)
API.write.visibility = 'public'
