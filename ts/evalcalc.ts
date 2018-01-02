export const evalCalc = (rawinput: string): number => {
  // tslint:disable-next-line: ter-no-irregular-whitespace
  let input = rawinput.replace(/　/g, ' ')
  input = input.replace(/＋/g, '+')
  input = input.replace(/−/g, '-')
  input = input.replace(/ｘ×✕✖/g, '*')
  input = input.replace(/÷➗/g, '/')

  // Check if it contains any invalid characters.
  if (/[^0-9.+\-%^&*/><()\s]/.test(input)) return NaN

  // Separate Numeral or operator symbol.
  const pattern = String.raw`(\-?[0-9.]+|[+\-%^&]|[*/><]{1,2}|[()]+)`
  const re = new RegExp(pattern, 'g')
  const matchs = input.match(re)
  // Return if it is corrupt expression.
  if (!matchs) return NaN
  const expression = matchs.join(' ')

  try {
    // tslint:disable-next-line: no-eval
    const result = eval(expression)
    // Check if it is number (and is not NaN).
    if (isNaN(Number(result))) return NaN
    const decFraction: string | undefined = result.toString().split('.')[1]
    // Rounded to 3 digits after the decimal point.
    if (decFraction && decFraction.length > 3) return Number(result.toFixed(3))
    else return result
  } catch (_) {
    return NaN
  }
}
