import { __ } from '@common/helpers/i18nWrap'
import config from '@config/config'
import { type AllSettingsType } from '@pages/Settings/data/useSettings'
import useSettings from '@pages/Settings/data/useSettings'
import useUpdateExternalCronSetting from '@pages/Settings/data/useUpdateExternalCronSetting'
import CronWarning from '@src/components/CronWarning'
import { Card, Space, Spin, Switch, theme, Typography } from 'antd'
import { produce } from 'immer'
import { useState } from 'react'
import { LuMoveUpRight } from 'react-icons/lu'

const { Paragraph, Text, Title } = Typography

export default function ProCronSettings() {
  const { token } = theme.useToken()
  const cronLink = `wget -O /dev/null ${config.SITE_URL}/wp-cron.php?doing_wp_cron > /dev/null 2>&1`
  const { isUpdatingProSettings, updateProSettings } = useUpdateExternalCronSetting()
  const { allSettings, isLoadingSettings } = useSettings()
  const [errorMessage, setErrorMessage] = useState<Record<string, string>>({})

  // this method is for updating the setting for pro users
  const handleChangePro = async (key: keyof AllSettingsType['proSettings']['cron'], value: boolean) => {
    if (allSettings?.proSettings) {
      const updatedSettings = produce(allSettings.proSettings, draft => {
        draft.cron[key] = value
      })

      const { data } = await updateProSettings(updatedSettings)

      if ('errors' in data) {
        setErrorMessage(data.errors)
        return
      }
      setErrorMessage({})
    }
  }

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
        <Title level={5}>{__('For your website, the Cron Job command is:')}</Title>

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
          title={__('External Cron')}
        />

        <Space>
          <Text strong>{__('Enable External Cron')}</Text>
          <Switch
            checked={!!allSettings?.proSettings?.cron?.isExternalCronEnabled}
            disabled={!config.IS_PRO || isLoadingSettings || isUpdatingProSettings}
            onChange={value => handleChangePro('isExternalCronEnabled', value)}
            size="small"
          />
          {isUpdatingProSettings && <Spin size="small" />}
        </Space>

        <div>{errorMessage && <Text type="danger">{errorMessage?.isExternalCronEnabled}</Text>}</div>
      </Card>
    </Card>
  )
}
