export interface ScheduleModalType {
  open: boolean
  type?: 'create' | 'edit' | 'reSchedule'
}

export interface SocialMediaTemplate {
  content: string
  isAllImages: boolean
  isFeaturedImage: boolean
  isLinkCard: boolean
  isProductImage: boolean
  isVideo: boolean
}

// Define a type for the templates object
export type Templates = Record<string, SocialMediaTemplate>
