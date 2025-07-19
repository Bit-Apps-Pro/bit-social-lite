import type React from 'react'

import { $appConfig, $bitSocial, getAtom } from '@common/globalStates'
import $scheduleErrors from '@common/globalStates/$scheduleErrors'
import $shareNowData from '@common/globalStates/$shareNowData'
import { convertWordPressToDayjsDateFormat, dateTime } from '@common/helpers/globalHelpers'
import { __, sprintf } from '@common/helpers/i18nWrap'
import useIntervalTypes from '@pages/Schedules/data/useIntervalTypes'
import {
  Alert,
  Button,
  Form,
  Input,
  Modal,
  notification,
  Select,
  Space,
  Switch,
  TimePicker,
  type TimeRangePickerProps,
  Tooltip,
  Typography
} from 'antd'
import dayjs from 'dayjs'
import { produce } from 'immer'
import { useAtom, useAtomValue } from 'jotai'

import DatePicker from '../../components/DatePicker'
import { type ShareNowType } from './ShareNowType'

interface ShareNowScheduleModalType {
  isScheduleModal: boolean
  setScheduleModal: React.Dispatch<React.SetStateAction<boolean>>
  shareNowModalType?: 'edit'
}

const sleepDays = [
  { label: __('Monday'), value: 'Mon' },
  { label: __('Tuesday'), value: 'Tue' },
  { label: __('Wednesday'), value: 'Wed' },
  { label: __('Thursday'), value: 'Thu' },
  { label: __('Friday'), value: 'Fri' },
  { label: __('Saturday'), value: 'Sat' },
  { label: __('Sunday'), value: 'Sun' }
]
const { dateFormat, timeFormat, timeZone } = getAtom($bitSocial)
const wpDateTimeFormat = `${dateFormat} ${timeFormat}`
const calendarFormat = convertWordPressToDayjsDateFormat(wpDateTimeFormat)

const { Text } = Typography

