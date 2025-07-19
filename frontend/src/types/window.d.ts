export interface BitSocialType {
  [key: string]: string
  apiURL: {
    base: string
    separator: string
  }
}

export {}
declare global {
  interface Window {
    bit_social_: BitSocialType
  }
}
