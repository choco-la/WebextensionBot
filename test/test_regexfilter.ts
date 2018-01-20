import { assert } from 'chai'
import * as path from 'path'
import { RegexFilter } from '../ts/regexfilter'

describe('RegexFilter', () => {
  const muteWordsFile = path.join(__dirname, './', 'mock_muteregex.txt')
  const filter = new RegexFilter(muteWordsFile)
  it('Assert true', () => {
    assert.isTrue(filter.test('TeSt'))
    assert.isTrue(filter.test('0000'))
    assert.isTrue(filter.test('ABA'))
    assert.isTrue(filter.test('\\'))
    assert.isTrue(filter.test('test/test'))
  })

  it('Assert false', () => {
    assert.isFalse(filter.test('set'))
    assert.isFalse(filter.test('ABAB'))
    assert.isFalse(filter.test('# comment'))
    assert.isFalse(filter.test(''))
  })
})