export default function ShareNowScheduleModal({
  isScheduleModal,
  setScheduleModal,
  shareNowModalType
}: ShareNowScheduleModalType) {
  const [shareNowData, setShareNowData] = useAtom($shareNowData)

  const intervalTypes = useIntervalTypes()

  const [errors, setErrors] = useAtom($scheduleErrors)

  const { isProClient } = useAtomValue($appConfig)

  const localTime = dayjs(dateTime(timeZone)).format('YYYY-MM-DD HH:mm:ss')

  const changeState = (name: string, value: boolean | number | string | string[]) => {
    setShareNowData((prev: ShareNowType) =>
      produce(prev, draft => {
        draft.settings = { ...draft.settings, [name]: value }
      })
    )
  }

  const handleScheduleClose = () => {
    if (errors?.startedAt?.length) {
      notification.error({
        message: errors.startedAt,
        placement: 'topRight'
      })
      return
    }
    setScheduleModal(false)
  }

  const onChangeDate = (name: string) => (value: dayjs.Dayjs | null) => {
    const dateValue = dayjs(dateTime(timeZone)).format('YYYY-MM-DD')
    const timeValue = dayjs(value).format('HH:mm:ss')
    if (!value) {
      setErrors(prev => ({ ...prev, startedAt: '' }))
      changeState(name, '')
      return
    }

    const pickerValue = isProClient ? value : dayjs(dateValue + timeValue)
    const formatDateValue = pickerValue.format('YYYY-MM-DD HH:mm:ss')

    if (value && dayjs(value).diff(dateTime(timeZone)) < 1) {
      setErrors(prev => ({ ...prev, startedAt: 'Start date & time must be grater than local time' }))
      changeState(name, formatDateValue)
      return
    }

    if (formatDateValue) {
      setErrors(prev => ({ ...prev, startedAt: '' }))
      changeState(name, formatDateValue)
    }
  }

  const handleChange = (name: string) => (value: boolean | number | string) => {
    changeState(name, value)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    changeState(name, value)
  }

  const onChangeTimeRange =
    (name: 'sleep_time') => (values: TimeRangePickerProps['value'], formatString: [string, string]) => {
      if (values === null) {
        setShareNowData((prev: ShareNowType) =>
          produce(prev, draft => {
            delete draft.settings['sleep_time']
          })
        )
        return
      }
      changeState(name, formatString)
    }

  const handleOnClear = (value: dayjs.Dayjs | null) => {
    if (!value) {
      if (errors?.startedAt?.length) {
        setErrors(prev => ({ ...prev, startedAt: '' }))
      }
      changeState('started_at', '')
    }
  }

  const handleReset = () => {
    setShareNowData((prev: ShareNowType) =>
      produce(prev, draft => {
        draft.settings = {
          ...draft.settings,
          post_interval_type: 'hour',
          post_interval_value: 1,
          repeat: false,
          started_at: undefined
        }
        delete draft.settings.sleep_time
        delete draft.settings.sleep_days
      })
    )

    if (errors?.startedAt?.length) {
      setErrors(prev => ({ ...prev, startedAt: '' }))
    }
  }

  return (
    <Modal
      centered
      footer={[
        <Button key="reset" onClick={handleReset}>
          {__('Reset')}
        </Button>,
        <Button key="continue" onClick={handleScheduleClose} type="primary">
          {__('Continue')}
        </Button>
      ]}
      maskClosable={false}
      okButtonProps={{ style: { display: 'none' } }}
      onCancel={handleScheduleClose}
      open={isScheduleModal}
      title={shareNowModalType === 'edit' ? __('Edit schedule') : __('Schedule')}
      width={580}
    >
      <Form layout="vertical">
        <Form.Item label={__('Start date & time')}>
          <Space direction="vertical">
            <DatePicker
              handleOnClear={handleOnClear}
              onChangeDate={onChangeDate}
              stateData={shareNowData}
              type="SHARENOW"
            />
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
        <Space className="fw-sb pb-2">
          <Tooltip placement="bottomLeft" title={__('Please, insert a valid start date & time first!')}>
            <Switch
              defaultChecked={shareNowData.settings.repeat}
              disabled={!shareNowData.settings.started_at}
              onChange={value => changeState('repeat', value)}
              size="small"
              value={shareNowData.settings.repeat}
            />
          </Tooltip>
          {__('Repeat')}
        </Space>

        <Form.Item label={__('Post interval')} style={{ margin: '10px 0' }}>
          <Space>
            <Input
              css={{ maxWidth: 80 }}
              disabled={!shareNowData.settings.repeat}
              min={1}
              name="post_interval_value"
              onChange={handleInputChange}
              type="number"
              value={shareNowData.settings.post_interval_value}
            />
            <Select
              css={{ minWidth: 100 }}
              disabled={!shareNowData.settings.repeat}
              onChange={handleChange('post_interval_type')}
              options={intervalTypes}
              value={shareNowData.settings.post_interval_type}
            />
          </Space>
        </Form.Item>
        {shareNowData.id &&
          shareNowData.settings.started_at &&
          dayjs(shareNowData.settings.started_at).diff(dateTime(timeZone)) < 1 && (
            <Alert
              message={
                <>
                  {__(
                    'If your start time has passed, updating the interval will set your next post to local time plus the new interval! For example, current time 06:00 PM, updated Post interval:2 hours. Next post will be at 08:00 PM.'
                  )}
                  <Typography.Link
                    href="https://bit-social.com/docs/bit-social/instantly-share-posts-on-social-media-platforms/#if-you-update-your-post-interval"
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
        <Form.Item label={__('Set a sleep timer')}>
          <TimePicker.RangePicker
            disabled={!shareNowData.settings.repeat}
            format="HH:mm"
            onChange={onChangeTimeRange('sleep_time')}
            value={
              shareNowData.settings.sleep_time?.[0] && shareNowData.settings.sleep_time?.[1]
                ? [
                    dayjs(shareNowData.settings.sleep_time[0], 'HH:mm'),
                    dayjs(shareNowData.settings.sleep_time[1], 'HH:mm')
                  ]
                : undefined
            }
          />
        </Form.Item>
        <Form.Item label={__('Set sleep days')}>
          <Select
            allowClear
            disabled={!shareNowData.settings.repeat}
            mode="multiple"
            onChange={handleChange('sleep_days')}
            options={sleepDays}
            placeholder={__('Select sleep days')}
            value={shareNowData.settings.sleep_days}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
