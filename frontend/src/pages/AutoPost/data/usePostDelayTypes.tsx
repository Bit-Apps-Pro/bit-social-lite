import { $appConfig } from '@common/globalStates'
import { __ } from '@common/helpers/i18nWrap'
import { useAtomValue } from 'jotai'
import { LuCrown } from 'react-icons/lu'

export default function usePostDelayTypes() {
  const { isProClient } = useAtomValue($appConfig)

  const DelayValue = ({ value }: { value: string }) =>
    isProClient ? (
      value
    ) : (
      <>
        {value} <LuCrown color="#ff8609" size={16} />
      </>
    )

  return [
    { label: __('immediately'), value: '0' },
    { label: <DelayValue value={'5 minutes'} />, value: '5-minute' },
    { label: <DelayValue value={'10 minutes'} />, value: '10-minute' },
    { label: <DelayValue value={'20 minutes'} />, value: '20-minute' },
    { label: <DelayValue value={'30 minutes'} />, value: '30-minute' },
    { label: <DelayValue value={'1 hour'} />, value: '1-hour' },
    { label: <DelayValue value={'2 hours'} />, value: '2-hour' },
    { label: <DelayValue value={'3 hours'} />, value: '3-hour' },
    { label: <DelayValue value={'6 hours'} />, value: '6-hour' }
  ]
}
