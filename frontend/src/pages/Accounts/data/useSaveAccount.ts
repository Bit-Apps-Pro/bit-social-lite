import request from '@common/helpers/request'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'

import { type AccountDataType } from '../AccountsType'

interface AccountSaveResponse {
  account: AccountDataType
  message: string
}

export default function useSaveAccount() {
  const [searchParams] = useSearchParams({})
  const searchTabValue = searchParams.get('value') || ''
  const searchTypeValue = searchParams.get('type') || ''

  const selectedMenuTab = { type: searchTypeValue, value: searchTabValue }

  const queryClient = useQueryClient()
  const { isError, isPending, isSuccess, mutateAsync } = useMutation({
    mutationFn: async (accountData: AccountDataType) =>
      request<AccountSaveResponse>('account/save', { accountData }, undefined, 'POST'),
    mutationKey: ['save_account'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-accounts'] })
      queryClient.invalidateQueries({ queryKey: ['accounts', selectedMenuTab] })
    }
  })

  return {
    isSavingAccount: isPending,
    isSavingAccountError: isError,
    isSavingAccountSuccess: isSuccess,
    saveAccount: mutateAsync
  }
}
