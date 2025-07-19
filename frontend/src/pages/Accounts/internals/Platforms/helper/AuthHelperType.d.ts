import type platforms from '@config/platforms'

export type AuthCodeResponseType = Record<string, string>

export interface AuthCodeResponseCustomType {
  code: string
  guild_id: string
  oauth_verifier: string
  rest_route: string
}

export interface CredentialsType {
  apiVersion?: null | string
  appId: string
  appSecret: string
  platform: keyof typeof platforms
  redirectUri: string
}
