import { type ScheduleTemplatesType } from '../ScheduleType'

export const templatePostTypes = <T extends keyof ScheduleTemplatesType>(
  platformTemplate: ScheduleTemplatesType[T]
) => {
  const invalidTypes = new Set(['button', 'content'])

  // Filter keys dynamically and exclude invalid types
  return (Object.keys(platformTemplate) as (keyof typeof platformTemplate)[]).filter(
    type => !invalidTypes.has(type as string)
  )
}

export type PostType<T extends keyof ScheduleTemplatesType> = Exclude<
  keyof ScheduleTemplatesType[T],
  'button' | 'comment' | 'content'
>[]

export const postTypes = <T extends keyof ScheduleTemplatesType>(
  platform: T,
  scheduleData: ScheduleTemplatesType
): PostType<T> => {
  return templatePostTypes(scheduleData[platform]) as PostType<T>
}

export type PostingNameKeyType =
  | 'isAllImages'
  | 'isFeaturedImage'
  | 'isLinkCard'
  | 'isProductImage'
  | 'isVideo'

type PostingNameType = Record<
  PostingNameKeyType,
  {
    name: string
    tooltip: string
  }
>

export const postingName: PostingNameType = {
  isAllImages: { name: 'All Images', tooltip: 'Enable to the post all images shared' },
  isFeaturedImage: {
    name: 'Featured Image',
    tooltip: 'Enable to the post featured image shared'
  },
  isLinkCard: { name: 'Link Card', tooltip: 'Enable to the post link shared as a card' },
  isProductImage: {
    name: 'Product Image',
    tooltip: 'Enable to the product image shared'
  },
  isVideo: { name: 'Video', tooltip: 'Enable to the post video shared' }
}
