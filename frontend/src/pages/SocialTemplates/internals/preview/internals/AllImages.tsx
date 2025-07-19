import PlaceholderImgIcon from '@icons/PlaceholderImgIcon'
import { Col, Row, theme } from 'antd'

export default function AllImages() {
  const { token } = theme.useToken()
  const imageStyle = {
    backgroundColor: token.colorBgContainerDisabled,
    borderBottom: `1px solid ${token.colorBorder}`,
    borderTop: `1px solid ${token.colorBorder}`,
    display: 'flex',
    justifyContent: 'center',
    padding: '50px 0'
  }

  return (
    <Row gutter={[2, 2]}>
      <Col span={24}>
        <div style={imageStyle}>
          <PlaceholderImgIcon size={100} />
        </div>
      </Col>
      <Col span={8}>
        <div style={imageStyle}>
          <PlaceholderImgIcon size={80} />
        </div>
      </Col>
      <Col span={8}>
        <div style={imageStyle}>
          <PlaceholderImgIcon size={80} />
        </div>
      </Col>
      <Col span={8}>
        <div style={imageStyle}>
          <PlaceholderImgIcon size={80} />
        </div>
      </Col>
    </Row>
  )
}
