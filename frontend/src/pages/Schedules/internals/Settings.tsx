import { $bitSocial, getAtom } from '@common/globalStates'
import $scheduleErrors from '@common/globalStates/$scheduleErrors'
import { $scheduleData } from '@common/globalStates/$scheduleModalData'
import { convertWordPressToDayjsDateFormat, dateTime } from '@common/helpers/globalHelpers'
import { __, sprintf } from '@common/helpers/i18nWrap'
import DatePicker from '@components/DatePicker'
import { Alert, Form, Input, message, Select, Space, TimePicker, Typography } from 'antd'
import { type TimeRangePickerProps } from 'antd/es/time-picker'
import dayjs from 'dayjs'
import { produce } from 'immer'
import { useAtom } from 'jotai'

import useIntervalTypes from '../data/useIntervalTypes'
import { type ScheduleType } from '../ScheduleType'

const { Text } = Typography

const { dateFormat, timeFormat, timeZone } = getAtom($bitSocial)
const wpDateTimeFormat = `${dateFormat} ${timeFormat}`
const calendarFormat = convertWordPressToDayjsDateFormat(wpDateTimeFormat)

const sleepDaysTypes = [
  { label: __('Monday'), value: 'Mon' },
  { label: __('Tuesday'), value: 'Tue' },
  { label: __('Wednesday'), value: 'Wed' },
  { label: __('Thursday'), value: 'Thu' },
  { label: __('Friday'), value: 'Fri' },
  { label: __('Saturday'), value: 'Sat' },
  { label: __('Sunday'), value: 'Sun' }
]

export default function Settings() {
  const [scheduleData, setScheduleData] = useAtom($scheduleData)
  const intervalTypes = useIntervalTypes()
  const [errors, setErrors] = useAtom($scheduleErrors)
  const [messageApi, contextHolder] = message.useMessage()

  const localTime = dayjs(dateTime(timeZone)).format('YYYY-MM-DD HH:mm:ss')

  const changeState = (name: string, value: boolean | number | string | string[]) => {
    setScheduleData((prev: ScheduleType) =>
      produce(prev, draft => {
        draft.settings = { ...draft.settings, [name]: value }
      })
    )
  }

  const onChangeDate = (name: string) => (value: dayjs.Dayjs | null) => {
    if (value && dayjs(value).diff(dateTime(timeZone)) < 1) {
      setErrors(prev => ({ ...prev, startedAt: 'Start date & time must be grater than local time' }))
      return
    }

    const formatDateValue = value?.format('YYYY-MM-DD HH:mm:ss')
    if (formatDateValue) {
      if (errors.startedAt) setErrors(prev => ({ ...prev, startedAt: '' }))
      return changeState(name, formatDateValue)
    }
  }

  const handleChange = (name: string) => (value: boolean | number | string) => {
    if (name === 'sleep_days' && Array.isArray(value) && sleepDaysTypes.length === value.length) {
      messageApi.open({
        content: 'Minimum one day required for post ',
        type: 'warning'
      })
      return
    }
    changeState(name, value)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    changeState(name, value)
  }

  const onChangeTimeRange =
    (name: 'sleep_time') => (values: TimeRangePickerProps['value'], formatString: [string, string]) => {
      if (values === undefined) {
        setScheduleData((prev: ScheduleType) =>
          produce(prev, draft => {
            delete draft.settings['sleep_time']
          })
        )
        return
      }
      changeState(name, formatString)
    }

  return (
    <Form layout="vertical">
      {contextHolder}
      <Form.Item label={__('Title')}>
        <Input
          name="name"
          onChange={handleInputChange}
          placeholder={__('Enter a name')}
          type="text"
          value={scheduleData.settings?.name}
        />
      </Form.Item>

      <Form.Item label={__('Start date & time')}>
        <Space direction="vertical">
          <DatePicker onChangeDate={onChangeDate} stateData={scheduleData} type="SCHEDULE" />
          {errors.startedAt && <Text type="danger">{errors.startedAt} </Text>}
          <Text mark>
            {sprintf(
              __('Local time: %s ; Time Zone: (%s)'),
              dayjs(localTime).format(calendarFormat),
              timeZone
            )}
          </Text>
        </Space>
      </Form.Item>

      <Form.Item label={__('Post interval')} style={{ margin: '10px 0' }}>
        <Space>
          <Input
            css={{ maxWidth: 80 }}
            min={1}
            name="post_interval_value"
            onChange={handleInputChange}
            type="number"
            value={scheduleData.settings.post_interval_value}
          />
          <Select
            css={{ minWidth: 100 }}
            onChange={handleChange('post_interval_type')}
            options={intervalTypes}
            value={scheduleData.settings.post_interval_type}
          />
        </Space>
      </Form.Item>

      {scheduleData.id &&
        scheduleData.settings.started_at &&
        dayjs(scheduleData.settings.started_at).diff(dateTime(timeZone)) < 1 && (
          <Alert
            message={
              <>
                {__(
                  'If your start time has passed, updating the interval will set your next post to local time plus the new interval! For example, current time 06:00 PM, updated Post interval: 2 hours. Next post will be at 08:00 PM.'
                )}
                <Typography.Link
                  href="https://bit-social.com/docs/bit-social/schedule-wordpress-posts-on-social-media/#if-you-update-your-post-interval"
                  rel="noopener noreferrer"
                  target="_blank"
                  underline
                >
                  {__('Visit our documentation')}
                </Typography.Link>
              </>
            }
            showIcon
            type="info"
          />
        )}

      <Form.Item label={__('Order posts by')}>
        <Select
          onChange={handleChange('post_publish_order')}
          options={[
            { label: __('Randomly without duplicates'), value: '1' },
            { label: __('Randomly'), value: '2' },
            { label: __('Start from the oldest to new posts'), value: '3' },
            { label: __('Start from the latest to old posts'), value: '4' }
          ]}
          value={scheduleData.settings.post_publish_order}
        />
      </Form.Item>

      <Form.Item>
        <Space direction="vertical">
          <Space>
            <Text> {__('Set a sleep timer')} </Text>
          </Space>
          <TimePicker.RangePicker
            format="HH:mm"
            onChange={onChangeTimeRange('sleep_time')}
            order={false}
            value={
              scheduleData.settings.sleep_time?.[0] && scheduleData.settings.sleep_time?.[1]
                ? [
                    dayjs(scheduleData.settings.sleep_time[0], 'HH:mm'),
                    dayjs(scheduleData.settings.sleep_time[1], 'HH:mm')
                  ]
                : undefined
            }
          />
        </Space>
      </Form.Item>

      <Form.Item label={__('Set sleep days')}>
        <Select
          allowClear
          mode="multiple"
          onChange={handleChange('sleep_days')}
          options={sleepDaysTypes}
          placeholder={__('Select sleep days')}
          value={scheduleData.settings.sleep_days}
        />
      </Form.Item>
    </Form>
  )
}
