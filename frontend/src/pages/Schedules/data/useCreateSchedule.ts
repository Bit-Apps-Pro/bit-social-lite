import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type ScheduleType } from '../ScheduleType'

export default function useCreateSchedule() {
  const queryClient = useQueryClient()
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (scheduleData: ScheduleType) =>
      request('schedule', { ...scheduleData }, undefined, 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-schedules'] })
      queryClient.invalidateQueries({ queryKey: ['get-calendar-schedules'] })
    }
  })

  return {
    createSchedule: (scheduleData: ScheduleType) => mutateAsync(scheduleData),
    createScheduleLoading: isPending
  }
}
