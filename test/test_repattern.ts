import { assert } from 'chai'
import { rePattern, sholdWipeTL } from '../ts/repattern'

describe('rePattern', () => {
  describe('Assert true', () => {
    it('After', () => {
      assert.isTrue(rePattern.after.test('学校終わったっ'))
      assert.isTrue(rePattern.after.test('学校終わり〜'))
      assert.isTrue(rePattern.after.test('しごおわ'))
      assert.isTrue(rePattern.after.test('バイトから帰った'))
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
    it('GameReset', () => {
      assert.isTrue(rePattern.resetgame.test('げーむやりなおし'))
    })
  })

  describe('Assert false', () => {
    it('After', () => {
      assert.isFalse(rePattern.after.test('学校まだ終わってない'))
      assert.isFalse(rePattern.after.test('学校終わったら'))
      assert.isFalse(rePattern.after.test('学校帰りに'))
      assert.isFalse(rePattern.after.test('学校終わってない'))
      assert.isFalse(rePattern.after.test('仕事終わらん'))
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
    it('GameReset', () => {
      assert.isFalse(rePattern.resetgame.test(''))
    })
  })
})

describe('sholdWipeTL', () => {
  describe('Assert true', () => {
    it('wipeTL', () => {
      assert.isTrue(sholdWipeTL('ﾎﾋﾎﾋﾎﾋﾎﾋ!!'))
      assert.isTrue(sholdWipeTL('あﾌﾞﾘ'))
      assert.isTrue(sholdWipeTL('ﾌﾞﾘｯｺ'))
    })
  })

  describe('Assert false', () => {
    it('wipeTL', () => {
      assert.isFalse(sholdWipeTL('ｱｲｳｴｱｲｳｴ!!'))
      assert.isFalse(sholdWipeTL('ｱｱｱｱｱｱｱｱ!!'))
    })
  })
})
