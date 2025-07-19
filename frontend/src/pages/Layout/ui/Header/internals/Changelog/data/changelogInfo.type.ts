import { type ReactNode } from 'react'

export interface ChangeTopic {
  label: ReactNode
  list?: ChangeTopic[] | ReactNode[]
  tag?: string
}

interface Added {
  added: ChangeTopic
}
interface Coming {
  coming: ChangeTopic
}
interface Features {
  features: ChangeTopic
}
interface Fixed {
  fixed: ChangeTopic
}
interface Improvement {
  improvement: ChangeTopic
}
interface Integration {
  integration: ChangeTopic
}
interface Others {
  others: ChangeTopic
}

type Changes = Added | Coming | Features | Fixed | Improvement | Integration | Others

interface Log {
  changes: Changes
  date: string
}

export type ChangelogInfo = Record<string, Log>
