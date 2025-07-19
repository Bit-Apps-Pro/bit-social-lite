import type dayjs from 'dayjs'

import { type ScheduleType } from '@pages/Schedules/ScheduleType'
import isPro from '@plugin-commons/utils/isPro'

import { type ShareNowType } from '../pages/ShareNow/ShareNowType'
import FreeTimePicker from './FreeTimePicker.free'
import ProDatePicker from './ProDatePicker.pro'

export interface ShareNowDatePickerType {
  handleOnClear?: (value: dayjs.Dayjs | null) => void
  onChangeDate: (name: string) => (value: dayjs.Dayjs | null) => void
  stateData: ScheduleType | ShareNowType
  type: 'SCHEDULE' | 'SHARENOW'
}

export default function DatePicker({
  handleOnClear,
  onChangeDate,
  stateData,
  type
}: ShareNowDatePickerType) {
  return isPro() ? (
    <ProDatePicker
      handleOnClear={handleOnClear}
      onChangeDate={onChangeDate}
      stateData={stateData}
      type={type}
    />
  ) : (
    <FreeTimePicker
      handleOnClear={handleOnClear}
      onChangeDate={onChangeDate}
      stateData={stateData}
      type={type}
    />
  )
}
