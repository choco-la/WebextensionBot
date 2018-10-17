import { API } from '../../bot/api'
import { randomContent } from '../../bot/botcontents'
import { IArgumentToot } from '../../types/apitype'
import { IParsedToot } from '../../types/deftype'
import { OXGame } from './gamestate'
import { Coordinate, Mark } from './oxgametype'

// OXGame states.
const oxGameStates: {[key: string]: OXGame} = {}

const playOXGame = (toot: IParsedToot, oxCoordinate: Coordinate | null, mark: Mark, ismention?: boolean): void => {
  // Setup
  if (!oxGameStates[toot.account]) {
    const newGame = new OXGame(mark)
    oxGameStates[toot.account] = newGame
  }

  const state = oxGameStates[toot.account]
  let result = null
  if (oxCoordinate) result = state.move(oxCoordinate)
  else result = state.initMove()
  const nowState = state.stateView()
  if (result === '◯' || result === '✕' || result === 'draw') {
    delete oxGameStates[toot.account]
  } else if (result === 'invalid') {
    const invalid = 'そこゎ置けないょ(∩´﹏`∩)💦'
    const sendDataOnInvalid: IArgumentToot = {
      status: `@${toot.account} ${invalid}`,
      visibility: toot.visibility
    }
    if (ismention) sendDataOnInvalid.in_reply_to_id = toot.id
    setTimeout(() => API.write.toot(sendDataOnInvalid), 3000)
    return
  }

  const playerMark = state.player
  const botMark = state.bot

  let prefixMsg = ''
  switch (result) {
    // Player wins.
    case playerMark:
      prefixMsg = randomContent.oxGameYouWin()
      break
    case botMark:
      prefixMsg = randomContent.oxGameYouLose()
      break
    case null:
      prefixMsg = randomContent.oxGameThinking()
      break
    case 'draw':
      prefixMsg = '引き分けだね〜(๑>◡<๑)'
      break
  }

  const msg = `${prefixMsg}\n${nowState}`
  const sendData: IArgumentToot = {
    spoiler_text: `あなた: ${playerMark} ぅゅ: ${botMark}`,
    status: `@${toot.account} ${msg}`,
    visibility: toot.visibility
  }
  if (ismention) sendData.in_reply_to_id = toot.id
  setTimeout(() => API.write.toot(sendData), 3000)
}

const resetOXGame = (toot: IParsedToot, oxCoordinate: Coordinate | null, mark: Mark, ismention?: boolean): void => {
  const newGame = new OXGame(mark)
  oxGameStates[toot.account] = newGame

  playOXGame(toot, oxCoordinate, mark, ismention)
}

export { playOXGame, resetOXGame }
