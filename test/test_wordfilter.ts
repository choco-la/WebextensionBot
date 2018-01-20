import { assert } from 'chai'
import * as path from 'path'
import { WordFilter } from '../ts/wordfilter'

describe('WordFilter', () => {
  const muteWordsFile = path.join(__dirname, './', 'mock_muteword.txt')
  const filter = new WordFilter(muteWordsFile)
  it('Assert true', () => {
    assert.isTrue(filter.test('#this_hashtag_should_be_muted'))
    assert.isTrue(filter.test('\\'))
    assert.isTrue(filter.test('.*'))
  })

  it('Assert false', () => {
    assert.isFalse(filter.test('# comment'))
    assert.isFalse(filter.test('not match'))
  })
})
