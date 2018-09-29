import { Listener } from '../../api/stream/listener'
import { Stream } from '../../api/stream/stream'
import { Auth } from '../../conf'
import { filterWords } from '../../filter/secret'
import { bot } from '../state'

const homeUpdateListener = new Listener()

const home = new Stream(Auth.hostName, Auth.bearerToken, 'home')
home.addListener('open', () => console.log('opened home'))
home.addListener('close', () => console.log('closed home'))
home.listener = homeUpdateListener

const localUpdateListener = new Listener()

const ltl = new Stream(Auth.hostName, Auth.bearerToken, 'local')
ltl.addListener('open', () => console.log('opened ltl'))
ltl.addListener('close', () => console.log('closed ltl'))
ltl.listener = localUpdateListener

const notifictionListener = new Listener()

const notification = new Stream(Auth.hostName, Auth.bearerToken, 'notification')
notification.addListener('open', () => console.log('opened notification'))
notification.addListener('close', () => console.log('closed notification'))
notification.listener = notifictionListener

const streams: Stream[] = [
  home,
  ltl,
  notification
]

const listeners = [
  localUpdateListener,
  homeUpdateListener,
  notifictionListener
]

listeners.map((listener) => listener.mute('screenname', bot.ID))
listeners.map((listener) => listener.mute('application', 'mastbot'))

const joinedFilterWords = filterWords.join('|')
listeners.map((listener) => listener.mute('content', joinedFilterWords))
listeners.map((listener) => listener.filterBot(true))

export {
  streams,
  homeUpdateListener,
  localUpdateListener,
  notifictionListener
}
