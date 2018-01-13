import { assert } from 'chai'
import { evalCalc } from '../ts/evalcalc'

describe('Test evalCalc', () => {
  it('Simple calculate', () => {
    assert.strictEqual(evalCalc('2 + 2'), 4)
    assert.strictEqual(evalCalc('5 - 1'), 4)
    assert.strictEqual(evalCalc('2 * 2'), 4)
    assert.strictEqual(evalCalc('8 / 2'), 4)
    assert.strictEqual(evalCalc('24 % 5'), 4)
    assert.strictEqual(evalCalc('2 ** 2'), 4)
    assert.strictEqual(evalCalc('1 << 2'), 4)
    assert.strictEqual(evalCalc('16 >> 2'), 4)
  })

  it('Complicated calculate', () => {
    assert.strictEqual(evalCalc('$rand ** 0 * 4'), 4)
    assert.strictEqual(evalCalc('(1 ＋ 1) ｘ 2'), 4)
    assert.strictEqual(evalCalc('(1 　＋ 1.0) ｘ 2　+ 0'), 4)
  })

  it('NaN calculate', () => {
    // TODO: AssertionError: expected NaN to equal NaN
    // assert.strictEqual(evalCalc('1 / 0'), NaN)
    assert.strictEqual(Number.isNaN(evalCalc('strings')), true)
    assert.strictEqual(Number.isNaN(evalCalc('2( ** 2')), true)
    assert.strictEqual(Number.isNaN(evalCalc(`${Number.MAX_SAFE_INTEGER} + 1`)), true)
    assert.strictEqual(Number.isNaN(evalCalc(`-${Number.MAX_SAFE_INTEGER} - 1`)), true)
    assert.strictEqual(Number.isNaN(evalCalc('1 / 0')), true)
    assert.strictEqual(Number.isNaN(evalCalc('/^(0).*/ && %20()')), true)
  })
})
