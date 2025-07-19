import { dateTimeFormatter } from '@common/helpers/globalHelpers'
import config from '@config/config'
import { Col, Row, Typography } from 'antd'

import PostCard from './PostCard'

interface ListType {
  name: string
  scheduleType: number
  time: string
}

interface TimeCardType {
  lists: ListType[]
  style?: React.CSSProperties
  time: string
}

export default function TimeCard({ lists, style, time }: TimeCardType) {
  const { Title } = Typography

  if (lists === undefined) return

  return (
    <div style={style}>
      <Row css={{ padding: '16px 0' }} justify="space-evenly">
        <Col span={4}>
          <Title level={5}>{time}</Title>
        </Col>
        <Col span={20}>
          {lists.map(list => (
            <PostCard
              key={list.time}
              name={list.name}
              scheduleType={list.scheduleType}
              time={dateTimeFormatter(list.time, config.TIME_FORMAT)}
            />
          ))}
        </Col>
      </Row>
      <hr className="m-0" />
    </div>
  )
}
