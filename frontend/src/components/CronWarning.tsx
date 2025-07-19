import { $bitSocial, getAtom } from '@common/globalStates'
import { __ } from '@common/helpers/i18nWrap'
import useSettings from '@pages/Settings/data/useSettings'
import { Typography } from 'antd'
import { LuMoveUpRight } from 'react-icons/lu'
import { Link } from 'react-router'

export default function CronWarning({
  type = 'warning'
}: {
  type?: 'message' | 'settings' | 'warning'
}) {
  const { wpCronStatus } = getAtom($bitSocial)
  const { allSettings } = useSettings()
  const isExternalCron = allSettings?.proSettings?.cron?.isExternalCronEnabled

  if (!wpCronStatus && !isExternalCron) {
    return (
      <>
        <Typography.Text mark>
          <span dangerouslySetInnerHTML={{ __html: __('Your <b>WP_CRON</b> are disabled') }} />

          {type !== 'settings' && (
            <b>
              <Link className="mt-2" to="/settings">
                {__('Cron Settings')}
                <LuMoveUpRight style={{ transform: 'translateY(-2px)' }} />
              </Link>
            </b>
          )}
          {type !== 'message' && __('the scheduled post or share now post may not publish on time!')}
        </Typography.Text>

        {type !== 'message' && (
          <Typography.Link
            href="https://bit-social.com/documentation/setting/setup-cron-jobs/"
            rel="noopener noreferrer nofollow"
            target="_blank"
            underline
          >
            {__('Learn more')}
          </Typography.Link>
        )}
      </>
    )
  }
}
