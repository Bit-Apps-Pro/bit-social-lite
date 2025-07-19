import { pageChecker } from '@common/helpers/globalHelpers'
import { __ } from '@common/helpers/i18nWrap'
import useSearchedSchedules from '@hooks/queries/schedule/useSearchedSchedules'
import DotsVertical from '@icons/DotsVertical'
import { Button, Card, Popconfirm, Popover, Row, Space, Switch, Typography } from 'antd'
import { useState } from 'react'

import useDeleteSchedule from '../data/useDeleteSchedule'
import useUpdateScheduleStatus from '../data/useUpdateScheduleStatus'

interface ScheduleCardType {
  currentPage: number
  id: number
  info?: string
  isActive: boolean
  name: string
  next: string
  onEditClick: () => void
  pageLimit: number
  setCurrentPage: (number: number) => void
  start: string
  totalSchedule: number
}

export default function ScheduleCard({
  currentPage,
  id,
  info,
  isActive,
  name,
  next,
  onEditClick,
  pageLimit,
  setCurrentPage,
  start,
  totalSchedule
}: ScheduleCardType) {
  const { Text, Title } = Typography
  const [isAccountActive, setIsAccountActive] = useState(isActive)
  const { refetchSchedules } = useSearchedSchedules('', currentPage, pageLimit)
  const { updateScheduleStatus } = useUpdateScheduleStatus()
  const { deleteSchedule, deleteScheduleLoading } = useDeleteSchedule()
  const [open, setOpen] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }
  const hide = () => {
    setOpen(false)
  }
  const onStatusChange = async () => {
    await updateScheduleStatus({ id, status: Number(!isAccountActive) })
    refetchSchedules()
  }

  const onDeleteClick = async () => {
    await deleteSchedule([id])
    refetchSchedules()
    pageChecker(currentPage, pageLimit, totalSchedule, setCurrentPage)
  }

  const onChange = () => {
    setIsAccountActive(prev => !prev)
    onStatusChange()
  }
  const onPopoverEditClick = () => {
    hide()
    onEditClick()
  }
  const onPopoverDeleteClick = () => {
    hide()
    onDeleteClick()
  }

  return (
    <Card css={{ margin: '8px 0' }} size="small">
      <Row justify="space-between">
        <div css={{ maxWidth: '650px' }}>
          <Title level={5}>{name}</Title>
          <Text>{info}</Text>
        </div>
        <Space size="large">
          <div css={{ width: '200px' }}>
            <Title level={5}>{__('Start')}</Title>
            <Text>{start}</Text>
          </div>
          <div css={{ width: '200px' }}>
            <Title level={5}>{__('Next post')}</Title>
            <Text>{next}</Text>
          </div>
          <Switch checked={isAccountActive} onChange={onChange} size="small" />
          <Popover
            content={
              <Space direction="vertical">
                <Button onClick={onPopoverEditClick} type="text">
                  {__('Edit')}
                </Button>
                <Popconfirm
                  description={__('Are you sure you want to delete this schedule?')}
                  okButtonProps={{ loading: deleteScheduleLoading }}
                  onConfirm={onPopoverDeleteClick}
                  placement="right"
                  title={__('Delete?')}
                >
                  <Button type="text">{__('Delete')}</Button>
                </Popconfirm>
              </Space>
            }
            onOpenChange={handleOpenChange}
            open={open}
            placement="bottom"
            trigger="click"
          >
            <Button icon={<DotsVertical size={12} />} type="text" />
          </Popover>
        </Space>
      </Row>
    </Card>
  )
}
