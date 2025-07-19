import { __ } from '@common/helpers/i18nWrap'
import AdvanceScheduleImg from '@resource/img/advanceSchedule.svg'
import { Button, Flex, Image, Popover, theme, Typography } from 'antd'
import { useState } from 'react'
import { LuCrown } from 'react-icons/lu'

const { Link, Title } = Typography

export default function AdvanceSchedule() {
  const { token } = theme.useToken()
  const [open, setOpen] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  return (
    <Popover
      content={<Image preview={false} src={AdvanceScheduleImg} width={400} />}
      onOpenChange={handleOpenChange}
      open={open}
      placement="bottomRight"
      title={
        <Flex align="center" justify="space-between">
          <Title level={5} style={{ color: token.colorPrimary, marginBottom: 0 }}>
            {__('Advance Schedule Feature on Pro!')}
          </Title>
          <Link
            href="https://bit-social.com/#pricing"
            rel="noopener noreferrer nofollow"
            strong
            style={{ whiteSpace: 'nowrap' }}
            target="_blank"
          >
            <Button size="small" type="primary">
              {__('Buy Pro')}
            </Button>
          </Link>
        </Flex>
      }
      trigger="click"
    >
      <Button style={{ borderColor: token.colorPrimary }} type="text">
        {__('Advance Schedule')} <LuCrown color="#ff8609" size={18} />
      </Button>
    </Popover>
  )
}
