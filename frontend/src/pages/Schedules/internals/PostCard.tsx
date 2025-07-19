import { __ } from '@common/helpers/i18nWrap'
import { Card, Flex, Typography } from 'antd'
import { LuClock } from 'react-icons/lu'

interface PostCardType {
  name: string
  scheduleType: number
  time: string
}

const { Paragraph, Text } = Typography
const SCHEDULE_SHARE = 1

export default function PostCard({ name, scheduleType, time }: PostCardType) {
  // NOTE: It should be changed later by Khoaiz

  // const getTimeIconName = (fullTime: string): string => {
  //   const hour24 = Number(fullTime.split(':')[0])
  //   const hour12 = hour24 > 12 ? hour24 - 12 : hour24
  //   return `Clock${hour12}`
  // }

  return (
    <Card size="small">
      <Flex align="center" justify="space-between">
        <div>
          <Paragraph strong style={{ marginBottom: 0 }}>
            {name}
          </Paragraph>
          <Text type="secondary">
            {scheduleType === SCHEDULE_SHARE ? __('Schedule Share') : __('Scheduled Direct Share')}
          </Text>
        </div>

        <Text>
          <LuClock size={13} /> {time}
        </Text>
      </Flex>
    </Card>
  )
}
