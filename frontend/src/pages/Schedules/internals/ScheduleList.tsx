import type React from 'react'

import { $bitSocial, getAtom } from '@common/globalStates'
import { $createScheduleModal } from '@common/globalStates/$createScheduleModal'
import { $scheduleData, $searchText } from '@common/globalStates/$scheduleModalData'
import { dateTime, dateTimeFormatter } from '@common/helpers/globalHelpers'
import { __ } from '@common/helpers/i18nWrap'
import useDebounce from '@common/hooks/useDebounce'
import CronWarning from '@components/CronWarning'
import Note from '@components/Note'
import config from '@config/config'
import useSearchedSchedules from '@hooks/queries/schedule/useSearchedSchedules'
import DeleteIcon from '@icons/DeleteIcon'
import Refresh from '@icons/Refresh'
import {
  Button,
  Empty,
  Flex,
  type GlobalToken,
  Input,
  notification,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  Typography
} from 'antd'
import { type ColumnsType } from 'antd/es/table/interface'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { produce } from 'immer'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { LuMoveUpRight, LuPencil, LuRepeat, LuSearch, LuTrash2 } from 'react-icons/lu'
import { useSearchParams } from 'react-router'

import useDeleteSchedule from '../data/useDeleteSchedule'
import useUpdateScheduleStatus from '../data/useUpdateScheduleStatus'
import { type ScheduleTableDataType } from '../ScheduleType'
import CreateScheduleModal from './CreateScheduleModal'

dayjs.extend(utc)
dayjs.extend(timezone)

const activeStyle = ({ token }: { token: GlobalToken }) => ({
  background: token.colorSuccessBg,
  border: `1px solid ${token.colorSuccessBorder}`,
  borderRadius: '10px',
  color: token.colorSuccessText,
  minWidth: '90px'
})
const pushedStyle = ({ token }: { token: GlobalToken }) => ({
  background: token.colorWarningBg,
  border: `1px solid ${token.colorWarningBorder}`,
  borderRadius: '10px',
  color: token.colorWarningText,
  minWidth: '90px'
})

const STATUS_ACTIVE = 1
const STATUS_INACTIVE = 0
const SCHEDULE_STATUS_COMPLETE = 2
const SCHEDULE_STATUS_MISSED = 4

