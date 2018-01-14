import { assert } from 'chai'
import { tootParser } from '../ts/tootparser'
import { tootSampleNico } from './mock_toot'

describe('tootParser', () => {
  describe('Strings', () => {
    it('Parse blank', () => {
      const input = ''
      const content = tootParser.tootContent(input)
      assert.strictEqual(content, '')
    })

    it('Parse new lines', () => {
      const input = '\n\n\n\n'
      const content = tootParser.tootContent(input)
      assert.strictEqual(content, '\n\n\n\n')
    })
  })

  describe('JSON', () => {
    it('Parse content', () => {
      // tslint:disable-next-line: max-line-length
      const samplecontent = ':@example_display_name0: content\n#sampleHashtag\ntoot content A\ntoot content B\nhttps://example.com/index.html'
      const content = tootParser.tootContent(tootSampleNico.content)
      assert.strictEqual(content, samplecontent)
    })

    it('Parse name', () => {
      const screenName = tootParser.screenName(tootSampleNico.account)
      assert.strictEqual(screenName, 'example_display_name0@example.com')
    })
  })
})
