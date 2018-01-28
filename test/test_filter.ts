import { assert } from 'chai'
import { RegexFilter } from '../ts/regexfilter'
import { WordFilter } from '../ts/wordfilter'

const muteApplications = [
  'mastbot',
  '_mastbot'
]

const muteContents = [
  String.raw`(?:死|ﾀﾋ)ね|殺す`,
  String.raw`\\`,
  String.raw`[0-9]/.`
]

describe('RegexFlter', () => {
  const filter = new RegexFilter(muteContents)

  it('Assert true', () => {
    assert.isTrue(filter.test('ﾀﾋね'))
    assert.isTrue(filter.test('\\'))
    assert.isTrue(filter.test('1/0'))
  })

  it('Assert false', () => {
    assert.isFalse(filter.test('死す'))
    assert.isFalse(filter.test('[0-9]/.'))
  })
})

describe('WordFilter', () => {
  const filter = new WordFilter(muteApplications)

  it('Assert true', () => {
    assert.isTrue(filter.test('mastbot'))
    assert.isTrue(filter.test('_mastbot'))
  })

  it('Assert false', () => {
    assert.isFalse(filter.test('__mastbot'))
  })
})
