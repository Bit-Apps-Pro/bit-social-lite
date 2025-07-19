import { $bitSocial, getAtom } from '@common/globalStates'
import { dateTime, deepCopy } from '@common/helpers/globalHelpers'
import config from '@config/config'
import { type AccountType } from '@pages/Accounts/AccountsType'
import { type DayListType, type ListDataType, type ScheduleType } from '@pages/Calendar/CalendarTypes'
import { type Dayjs } from 'dayjs'
import dayjs from 'dayjs'

interface NextScheduleFuncType {
  interval: { every: number; unit: string }
  maxRetry?: number
  sleepDays?: string[]
  sleepTime?: { end: string; start: string }
  startDate: Dayjs
}

export const getNextSchedule = ({
  interval,
  maxRetry = 32,
  sleepDays,
  sleepTime,
  startDate
}: NextScheduleFuncType): Dayjs => {
  if (maxRetry === 0) {
    return startDate
  }

  let currentDate = dayjs(startDate)
  switch (interval.unit) {
    case 'day': {
      currentDate = currentDate.add(interval.every, 'day')
      break
    }
    case 'hour': {
      currentDate = currentDate.add(interval.every, 'hour')
      break
    }
    case 'minute': {
      currentDate = currentDate.add(interval.every, 'minute')
      break
    }
    case 'month': {
      currentDate = currentDate.add(interval.every, 'month')
      break
    }
    case 'second': {
      currentDate = currentDate.add(interval.every, 'second')
      break
    }
    case 'week': {
      currentDate = currentDate.add(interval.every * 7, 'day')
      break
    }
    case 'year': {
      currentDate = currentDate.add(interval.every, 'year')
      break
    }
    default: {
      break
    }
  }
  const weekDay = currentDate.format('ddd')
  const isSleepDay = sleepDays && sleepDays.includes(weekDay)
  let isSleepTime = false
  if (sleepTime && sleepTime.start && sleepTime.end) {
    const [startHour, startMinute, startSecond] = sleepTime.start.split(':')
    const [endHour, endMinute, endSecond] = sleepTime.end.split(':')
    const sleepStartTime = currentDate
      .set('hour', Number(startHour))
      .set('minute', Number(startMinute))
      .set('second', Number(startSecond))
    const sleepEndTime = currentDate
      .set('hour', Number(endHour))
      .set('minute', Number(endMinute))
      .set('second', Number(endSecond))
    if (currentDate >= sleepStartTime && currentDate <= sleepEndTime) {
      isSleepTime = true
    }
  }
  if (!isSleepDay && !isSleepTime) {
    return currentDate
  }
  if (!interval.every) {
    return currentDate
  }
  return getNextSchedule({
    interval,
    maxRetry: maxRetry - 1,
    sleepDays,
    sleepTime,
    startDate: currentDate
  })
}

export const generateSchedules = (
  schedules: ScheduleType[],
  selectedMonthYear: string
): ScheduleType[] => {
  const { IS_PRO } = config
  const result: ScheduleType[] = []
  schedules.forEach(schedule => {
    const { interval, sleepDays, sleepTime, startDateTime } = schedule
    const startDate = dayjs(startDateTime)
    const [month, year] = selectedMonthYear.split('/')
    let endDate = dayjs(`${year}-${month}-01`).endOf('month')
    if (!IS_PRO) {
      endDate = dayjs(startDateTime).endOf('day')
    }

    let currentDate = dayjs(startDate)
    let iterateCount = 0
    while (currentDate <= endDate) {
      if (schedule.postsCount !== -1 && iterateCount >= schedule.postsCount) {
        break
      }
      iterateCount += 1
      const currentMonthYear = currentDate.format('MM/YYYY')
      if (selectedMonthYear === currentMonthYear) {
        result.push({
          ...schedule,
          startDateTime: currentDate.format('YYYY-MM-DD HH:mm:ss')
        })
      }
      currentDate = getNextSchedule({ interval, sleepDays, sleepTime, startDate: currentDate })
    }
  })
  return result
}

export const generateCalendarDayCellData = (
  schedules: ScheduleType[]
): Record<string, ListDataType[]> => {
  const result: Record<string, ListDataType[]> = {}
  schedules.forEach(schedule => {
    const { startDateTime } = schedule
    const currentDateTime = dayjs(startDateTime)
    const date = currentDateTime.date()
    const month = currentDateTime.month()
    const key = `${month}-${date}`
    if (!result[key]) {
      result[key] = []
    }
    const index = result[key].findIndex(item => item.scheduleId === schedule.scheduleId)
    if (index === -1) {
      result[key].push({
        content: schedule.scheduleName,
        scheduleId: schedule.scheduleId,
        startDateTime: schedule.startDateTime,
        type: 'success'
      })
    }
  })
  return result
}

