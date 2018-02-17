import { Coordinate, Counts, IStateCount, Mark, State } from '../types/oxgametype'

const countUpState = (state: State): IStateCount => {
  const countsTemplete: Counts = [
    [0, 0, 0], // Row
    [0, 0, 0], // Column
    [0, 0] // Diagonal
  ]

  const oState = deepCopy(countsTemplete)
  const xState = deepCopy(countsTemplete)
  const stateCount: IStateCount = {
    '◯': oState,
    '✕': xState
  }

  for (let row = 0; countsTemplete[0].length > row; row++) {
    for (let column = 0; countsTemplete[1].length > column; column++) {
      const value = state[row][column]
      if (value === '＿') continue
      stateCount[value][0][row] += 1

      stateCount[value][1][column] += 1

      const [isDiagonal0, isDiagonal1] = checkDiagonalLine(row, column)
      if (isDiagonal0) stateCount[value][2][0] += 1
      if (isDiagonal1) stateCount[value][2][1] += 1
    }
  }

  return stateCount
}

const checkDiagonalLine = (row: number, column: number): [boolean, boolean] => {
  if (row === 1 && column === 1) return [true, true] // Center.
  const diagonalPair = [
    [[0, 0], [2, 2]], // Diagonal like ＼.
    [[2, 0], [0, 2]] // Diagonal like ／.
  ] // Diagonal coordinate pairs except center.

  const result: [boolean, boolean] = [false, false]
  for (let index = 0; diagonalPair.length > index; index++) {
    const pairs = diagonalPair[index]
    for (const pair of pairs) {
      const [x, y] = pair
      if (row === x && column === y) {
        result[index] = true
        return result
      }
    }
  }

  return result
}

export const isWin = (mark: Mark, state: State): boolean => {
  const counts = countUpState(state)
  const markCount = counts[mark]
  for (const lines of markCount) {
    if (lines.indexOf(3) > -1) return true
  }
  return false
}

export const isFilledState = (state: State): boolean => {
  for (const line of state) {
    if (line.indexOf('＿') > -1) return false
  }
  return true
}

export const isEmptyCoorinate = (coordinate: Coordinate, state: State): boolean => {
  const [row, column] = coordinate
  return state[row][column] === '＿' ? true : false
}

const searchReachCoordinate = (counts: Counts, state: State): Coordinate | null => {
  for (let line = 0; counts.length > line; line++) {
    const lineCount = counts[line]
    for (let index = 0; lineCount.length > index; index++) {
      if (lineCount[index] === 2) {
        const reachCoordinate = getReachCoordinate(line, index, state)
        // Filled by my mark.
        if (reachCoordinate === null) continue
        return reachCoordinate
      }
    }
  }
  return null
}

const getReachCoordinate = (lineType: number, linePosition: number, state: State): Coordinate | null => {
  const lineLength = state.length
  switch (lineType) {
    // Row line.
    case 0: {
      for (let index = 0; lineLength > index; index++) {
        if (state[linePosition][index] === '＿') return [linePosition, index]
      }
      break
    }
    // Column line.
    case 1: {
      for (let index = 0; lineLength > index; index++) {
        if (state[index][linePosition] === '＿') return [index, linePosition]
      }
      break
    }
    // Diagonal line.
    case 2: {
      if (linePosition === 0) {
        for (const [row, column] of [[0, 0], [1, 1], [2, 2]]) {
          if (state[row][column] === '＿') return [row, column]
        }
      } else if (linePosition === 1) {
        for (const [row, column] of [[0, 2], [1, 1], [0, 2]]) {
          if (state[row][column] === '＿') return [row, column]
        }
      }
      break
    }
  }
  return null
}

const randomNextMove = (state: State): Coordinate | null => {
  const shuffledRow = shuffleArray([0, 1, 2])
  const shuffledColumn = shuffleArray([0, 1, 2])

  for (const row of shuffledRow) {
    for (const column of shuffledColumn) {
      const value = state[row][column]
      if (value === '＿') return [row, column]
    }
  }
  return null
}

const shuffleArray = <T>(list: T[]): T[] => {
  for (let index = list.length - 1; index > 0; index--) {
    const random = Math.floor(Math.random() * list.length)
    const tmp = list[index]
    list[index] = list[random]
    list[random] = tmp
  }
  return list
}

export const calcNextMove = (my: Mark, opponent: Mark, state: State): Coordinate | null => {
  const counts = countUpState(state)

  // Opponent first.
  for (const mark of [opponent, my]) {
    const reach = searchReachCoordinate(counts[mark], state)
    if (reach) return reach
  }

  const random = randomNextMove(state)
  if (random) return random

  return null
}

const deepCopy = <T>(arg: T): T => {
  const stringified = JSON.stringify(arg)
  return JSON.parse(stringified)
}
