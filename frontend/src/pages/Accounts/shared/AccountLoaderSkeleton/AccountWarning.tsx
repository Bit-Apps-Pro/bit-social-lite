import { __ } from '@common/helpers/i18nWrap'
import arrow from '@resource/arrow.svg'
import { Alert } from 'antd'
import { LuMoveUpRight } from 'react-icons/lu'

export default function AccountWarning() {
  return (
    <>
      <img alt="Arrow" src={arrow} style={{ marginLeft: '24%' }} width={150} />
      <Alert
        description={
          <>
            <div
              className="mb-3"
              dangerouslySetInnerHTML={{
                __html: __(
                  'To connect your social media accounts, click <b>"Connect Account"</b>  There are two methods available:'
                )
              }}
            />
            <div className="mb-3">
              <b>{__('Connect')}:</b>
              {__('It will automatically connect your social account without any credentials')}
            </div>

            <div className="mb-3">
              <b>{__('Custom App')}:</b>

              {__(
                'It will show you a form to input app credentials to create your own app and connect your social account.'
              )}
            </div>
            <a
              href="https://bit-social.com/docs/accounts/"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {__('You can find more about it here')}
              <LuMoveUpRight style={{ transform: 'translateY(-2px)' }} />
            </a>
          </>
        }
        style={{
          border: '4px solid #565b84',
          fontSize: '1.3rem',
          marginLeft: '10%',
          marginTop: -25,
          width: 800
        }}
      />
    </>
  )
}
