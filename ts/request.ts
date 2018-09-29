export type ISender = (url: string, data: string | null) => Promise<Response>
export type IFetcher = (url: string) => Promise<Response>

interface IContent {
  fetch: (req: Request) => Promise<Response>
}
declare var content: IContent

const post = (url: string, token: string, data: string | null): Promise<Response> => {
  const HTTPHeaders = new Headers()
  HTTPHeaders.append('Content-Type', 'application/json; charset=utf-8')
  HTTPHeaders.append('Authorization', `Bearer ${token}`)
  const conf: RequestInit = {
    body: data,
    headers: HTTPHeaders,
    method: 'POST'
  }
  const request = new Request(url, conf)
  return content.fetch(request)
}

const get = async (url: string, token: string): Promise<Response> => {
  const HTTPHeaders = new Headers()
  HTTPHeaders.append('Authorization', `Bearer ${token}`)
  const conf: RequestInit = {
    headers: HTTPHeaders,
    method: 'GET'
  }
  const request = new Request(url, conf)
  const response = await content.fetch(request)
  if (!response.ok) throw new Error(response.statusText)
  if (response.status < 200 || response.status >= 300) {
    const error = new Error(response.statusText)
    Object.defineProperty(error, 'response', response)
    throw error
  }
  return response
}

export const getSender = (token: string): ISender => {
  return (url: string, data: string | null) => post(url, token, data)
}

export const getFetcher = (token: string): IFetcher => {
  return (url: string) => get(url, token)
}
