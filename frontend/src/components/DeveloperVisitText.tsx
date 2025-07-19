import { __ } from '@common/helpers/i18nWrap'
import platforms from '@config/platforms'
import { Typography } from 'antd'
import { LuMoveUpRight } from 'react-icons/lu'

const { Link } = Typography

interface DeveloperVisitTextType {
  devLink: string
  name: keyof typeof platforms
}

export default function DeveloperVisitText({ devLink, name }: DeveloperVisitTextType) {
  return (
    <>
      {__('To get app credentials, Visit')}{' '}
      <Link
        href={devLink}
        rel="noopener noreferrer nofollow"
        strong
        style={{ whiteSpace: 'nowrap' }}
        target="_blank"
      >
        {platforms[name].name} {__('Developer')}
        <LuMoveUpRight size={12} style={{ transform: 'translateY(-2px)' }} />
      </Link>
    </>
  )
}
