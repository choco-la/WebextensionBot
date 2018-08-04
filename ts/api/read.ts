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

  public relationships = <T extends IRelationship[]>(idarray: string[]): Promise<T> => {
    const query: string = `id[]=${idarray.join('&id[]=')}`
    const url = `https://${this.hostName}/api/v1/accounts/relationships?${query}`
    return this.get(url)
  }

  public verifyCredentials = <T extends IAccount>(): Promise<T> => {
    const url = `https://${this.hostName}/api/v1/accounts/verify_credentials`
    return this.get(url)
  }
}
