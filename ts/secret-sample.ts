const filterWords = [
  String.raw`死ね`,
  String.raw`殺す`
]

class RegexFilter {
  private regexs: Set<RegExp>
  constructor (patterns: string[]) {
    this.regexs = new Set()
    for (const pattern of patterns) {
      const re = new RegExp(pattern)
      this.regexs.add(re)
    }
  }

  public test (text: string) {
    for (const re of this.regexs) {
      if (re.test(text)) return true
    }
    return false
  }
}

export const secretFilter = new RegexFilter(filterWords)
