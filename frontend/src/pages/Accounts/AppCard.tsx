import { __ } from '@common/helpers/i18nWrap'
import { Button, Card, Row, Typography } from 'antd'

const { Text } = Typography
interface AppCardType {
  handleManage: () => void
  name: string
}
export default function AppCard({ handleManage, name }: AppCardType) {
  return (
    <Card css={{ width: '400px' }} size="small">
      <Row align="middle" justify="space-between">
        <Text ellipsis strong>
          {name}
        </Text>
        <Button onClick={handleManage} size="small">
          {__('Manage')}
        </Button>
      </Row>
    </Card>
  )
}
