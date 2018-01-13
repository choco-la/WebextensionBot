export const evalCalc = (rawinput: string): number => {
  const randomReplaced = replRand(rawinput)
  const maybeExpression = makeIntoExpression(randomReplaced)
  const expression = getValidExpression(maybeExpression)
  if (expression === null) return NaN

  return evaluateAsCalculation(expression)
}

const replRand = (raw: string): string => {
  const randomRe = /\$rand(?:om)?/i
  let result = raw.replace(randomRe, Math.round(Math.random() * 100).toString())
  while (randomRe.test(result)) {
    result = result.replace(randomRe, Math.round(Math.random() * 100).toString())
  }
  return result
}

const makeIntoExpression = (rawinput: string): string => {
  // tslint:disable-next-line: ter-no-irregular-whitespace
  const expression = rawinput.replace(/　/g, ' ')
                             .replace(/＋/g, '+')
                             .replace(/−/g, '-')
                             .replace(/[xｘ×✕✖]/gi, '*')
                             .replace(/[÷➗]/g, '/')
                             .replace(/,/g, '')

  return expression
}

const getValidExpression = (input: string): string | null => {
  // Check if it contains any invalid characters.
  if (/[^0-9.+\-%^&*/><()\s]/.test(input)) return null

  // Separate Numeral or operator symbol.
  const pattern = String.raw`(\-?[0-9.]+|[+\-%^&/]|\*{1,2}|[><]{2}|[()]+)`
  const re = new RegExp(pattern, 'g')
  const matchs = input.match(re)
  // Return if it is corrupt expression.
  if (!matchs) return null

  const expression = matchs.join(' ')
  return expression
}

const evaluateAsCalculation = (expression: string): number => {
  let result: number
  try {
    // tslint:disable-next-line: no-eval
    result = Number(eval(expression))
  } catch (_) {
    return NaN
  }

  if (!Number.isSafeInteger(result)) return NaN
  const decFraction: string | undefined = result.toString().split('.')[1]
  // Rounded to 3 digits after the decimal point.
  if (decFraction && decFraction.length > 3) return Number(result.toFixed(3))
  else return result
}
