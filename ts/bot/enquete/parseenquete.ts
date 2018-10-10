export const parseForEnquete = (text: string): [string, string[]] | null => {
  const questionPart = /([^:：]+)[?？](.+)[:：](.+)/.exec(text)
  if (!questionPart) return null
  return [ questionPart[1].trim(), questionPart.slice(2, 4).map((prop) => prop.trim())]
}
