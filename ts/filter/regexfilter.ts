export class RegexFilter {
  private regexSet: Set<RegExp>
  constructor (regex?: string) {
    this.regexSet = new Set()
    if (!regex) return
    const re = new RegExp(regex, 'iu')
    this.regexSet.add(re)
  }

  public add = (pattern: string): void => {
    const regex = new RegExp(pattern, 'iu')
    this.regexSet.add(regex)
  }

  public test = (text: string): boolean => {
    for (const re of this.regexSet) {
      if (re.test(text)) return true
    }
    return false
  }
}
