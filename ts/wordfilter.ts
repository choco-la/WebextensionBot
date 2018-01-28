export class WordFilter {
  private wordSet: Set<string>
  constructor (words: Iterable<string>) {
    this.wordSet = new Set()
    for (const word of words) {
      this.wordSet.add(word)
    }
  }

  public add (word: string): void {
    this.wordSet.add(word)
  }

  public test (text: string): boolean {
    if (this.wordSet.has(text)) return true
    return false
  }
}
