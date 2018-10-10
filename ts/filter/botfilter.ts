import { whitelists } from '../conf'
import { IStatus } from '../types/deftype'

export const botFilter = (account: IStatus['account'], name: string): boolean => {
  if (whitelists.notBot.indexOf(name) >= 0) return false
  return Boolean(account.bot)
}
