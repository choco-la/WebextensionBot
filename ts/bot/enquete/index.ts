import { API } from '../api'

export const enquete = (status: string): void => {
  const questionPart = /(.+)[?？](.+)[:：](.+)/.exec(status)
  if (questionPart === null) return
  const sendEnquete = {
    enquete_items: questionPart.slice(2, 4),
    isEnquete: true,
    status: questionPart[1]
  }
  API.write.takeInstantEnquete(sendEnquete)
}
