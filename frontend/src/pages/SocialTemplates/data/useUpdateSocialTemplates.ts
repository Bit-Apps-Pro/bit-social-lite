import { type SocialTemplates } from '@common/globalStates/socialTemplates/SocialTemplatesType'
import request from '@common/helpers/request'
import { useMutation } from '@tanstack/react-query'

export default function useUpdateSocialTemplates() {
  const { isPending, isSuccess, mutateAsync } = useMutation({
    mutationFn: async (socialTemplates: SocialTemplates) =>
      request('socialTemplates/update', { socialTemplates }, undefined, 'POST'),
    mutationKey: ['socialTemplatesUpdate']
  })

  return {
    isTemplatesUpdateSuccessfully: isSuccess,
    isUpdatingSocialTemplates: isPending,
    updateSocialTemplates: mutateAsync
  }
}
