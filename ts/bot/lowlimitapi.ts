import { Auth } from '../conf'
import { APIRateLimit, MastodonAPI } from '../limitapi'

const rateLimit = APIRateLimit()
export const LowLimitAPI = new MastodonAPI(Auth.hostName, Auth.bearerToken, rateLimit)
LowLimitAPI.setRateLimit(60, 60)
LowLimitAPI.setCoolTime(3000)
