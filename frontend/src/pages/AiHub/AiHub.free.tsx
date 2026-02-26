import { $appConfig } from '@common/globalStates'
import { __ } from '@common/helpers/i18nWrap'
import aiPromptDark from '@resource/img/ai-prompt-dark.svg'
import aiPromptLight from '@resource/img/ai-prompt-light.svg'
import ProWrapper from '@utilities/ProWrapper'
import { Image, Typography } from 'antd'
import { useAtomValue } from 'jotai'
import { LuMoveUpRight } from 'react-icons/lu'

export default function AiHub() {
  const { isDarkTheme } = useAtomValue($appConfig)

  return (
    <>
      <Typography.Link
        href="https://bit-social.com/documentation/auto-publish-wordpress-posts-on-social-media/ai-prompt-in-bit-social/"
        rel="noopener noreferrer"
        strong
        style={{ fontSize: '18px' }}
        target="_blank"
      >
        {__('How to use AI Prompts?')} <LuMoveUpRight style={{ transform: 'translateY(-2px)' }} />
      </Typography.Link>
      <ProWrapper>
        <Image preview={false} src={isDarkTheme ? aiPromptDark : aiPromptLight} width="100%" />
      </ProWrapper>
    </>
  )
}
