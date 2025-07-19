// interface cls { [key: string]: string; }

// declare module '*.module.css' {
//   const classes: { [key: string]: string }
//   export = classes
// }

declare module 'i18nWrap'
declare module 'incstr'
declare module 'postcss-csso'
declare module '*.module.css'
declare module '*.module.scss'
declare module '*.module.sass'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.webp'
declare module '*.json'
declare module 'bitapps-dev-utils'

declare let bitapp
declare let wp

type KeyedValueHandler<T> = <K extends keyof T>(key: K, value: T[K]) => void

declare const VITE_PLUGIN_HAS_SUBMODULE_UPDATES: boolean

declare const SERVER_VARIABLES: {
  ajaxURL: string
  apiURL: {
    base: string
    separator: string
  }
  assetsURL: string
  baseURL: string
  dateFormat: string
  isPro: string
  isProExist: string
  key?: string
  loggedInUserName: string
  nonce: string
  pluginSlug: string
  proPluginVersion: string
  proPluginVersion: string
  proSlug: string
  rootURL: string
  routePrefix: string
  settings: string
  siteBaseURL: string
  siteUrl: string
  timeFormat: string
  timeZone: string
  translations?: Record<string, string>
  version: string
}
