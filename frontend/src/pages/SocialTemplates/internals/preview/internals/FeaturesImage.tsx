import PlaceholderImgIcon from '@icons/PlaceholderImgIcon'
import { theme } from 'antd'

export default function FeaturesImage() {
  const { token } = theme.useToken()

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainerDisabled,
        borderBottom: `1px solid ${token.colorBorder}`,
        borderTop: `1px solid ${token.colorBorder}`,
        padding: '70px 0',
        textAlign: 'center'
      }}
    >
      <PlaceholderImgIcon size={100} />
    </div>
  )
}
