import { __, sprintf } from '@common/helpers/i18nWrap'
import { Button, Flex, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'

const { Title } = Typography

export default function Error404() {
  const [sec, setsec] = useState(9)
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      if (sec === 0) {
        navigate('/', { replace: true })
      }
      setsec(sec - 1)
    }, 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sec])

  return (
    <Flex align="center" justify="center" style={{ height: '80vh' }} vertical>
      <Title level={1}>{__('Oops !')}</Title>
      <Title level={4} style={{ marginTop: 0 }} type="danger">
        {__('404 - Not Found')}
      </Title>
      <Title level={4} style={{ marginTop: 0 }}>
        {sprintf(__('Redirecting Home in %s second'), sec)}
      </Title>
      <Link className="btn dp-blue btcd-btn-lg mt-1" to="/">
        <Button type="primary">{__('Go The Home')}</Button>
      </Link>
    </Flex>
  )
}
