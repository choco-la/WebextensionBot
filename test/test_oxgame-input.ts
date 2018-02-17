import { assert } from 'chai'
import { findCoordinate } from '../ts/oxgame/input'

describe('findCoordinate', () => {
  it('Acceptable', () => {
    assert.deepEqual(findCoordinate('1-a'), [0, 0])
    assert.deepEqual(findCoordinate('2-a'), [0, 1])
    assert.deepEqual(findCoordinate('aの2'), [0, 1])
    assert.deepEqual(findCoordinate('1のA'), [0, 0])
    assert.deepEqual(findCoordinate('２−B'), [1, 1])
  })
})
