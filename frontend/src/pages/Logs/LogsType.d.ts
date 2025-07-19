interface ProfileType {
  image: string
  name: string
}

export interface LogDetails {
  account_id: string
  account_name: string
  post_id: string
  post_url: string
  response: { id: string }
}
export interface LogsTableDataType {
  account: string
  date: string
  details: LogDetails
  key: string
  platform: keyof typeof platforms
  schedule: string
  scheduleId: string
  status: number | string
}

export interface LogsType extends AB {
  created_at: string
  id: string
  schedule: Record<string, string>
  schedule_id: string
  status: number
}
type AB = Pick<LogsTableDataType, 'details' | 'platform'>

export interface RetryDataType {
  details: LogDetails
  key: string
  scheduleId: string
}
