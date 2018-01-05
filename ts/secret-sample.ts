const filterWords = [
  String.raw`死ね`,
  String.raw`殺す`
]

export const secretFilter = new RegExp(filterWords.join('|'))
