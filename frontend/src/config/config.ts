type GetServerVariableType = <K extends keyof typeof SERVER_VARIABLES>(
  key: K,
  fallback?: (typeof SERVER_VARIABLES)[K]
) => (typeof SERVER_VARIABLES)[K]

const getServerVariable: GetServerVariableType = (key, fallback) => {
  if (!key && fallback) return fallback
  if (!(key in SERVER_VARIABLES) || !SERVER_VARIABLES?.[key]) {
    if (import.meta.env.MODE !== 'test') {
      console.error('🚥 Missing server variable:', key)
    }

    if (fallback) return fallback
  }

  return SERVER_VARIABLES[key]
}
interface ConfigType {
  AJAX_URL: string
  ALL_CLIENT_ID_URL: string
  API_URL: { base: string; separator: string }
  BASE_SERVER_URL: string
  CLIENT_SECRET_URL: string
  DATE_FORMAT: string
  FREE_VERSION: string
  IS_DEV: boolean
  IS_PRO: boolean
  IS_PRO_EXIST: boolean
  KEY?: string
  NONCE: string
  PLUGIN_SLUG: string
  PRO_SLUG?: string
  PRO_VERSION: string
  PRODUCT_NAME: string
  REDIRECT_URL: string
  ROOT_URL: string
  ROUTE_PREFIX: string
  SITE_BASE_URL: string
  SITE_URL: string
  TIME_FORMAT: string
}

const config = {
  AJAX_URL: getServerVariable('ajaxURL', 'http://.local/wp-admin/admin-ajax.php'),
  ALL_CLIENT_ID_URL: 'https://auth-apps.bitapps.pro/apps/all', // TODO: make this dynamic
  API_URL: getServerVariable('apiURL', {
    base: 'http://bit-social.xyz/wp-json/bit-social/v1',
    separator: '?'
  }) as { base: string; separator: string },
  BASE_SERVER_URL: 'https://auth-apps.bitapps.pro/apps/', // TODO: make this dynamic
  CLIENT_SECRET_URL: 'https://auth-apps.bitapps.pro/apps/secret', // TODO: make this dynamic
  DATE_FORMAT: getServerVariable('dateFormat'),
  FREE_VERSION: getServerVariable('version'),
  IS_DEV: true,
  IS_PRO: SERVER_VARIABLES.isPro === '1',
  IS_PRO_EXIST: getServerVariable('isProExist', '0') === '1',
  KEY: getServerVariable('key'),
  NONCE: getServerVariable('nonce', ''),
  PLUGIN_SLUG: getServerVariable('pluginSlug', 'bit-social'),
  PRO_SLUG: getServerVariable('proSlug'),
  PRO_VERSION: getServerVariable('proPluginVersion'),
  PRODUCT_NAME: 'Bit Social',
  REDIRECT_URL: 'https://auth-apps.bitapps.pro/redirect/v2', // TODO: make this dynamic
  ROOT_URL: getServerVariable('rootURL', 'http://.local'),
  ROUTE_PREFIX: getServerVariable('routePrefix', 'bit_social_'),
  SITE_BASE_URL: getServerVariable('siteBaseURL'),
  SITE_URL: getServerVariable('siteUrl'),
  TIME_FORMAT: getServerVariable('timeFormat')
} satisfies ConfigType

export default config
