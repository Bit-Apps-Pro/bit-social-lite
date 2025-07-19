import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function useDeleteSchedule() {
  const queryClient = useQueryClient()
  const { isPending, isSuccess, mutateAsync } = useMutation({
    mutationFn: async (scheduleIds: number[]) => {
      if (!scheduleIds.length) throw new Error('Schedule ID is undefined')
      return request(`schedule/destroy`, { scheduleIds }, undefined, 'POST')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-calendar-schedules'] })
      queryClient.invalidateQueries({ queryKey: ['all-schedules'] })
    }
  })

  return {
    deleteSchedule: (scheduleIds: number[]) => mutateAsync(scheduleIds),
    deleteScheduleLoading: isPending,
    deleteScheduleSuccess: isSuccess
  }
}
