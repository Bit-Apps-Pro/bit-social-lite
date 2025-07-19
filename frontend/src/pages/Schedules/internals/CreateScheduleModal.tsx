import { $bitSocial, getAtom } from '@common/globalStates'
import $scheduleErrors from '@common/globalStates/$scheduleErrors'
import { $scheduleData, $searchText, defaultScheduleData } from '@common/globalStates/$scheduleModalData'
import $socialTemplates from '@common/globalStates/socialTemplates/$socialTemplates'
import { dateTime } from '@common/helpers/globalHelpers'
import { __ } from '@common/helpers/i18nWrap'
import CronWarning from '@components/CronWarning'
import useSearchedSchedules from '@hooks/queries/schedule/useSearchedSchedules'
import Plus from '@icons/Plus'
import { Button, message, Modal, Space, theme } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { produce } from 'immer'
import { useAtom, useAtomValue } from 'jotai'
import { useId, useState } from 'react'
import { useSearchParams } from 'react-router'

import useCreateSchedule from '../data/useCreateSchedule'
import useUpdateSchedule from '../data/useUpdateSchedule'
import { type CreateScheduleModalType, type ScheduleType } from '../ScheduleType'
import ScheduleModalTabs from './ScheduleModalTabs'

dayjs.extend(utc)
dayjs.extend(timezone)

const { timeZone } = getAtom($bitSocial)

const modalTitle = {
  create: 'Create schedule',
  edit: 'Edit schedule',
  reSchedule: 'Reschedule'
}

export default function CreateScheduleModal({
  btnTitle,
  isScheduleModalOpen,
  setIsScheduleModalOpen
}: CreateScheduleModalType) {
  const { token } = theme.useToken()
  const [scheduleData, setScheduleData] = useAtom($scheduleData)
  const modalId = useId()
  const [tabActive, setTabActive] = useState('1')
  const { createSchedule, createScheduleLoading } = useCreateSchedule()
  const { isUpdateScheduleLoading, updateSchedule } = useUpdateSchedule()
  const [messageApi, contextHolder] = message.useMessage()
  const [searchParams] = useSearchParams()
  const pageNumber = Number(searchParams.get('page')) || 1
  const pageLimit = Number(searchParams.get('limit')) || 10
  const [searchText] = useAtom($searchText)

  const { refetchSchedules } = useSearchedSchedules(searchText, pageNumber, pageLimit)

  const allSocialTemplates = useAtomValue($socialTemplates)
  const [errors, setErrors] = useAtom($scheduleErrors)

  const scheduleValidation = (
    data: ScheduleType,
    setTabActiveNumber: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (data.settings.name === '') {
      messageApi.open({
        content: 'name required',
        type: 'error'
      })
      return false
    }
    if (data.settings.started_at === '') {
      messageApi.open({
        content: 'start time required',
        type: 'error'
      })
      return false
    }
    if (!data.accounts.accountIds?.length && !data.accounts?.groupIds?.length) {
      messageApi.open({
        content: 'No account selected',
        type: 'error'
      })
      setTabActiveNumber('3')
      return false
    }
    if (errors?.startedAt?.length) {
      messageApi.open({
        content: errors.startedAt,
        type: 'error'
      })
      setTabActiveNumber('1')
      return false
    }

    return true
  }

  const showModal = () => {
    setTabActive('1')
    const startDateTimeNow = dayjs(dateTime(timeZone)).format('YYYY-MM-DD HH:mm:ss')
    setScheduleData((prev: ScheduleType) =>
      produce(prev, draft => {
        draft.settings.started_at = startDateTimeNow
      })
    )
    setIsScheduleModalOpen({ open: true, type: 'create' })
  }

  const handleOk = async () => {
    const valid = scheduleValidation(scheduleData, setTabActive)
    if (!valid) {
      return
    }
    await (scheduleData.id ? updateSchedule(scheduleData) : createSchedule(scheduleData))
    refetchSchedules()
    setIsScheduleModalOpen({ open: false })
    setTabActive('1')

    setScheduleData(defaultScheduleData(allSocialTemplates))
  }

  const handleCancel = () => {
    setTabActive('1')
    setIsScheduleModalOpen({ open: false })
    setErrors({})

    setScheduleData(defaultScheduleData(allSocialTemplates))
  }

  const handleTabActive = (key: string) => {
    setTabActive(key)
  }

  return (
    <>
      {contextHolder}
      {btnTitle && (
        <Button icon={<Plus size={12} />} onClick={showModal} size="large" type="primary">
          {btnTitle}
        </Button>
      )}

      <Modal
        centered
        confirmLoading={createScheduleLoading || isUpdateScheduleLoading}
        footer={
          <Space>
            <div className="pr-2">
              <CronWarning type="message" />
            </div>
            <Button key="back" onClick={handleCancel}>
              {__('Cancel')}
            </Button>
            <Button
              key="Ok"
              loading={createScheduleLoading || isUpdateScheduleLoading}
              onClick={handleOk}
              type="primary"
            >
              {scheduleData.id ? 'Update' : 'Create'}
            </Button>
          </Space>
        }
        key={`hello ${modalId}`}
        maskClosable={false}
        onCancel={handleCancel}
        open={isScheduleModalOpen.open}
        styles={{
          body: {
            marginInline: -24,
            maxHeight: 'calc(100vh - 160px)',
            overflow: 'auto'
          }
        }}
        title={isScheduleModalOpen.type ? modalTitle[isScheduleModalOpen.type] : ''}
        width={tabActive === '3' ? 800 : 600}
      >
        <ScheduleModalTabs handleTabActive={handleTabActive} tabActive={tabActive} token={token} />
      </Modal>
    </>
  )
}
