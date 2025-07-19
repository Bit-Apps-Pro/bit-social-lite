import request from '@common/helpers/request'
import { useMutation } from '@tanstack/react-query'

import { type ScheduleType } from '../ScheduleType'

export default function useUpdateSchedule() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (scheduleData: ScheduleType) => {
      if (!scheduleData.id) throw new Error('Schedule ID is undefined')
      return request(`schedule/${scheduleData.id}/update`, { ...scheduleData }, undefined, 'POST')
    }
  })

  return {
    isUpdateScheduleLoading: isPending,
    updateSchedule: (scheduleData: ScheduleType) => mutateAsync(scheduleData)
  }
}
