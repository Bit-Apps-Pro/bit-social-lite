import { __ } from '@common/helpers/i18nWrap'
import request from '@common/helpers/request'
import { useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { type ReactNode } from 'react'
import { LuClock, LuMousePointerClick, LuText } from 'react-icons/lu'

interface SingleItem {
  count: number
  icon: ReactNode
  slug: string
  title: string
}

type GetAnalyticsType = Record<string, number>

const defaultData: SingleItem[] = [
  {
    count: 0,
    icon: <LuMousePointerClick />,
    slug: 'active_account_count',
    title: __('Active Account')
  },
  {
    count: 0,
    icon: <LuText />,
    slug: 'published_post_count',
    title: __('Published Post')
  },
  {
    count: 0,
    icon: <LuClock />,
    slug: 'active_schedule_count',
    title: __('Active Schedule')
  }
]

export default function useAnalytics() {
  const { data, isLoading } = useQuery<SingleItem[]>({
    queryFn: async () => {
      const { data: analytics } = await request<GetAnalyticsType>(
        'analytics',
        undefined,
        undefined,
        'GET'
      )

      return defaultData.map((item: SingleItem) =>
        produce(item, draft => {
          draft.count = analytics?.[item.slug] || 0
        })
      )
    },
    queryKey: ['analytics']
  })

  return {
    analytics: data || [],
    isAnalyticsLoading: isLoading
  }
}
