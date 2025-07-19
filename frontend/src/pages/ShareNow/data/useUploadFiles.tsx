import request from '@common/helpers/request'
import { useMutation } from '@tanstack/react-query'

export default function useUploadFiles() {
  const { isPending, isSuccess, mutateAsync } = useMutation({
    mutationFn: async (files: FormData) => request('upload-files', files, undefined, 'POST'),
    mutationKey: ['upload-files']
  })

  return {
    isUploadLoading: isPending,
    isUploadSuccess: isSuccess,
    uploadFiles: mutateAsync
  }
}
