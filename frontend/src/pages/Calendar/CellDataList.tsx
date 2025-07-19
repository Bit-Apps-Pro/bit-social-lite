import { trimStr } from '@common/helpers/globalHelpers'
import { type BadgeProps } from 'antd'
import { Badge, Divider, Space } from 'antd'

import { type ListDataType } from './CalendarTypes'

interface CellDataListInter {
  listData: ListDataType[]
}

export default function CellDataList({ listData }: CellDataListInter) {
  const badgeColor = 'rgb(146 108 216 / 85%)'
  return (
    <ul className="events">
      {listData.map((item, index) => (
        <li key={`hello ${index * 2}`}>
          <Space>
            <Badge status={item.type as BadgeProps['status']} text={trimStr(item.content, 10)} />
            <Badge color={badgeColor} count={item.count} showZero size="small" />
          </Space>
          <Divider dashed style={{ margin: '1px 0px' }} />
        </li>
      ))}
    </ul>
  )
}
