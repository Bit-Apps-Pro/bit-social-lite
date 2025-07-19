import { __ } from '@common/helpers/i18nWrap'
import DashboardDefault from '@resource/img/dashboard-image.svg'
import { Button, Flex, Image, Skeleton, Typography } from 'antd'
import { LuMoveUpRight } from 'react-icons/lu'
import { Link } from 'react-router'

import useUserInfo from './data/useUserInfo'

const { Text, Title } = Typography

function DefaultDashboard() {
  const { isUserInfoLoading, userInfo } = useUserInfo()

  if (isUserInfoLoading) return <Skeleton />
  return (
    <Flex align="center" justify="center" style={{ paddingBottom: 40, position: 'relative' }} vertical>
      <Title style={{ left: '30px', position: 'absolute', top: '20px' }}>
        {__('Hi')} {userInfo?.username}
      </Title>
      <Image className="mt-2" height="300px" preview={false} src={DashboardDefault} />
      <Title className="mt-3" level={3}>
        {__('Welcome to Bit Social')}
      </Title>
      <Text style={{ color: 'blue' }}>{__('Thanks for using Bit Social')}</Text>
      <Text>{__('Smart solution for WordPress post Schedule')}</Text>
      <Link className="mt-2" to="/accounts">
        <Button size="large" type="primary">
          {__('Accounts')}
          <LuMoveUpRight style={{ transform: 'translateY(-2px)' }} />
        </Button>
      </Link>{' '}
    </Flex>
  )
}

export default DefaultDashboard
