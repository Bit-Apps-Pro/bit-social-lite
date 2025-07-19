import request from '@common/helpers/request'
import { useQuery } from '@tanstack/react-query'

interface UserInfo {
  first_name: string
  user_email: string
  username: string
}

export default function useUserInfo() {
  const { data, isLoading } = useQuery({
    queryFn: async () => request<UserInfo>(`user-info`, undefined, undefined, 'GET'),
    queryKey: ['user-info']
  })

  return {
    isUserInfoLoading: isLoading,
    userInfo: data?.data
  }
}