export const generateCalendarModalData = (
  selectedMonthYear: string,
  generatedSchedules: ScheduleType[]
): Record<string, DayListType[]> => {
  const result: Record<string, DayListType[]> = {}
  const [currentMonth, currentYear] = selectedMonthYear.split('/')
  let startDateTime = dayjs(`${currentYear}-${currentMonth}-01`)
  const endDateTime = startDateTime.endOf('month')
  while (startDateTime <= endDateTime) {
    const dateList: DayListType[] = []
    const date = startDateTime.date()
    const month = startDateTime.month()
    const listData = generatedSchedules.filter(item => {
      const startDate = dayjs(item.startDateTime)
      const itemDate = startDate.date()
      const itemMonth = startDate.month()
      return itemDate === date && itemMonth === month
    })
    const hourList: string[] = []
    const { timeZone } = getAtom($bitSocial)

    listData
      .filter(list => dayjs(list.startDateTime).diff(dateTime(timeZone)) > 1)
      .forEach(item => {
        const startDate = dayjs(item.startDateTime)

        const hour = startDate.format('HH:00')
        if (!hourList.includes(hour)) {
          hourList.push(hour)
        }

        const index = dateList.findIndex(r => r.time === hour)
        if (index === -1) {
          dateList.push({
            lists: [
              {
                name: item.scheduleName,
                scheduleId: item.scheduleId,
                scheduleType: item.scheduleType,
                time: item.startDateTime
              }
            ],
            time: hour
          })
        } else {
          dateList[index].lists.push({
            name: item.scheduleName,
            scheduleId: item.scheduleId,
            scheduleType: item.scheduleType,
            time: item.startDateTime
          })
        }
      })
    dateList.sort((a, b) => {
      const aHour = a.time.split(':')[0]
      const bHour = b.time.split(':')[0]
      return Number(aHour) - Number(bHour)
    })
    const key = `${month}-${date}`
    result[key] = dateList
    startDateTime = startDateTime.add(1, 'day')
  }

  return result
}

export const getScheduledDataWithCount = (
  listData: DayListType[] = [],
  scheduledData: ListDataType[] = []
): ListDataType[] => {
  const copiedScheduledData: ListDataType[] = deepCopy(scheduledData) || []

  copiedScheduledData.forEach((data, index) => {
    const count = listData.reduce(
      (accumulator, current) =>
        current.lists.filter(l => l.scheduleId === data.scheduleId).length + accumulator,
      0
    )
    copiedScheduledData[index] = { ...data, count }
  })

  return copiedScheduledData
}

export const getListData = (
  value: Dayjs,
  calendarModalData: Record<string, DayListType[]>,
  calendarDayCellData: Record<string, ListDataType[]>,
  all = false
): ListDataType[] => {
  const date = value.date()
  const month = value.month()
  const key = `${month}-${date}`
  const scheduledData = getScheduledDataWithCount(
    calendarModalData[key],
    calendarDayCellData[key]
  ).filter(list => list.count !== 0)

  if (all) {
    return scheduledData
  }

  if (scheduledData.length < 4) return scheduledData
  const hiddenData = scheduledData.splice(3)
  if (hiddenData.length === 0) return scheduledData
  const hiddenDataCount = hiddenData.reduce(
    (accumulator, current) => accumulator + (current.count || 0),
    0
  )
  scheduledData.push({
    content: `+${hiddenData.length} more...`,
    count: hiddenDataCount,
    scheduleId: 0,
    startDateTime: '',
    type: 'default'
  })
  return scheduledData
}

export const getTimeCardSizes = (monthData: DayListType[]) => {
  const POST_CARD_HEIGHT = 68
  const HR_HEIGHT = 2
  const TIME_CARD_PADDING = 32
  const GAP_BETWEEN_CARDS = 8
  return (
    monthData.map(d => {
      const listsHeight = d.lists.length
      let totalHeight = listsHeight * POST_CARD_HEIGHT
      totalHeight += (listsHeight - 1) * GAP_BETWEEN_CARDS
      return totalHeight + TIME_CARD_PADDING + HR_HEIGHT
    }) || 0
  )
}

export function accountIcons(accountIds: number[], accountDetails: AccountType[]) {
  return accountIds
    .map(id => {
      const account = accountDetails.find(accountData => accountData.id === id)

      if (account === undefined) {
        console.error('account not found')
        return
      }

      return {
        name: account.details.account_name,
        platform: account.platform,
        src: account.details.icon
      }
    })
    .filter(item => item !== undefined)
}
