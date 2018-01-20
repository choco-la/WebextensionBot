import * as fs from 'fs'

const readLinesIntoWords = (file: string, enc: string = 'utf-8'): Set<string> => {
  let fileContent: string
  const lines: Set<string> = new Set()
  try {
    fileContent = fs.readFileSync(file, enc)
  } catch (err) {
    console.error(err)
    return new Set()
  }
  for (const line of fileContent.split('\n')) {
    const pattern = line.trim()
    // Not to continue when startsWith '#[^\s]' for hashtag filtering.
    if (pattern.length <= 0 || pattern.startsWith('# ')) continue
    lines.add(pattern)
  }
  return lines
}

export class WordFilter {
  private wordSet: Set<string>
  constructor (file: string, enc: string = 'utf-8') {
    this.wordSet = readLinesIntoWords(file, enc)
  }

  public test (text: string): boolean {
    if (this.wordSet.has(text)) return true
    return false
  }
}
