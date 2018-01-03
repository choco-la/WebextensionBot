export const evalCalc = (rawinput: string): number => {
  // tslint:disable-next-line: ter-no-irregular-whitespace
  const input = replRand(rawinput).replace(/　/g, ' ')
                                  .replace(/＋/g, '+')
                                  .replace(/−/g, '-')
                                  .replace(/xｘ×✕✖/gi, '*')
                                  .replace(/÷➗/g, '/')
                                  .replace(/,/g, '')

  // Check if it contains any invalid characters.
  if (/[^0-9.+\-%^&*/><()\s]/.test(input)) return NaN

  // Separate Numeral or operator symbol.
  const pattern = String.raw`(\-?[0-9.]+|[+\-%^&]|[*/]{1,2}|[><]{2}|[()]+)`
  const re = new RegExp(pattern, 'g')
  const matchs = input.match(re)
  // Return if it is corrupt expression.
  if (!matchs) return NaN
  const expression = matchs.join(' ')

  let result: number
  try {
    // tslint:disable-next-line: no-eval
    result = Number(eval(expression))
  } catch (_) {
    return NaN
  }

  if (result > Number.MAX_SAFE_INTEGER) return Infinity
  const decFraction: string | undefined = result.toString().split('.')[1]
  // Rounded to 3 digits after the decimal point.
  if (decFraction && decFraction.length > 3) return Number(result.toFixed(3))
  else return result
}

const replRand = (raw: string): string => {
  const randomRe = /\$rand(?:om)?/i
  let result = raw.replace(randomRe, Math.round(Math.random() * 100).toString())
  while (randomRe.test(result)) {
    result = result.replace(randomRe, Math.round(Math.random() * 100).toString())
  }
  return result
}
