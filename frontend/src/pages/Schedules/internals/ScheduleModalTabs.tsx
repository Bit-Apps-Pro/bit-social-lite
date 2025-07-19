/* eslint-disable translate-obj-prop/translate-obj-prop */
import { type GlobalToken } from 'antd'
import { Tabs } from 'antd'

import Accounts from './Accounts/Accounts'
import PostFilter from './PostFilter'
import Settings from './Settings'

const tabList = [
  {
    children: <Settings />,
    key: '1',
    label: 'Settings'
  },
  {
    children: <PostFilter />,
    key: '2',
    label: 'Post Filter'
  },
  {
    children: <Accounts />,
    key: '3',
    label: 'Accounts & Template'
  }
]

interface ScheduleModalTabsType {
  handleTabActive: (key: string) => void
  tabActive: string
  token: GlobalToken
}

function ScheduleModalTabs({ handleTabActive, tabActive, token }: ScheduleModalTabsType) {
  return (
    <div style={{ paddingInline: 24 }}>
      <Tabs
        activeKey={tabActive}
        className="sticky-tab"
        css={{
          '& .ant-tabs-nav': {
            backgroundColor: token.colorBgElevated
          }
        }}
        defaultActiveKey="1"
        items={tabList}
        onChange={handleTabActive}
      />
    </div>
  )
}

export default ScheduleModalTabs
