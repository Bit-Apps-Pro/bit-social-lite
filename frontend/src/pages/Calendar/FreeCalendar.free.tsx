import { $appConfig } from '@common/globalStates'
import { __ } from '@common/helpers/i18nWrap'
import calendarImageDark from '@resource/img/calendar-dark.svg'
import calendarImage from '@resource/img/calendar.svg'
import ProWrapper from '@utilities/ProWrapper'
import { Image, Typography } from 'antd'
import { useAtomValue } from 'jotai'
import { LuMoveUpRight } from 'react-icons/lu'

export default function FreeCalendar() {
  const { isDarkTheme } = useAtomValue($appConfig)

  return (
    <>
      <Typography.Link
        href="https://bit-social.com/docs/calendar/"
        rel="noopener noreferrer"
        strong
        style={{ fontSize: '18px' }}
        target="_blank"
      >
        {__('Click here to know more about Calendar')}
        <LuMoveUpRight style={{ transform: 'translateY(-2px)' }} />
      </Typography.Link>

      <ProWrapper>
        <Image preview={false} src={isDarkTheme ? calendarImageDark : calendarImage} width="100%" />
      </ProWrapper>
    </>
  )
}
