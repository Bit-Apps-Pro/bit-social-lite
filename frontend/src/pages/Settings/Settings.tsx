import Error404 from '@pages/Error404'
import { lazy, Suspense } from 'react'
import { useParams } from 'react-router'

import { Loading } from '../../AppRoutes'
import SettingsWrapper from './SettingsWrapper'

const CronSettings = lazy(() => import('./CronSettings'))

export default function Settings() {
  const { option } = useParams()

  const getSetting = () => {
    switch (option) {
      case 'cron':
      case undefined: {
        return <CronSettings />
      }
      default: {
        return <Error404 />
      }
    }
  }

  return (
    <SettingsWrapper>
      <Suspense fallback={<Loading />}>{getSetting()}</Suspense>
    </SettingsWrapper>
  )
}
