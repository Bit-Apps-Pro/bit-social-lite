import '@plugin-commons/resources/css/antd-reset.css'
import '@plugin-commons/resources/css/wp-css-reset.css'
import '@resource/styles/global.css'
import '@resource/styles/utilities.css'
import BuyPro from '@components/BuyPro'
// import '@resource/styles/variables.css'
// import '@resource/styles/wp-css-reset.css'
// import 'antd/dist/reset.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { enableMapSet } from 'immer'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'

import AppRoutes from './AppRoutes'

enableMapSet()

const queryClient = new QueryClient()
const elm = document.querySelector('#bit-apps-root')
if (elm) {
  const root = createRoot(elm)

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <BuyPro />
          <AppRoutes />
        </HashRouter>
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      </QueryClientProvider>
    </StrictMode>
  )
}
