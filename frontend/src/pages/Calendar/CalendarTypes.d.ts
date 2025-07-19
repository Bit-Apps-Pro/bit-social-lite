import { type BadgeProps } from 'antd'

export interface ScheduleType {
  interval: {
    every: number
    unit: string
  }
  postsCount: number
  scheduleId: number
  scheduleName: string
  scheduleType: number
  sleepDays?: string[]
  sleepTime?: {
    end: string
    start: string
  }
  startDateTime: string
}

export interface ListDataType {
  content: string
  count?: number
  scheduleId: number
  startDateTime: string
  type: BadgeProps['status']
}

export interface DayListType {
  lists: {
    name: string
    scheduleId: number
    scheduleType: number
    time: string
  }[]
  time: string
}
