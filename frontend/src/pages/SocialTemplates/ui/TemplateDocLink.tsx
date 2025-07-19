import { __, sprintf } from '@common/helpers/i18nWrap'
import { Typography } from 'antd'
import { LuMoveUpRight } from 'react-icons/lu'

const { Link, Paragraph } = Typography

export default function TemplateDocLink({ platform }: { platform: string }) {
  return (
    <Paragraph>
      {sprintf(__('You can setup %s post settings below.'), platform)}
      <Link
        className="pl-2"
        href="https://bit-social.com/docs/templates/"
        rel="noopener noreferrer nofollow"
        target="_blank"
        underline
      >
        {__('Doc here.')}
        <LuMoveUpRight size={12} style={{ transform: 'translateY(-2px)' }} />
      </Link>
    </Paragraph>
  )
}
