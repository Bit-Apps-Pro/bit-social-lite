import { $bitSocial, getAtom } from '@common/globalStates'
import $shareNowData, { defaultShareNowData } from '@common/globalStates/$shareNowData'
import { dateTime, dateTimeFormatter } from '@common/helpers/globalHelpers'
import { __ } from '@common/helpers/i18nWrap'
import CronWarning from '@components/CronWarning'
import Note from '@components/Note'
import config from '@config/config'
import DeleteIcon from '@icons/DeleteIcon'
import Refresh from '@icons/Refresh'
import useUpdateScheduleStatus from '@pages/Schedules/data/useUpdateScheduleStatus'
import { type ShareNowModalType } from '@pages/ShareNow/ShareNow'
import {
  Button,
  Col,
  Empty,
  type GlobalToken,
  notification,
  Popconfirm,
  Row,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  Typography
} from 'antd'
import { type ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { produce } from 'immer'
import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { LuMoveUpRight, LuPencil, LuPlus, LuRepeat, LuTrash2 } from 'react-icons/lu'
import { useSearchParams } from 'react-router'

import useDeleteShareNow from './data/useDeleteShareNow'
import useShareNow from './data/useShareNow'
import { type ShareNowTableDataType } from './ShareNowType'

interface PostTypes {
  setShareNowModal: React.Dispatch<React.SetStateAction<ShareNowModalType>>
}

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

const SCHEDULE_STATUS_INACTIVE = 0
const SCHEDULE_STATUS_ACTIVE = 1
const SCHEDULE_STATUS_COMPLETE = 2
const SCHEDULE_STATUS_DRAFT = 3
const SCHEDULE_STATUS_MISSED = 4

export default function ShareNowList({ setShareNowModal }: PostTypes) {
  const [searchParams, setSearchParams] = useSearchParams({})
  const pageNumber = Number(searchParams.get('page')) || 1
  const pageLimit = Number(searchParams.get('limit')) || 10

  const { timeZone } = getAtom($bitSocial)

  const {
    isFetchingShareNowList,
    isLoadingShareNowList,
    refetchShareNowList,
    shareNowData,
    totalPages,
    totalShareNow
  } = useShareNow(pageNumber, pageLimit)
  const [selectedShareNowIds, setSelectedShareNowIds] = useState<number[]>([])

  const { updateScheduleStatus } = useUpdateScheduleStatus()
  const { deleteShareNow, isShareNowDeleting } = useDeleteShareNow(pageLimit, pageNumber)
  const setShareNowData = useSetAtom($shareNowData)
  const [api, contextHolder] = notification.useNotification()

  const showNotification = (description: string, status: 'error' | 'success' = 'success') => {
    api[status]({
      description,
      message: 'Share Now'
    })
  }

  const shareNowListData = shareNowData.map(item => ({
    created_at: dateTimeFormatter(item.created_at, `${config.DATE_FORMAT} ${config.TIME_FORMAT}`),
    details: item,
    interval: item.config,
    key: item.id,
    nextPost:
      item.next_published_at &&
      item.status === 1 &&
      dayjs(item.next_published_at).diff(dateTime(timeZone)) > 1
        ? item.human_readable_next_publish
        : '-',
    start: item?.config.settings.started_at
      ? dateTimeFormatter(
          item?.config.settings.started_at,
          `${config.DATE_FORMAT} ${config.TIME_FORMAT}`
        )
      : '-',
    status: item.status,
    title: item.name
  }))

  const onStatusChange = async (id: number, statusValue: number) => {
    const { data, status } = await updateScheduleStatus({ id, status: statusValue })

    showNotification(data, status)

    refetchShareNowList()
  }

  const handleDrawerOpen = () => {
    setShareNowData(defaultShareNowData())
    setShareNowModal({ open: true, type: 'create' })
  }

  const onDeleteClick = async (id: number) => {
    await deleteShareNow([id])
    refetchShareNowList()
  }

  const onEditClick = (key: number) => {
    const shareNowEditData = shareNowData.find(item => item.id === key)
    if (!shareNowEditData) return

    setShareNowData(prev => ({
      ...prev,
      accounts: shareNowEditData.config.accounts,
      id: key,
      settings: shareNowEditData.config.settings,
      status: shareNowEditData.status,
      templates: shareNowEditData.config.templates
    }))
    setShareNowModal({ open: true, type: 'edit' })
  }

  const handleRePost = (index: number) => {
    const shareNowPrevData = shareNowData.find(item => item.id === index)

    if (!shareNowPrevData) return

    setShareNowData(prev =>
      produce(prev, draft => {
        draft.accounts = shareNowPrevData.config.accounts
        draft.settings.name = `Re post: ${shareNowPrevData.name}`
        draft.settings.started_at = undefined
        draft.status = shareNowPrevData.status
        draft.templates = shareNowPrevData.config.templates
      })
    )

    setShareNowModal({ open: true, type: 'create' })
  }

  const columns: ColumnsType<ShareNowTableDataType> = [
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
      render: (_, { interval }) => (
        <Typography.Text>
          {interval.settings.repeat
            ? `${interval.settings.post_interval_value} ${interval.settings.post_interval_type}`
            : '-'}
        </Typography.Text>
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
      render: (_, { key, status }) => {
        switch (status) {
          case SCHEDULE_STATUS_ACTIVE:
          case SCHEDULE_STATUS_INACTIVE: {
            return (
              <Select
                css={status === SCHEDULE_STATUS_ACTIVE ? activeStyle : pushedStyle}
                onChange={value => onStatusChange(key, Number(value))}
                options={[
                  {
                    disabled: status === SCHEDULE_STATUS_ACTIVE,
                    label: __('Active'),
                    value: SCHEDULE_STATUS_ACTIVE
                  },
                  {
                    disabled: status === SCHEDULE_STATUS_INACTIVE,
                    label: __('Paused'),
                    value: SCHEDULE_STATUS_INACTIVE
                  }
                ]}
                size="small"
                value={status === SCHEDULE_STATUS_ACTIVE ? 'Active' : 'Paused'}
                variant="borderless"
              />
            )
          }
          case SCHEDULE_STATUS_COMPLETE: {
            return <Tag color="grey">{__('Completed')}</Tag>
          }
          case SCHEDULE_STATUS_DRAFT: {
            return <Tag color="purple">{__('Draft')}</Tag>
          }
          case SCHEDULE_STATUS_MISSED: {
            return <Tag color="red">{__('Missed')}</Tag>
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
      render: (_, { key, status }) => (
        <Space direction="horizontal">
          <Popconfirm
            description={__('Are you sure you want to delete this schedule?')}
            okButtonProps={{ danger: true, loading: isShareNowDeleting }}
            okText={__('Yes, Delete')}
            onConfirm={() => onDeleteClick(key)}
            placement="right"
            title={__('Delete?')}
          >
            <Button danger icon={<LuTrash2 />} type="text" />
          </Popconfirm>

          {status === SCHEDULE_STATUS_COMPLETE || status === SCHEDULE_STATUS_MISSED ? (
            <Button
              icon={<LuRepeat />}
              onClick={() => handleRePost(key)}
              title={__('Re-post')}
              type="text"
            />
          ) : (
            <Button
              icon={<LuPencil />}
              onClick={() => onEditClick(key)}
              title={__('Edit')}
              type="text"
            />
          )}
        </Space>
      ),
      title: __('Action ')
    }
  ]

  const handlePagination = (pageNo: number, limits: number) => {
    setSearchParams(prev => {
      prev.set('page', String(pageNo))
      prev.set('limit', String(limits))
      return prev
    })
  }

  const rowSelection = {
    onSelect: (record: ShareNowTableDataType, selected: boolean) => {
      if (!record) return

      if (selected) {
        setSelectedShareNowIds(prev => [...prev, record.key])
        return
      }
      setSelectedShareNowIds(prev => prev.filter(id => id !== record.key))
    },
    onSelectAll: (selected: boolean, selectedRows: ShareNowTableDataType[]) => {
      if (selected) {
        setSelectedShareNowIds(selectedRows.map(row => row?.key).filter(id => id !== undefined))
        return
      }
      setSelectedShareNowIds([])
    }
  }

  const hasSelected = selectedShareNowIds.length > 0

  const confirm = async () => {
    await deleteShareNow(selectedShareNowIds)
    setSelectedShareNowIds([])
    refetchShareNowList()
  }

  useEffect(() => {
    if (!shareNowData.length && totalPages && pageNumber > totalPages) {
      setSearchParams(prev => {
        prev.set('page', String(totalPages))
        return prev
      })
    }
  }, [shareNowData])

  return (
    <>
      {contextHolder}
      <Row className="mb-2" justify="space-between">
        <Col>
          <Space>
            {hasSelected ? (
              <>
                <Typography.Text>{`Selected ${selectedShareNowIds.length} items`}</Typography.Text>
                <Popconfirm
                  description={__('Are you sure to delete this logs?')}
                  okText={__('Confirm')}
                  onConfirm={confirm}
                  placement="right"
                  title={__('Delete Logs')}
                >
                  <Button danger icon={<DeleteIcon />} type="text" />
                </Popconfirm>
              </>
            ) : undefined}
          </Space>
        </Col>
        <Col>
          {shareNowListData?.length ? (
            <Space>
              <Typography.Link
                href="https://bit-social.com/docs/instantly-share-posts-on-social-media-platforms/"
                rel="noopener noreferrer"
                strong
                style={{ fontSize: '18px' }}
                target="_blank"
              >
                {__('How to share a post instantly')}
                <LuMoveUpRight style={{ transform: 'translateY(-2px)' }} />
              </Typography.Link>

              <Button
                disabled={isLoadingShareNowList || isFetchingShareNowList}
                icon={<Refresh spin={isLoadingShareNowList || isFetchingShareNowList} />}
                onClick={() => refetchShareNowList()}
                size="large"
              >
                {__('Refresh')}
              </Button>

              <Button icon={<LuPlus />} onClick={handleDrawerOpen} size="large" type="primary">
                {__('Share Post')}
              </Button>
            </Space>
          ) : undefined}
        </Col>
      </Row>
      {shareNowListData?.length ? (
        <>
          <CronWarning />
          <Table
            bordered
            className="mt-1"
            columns={columns}
            dataSource={shareNowListData}
            pagination={{
              current: pageNumber,
              defaultCurrent: 1,
              onChange: handlePagination,
              pageSize: pageLimit,
              showSizeChanger: true,
              total: totalShareNow
            }}
            rowSelection={rowSelection}
          />
        </>
      ) : undefined}

      {!isLoadingShareNowList && !shareNowListData?.length ? (
        <Empty description={__('No Share Post found!')}>
          <Button icon={<LuPlus />} onClick={handleDrawerOpen} size="large" type="primary">
            {__('Share Post')}
          </Button>
        </Empty>
      ) : undefined}

      {isLoadingShareNowList && <Skeleton />}

      {!isLoadingShareNowList && !shareNowListData?.length ? (
        <Note fontSize="1.6rem" section="shareNow" style={{ marginTop: '30px', textAlign: 'justify' }} />
      ) : undefined}
    </>
  )
}
