import { $bitSocial, getAtom } from '@common/globalStates'
import { $scheduleData } from '@common/globalStates/$scheduleModalData'
import { type ScheduleModalType } from '@common/globalStates/GlobalStates'
import { dateTime } from '@common/helpers/globalHelpers'
import { __ } from '@common/helpers/i18nWrap'
import { Button } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { produce } from 'immer'
import { useSetAtom } from 'jotai'

import { type ListDataType } from './CalendarTypes'
import CellDataList from './CellDataList'

interface DataCellRenderType {
  listData: ListDataType[]
  panelMode: 'month' | 'year'
  setIsScheduleModalOpen: React.Dispatch<React.SetStateAction<ScheduleModalType>>
  showScheduleBtn: boolean
  value: Dayjs
}

function DateCellRender({
  listData,
  panelMode,
  setIsScheduleModalOpen,
  showScheduleBtn,
  value
}: DataCellRenderType) {
  const setScheduleData = useSetAtom($scheduleData)
  const { timeZone } = getAtom($bitSocial)

  const handleCreateScheduleModal = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()

    const selectDate = value.format('YYYY-MM-DD')
    const currentTime = dayjs(dateTime(timeZone)).format('HH:mm:ss')

    const startedAt = dayjs(`${selectDate} ${currentTime}`).format('YYYY-MM-DD HH:mm:ss')

    setScheduleData(prev =>
      produce(prev, draft => {
        draft.settings.started_at = startedAt
      })
    )

    setIsScheduleModalOpen({ open: true, type: 'create' })
  }

  if (showScheduleBtn && panelMode === 'month') {
    return (
      <>
        <Button
          onClick={handleCreateScheduleModal}
          size="small"
          style={{ fontSize: '.8125rem' }}
          type="text"
        >
          {__('Add schedule')}
        </Button>
        <CellDataList listData={listData} />
      </>
    )
  }
  return
}

export default DateCellRender
