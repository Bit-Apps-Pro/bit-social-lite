import $logFilter from '@common/globalStates/$logFilter'
import { dateTimeFormatter } from '@common/helpers/globalHelpers'
import { __ } from '@common/helpers/i18nWrap'
import CronWarning from '@components/CronWarning'
import config from '@config/config'
import DeleteIcon from '@icons/DeleteIcon'
import Refresh from '@icons/Refresh'
import useDeleteLogs from '@pages/Logs/data/useDeleteLogs'
import useLogs from '@pages/Logs/data/useLogs'
import { Alert, Button, Flex, message, Popconfirm, Space, Spin, Table, Tag, Typography } from 'antd'
import { type ColumnsType } from 'antd/es/table'
import { type TableRowSelection } from 'antd/es/table/interface'
import { useAtomValue } from 'jotai'
import { type SyntheticEvent, useEffect, useState } from 'react'
import { LuExternalLink, LuMoveUpRight, LuRepeat } from 'react-icons/lu'
import { useSearchParams } from 'react-router'

import useRetry from './data/useRetry'
import FilterLogs from './internals/FilterLogs'
import FilterTags from './internals/FilterLogs/FilterTags'
import css from './Log.module.css'
import { type LogsTableDataType, type LogsType, type RetryDataType } from './LogsType'

const handleRetry = (e: SyntheticEvent, params: RetryDataType, retry: RetryHandlerType) => {
  e.stopPropagation()
  retry(params)
}
const { Paragraph, Text } = Typography
type RetryHandlerType = (data: RetryDataType) => void
const columnsData = (retry: RetryHandlerType, isRetryLoading: boolean) => {
  const columns: ColumnsType<LogsTableDataType> = [
    {
      dataIndex: 'date',
      key: 'date',
      title: __('Date'),
      width: '15%'
    },
    {
      dataIndex: 'platform',
      key: 'platform',
      title: __('Platform')
    },
    {
      dataIndex: 'account',
      key: 'account',
      title: __('Account')
    },

    {
      dataIndex: 'schedule',
      key: 'schedule',
      title: __('Schedule'),
      width: '20%'
    },
    {
      dataIndex: 'details',
      key: 'details',
      render: (_, { details, status }) => {
        const data = details
        const response = JSON.stringify(data)
        return (
          <Flex align="center">
            {status === '1' ? (
              <Tag color="success">{__('Success')}</Tag>
            ) : (
              <Tag color="error">{__('Error')}</Tag>
            )}
            <Paragraph copyable={{ text: response }} style={{ marginBottom: 0 }}>
              {response.slice(0, 20)}
            </Paragraph>
          </Flex>
        )
      },
      title: __('Response'),
      width: '20%'
    },
    {
      dataIndex: 'actions',
      key: 'actions',
      render: (_, { details, key, scheduleId, status }) => (
        <>
          {status === '1' ? (
            <Button
              href={details?.post_url}
              icon={<LuExternalLink size={13} />}
              size="small"
              target="_blank"
            >
              {__('Visit')}
            </Button>
          ) : (
            <Button
              danger
              disabled={isRetryLoading || !scheduleId}
              icon={<LuRepeat size={13} />}
              onClick={e => handleRetry(e, { details, key, scheduleId }, retry)}
              size="small"
              title={scheduleId ? __('Retry') : __('Related schedule was deleted')}
            >
              {__('Retry')}
            </Button>
          )}
        </>
      ),
      title: __('Actions')
    }
  ]
  return columns
}

const rowRender = (record: LogsTableDataType) => (
  <Alert
    description={<pre className={css.expandDetails}>{JSON.stringify(record.details, undefined, 2)}</pre>}
    message={record.status === '1' ? 'Success' : 'Error'}
    showIcon
    type={record.status === '1' ? 'success' : 'error'}
  />
)

const handleExpandIcon = ({
  expanded,
  onExpand,
  record
}: {
  expanded: boolean
  onExpand: (record: LogsTableDataType, event: React.MouseEvent<HTMLElement>) => void
  record: LogsTableDataType
}) => (
  <Button onClick={e => onExpand(record, e)} size="small">
    {expanded ? __('Hide') : __('Details')}
  </Button>
)

