import { assert } from 'chai'
import { parseForEnquete } from '../ts/bot/enquete/parseenquete'

describe('parseEnquete', () => {
  it('Assert true', () => {
    const text1 = '@admin あんけーと: 質問 ? 回答1 : 回答2'
    assert.deepEqual(parseForEnquete(text1), ['質問', ['回答1', '回答2']])
    const text2 = '@admin あんけーと：\n質問 ？ 回答1 ： 回答2\n'
    assert.deepEqual(parseForEnquete(text2), ['質問', ['回答1', '回答2']])
  })
})
