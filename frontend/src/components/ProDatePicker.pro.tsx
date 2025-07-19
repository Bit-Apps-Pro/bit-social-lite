import { $bitSocial, getAtom } from '@common/globalStates'
import { convertWordPressToDayjsDateFormat } from '@common/helpers/globalHelpers'
import { type ShareNowDatePickerType } from '@components/DatePicker'
import { DatePicker } from 'antd'
import { type RangePickerProps } from 'antd/es/date-picker'
import dayjs, { type Dayjs } from 'dayjs'

const { dateFormat, timeFormat } = getAtom($bitSocial)
const wpDateTimeFormat = `${dateFormat} ${timeFormat}`
const calendarFormat = convertWordPressToDayjsDateFormat(wpDateTimeFormat)

const enableTodayAndNextDay = (currentDate: Dayjs) =>
  !(currentDate.isAfter(dayjs(), 'day') || currentDate.isSame(dayjs(), 'day'))

const disabledDate: RangePickerProps['disabledDate'] = current => enableTodayAndNextDay(current)

export default function ProDatePicker({
  handleOnClear,
  onChangeDate,
  stateData,
  type
}: ShareNowDatePickerType) {
  return (
    <DatePicker
      allowClear={type === 'SHARENOW'}
      disabledDate={disabledDate}
      format={calendarFormat}
      onChange={type === 'SHARENOW' ? handleOnClear : undefined}
      onOk={onChangeDate('started_at')}
      showNow={false}
      showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
      value={
        stateData.settings?.started_at
          ? dayjs(stateData.settings?.started_at, 'YYYY-MM-DD HH:mm:ss')
          : undefined
      }
    />
  )
}
