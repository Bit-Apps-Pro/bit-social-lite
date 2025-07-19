/* eslint-disable max-len */
import { __ } from '@common/helpers/i18nWrap'
import { Alert, Typography } from 'antd'
import { LuMoveUpRight } from 'react-icons/lu'

export const description = (section: string) => {
  switch (section) {
    case 'accounts': {
      return (
        <>
          <div
            className="mb-3"
            dangerouslySetInnerHTML={{
              __html: __(
                '<b>Accounts:</b> To add your desired social platform, click on the <b>"Connect Account"</b> button. A modal will appear displaying various social platforms where you will find two options. First one is <b>"Connect"</b> button to connect your platform directly and another one is <b>"Custom app"</b> option which will work by entering your personal app credentials.'
              )
            }}
          />

          <span
            dangerouslySetInnerHTML={{
              __html: __(
                'To set it up, click on the <b>"Connect Account"</b> button and follow the next step!'
              )
            }}
          />
          <a href="https://bit-social.com/docs/accounts/" rel="noopener noreferrer" target="_blank">
            {' '}
            {__('Learn more')} <LuMoveUpRight style={{ transform: 'translateY(-2px)' }} />
          </a>
        </>
      )
    }

    case 'schedule': {
      return (
        <>
          <div className="mb-3">
            <b>{__('Schedules')}</b>:
            {__(
              'You can automatically schedule your Publish WordPress posts to be shared on  social media platforms. This feature allows you to filter your posts, ensuring that only the content you want to share at your chosen times.'
            )}
          </div>
          <span
            dangerouslySetInnerHTML={{
              __html: __(
                'To set it up, click on the <b>"Create Schedule"</b> button and follow the next step!'
              )
            }}
          />
          <a
            href="https://bit-social.com/docs/schedule-wordpress-posts-on-social-media/"
            rel="noopener noreferrer"
            target="_blank"
          >
            {' '}
            {__('Learn more')} <LuMoveUpRight style={{ transform: 'translateY(-2px)' }} />
          </a>
        </>
      )
    }
    case 'shareNow': {
      return (
        <>
          <div className="mb-3">
            <b> {__('Share Now')} </b>:
            {__(
              ' You can instantly share and automatically schedule your written posts to be shared on your social media platforms. There you will find a save draft (to save your content for future), publish (to share instantly), and setup schedule option to ensure that the content you have written will be shared at your chosen times.'
            )}
          </div>
          <span
            dangerouslySetInnerHTML={{
              __html: __(
                'To set it up, click on the <b>"Share Post"</b> button and follow the next step!'
              )
            }}
          />
          <a
            href="https://bit-social.com/docs/instantly-share-posts-on-social-media-platforms/"
            rel="noopener noreferrer"
            target="_blank"
          >
            {' '}
            {__('Learn more')} <LuMoveUpRight style={{ transform: 'translateY(-2px)' }} />
          </a>
        </>
      )
    }
    default: {
      return ''
    }
  }
}

export default function Note({
  fontSize = '1rem',
  section,
  style
}: {
  fontSize: string
  section: string
  style: React.CSSProperties
}) {
  return (
    <Alert
      description={<Typography.Text style={{ fontSize }}>{description(section)}</Typography.Text>}
      style={style}
      type="info"
    />
  )
}
