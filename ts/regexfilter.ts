import * as fs from 'fs'

const readLinesIntoRegex = (file: string, enc: string = 'utf-8'): Set<RegExp> => {
  let fileContent: string
  const lines: Set<RegExp> = new Set()
  try {
    fileContent = fs.readFileSync(file, enc)
  } catch (err) {
    console.error(err)
    return new Set()
  }
  for (const line of fileContent.split('\n')) {
    const pattern = line.trim()
    if (pattern.length <= 0 || pattern.startsWith('#')) continue
    lines.add(new RegExp(pattern, 'iu'))
  }
  return lines
}

export class RegexFilter {
  private regexSet: Set<RegExp>
  constructor (file: string, enc: string = 'utf-8') {
    this.regexSet = readLinesIntoRegex(file, enc)
  }

  public test (text: string): boolean {
    for (const re of this.regexSet) {
      if (re.test(text)) return true
    }
    return false
  }
}
