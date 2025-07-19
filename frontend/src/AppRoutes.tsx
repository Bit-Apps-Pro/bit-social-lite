import { StyleProvider } from '@ant-design/cssinjs'
import { $appConfig } from '@common/globalStates'
import { darkThemeConfig, lightThemeConfig } from '@config/theme'
import AllPluginEssentials from '@plugin-commons/components/AllPluginEssentials'
import { createAntDesignStyleContainer } from '@plugin-commons/utils/themeUtils'
import { useAppEssentials } from '@plugin-commons/utils/useAppEssentials'
import { ConfigProvider, Spin, theme } from 'antd'
import { useAtomValue } from 'jotai'
import { lazy } from 'react'
import { Route, Routes } from 'react-router'

const AuthResponseCapture = lazy(() => import('@pages/Accounts/AuthResponseCapture'))
const Accounts = lazy(() => import('@pages/Accounts'))
const Layout = lazy(() => import('@pages/Layout'))
const Logs = lazy(() => import('@pages/Logs'))
const Root = lazy(() => import('@pages/root/Root'))
const Schedules = lazy(() => import('@pages/Schedules'))
const Calendar = lazy(() => import('@pages/Calendar'))
const Settings = lazy(() => import('@pages/Settings'))
const ShareNow = lazy(() => import('@pages/ShareNow'))
const SocialTemplates = lazy(() => import('@pages/SocialTemplates'))
const AutoPost = lazy(() => import('@pages/AutoPost'))
const Support = lazy(() => import('@pages/Support'))
const Error404 = lazy(() => import('@pages/Error404'))

const { darkAlgorithm, defaultAlgorithm } = theme

const styleContainer = createAntDesignStyleContainer()

export default function AppRoutes() {
  const { isDarkTheme } = useAtomValue($appConfig)
  const themeTokens = isDarkTheme ? darkThemeConfig : lightThemeConfig
  const themeAlgorithm = isDarkTheme ? darkAlgorithm : defaultAlgorithm

  useAppEssentials()

  return (
    <ConfigProvider
      theme={{
        algorithm: themeAlgorithm,
        token: themeTokens
      }}
    >
      <StyleProvider container={styleContainer} hashPriority="high" layer>
        <AllPluginEssentials />
        <Routes>
          <Route element={<Layout />} path="/">
            <Route element={<Root />} index />

            <Route element={<Accounts />} path="accounts" />

            <Route path="accounts/auth">
              <Route element={<AuthResponseCapture />} path="*" />
            </Route>

            <Route element={<AutoPost />} path="auto-post" />

            <Route element={<Schedules />} path="schedules" />

            <Route element={<Calendar />} path="Calendar" />

            <Route element={<ShareNow />} path="share-now" />

            <Route element={<SocialTemplates />} path="templates/:platform?" />

            <Route element={<Logs />} path="logs" />

            <Route element={<Settings />} path="settings/:option?" />

            <Route element={<Support />} path="support" />

            <Route element={<Error404 />} path="*" />
          </Route>
        </Routes>
      </StyleProvider>
    </ConfigProvider>
  )
}

export function Loading() {
  return (
    <div css={{ padding: 50 }}>
      <Spin css={{ zIndex: 99_999 }} size="large" tip="Loading">
        <div className="content" />
      </Spin>
    </div>
  )
}
