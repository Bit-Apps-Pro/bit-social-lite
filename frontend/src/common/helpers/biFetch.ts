import config from '@config/config'

interface OptionsType {
  body?: string
  headers: Record<string, string>
  method: string
}

type MethodType = 'DELETE' | 'GET' | 'POST' | 'PUT'

interface QueryParam {
  [`key`]: string
}

export default async function biFetch<T extends [] | object>(
  action: string,
  data: null | T,
  queryParam: null | QueryParam,
  method: MethodType
) {
  const { API_URL, NONCE, ROUTE_PREFIX } = config
  const uri = new URL(API_URL.base)
  uri.searchParams.append('action', `${ROUTE_PREFIX}${action}`)
  uri.searchParams.append('_ajax_nonce', NONCE)

  if (queryParam !== null) {
    const queryParams = Object.keys(queryParam)
    queryParams.forEach(param => {
      if (param) uri.searchParams.append(param, queryParam[param as keyof QueryParam])
    })
  }

  const options: OptionsType = {
    headers: {
      'Content-Type': 'application/json'
    },
    method
  }

  if (
    method.toLowerCase() === 'post' ||
    method.toLowerCase() === 'put' ||
    method.toLowerCase() === 'delete'
  ) {
    options.body = JSON.stringify(data)
  }

  return fetch(uri, options).then(res => res.json())
}
