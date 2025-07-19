import { $appConfig } from '@common/globalStates'
import { Global, ThemeProvider } from '@emotion/react'
import Header from '@pages/Layout/ui/Header'
import globalCssInJs from '@resource/GlobalCss'
import { Loading } from '@src/AppRoutes'
import { Layout as AntLayout, notification, theme } from 'antd'
import { useAtomValue } from 'jotai'
import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router'

import cls from './Layout.module.css'

const { useToken } = theme

export default function Layout() {
  const { isDarkTheme } = useAtomValue($appConfig)
  const antConfig = useToken()

  const location = useLocation()

  notification.config({
    duration: 2.5,
    placement: 'bottomRight',
    rtl: false
  })

  return (
    <ThemeProvider theme={antConfig}>
      <AntLayout
        className={`${cls.layoutWrp} ${isDarkTheme ? 'dark' : 'light'}`}
        color-scheme={isDarkTheme ? 'dark' : 'light'}
        style={{
          backgroundColor: antConfig.token.colorBgContainer,
          border: `1px solid ${antConfig.token.controlOutline}`,
          borderRadius: antConfig.token.borderRadius
        }}
      >
        <Global styles={globalCssInJs(antConfig)} />

        <section className="bg-slate-50 dark:bg-transparent overflow-auto h-full">
          <Header />
          <main style={{ padding: 24 }}>
            <Suspense fallback={<Loading />} key={location.key}>
              <Outlet />
            </Suspense>
          </main>
        </section>
      </AntLayout>
    </ThemeProvider>
  )
}
