import { $bitSocial } from '@common/globalStates'
import { dateTime, dateTimeFormatter } from '@common/helpers/globalHelpers'
import { __ } from '@common/helpers/i18nWrap'
import config from '@config/config'
import PlatformIcon from '@icons/PlatformIcon'
import { Avatar, Badge, Card, Col, Flex, Row, Space, theme, Tooltip, Typography } from 'antd'
import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'

import { type SelectDateModalData } from './ProCalendar.pro'

const { Text, Title } = Typography

const SCHEDULE_TYPE: Record<number, string> = {
  1: 'Wp Post Schedule',
  2: 'Share Now'
}

export default function DayCellDataCard({ avatars, runTimes, schedule }: SelectDateModalData) {
  const { timeZone } = useAtomValue($bitSocial)
  const typeWidth = {
    width: '110px'
  }
  const { token } = theme.useToken()

  return (
    <Card size="small">
      <Row gutter={20} justify="space-between">
        <Col span={14}>
          <Title level={5}>{schedule.name} </Title>
          <Space direction="vertical">
            <Flex>
              <Text style={typeWidth}> {__('Start Date:')} </Text>
              <Text strong type="secondary">
                {schedule.config?.settings?.started_at &&
                  dateTimeFormatter(
                    schedule.config.settings.started_at,
                    `${config.DATE_FORMAT} ${config.TIME_FORMAT}`
                  )}
              </Text>
            </Flex>
            <Flex>
              <Text style={typeWidth}>{__('Post Type:')}</Text>
              <Text strong>{SCHEDULE_TYPE[schedule.schedule_type]}</Text>
            </Flex>
            <Flex>
              <Text style={typeWidth}>{__('Post Time:')}</Text>
              <Text strong>
                {schedule.next_published_at &&
                schedule.status === 1 &&
                dayjs(schedule.next_published_at).diff(dateTime(timeZone)) > 1
                  ? dateTimeFormatter(schedule.next_published_at, `${config.TIME_FORMAT}`)
                  : '-'}
              </Text>
            </Flex>
          </Space>
        </Col>
        <Col span={10}>
          <Flex align="end" gap="large" vertical>
            <Title level={5}>
              {__('Run Times: ')}
              <Badge className="" color="purple" count={runTimes || 1} />
            </Title>
            <Avatar.Group
              max={{
                count: 7
              }}
            >
              {avatars.map(avatar => (
                <Tooltip key={avatar.name} placement="top" title={avatar.name}>
                  <Badge
                    count={
                      <PlatformIcon
                        name={avatar.platform}
                        size={18}
                        style={{ border: '2px solid', borderColor: token.colorBorder }}
                      />
                    }
                    offset={[-2, 28]}
                    size="small"
                  >
                    <Avatar src={avatar.src} />
                  </Badge>
                </Tooltip>
              ))}
            </Avatar.Group>
          </Flex>
        </Col>
      </Row>
    </Card>
  )
}
