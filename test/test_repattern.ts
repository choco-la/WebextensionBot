import { assert } from 'chai'
import { rePattern } from '../ts/repattern'

describe('rePattern', () => {
  describe('Assert true', () => {
    it('After', () => {
      assert.isTrue(rePattern.after.test('学校終わったっ'))
    })
    it('Close', () => {
      assert.isTrue(rePattern.close.test('おわり〜'))
    })
    it('Food', () => {
      assert.isTrue(rePattern.food.test("🍵どうぞ〜（*'∀'人）"))
    })
    it('Fortune', () => {
      assert.isTrue(rePattern.fortune.test('！おみくじ頂戴！'))
    })
    it('Kiss', () => {
      assert.isTrue(rePattern.kiss.test('ぶっちゅ〜！'))
    })
    it('Otoshidama', () => {
      assert.isTrue(rePattern.otoshidama.test('!お年玉'))
    })
  })

  describe('Assert false', () => {
    it('After', () => {
      assert.isFalse(rePattern.after.test('学校まだ終わってない'))
      // assert.isFalse(rePattern.after.test('学校終わったら'))
    })
    it('Close', () => {
      assert.isFalse(rePattern.close.test('終了のお知らせ'))
    })
    it('Food', () => {
      assert.isFalse(rePattern.food.test('🍛どうぞ'))
    })
    it('Fortune', () => {
      assert.isFalse(rePattern.fortune.test(''))
    })
    it('Kiss', () => {
      assert.isFalse(rePattern.kiss.test('ぴかちゅう'))
    })
    it('Otoshidama', () => {
      assert.isFalse(rePattern.otoshidama.test(''))
    })
  })
})
