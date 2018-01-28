export class RegexFilter {
  private regexSet: Set<RegExp>
  constructor (patterns: Iterable<string>) {
    this.regexSet = new Set()
    for (const pattern of patterns) {
      const regex = new RegExp(pattern, 'iu')
      this.regexSet.add(regex)
    }
  }

  public test (text: string): boolean {
    for (const re of this.regexSet) {
      if (re.test(text)) return true
    }
    return false
  }
}
