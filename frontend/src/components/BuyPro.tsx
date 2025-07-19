import { $isBuyProModalOpen } from '@common/globalStates/$buyPro'
import { __ } from '@common/helpers/i18nWrap'
import { Button, Modal, Space, Typography } from 'antd'
import { useAtom } from 'jotai'
import { LuCheck, LuCrown } from 'react-icons/lu'

const { Link, Title } = Typography

const proFeatureList = [
  'Unlimited social media account',
  'Unlimited auto post',
  'WooCommerce product post',
  'Advance Schedule',
  'Advance Calendar',
  'Advance Smart Tags',
  'Posting type All Images',
  'Multiple Images',
  'Advance Cron settings'
]

export default function BuyPro() {
  const [isModalOpen, setIsModalOpen] = useAtom($isBuyProModalOpen)

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <Modal
      footer
      onCancel={handleCancel}
      onOk={handleOk}
      open={isModalOpen}
      width={500}
      zIndex={100_000_000_000_000}
    >
      <Space className="p-2 ta-cen w-100" direction="vertical">
        <Title level={2}>
          {__('Bit Social Pro')} <LuCrown color="#ff8609" size={36} />
        </Title>
      </Space>
      <Space className="pl-2 ta-start" direction="vertical">
        {proFeatureList.map((feature, index) => (
          <Title key={index} level={5}>
            <LuCheck /> {feature}
          </Title>
        ))}
      </Space>
      <div className="p-2 ta-cen w-100">
        <Link
          href="https://bit-social.com/#pricing"
          rel="noopener noreferrer nofollow"
          strong
          style={{ whiteSpace: 'nowrap' }}
          target="_blank"
        >
          <Button
            size="large"
            style={{
              backgroundColor: '#6817ff',
              fontSize: '20px',
              fontWeight: 600,
              height: '100%',
              width: '200px'
            }}
            type="primary"
          >
            {__('Buy Pro')}
          </Button>
        </Link>
      </div>
    </Modal>
  )
}
