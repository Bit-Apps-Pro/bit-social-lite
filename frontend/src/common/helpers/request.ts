import config from '@config/config'

export interface EndpointType {
  bodyParams?: Record<string, MaybeArrayEndPointValueType>
  encrypted?: string[]
  headers?: Record<string, MaybeArrayEndPointValueType>
  method: 'GET' | 'POST'
  queryParams?: Record<string, MaybeArrayEndPointValueType>
  url: string
}

type MethodType = 'GET' | 'POST'

interface EncryptionValueType {
  encryption: 'base64_decode' | 'base64_encode' | 'hmac_decrypt' | 'hmac_encrypt'
  value: MaybeArrayEndPointValueType
}

type EndPointValueType = EncryptionValueType | number | string
type MaybeArrayEndPointValueType = EndPointValueType | EndPointValueType[]

interface OptionsType {
  body?: FormData | string
  headers: Record<string, string>
  method: MethodType
}

type QueryParam = Record<string, number | string>

export type ApiResponseType = Record<string, number | string>

export interface Response<T> {
  code: 'ERROR' | 'SUCCESS'
  data: T
  status: 'error' | 'success'
}

export default async function request<T>(
  action: string,
  data?: any | FormData | null | Record<string, unknown> | undefined, // eslint-disable-line @typescript-eslint/no-explicit-any
  queryParam?: null | QueryParam | undefined,
  method: MethodType = 'POST'
): Promise<Response<T>> {
  const { AJAX_URL, NONCE, ROUTE_PREFIX } = config
  const uri = new URL(AJAX_URL)
  uri.searchParams.append('action', `${ROUTE_PREFIX}${action}`)
  uri.searchParams.append('_ajax_nonce', NONCE)

  // append query params in url
  if (queryParam !== null) {
    for (const key in queryParam) {
      if (key) {
        uri.searchParams.append(key, queryParam[key as keyof QueryParam].toString())
      }
    }
  }

  const options: OptionsType = {
    headers: {},
    method
  }

  if (method.toLowerCase() === 'post') {
    options.body = data instanceof FormData ? data : JSON.stringify(data)
  }

  return (await fetch(uri, options).then(res => res.json())) as Response<T>
}

export async function proxyRequest<T>(data: EndpointType): Promise<Response<T>> {
  return request<T>('proxy/route', data).catch(error => error as Response<T>)
}
