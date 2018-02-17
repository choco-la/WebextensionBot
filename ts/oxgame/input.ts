import { Coordinate } from '../types/oxgametype'

const replaceRowDict: {[key: string]: number} = {
  a: 0, b: 1, c: 2,
  ａ: 0, ｂ: 1, ｃ: 2
}

const replaceColumnDict: {[key: string]: number} = {
  '1': 0, '2': 1, '3': 2,
  '１': 0, '２': 1, '３': 2
}
export const findCoordinate = (text: string): Coordinate | null => {
  const alpNum = /([abcａｂｃ])[-ー−の]?([123１２３])/i
  const matchAN = alpNum.exec(text)
  if (matchAN) {
    const column = replaceColumnDict[matchAN[2]]
    const row = replaceRowDict[matchAN[1].toLowerCase()]
    return [row, column]
  }

  const numAlp = /([123１２３])[-ー−の]?([abcａｂｃ])/i
  const matchNA = numAlp.exec(text)
  if (matchNA) {
    const column = replaceColumnDict[matchNA[1]]
    const row = replaceRowDict[matchNA[2].toLowerCase()]
    return [row, column]
  }

  return null
}
