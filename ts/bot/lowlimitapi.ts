import { Auth } from '../conf'
import { MastodonAPI } from '../limitapi'

export const LowLimitAPI = new MastodonAPI(Auth.hostName, Auth.bearerToken)
LowLimitAPI.setRateLimit(60, 60)
LowLimitAPI.setCoolTime(3000)
