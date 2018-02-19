import { assert } from 'chai'
import { TEST } from '../ts/oxgame/scan'
import { IStateCount, State } from '../ts/types/oxgametype'

const reachState1: State = [
  ['◯', '＿', '＿'],
  ['✕', '◯', '✕'],
  ['＿', '✕', '＿']
]
const reachCount1: IStateCount = {
  '◯': [
    [1, 1, 0],
    [1, 1, 0],
    [2, 1]
  ],
  '✕': [
    [0, 2, 1],
    [1, 1, 1],
    [0, 0]
  ]
}

const reachState2: State = [
  ['◯', '＿', '◯'],
  ['✕', '＿', '✕'],
  ['＿', '✕', '＿']
]
const reachCount2: IStateCount = {
  '◯': [
    [2, 0, 0],
    [1, 0, 1],
    [1, 1]
  ],
  '✕': [
    [0, 2, 1],
    [1, 1, 1],
    [0, 0]
  ]
}

const lineState1: State = [
  ['◯', '＿', '＿'],
  ['◯', '✕', '✕'],
  ['◯', '✕', '＿']
]
const lineCount1: IStateCount = {
  '◯': [
    [1, 1, 1],
    [3, 0, 0],
    [1, 1]
  ],
  '✕': [
    [0, 2, 1],
    [0, 2, 1],
    [1, 1]
  ]
}

describe('countUpState', () => {
  it('Assert true', () => {
    assert.deepEqual(TEST.countUpState(reachState1), reachCount1)
    assert.deepEqual(TEST.countUpState(reachState2), reachCount2)
  })

  it('Assert false', () => {
    assert.notDeepEqual(TEST.countUpState(reachState2), reachCount1)
    assert.notDeepEqual(TEST.countUpState(reachState1), reachCount2)
  })
})

describe('searchReachCoordinate', () => {
  it('Found', () => {
    assert.deepEqual(TEST.searchReachCoordinate(reachCount1['◯'], reachState1), [2, 2])
    assert.deepEqual(TEST.searchReachCoordinate(reachCount2['◯'], reachState2), [0, 1])
  })
  it('Not found', () => {
    assert.strictEqual(TEST.searchReachCoordinate(reachCount1['✕'], reachState1), null)
  })
  it('Assert invalid', () => {
    assert.notDeepEqual(TEST.searchReachCoordinate(reachCount2['◯'], reachState1), [2, 2])
  })
})

describe('checkDiagonalLine', () => {
  it('Acceptable', () => {
    assert.deepEqual(TEST.checkDiagonalLine(0, 0), [true, false])
    assert.deepEqual(TEST.checkDiagonalLine(1, 1), [true, true])
    assert.deepEqual(TEST.checkDiagonalLine(0, 2), [false, true])
  })
})

describe('getReachCoordinate', () => {
  it('Found', () => {
    assert.deepEqual(TEST.getReachCoordinate(2, 0, reachState1), [2, 2])
  })
  it('Not found', () => {
    assert.strictEqual(TEST.getReachCoordinate(1, 0, lineState1), null)
  })
})
