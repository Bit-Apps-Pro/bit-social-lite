import { __ } from '@common/helpers/i18nWrap'
import { Modal } from 'antd'
import { useState } from 'react'

import ShareBox from './ShareBox'
import ShareNowList from './ShareNowList'

export interface ShareNowModalType {
  open: boolean
  type: 'create' | 'edit' | undefined
}

const defaultShareNowModal: ShareNowModalType = { open: false, type: undefined }

export default function ShareNow() {
  const [shareNowModal, setShareNowModal] = useState<ShareNowModalType>(defaultShareNowModal)

  const shareNowModalClose = () => {
    setShareNowModal(defaultShareNowModal)
  }

  return (
    <>
      <ShareNowList setShareNowModal={setShareNowModal} />

      {shareNowModal.open ? (
        <Modal
          centered
          footer={false}
          maskClosable={false}
          onCancel={shareNowModalClose}
          open={shareNowModal.open}
          styles={{
            body: {
              height: 'calc(100vh - 140px)',
              marginInline: -24,
              overflow: 'auto',
              padding: 0
            }
          }}
          title={shareNowModal.type === 'edit' ? __('Edit Share Now') : __('Share Now')}
          width="70%"
        >
          <div style={{ paddingInline: 24 }}>
            <ShareBox shareNowModalClose={shareNowModalClose} shareNowModalType={shareNowModal.type} />
          </div>
        </Modal>
      ) : (
        ''
      )}
    </>
  )
}
