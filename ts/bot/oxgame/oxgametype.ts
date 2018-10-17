export type Counts = [
  number[], // Count of marks on each rows.
  number[], // Count of marks on each columns.
  number[] // Count of marks on each diagonals. [＼, ／]
]

export interface IStateCount {
  '◯': Counts,
  '✕': Counts
}

export type Mark = keyof IStateCount
export type Coordinate = [number, number]

export type StateMark = Mark | '＿'
export type State = StateMark[][]
