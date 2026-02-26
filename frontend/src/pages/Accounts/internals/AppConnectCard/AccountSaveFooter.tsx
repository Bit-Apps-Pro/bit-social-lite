import { __, sprintf } from '@common/helpers/i18nWrap'
import { Typography } from 'antd'

export const accountSaveFooterMessage = (platform: string) => {
  switch (platform) {
    case 'googleBusinessProfile': {
      return (
        <>
          {__('You can only add verified locations.')}
          <br />
          {__(
            'If you need to add another Google account, simply log out of or switch Google accounts first.'
          )}
        </>
      )
    }
    default: {
      return (
        <>
          {sprintf(
            __(
              'If you need to add another %1$s  account, simply log out of or switch %2$s accounts first.'
            ),
            platform,
            platform
          )}
        </>
      )
    }
  }
}

export default function AccountSaveFooter({ count = 0, platform }: { count: number; platform: string }) {
  return (
    <Typography.Text style={{ fontSize: '14px' }} type="secondary">
      <div>{sprintf(__('Total %s accounts found'), count)} </div>
      {accountSaveFooterMessage(platform)}
    </Typography.Text>
  )
}
