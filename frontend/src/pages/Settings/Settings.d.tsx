import { type ReactElement, type ReactNode } from 'react'

export interface SettingsOptionsType {
  action: boolean | ReactNode
  children?: ReactElement | ReactNode
  description: string
  name: string
}

export interface SettingsType {
  general: SettingsOptionsType[]
}