export default function ScheduleList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageNumber = Number(searchParams.get('page')) || 1
  const pageLimit = Number(searchParams.get('limit')) || 10

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useAtom($createScheduleModal)

  const [selectedScheduleIds, setSelectedScheduleIds] = useState<number[]>([])
  const setScheduleData = useSetAtom($scheduleData)

  const [searchText, setSearchText] = useAtom($searchText)
  const searchTextDebounced = useDebounce<string>(searchText, 300)
  const {
    isFetchingSchedules,
    isLoadingSchedules,
    refetchSchedules,
    scheduleData,
    totalPages,
    totalSchedule
  } = useSearchedSchedules(searchTextDebounced, pageNumber, pageLimit)

  const { deleteSchedule, deleteScheduleLoading } = useDeleteSchedule()
  const { updateScheduleStatus } = useUpdateScheduleStatus()
  const [api, contextHolder] = notification.useNotification()

  const { timeZone } = getAtom($bitSocial)

  const startDateTimeNow = dayjs(dateTime(timeZone)).format('YYYY-MM-DD HH:mm:ss')

  const showNotification = (description: string, status: 'error' | 'success' = 'success') => {
    api[status]({
      description,
      message: 'Share Now'
    })
  }

  const handlePagination = (pageNo: number, limits: number) => {
    setSearchParams(prev => {
      prev.set('page', String(pageNo))
      prev.set('limit', String(limits))
      return prev
    })
  }

  const onEditClick = (index: number) => {
    const schedule = scheduleData.find(item => item.id === index)

    if (!schedule) return

    setScheduleData(
      produce(schedule.config, draft => {
        draft.id = schedule.id
      })
    )

    setIsScheduleModalOpen({ open: true, type: 'edit' })
  }

  const handleReschedule = (index: number) => {
    const schedule = scheduleData.find(item => item.id === index)

    if (!schedule) return
    setScheduleData(
      produce(schedule.config, draft => {
        draft.settings.name = `Reschedule: ${draft.settings.name}`
        draft.settings.started_at = startDateTimeNow
        delete draft.id
      })
    )
    setIsScheduleModalOpen({ open: true, type: 'reSchedule' })
  }

  const handleScheduleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const onDeleteSchedules = async () => {
    await deleteSchedule(selectedScheduleIds)
    setSelectedScheduleIds([])
    refetchSchedules()
  }

  const onDeleteClick = async (id: number) => {
    await deleteSchedule([id])
    refetchSchedules()
  }
  const onStatusChange = async (id: number, statusValue: number) => {
    const { data, status } = await updateScheduleStatus({ id, status: statusValue })
    showNotification(data, status)
    refetchSchedules()
  }

  const scheduleColumns: ColumnsType<ScheduleTableDataType> = [
    {
      dataIndex: 'title',
      key: 'title',
      title: __('Title'),
      width: '20%'
    },
    {
      dataIndex: 'created_at',
      key: 'created_at',
      title: __('Created At')
    },
    {
      dataIndex: 'start',
      key: 'start',
      title: __('Start Scheduled Post')
    },
    {
      dataIndex: 'interval',
      key: 'interval',
      render: (_, { interval }) =>
        interval.settings?.post_interval_value ? (
          <Typography.Text>{`${interval.settings.post_interval_value}  ${interval.settings.post_interval_type}`}</Typography.Text>
        ) : (
          '-'
        ),
      title: __('Interval ')
    },
    {
      dataIndex: 'nextPost',
      key: 'nextPost',
      title: __('Next Post ')
    },
    {
      dataIndex: 'status',
      key: 'status',
      render: (_, { interval, key, status }) => {
        if (!interval.settings?.post_interval_value && status === STATUS_ACTIVE) {
          return <Tag color="green">{__('In Progress')}</Tag>
        }
        switch (status) {
          case SCHEDULE_STATUS_COMPLETE: {
            return <Tag color="grey">{__('Completed')}</Tag>
          }
          case STATUS_ACTIVE:
          case STATUS_INACTIVE: {
            return (
              <Select
                css={status === STATUS_ACTIVE ? activeStyle : pushedStyle}
                onChange={value => onStatusChange(key, Number(value))}
                options={[
                  { disabled: status === STATUS_ACTIVE, label: __('Active'), value: STATUS_ACTIVE },
                  { disabled: status === STATUS_INACTIVE, label: __('Paused'), value: STATUS_INACTIVE }
                ]}
                size="small"
                value={status === STATUS_ACTIVE ? 'Active' : 'Paused'}
                variant="borderless"
              />
            )
          }
          default: {
            break
          }
        }
      },
      title: __('Status')
    },
    {
      dataIndex: 'action',
      key: 'action',
      render: (_, { interval, key, status }) => {
        return (
          <Space direction="horizontal">
            <Popconfirm
              description={__('Are you sure you want to delete this schedule?')}
              okButtonProps={{ danger: true, loading: deleteScheduleLoading }}
              okText={__('Yes, Delete')}
              onConfirm={() => onDeleteClick(key)}
              placement="right"
              title={__('Delete?')}
            >
              <Button danger icon={<LuTrash2 />} type="text" />
            </Popconfirm>

            {interval.settings?.post_interval_value && status !== SCHEDULE_STATUS_COMPLETE && (
              <Button icon={<LuPencil />} onClick={() => onEditClick(key)} type="text" />
            )}

            {interval.settings?.post_interval_value &&
              (status === SCHEDULE_STATUS_COMPLETE || status === SCHEDULE_STATUS_MISSED) && (
                <Button
                  icon={<LuRepeat />}
                  onClick={() => handleReschedule(key)}
                  title={__('Re-schedule')}
                  type="text"
                />
              )}
          </Space>
        )
      },
      title: __('Action ')
    }
  ]

  const scheduleListData =
    scheduleData &&
    scheduleData.map(schedule => ({
      created_at: dateTimeFormatter(schedule.created_at, `${config.DATE_FORMAT} ${config.TIME_FORMAT}`),
      interval: schedule.config,
      key: schedule.id,
      nextPost:
        schedule.next_published_at &&
        schedule.status === 1 &&
        dayjs(schedule.next_published_at).diff(dateTime(timeZone)) > 1
          ? schedule.human_readable_next_publish
          : '-',
      start: schedule?.started_at
        ? dateTimeFormatter(schedule.started_at, `${config.DATE_FORMAT} ${config.TIME_FORMAT}`)
        : '-',
      status: schedule.status,
      title: schedule.name
    }))

  const scheduleSelect = {
    onSelect: (record: ScheduleTableDataType, selected: boolean) => {
      if (!record) return

      if (selected) {
        setSelectedScheduleIds(prev => [...prev, record.key])
        return
      }
      setSelectedScheduleIds(prev => prev.filter(id => id !== record.key))
    },
    onSelectAll: (selected: boolean, selectedRows: ScheduleTableDataType[]) => {
      if (selected) {
        setSelectedScheduleIds(selectedRows.map(row => row?.key).filter(id => id !== undefined))
        return
      }
      setSelectedScheduleIds([])
    }
  }

  const hasScheduleSelected = selectedScheduleIds.length > 0

  useEffect(() => {
    if (!scheduleData.length && totalPages && pageNumber > totalPages) {
      setSearchParams(prev => {
        prev.set('page', String(totalPages))
        return prev
      })
    }
  }, [scheduleData])

  return (
    <>
      {contextHolder}
      <Flex className="mb-1" justify="space-between">
        <Space>
          {(!searchTextDebounced && scheduleData.length) || searchTextDebounced ? (
            <Input
              onChange={handleScheduleSearch}
              placeholder={__('Search schedule')}
              prefix={<LuSearch />}
              value={searchText}
            />
          ) : undefined}

          {hasScheduleSelected ? (
            <>
              <Typography.Text>{`Selected ${selectedScheduleIds.length} items`}</Typography.Text>
              <Popconfirm
                description={__('Are you sure to delete this logs?')}
                okButtonProps={{ danger: true }}
                okText={__('Yes, Delete')}
                onConfirm={onDeleteSchedules}
                placement="right"
                title={__('Delete Logs')}
              >
                <Button className="ml-2" danger icon={<DeleteIcon />} type="text" />
              </Popconfirm>
            </>
          ) : undefined}
        </Space>

        <div>
          {(!searchTextDebounced && scheduleData.length) || searchTextDebounced ? (
            <Space>
              <Typography.Link
                href="https://bit-social.com/docs/schedule-wordpress-posts-on-social-media/"
                rel="noopener noreferrer"
                strong
                style={{ fontSize: '18px' }}
                target="_blank"
              >
                {__('How to create schedule')}
                <LuMoveUpRight style={{ transform: 'translateY(-2px)' }} />
              </Typography.Link>
              <Button
                disabled={isFetchingSchedules}
                icon={<Refresh spin={isFetchingSchedules} />}
                onClick={() => refetchSchedules()}
                size="large"
              >
                {__('Refresh')}
              </Button>
              <CreateScheduleModal
                btnTitle={__('Create Schedule')}
                isScheduleModalOpen={isScheduleModalOpen}
                setIsScheduleModalOpen={setIsScheduleModalOpen}
              />
            </Space>
          ) : undefined}
        </div>
      </Flex>

      {isLoadingSchedules && <Skeleton />}

      {scheduleData?.length ? (
        <>
          <CronWarning />
          <Table
            bordered
            className="mt-1"
            columns={scheduleColumns}
            dataSource={scheduleListData}
            pagination={{
              current: pageNumber,
              defaultCurrent: 1,
              onChange: handlePagination,
              pageSize: pageLimit,
              showSizeChanger: true,
              total: totalSchedule
            }}
            rowSelection={scheduleSelect}
          />
        </>
      ) : undefined}

      {!isLoadingSchedules && !scheduleData?.length ? (
        <Empty description={__('No schedule found!')}>
          {!searchTextDebounced && (
            <CreateScheduleModal
              btnTitle={__('Create Schedule')}
              isScheduleModalOpen={isScheduleModalOpen}
              setIsScheduleModalOpen={setIsScheduleModalOpen}
            />
          )}
        </Empty>
      ) : undefined}

      {!isLoadingSchedules && !scheduleData?.length ? (
        <Note fontSize="1.6rem" section="schedule" style={{ marginTop: '30px', textAlign: 'justify' }} />
      ) : undefined}
    </>
  )
}
