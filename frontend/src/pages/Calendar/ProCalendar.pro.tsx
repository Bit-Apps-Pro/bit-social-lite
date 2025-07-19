import type platforms from '@config/platforms'

import { $bitSocial, getAtom } from '@common/globalStates'
import { $scheduleData } from '@common/globalStates/$scheduleModalData'
import { type ScheduleModalType } from '@common/globalStates/GlobalStates'
import { dateTime, dateTimeFormatter } from '@common/helpers/globalHelpers'
import config from '@config/config'
import { type CSSObject } from '@emotion/react'
import useGetCalendarSchedules from '@hooks/queries/calendar/useGetCalendarSchedules'
import useSchedules, { type GetSchedulesType } from '@hooks/queries/schedule/useSchedules'
import useAccounts from '@pages/Accounts/data/useAccounts'

import './Calendar.css'

import CreateScheduleModal from '@pages/Schedules/internals/CreateScheduleModal'
import { Calendar, Modal, Skeleton, Space, theme } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { produce } from 'immer'
import { useSetAtom } from 'jotai'
import { useEffect, useRef, useState, useTransition } from 'react'

import { type DayListType, type ListDataType } from './CalendarTypes'
import DateCellRender from './DataCellRender'
import DayCellDataCard from './DayCellDataCard'
import {
  accountIcons,
  generateCalendarDayCellData,
  generateCalendarModalData,
  generateSchedules,
  getListData
} from './helper/calendarHelpers'

const calendarHeightStyle: CSSObject = {
  '& .ant-picker-calendar-date-content': {
    height: '150px !important'
  },
  '& .ant-picker-calendar-date-value': {
    position: 'absolute',
    right: '8px',
    top: '4px',
    zIndex: '1'
  },
  '& ant-picker-calendar-date-today': {
    position: 'relative'
  }
}

export interface SelectDateModalData {
  avatars: { name: string; platform: keyof typeof platforms; src: string }[]
  runTimes: number
  schedule: GetSchedulesType
}

export default function ProCalendar() {
  const isPanelChanged = useRef<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const selectedDate = useRef<Dayjs>()
  const [panelMode, setPanelMode] = useState<'month' | 'year'>('month')
  const [calendarMonth, setCalendarMonth] = useState(dayjs().format('MMMM'))
  const [currentMonthYear, setCurrentMonthYear] = useState<string>(dayjs().format('MM/YYYY'))
  const [calendarDayCellData, setCalendarDayCellData] = useState<Record<string, ListDataType[]>>({})
  const [calendarModalData, setCalendarModalData] = useState<Record<string, DayListType[]>>({})
  const [selectDateModalData, setSelectDateModalData] = useState<SelectDateModalData[]>([])
  const [isPending, startTransition] = useTransition()
  const { isLoadingSchedules, schedules: currentMonthYearSchedules } =
    useGetCalendarSchedules(currentMonthYear)
  const { refetchSchedules, schedules: allSchedules } = useSchedules()
  const { accounts } = useAccounts()

  const { token } = theme.useToken()

  const { timeZone } = getAtom($bitSocial)

  const setScheduleData = useSetAtom($scheduleData)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<ScheduleModalType>({
    open: false,
    type: 'create'
  })

  useEffect(() => {
    if (isLoadingSchedules || !currentMonthYearSchedules.length) return
    startTransition(() => {
      const schedules = generateSchedules(currentMonthYearSchedules, currentMonthYear)
      setCalendarDayCellData(generateCalendarDayCellData(schedules))
      setCalendarModalData(generateCalendarModalData(currentMonthYear, schedules))
      refetchSchedules()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonthYearSchedules, isLoadingSchedules])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const onDaySelect = (value: Dayjs) => {
    if (isLoadingSchedules) return

    setCurrentMonthYear(value.format('MM/YYYY'))
    if (panelMode === 'year' || isPanelChanged.current) {
      setPanelMode('month')
      return
    }

    selectedDate.current = value
    const dayMonthDate = `${value.month()}-${value.date()}`
    const isTodayOrAfterValue = value.format('YYYY-MM-DD') >= dayjs().format('YYYY-MM-DD')

    if (calendarModalData[dayMonthDate]?.length && isTodayOrAfterValue) showModal()

    const selectDateLists = getListData(value, calendarModalData, calendarDayCellData, true)

    const selectDateSchedules = selectDateLists
      .map(list => {
        const scheduleDetails = allSchedules.find(schedule => schedule.id === list.scheduleId)
        if (!scheduleDetails) {
          console.error('schedule details not found')
          return
        }

        if (dayjs(scheduleDetails.next_published_at).diff(dateTime(timeZone)) < 1) {
          return
        }
        const scheduleAccountIds = scheduleDetails.config.accounts.accountIds

        const accountAvatars = accountIcons(scheduleAccountIds, accounts)

        return {
          avatars: accountAvatars,
          runTimes: list.count || 0,
          schedule: scheduleDetails
        }
      })
      .filter(item => item !== undefined)

    setSelectDateModalData(selectDateSchedules)
  }

  const dateCellRender = (value: Dayjs) => {
    if (isLoadingSchedules || isPending) return <Skeleton active paragraph={{ rows: 2 }} title={false} />

    const listData = getListData(value, calendarModalData, calendarDayCellData)
    const showScheduleBtn =
      value.format('YYYY-MM-DD') >= dayjs().format('YYYY-MM-DD') &&
      value.format('MMMM') === calendarMonth

    return (
      <DateCellRender
        listData={listData}
        panelMode={panelMode}
        setIsScheduleModalOpen={setIsScheduleModalOpen}
        showScheduleBtn={showScheduleBtn}
        value={value}
      />
    )
  }

  const handlePanelChange = (value: Dayjs, mode: 'month' | 'year') => {
    setCalendarMonth(value.format('MMMM'))

    setPanelMode(mode)
    isPanelChanged.current = true
    setTimeout(() => {
      isPanelChanged.current = false
    }, 1)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onSelectCellDate = (value: Dayjs) => {
    setScheduleData(prev =>
      produce(prev, draft => {
        draft.settings.started_at = value.format('YYYY-MM-DD HH:mm:ss')
      })
    )

    onDaySelect(value)
  }

  return (
    <>
      <Calendar
        cellRender={dateCellRender}
        css={calendarHeightStyle}
        mode={panelMode}
        onPanelChange={handlePanelChange}
        onSelect={onSelectCellDate}
      />

      {isScheduleModalOpen.open ? (
        <CreateScheduleModal
          isScheduleModalOpen={isScheduleModalOpen}
          setIsScheduleModalOpen={setIsScheduleModalOpen}
        />
      ) : undefined}

      {/* for show schedule modal list */}

      <Modal
        centered
        closable
        footer={false}
        onCancel={handleCancel}
        open={isModalOpen}
        styles={{
          body: {
            backgroundColor: token.colorFillAlter,
            height: '75vh',
            marginInline: -24,
            maxHeight: '75vh',
            overflowY: 'scroll'
          }
        }}
        title={`Schedule List: ${dateTimeFormatter(
          selectedDate.current?.format('YYYY-MM-DD') || '',
          config.DATE_FORMAT
        )}`}
        width={600}
      >
        <Space className="w-100 py-2 px-2" direction="vertical">
          {selectDateModalData.map((daySchedule, index) => (
            <DayCellDataCard
              avatars={daySchedule.avatars}
              key={index}
              runTimes={daySchedule.runTimes}
              schedule={daySchedule.schedule}
            />
          ))}
        </Space>
      </Modal>
    </>
  )
}
