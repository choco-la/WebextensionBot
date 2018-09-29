import { tootParser } from '../tootparser'
import { API } from './api'

const bot = {
  // username@example.com
  ID: '',
  username: ''
}

// Ignore self.
API.read.verifyCredentials()
.then((account) => {
  bot.ID = tootParser.screenName(account)
  bot.username = account.username
})

export { bot }
