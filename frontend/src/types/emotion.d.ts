import '@emotion/react'
import { type GlobalToken } from 'antd'
import { type MapToken } from 'antd/es/theme/interface'
import { type SeedToken } from 'antd/es/theme/internal'

declare module '@emotion/react' {
  export interface Theme {
    hashId: string
    theme: Theme<SeedToken, MapToken>
    token: GlobalToken
  }
}
