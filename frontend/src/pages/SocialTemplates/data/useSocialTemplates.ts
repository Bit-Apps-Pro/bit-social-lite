import $socialTemplates from '@common/globalStates/socialTemplates/$socialTemplates'
import { type SocialTemplates } from '@common/globalStates/socialTemplates/SocialTemplatesType'
import request from '@common/helpers/request'
import { type UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

export default function useSocialTemplates() {
  const setSocialTemplates = useSetAtom($socialTemplates)

  const { data, isLoading }: UseQueryResult<SocialTemplates, Error> = useQuery({
    queryFn: async () => {
      const { data: socialTemplates } = await request<SocialTemplates>(
        'socialTemplates',
        undefined,
        undefined,
        'GET'
      )

      if (socialTemplates) {
        setSocialTemplates(socialTemplates)
        return socialTemplates
      }

      return []
    },
    queryKey: ['socialTemplates']
  })

  return {
    isLoadingSocialTemplates: isLoading,
    socialTemplates: data
  }
}
