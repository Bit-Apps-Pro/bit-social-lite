import { $isBuyProModalOpen } from '@common/globalStates/$buyPro'
import { __ } from '@common/helpers/i18nWrap'
import CronWarning from '@components/CronWarning'
import { Card, Space, Spin, Switch, theme, Typography } from 'antd'
import { useSetAtom } from 'jotai'
import { useState } from 'react'
import { LuCrown, LuMoveUpRight } from 'react-icons/lu'

import useUpdateExternalCronSetting from './data/useUpdateExternalCronSetting'

const { Paragraph, Text, Title } = Typography

export default function FreeCronSettings() {
  const { token } = theme.useToken()
  const cronLink = `wget -O /dev/null ${window.location.origin}/wp-cron.php?doing_wp_cron > /dev/null 2>&1`
  const { isUpdatingProSettings } = useUpdateExternalCronSetting()
  const [errorMessage] = useState<Record<string, string>>({})

  const setProModalOpen = useSetAtom($isBuyProModalOpen)

  return (
    <Card style={{ backgroundColor: token.colorFillAlter }}>
      <Title level={4}>{__('Cron Setup')}</Title>
      <Paragraph>
        {__('All settings here')}
        <Typography.Link
          href="https://bit-social.com/documentation/setting/setup-cron-jobs/"
          rel="noopener noreferrer nofollow"
          target="_blank"
          underline
        >
          {__('Doc here')}
          <LuMoveUpRight size={12} style={{ transform: 'translateY(-2px)' }} />
        </Typography.Link>
      </Paragraph>

      <Card style={{ marginBottom: 16 }}>
        <Card.Meta
          description={
            <>
              {__('For more accurate results, you must establish a genuine')}
              <Typography.Link
                href="https://bit-social.com/documentation/setting/setup-cron-jobs/"
                rel="noopener noreferrer nofollow"
                target="_blank"
                underline
              >
                {__('Cron job')}
              </Typography.Link>
              {__(
                'on your hosting or server and enable this option to disregard the built-in Cron job.Otherwise, the auto-post and scheduling tools might not operate promptly, and you might have delays.'
              )}
            </>
          }
          style={{ marginBottom: 8 }}
          title={__('Cron Job settings')}
        />
        <CronWarning type="settings" />

        <Title level={5}> {__('For your website, the Cron Job command is:')} </Title>

        <Text
          copyable={{ text: cronLink }}
          css={{ color: '#4059ff !important', fontSize: '16px !important' }}
        >
          {cronLink}
        </Text>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Card.Meta
          description={__(
            "Activate Bit Social's external cron feature for continuous cron job operation even if there is no user's hit on your website. This cron will automatically awake your website externally and your scheduled post will automatically publish on your desired social platforms!"
          )}
          style={{ marginBottom: 8 }}
          title={
            <>
              {__('External Cron')} <LuCrown color="#ff8609" size={22} />
            </>
          }
        />

        <Space>
          <Text strong>{__('Enable External Cron')}</Text>
          <Switch onChange={() => setProModalOpen(true)} size="small" value={false} />
          {isUpdatingProSettings && <Spin size="small" />}
        </Space>

        <div>{errorMessage && <Text type="danger">{errorMessage?.isExternalCronEnabled}</Text>}</div>
      </Card>
    </Card>
  )
}