const expandable = {
  expandedRowRender: rowRender,
  expandIcon: handleExpandIcon,
  expandIconAsCell: true,
  expandIconColumnIndex: 6
}

export default function Logs() {
  const [searchParams, setSearchParams] = useSearchParams({})
  const pageNumber = Number(searchParams.get('page')) || 1
  const pageLimit = Number(searchParams.get('limit')) || 10
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([])
  const filters = useAtomValue($logFilter)

  const { isFetching, isLogsLoading, logData, refetch, totalLogs, totalPages } = useLogs(
    pageNumber,
    pageLimit,
    filters
  )

  const { deleteLogs, isLogsDeleting } = useDeleteLogs(pageLimit, pageNumber)
  const { isRetryLoading, result, retry } = useRetry()
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    if (!isRetryLoading && result?.status === 'success') {
      return messageApi.open({
        content: 'Retry call successfully',
        type: 'success'
      })
    }
    if (!isRetryLoading && result?.status === 'error') {
      return messageApi.open({
        content: 'Retry call successfully',
        type: 'success'
      })
    }
  }, [result])

  const hasSelected = selectedLogIds.length > 0
  const LogTableData: LogsTableDataType[] | undefined =
    logData &&
    logData?.map((log: LogsType) => ({
      account: log.details.account_name,
      date: dateTimeFormatter(log.created_at, `${config.DATE_FORMAT} ${config.TIME_FORMAT}`),
      details: log.details,
      key: log.id,
      platform: log.platform,
      schedule: log?.schedule?.name || `Auto post - Post ID: ${log.details.post_id}`,
      scheduleId: log.schedule_id,
      status: log.status
    }))

  const rowSelection: TableRowSelection<LogsTableDataType> = {
    onSelect: (record, selected) => {
      if (!record) return

      if (selected) {
        setSelectedLogIds(prev => [...prev, record.key])
        return
      }
      setSelectedLogIds(prev => prev.filter(id => id !== record.key))
    },
    onSelectAll: (selected, selectedRows) => {
      if (selected) {
        setSelectedLogIds(selectedRows.map(row => row?.key).filter(id => id !== undefined))
        return
      }
      setSelectedLogIds([])
    }
  }

  const confirm = async () => {
    await deleteLogs(selectedLogIds)
    setSelectedLogIds([])
  }

  const handlePagination = (pageNo: number, limits: number) => {
    setSearchParams(prev => {
      prev.set('page', String(pageNo))
      prev.set('limit', String(limits))
      return prev
    })
  }

  useEffect(() => {
    refetch()
    setSelectedLogIds([])
  }, [filters])

  useEffect(() => {
    if (!logData.length && totalPages && pageNumber > totalPages) {
      setSearchParams(prev => {
        prev.set('page', String(totalPages))
        return prev
      })
    }
  }, [logData, filters])

  return (
    <>
      <Flex className="mb-2" justify="space-between">
        <Space>
          {(isLogsLoading || isLogsDeleting) && <Spin />}
          {hasSelected ? (
            <>
              <Text>{`Selected ${selectedLogIds.length} items`}</Text>
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

          {Object.values(filters).every(value => value === 'all') ? undefined : <FilterTags />}
        </Space>

        <Space>
          <Typography.Link
            href="https://bit-social.com/docs/log/"
            rel="noopener noreferrer"
            strong
            style={{ fontSize: '18px' }}
            target="_blank"
          >
            {__('Visit our documentation')}
            <LuMoveUpRight style={{ transform: 'translateY(-2px)' }} />
          </Typography.Link>
          <Button
            icon={<Refresh spin={isFetching} />}
            loading={isFetching}
            onClick={() => refetch()}
            size="large"
          >
            {__('Refresh')}
          </Button>
          <FilterLogs />
        </Space>
      </Flex>

      <CronWarning />

      <Table
        bordered
        className="mt-1"
        columns={columnsData(retry, isRetryLoading)}
        dataSource={LogTableData}
        expandable={expandable}
        pagination={{
          current: pageNumber,
          defaultCurrent: 1,
          onChange: handlePagination,
          pageSize: pageLimit,
          showSizeChanger: true,
          total: totalLogs
        }}
        rowSelection={rowSelection}
      />

      {contextHolder}
    </>
  )
}
