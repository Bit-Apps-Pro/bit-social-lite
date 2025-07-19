import { $appConfig } from '@common/globalStates'
import $logFilter, { defaultFilter } from '@common/globalStates/$logFilter'
import { __ } from '@common/helpers/i18nWrap'
import useSchedules from '@hooks/queries/schedule/useSchedules'
import { Button, DatePicker, Form, Modal, Select, Space } from 'antd'
import { type RangePickerProps } from 'antd/es/date-picker'
import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'
import { LuFilter } from 'react-icons/lu'
import { useSearchParams } from 'react-router'

export interface FilterPropsType {
  filters: Record<string, string>
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>
}

export default function FilterLogs() {
  const [filters, setFilters] = useAtom($logFilter)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [, setSearchParams] = useSearchParams({})

  const [rangeDate, setRangeDate] = useState<null | RangePickerProps['value']>()
  const { schedules } = useSchedules()
  const { isProClient } = useAtomValue($appConfig)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setFilters(filters)
    setIsModalOpen(false)
  }

  const changeState = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setSearchParams(prev => {
      prev.set('page', '1')
      return prev
    })
  }

  const freePlatformOptions = [
    { label: __('All'), value: 'all' },
    {
      label: __('Facebook'),
      value: 'facebook'
    },
    {
      label: __('Linkedin'),
      value: 'linkedin'
    }
  ]
  const proPlatformOptions = [
    {
      label: __('Google Business Profile'),
      value: 'googleBusinessProfile'
    },
    {
      label: __('Pinterest'),
      value: 'pinterest'
    },
    {
      label: __('Discord'),
      value: 'discord'
    },
    {
      label: __('Tumblr'),
      value: 'tumblr'
    },
    {
      label: __('X (twitter)'),
      value: 'twitter'
    },
    {
      label: __('Instagram'),
      value: 'instagram'
    }
  ]

  const platformOptions = isProClient
    ? [...freePlatformOptions, ...proPlatformOptions]
    : freePlatformOptions

  const scheduleOptions = schedules?.map(schedule => ({
    label: schedule.name,
    value: String(schedule.id)
  }))
  const allScheduleOptions = [{ label: __('All'), value: 'all' }, ...scheduleOptions]

  const onChangeDate =
    (name: string) => (rangeValue: RangePickerProps['value'], dateString: [string, string] | string) => {
      if (Array.isArray(dateString) && dateString.every(value => value === '')) {
        return changeState(name, 'all')
      }
      setRangeDate(rangeValue)
      changeState(name, JSON.stringify(dateString))
    }

  const handleReset = () => {
    setRangeDate(undefined)
    setFilters(defaultFilter)
  }

  return (
    <>
      <Space>
        <Button icon={<LuFilter size={12} />} onClick={showModal} size="large">
          {__('Filter')}
        </Button>
      </Space>
      <Modal
        footer={[
          <Button key="reset" onClick={handleReset} type="primary">
            {__('Reset')}
          </Button>
        ]}
        onCancel={handleCancel}
        open={isModalOpen}
        title={__('Logs filter')}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label={__('Date')}>
            <DatePicker.RangePicker
              className="w-100"
              onChange={onChangeDate('date')}
              value={rangeDate}
            />
          </Form.Item>
          <Form.Item label={__('Status')}>
            <Select
              defaultValue="all"
              onChange={value => changeState('status', value)}
              options={[
                { label: __('All'), value: 'all' },
                { label: __('Success'), value: '1' },
                { label: __('Error'), value: '0' }
              ]}
              value={filters.status}
            />
          </Form.Item>
          <Form.Item label={__('Schedule')}>
            <Select
              defaultValue="all"
              onChange={schedule => changeState('schedule', schedule)}
              options={allScheduleOptions}
              value={filters.schedule}
            />
          </Form.Item>
          <Form.Item label={__('Platform')}>
            <Select
              defaultValue="all"
              onChange={platform => changeState('platform', platform)}
              options={platformOptions}
              value={filters.platform}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
