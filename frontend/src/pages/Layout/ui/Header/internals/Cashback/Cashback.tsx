/* eslint-disable i18next/no-literal-string */
import { __ } from '@common/helpers/i18nWrap'
import cashbackImage from '@resource/img/cashback.jpg'
import { Button, Card, Modal, Typography } from 'antd'
import { useState } from 'react'
import { LuExternalLink, LuX } from 'react-icons/lu'

const { Paragraph, Text, Title } = Typography

export default function Cashback() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Button
        onClick={showModal}
        style={{ background: '#00FFA3', color: 'black', fontWeight: '600' }}
        type="primary"
      >
        {__('Get $10 Cashback')}
      </Button>

      <Modal
        closeIcon={<Button icon={<LuX />} shape="circle" />}
        footer={false}
        onCancel={handleCancel}
        open={isModalOpen}
        styles={{ content: { padding: 0 } }}
        width={440}
      >
        <Card
          cover={
            <div style={{ height: 130, position: 'relative' }}>
              <img
                alt="cashback"
                height="100%"
                src={cashbackImage}
                style={{ objectFit: 'cover' }}
                width="100%"
              />
              <div
                style={{
                  alignContent: 'center',
                  display: 'grid',
                  inset: 0,
                  justifyContent: 'center',
                  position: 'absolute',
                  textAlign: 'center'
                }}
              >
                <Title style={{ color: 'white', marginBlock: 0 }}>{__('Get $10 Cashback')}</Title>
                <Title level={5} style={{ color: 'white', marginBlock: 0 }}>
                  {__('Thank you for using Bit Social')}
                </Title>
              </div>
            </div>
          }
        >
          <Paragraph>
            {__('Give us a review on WordPress by clicking the')}
            <a
              href="https://wordpress.org/support/plugin/bit-social/reviews/#new-post"
              rel="noreferrer noopener"
              target="_blank"
            >
              {__('Review us')}
            </a>{' '}
            {__('button and send an email with the review link to')}{' '}
            <a href="mailto:support@bitapps.pro">support@bitapps.pro</a>.
            <span
              dangerouslySetInnerHTML={{
                __html: __('We will honour you with <b> $10 cashback</b> for your time & effort.')
              }}
            />
          </Paragraph>

          <Paragraph strong>{__('Suggestions on how you may write the review:')}</Paragraph>

          <Paragraph>
            <Text>{__('1. What features do you like most in Bit Social?')}</Text>
            <br />
            <Text>{__('2. Which software did you previously used for these features?')}</Text>
          </Paragraph>

          <div style={{ textAlign: 'center' }}>
            <Button
              href="https://wordpress.org/support/plugin/bit-social/reviews/#new-post"
              size="large"
              target="_blank"
              type="primary"
            >
              {__('Review us')}
              <LuExternalLink />
            </Button>
          </div>
        </Card>
      </Modal>
    </>
  )
}
