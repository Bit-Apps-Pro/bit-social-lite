import { Skeleton } from 'antd'

import Analytics from './Analytics'
import useAnalytics from './data/useAnalytics'
import DefaultDashboard from './DefaultDashboard'

export default function Root() {
  const { analytics, isAnalyticsLoading } = useAnalytics()

  if (isAnalyticsLoading) return <Skeleton />
  const isAnalytics = analytics.some(item => Number(item.count) > 0)

  return isAnalytics ? <Analytics /> : <DefaultDashboard />
}
