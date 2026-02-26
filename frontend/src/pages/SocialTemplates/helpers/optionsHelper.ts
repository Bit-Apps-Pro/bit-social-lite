import { $appConfig, getAtom } from '@common/globalStates'
import { __ } from '@common/helpers/i18nWrap'

export function isProPostingOption(key: string, val: string): boolean {
  const { isProClient } = getAtom($appConfig)

  const proOptionValues = new Set(['isAllImages', 'isCustomImage', 'isProductImage', 'isPromptImage'])

  return key === 'postingType' && proOptionValues.has(val) && !isProClient
}

export const postingTypeOptions = [
  { label: __('Only custom message'), value: 'onlyMessage' },
  { label: __('Link card'), value: 'isLinkCard' },
  { label: __('Feature image'), value: 'isFeaturedImage' },
  {
    label: __('Product Image'),
    value: 'isProductImage'
  },
  {
    label: __('All Images'),
    value: 'isAllImages'
  },
  {
    label: __('Prompt Image'),
    value: 'isPromptImage'
  }
]
