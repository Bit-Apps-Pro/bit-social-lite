import request from '@common/helpers/request'
import { useMutation } from '@tanstack/react-query'

export default function useUpdateScheduleStatus() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (statusData: { id: number; status: number }) => {
      if (!statusData.id) throw new Error('Schedule ID is undefined')
      return request<string>(
        `schedule/${statusData.id}/update-status`,
        { ...statusData },
        undefined,
        'POST'
      )
    }
  })

  return {
    isUpdateScheduleLoading: isPending,
    updateScheduleStatus: (statusData: { id: number; status: number }) => mutateAsync(statusData)
  }
}
