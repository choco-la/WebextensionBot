import { API } from '../api'
import { parseForEnquete } from './parseenquete'

export const enquete = (status: string): void => {
  const parsed = parseForEnquete(status)
  if (!parsed) return
  const [ question, enqueteItems ] = parsed
  const sendEnquete = {
    enquete_items: enqueteItems,
    isEnquete: true,
    status: question
  }
  API.write.takeInstantEnquete(sendEnquete)
}
