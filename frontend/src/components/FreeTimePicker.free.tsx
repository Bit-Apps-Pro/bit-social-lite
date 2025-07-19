import { $bitSocial, getAtom } from '@common/globalStates'
import { convertWordPressToDayjsDateFormat, dateTime } from '@common/helpers/globalHelpers'
import AdvanceSchedule from '@components/AdvanceSchedule'
import { Space, theme, TimePicker, Typography } from 'antd'
import dayjs from 'dayjs'

import { type ShareNowDatePickerType } from './DatePicker'

const { dateFormat, timeFormat, timeZone } = getAtom($bitSocial)
const timeFormatWP = convertWordPressToDayjsDateFormat(timeFormat)
const dateFormatWP = convertWordPressToDayjsDateFormat(dateFormat)

export default function FreeTimePicker({
  handleOnClear,
  onChangeDate,
  stateData,
  type
}: ShareNowDatePickerType) {
  const { token } = theme.useToken()

  return (
    <Space>
      <Typography.Text
        style={{
          border: `1px solid ${token.colorBorder}`,
          borderRadius: '9px',
          cursor: 'not-allowed',
          fontSize: '14px',
          padding: '5px 15px'
        }}
      >
        {dayjs(stateData?.settings?.started_at || dateTime(timeZone)).format(dateFormatWP)}
      </Typography.Text>
      <TimePicker
        allowClear={type === 'SHARENOW'}
        format={timeFormatWP}
        onChange={type === 'SHARENOW' ? handleOnClear : undefined}
        onOk={onChangeDate('started_at')}
        showNow={false}
        showSecond={false}
        value={
          stateData.settings?.started_at
            ? dayjs(stateData.settings?.started_at, 'YYYY-MM-DD HH:mm:ss')
            : undefined
        }
      />
      <AdvanceSchedule />
    </Space>
  )
}
