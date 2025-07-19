import { $accountConnect, setAtom } from '@common/globalStates'

export default function saveAuthCodeResponse() {
  const windowURL = new URL(window.location.href)
  const searchParams = new URLSearchParams(windowURL.hash)

  const urlQuery: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    if (value) {
      urlQuery[key] = value
    }
  })

  if (!urlQuery.code && !urlQuery.oauth_verifier) {
    return
  }

  localStorage.setItem('__bitSocial_platform', JSON.stringify(urlQuery))

  if (urlQuery.code || urlQuery.oauth_verifier) {
    const accountConnectState = {
      isModalOpen: true,
      loading: true
    }
    setAtom($accountConnect, accountConnectState)
  }

  window.close()
}
