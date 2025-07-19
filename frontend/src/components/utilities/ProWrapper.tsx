import { $isBuyProModalOpen } from '@common/globalStates/$buyPro'
import { __ } from '@common/helpers/i18nWrap'
import { Button } from 'antd'
import { useSetAtom } from 'jotai'
import { LuCrown } from 'react-icons/lu'

export default function ProWrapper({ children }: { children: React.ReactNode }) {
  const setProModalOpen = useSetAtom($isBuyProModalOpen)
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Button
        onClick={() => setProModalOpen(true)}
        size="large"
        style={{
          left: '50%',
          position: 'absolute',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1
        }}
        type="primary"
      >
        {__('Buy Pro')} <LuCrown size={18} />
      </Button>

      <div
        style={{
          borderRadius: '6px',
          filter: 'blur(0.7px)',
          padding: '8px',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        {children}
      </div>
    </div>
  )
}
