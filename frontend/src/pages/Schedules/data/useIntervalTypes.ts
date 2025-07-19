import { $appConfig } from '@common/globalStates'
import { __ } from '@common/helpers/i18nWrap'
import { useAtomValue } from 'jotai'

export default function useIntervalTypes() {
  const { isProClient } = useAtomValue($appConfig)

  const freeIntervalTypes = [
    { label: __('Minute'), value: 'minute' },
    { label: __('Hour'), value: 'hour' }
  ]

  const proIntervalTypes = [
    { label: __('Minute'), value: 'minute' },
    { label: __('Hour'), value: 'hour' },
    { label: __('Day'), value: 'day' },
    { label: __('Week'), value: 'week' },
    { label: __('Month'), value: 'month' },
    { label: __('Year'), value: 'year' }
  ]

  if (isProClient) {
    return proIntervalTypes
  }

  return freeIntervalTypes
}
