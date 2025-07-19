import { Avatar, Flex, Row, Typography } from 'antd'

import { type AccountCardType } from './AccountType'

const { Text } = Typography
export default function AccountCard({ img, name }: AccountCardType) {
  return (
    <Row justify="space-between">
      <Flex align="center" gap={6} justify="center">
        <Avatar shape="square" src={img} />
        <Text ellipsis title={name}>
          {name}
        </Text>
      </Flex>
    </Row>
  )
}
