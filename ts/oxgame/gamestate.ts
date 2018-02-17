import { Coordinate, Mark, State } from '../types/oxgametype'
import { calcNextMove, isEmptyCoorinate, isFilledState, isWin } from './scan'

type Result = Mark | 'draw' | 'invalid' | null

const genOXState = (): State => [
  ['＿', '＿', '＿'],
  ['＿', '＿', '＿'],
  ['＿', '＿', '＿']
]

const makeMove = (coordinate: Coordinate, state: State, mark: Mark) => {
  const [row, column] = coordinate
  state[row][column] = mark
}

const getView = (state: State): string => {
  return String.raw`
＿|１|２|３|
Ａ|${state[0][0]}|${state[0][1]}|${state[0][2]}|
Ｂ|${state[1][0]}|${state[1][1]}|${state[1][2]}|
Ｃ|${state[2][0]}|${state[2][1]}|${state[2][2]}|
`
}

export class OXGame {
  private playerMark: Mark
  private botMark: Mark
  private gameState: State

  constructor (playerMark: Mark) {
    this.playerMark = playerMark
    if (playerMark === '◯') this.botMark = '✕'
    else if (playerMark === '✕') this.botMark = '◯'

    this.gameState = genOXState()
  }

  public get player () {
    return this.playerMark
  }

  public get bot () {
    return this.botMark
  }

  public initMove = (): Result => {
    this.botMove()
    if (isWin(this.botMark, this.gameState)) return this.botMark

    // Draw.
    if (isFilledState(this.gameState)) return 'draw'
    return null
  }

  public move = (coordinate: Coordinate): Result => {
    if (!isEmptyCoorinate(coordinate, this.gameState)) return 'invalid'

    this.playerMove(coordinate)
    if (isWin(this.playerMark, this.gameState)) return this.playerMark

    this.botMove()
    if (isWin(this.botMark, this.gameState)) return this.botMark

    // Draw.
    if (isFilledState(this.gameState)) return 'draw'
    return null
  }

  public stateView = (): string => {
    return getView(this.gameState)
  }

  private playerMove = (coordinate: Coordinate): void => {
    makeMove(coordinate, this.gameState, this.playerMark)
  }

  private botMove = (): void => {
    const coordinate = calcNextMove(this.botMark, this.playerMark, this.gameState)
    if (coordinate === null) return
    makeMove(coordinate, this.gameState, this.botMark)
  }
}
