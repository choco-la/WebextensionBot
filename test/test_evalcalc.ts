import { assert } from 'chai'
import { evalCalc } from '../ts/evalcalc'

describe('evalCalc', () => {
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
    assert.deepEqual(evalCalc('strings'), NaN)
    assert.deepEqual(evalCalc('2( ** 2'), NaN)
    assert.deepEqual(evalCalc(`${Number.MAX_SAFE_INTEGER} + 1`), NaN)
    assert.deepEqual(evalCalc(`-${Number.MAX_SAFE_INTEGER} - 1`), NaN)
    assert.deepEqual(evalCalc('1 / 0'), NaN)
    assert.deepEqual(evalCalc('1 / 0'), NaN)
    assert.deepEqual(evalCalc('/^(0).*/ && %20()'), NaN)
    assert.deepEqual(evalCalc('/3./ + /2/'), NaN)
  })
})
