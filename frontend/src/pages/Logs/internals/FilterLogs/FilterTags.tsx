import $logFilter from '@common/globalStates/$logFilter'
import { __ } from '@common/helpers/i18nWrap'
import { Space, Tag } from 'antd'
import { useAtom } from 'jotai'
import { useSearchParams } from 'react-router'

const statusCode: Record<string, string> = {
  0: 'error',
  1: 'success'
}

export default function FilterTags() {
  const [filters, setFilters] = useAtom($logFilter)
  const [, setSearchParams] = useSearchParams({})

  const { platform, schedule, status } = filters

  const date = filters.date === 'all' ? false : JSON.parse(filters.date)

  const handleClose = (name: string) => {
    setFilters(prev => ({ ...prev, [name]: 'all' }))
    setSearchParams(prev => {
      prev.set('page', '1')
      return prev
    })
  }

  return (
    <Space size="small">
      {__('Filter:')}
      {date && (
        <Tag closable color="purple" onClose={() => handleClose('date')}>
          {__('Date')}: {date[0]} {__('to')} {date[1]}
        </Tag>
      )}
      {status !== 'all' && (
        <Tag closeIcon color={statusCode[status]} onClose={() => handleClose('status')}>
          {__('Status')}: {statusCode[status]}
        </Tag>
      )}
      {schedule !== 'all' && (
        <Tag closable color="orange" onClose={() => handleClose('schedule')}>
          {__('Schedule')}: {schedule}{' '}
        </Tag>
      )}
      {platform !== 'all' && (
        <Tag closable color="geekblue" onClose={() => handleClose('platform')}>
          {__('Platform')}: {platform}
        </Tag>
      )}
    </Space>
  )
}
