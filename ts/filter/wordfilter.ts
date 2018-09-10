export class WordFilter {
  private wordSet: Set<string>
  constructor (word?: string) {
    this.wordSet = new Set()
    if (!word) return
    this.wordSet.add(word)
  }

  public add = (word: string): void => {
    this.wordSet.add(word)
  }

  public test = (text: string): boolean => {
    if (this.wordSet.has(text)) return true
    return false
  }
}
