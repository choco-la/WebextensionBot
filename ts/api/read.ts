import { getFetcher, IFetcher } from '../request'
import { IAccount, IRelationship } from '../types/deftype'

export class ReadAPI {
  protected bearerToken: string
  protected hostName: string
  protected get: IFetcher

  constructor (host: string, token: string) {
    this.bearerToken = token
    this.hostName = host
    this.get = getFetcher(this.bearerToken)
  }

  public relationships = async (idarray: string[]): Promise<IRelationship[]> => {
    const query: string = `id[]=${idarray.join('&id[]=')}`
    const url = `https://${this.hostName}/api/v1/accounts/relationships?${query}`
    const response = await this.get(url)
    return response.json()
  }

  public verifyCredentials = async (): Promise<IAccount> => {
    const url = `https://${this.hostName}/api/v1/accounts/verify_credentials`
    const response = await this.get(url)
    return response.json()
  }
}
