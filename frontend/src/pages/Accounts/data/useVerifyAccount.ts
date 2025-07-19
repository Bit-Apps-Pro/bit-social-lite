import request from '@common/helpers/request'
import { useMutation } from '@tanstack/react-query'

import { type AccountDataType } from '../AccountsType'

export default function useVerifyAccount() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (verify: { data: AccountDataType; url: string }) =>
      request<{ accountDetails: AccountDataType; message: string }>(
        verify.url,
        verify.data,
        undefined,
        'POST'
      )
  })

  return {
    isVerifyAccountLoading: isPending,
    verifyAccount: (verify: { data: AccountDataType; url: string }) => mutateAsync(verify)
  }
}
