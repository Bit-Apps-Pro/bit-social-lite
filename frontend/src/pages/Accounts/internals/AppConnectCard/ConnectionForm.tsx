import type platforms from '@config/platforms'

import CustomConnection from './ui/CustomConnection'
import LineTokenConnection from './ui/LineTokenConnection'
import LoginConnection from './ui/LoginConnection'
import TelegramBotConnection from './ui/TelegramBotConnection'

interface ConnectionFormProps {
  closeConnectModal: () => undefined
  currentConnectType: string
  handleAuthCallback: () => void
  platform: keyof typeof platforms
  setCustomModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ConnectionForm({
  closeConnectModal,
  currentConnectType,
  handleAuthCallback,
  platform,
  setCustomModalOpen
}: ConnectionFormProps) {
  switch (currentConnectType) {
    case 'custom': {
      return (
        <CustomConnection
          closeConnectModal={closeConnectModal}
          handleAuthCallback={handleAuthCallback}
          platform={platform}
          setCustomModalOpen={setCustomModalOpen}
        />
      )
    }

    case 'login': {
      switch (platform) {
        case 'bluesky': {
          return (
            <LoginConnection
              closeConnectModal={closeConnectModal}
              handleAuthCallback={handleAuthCallback}
              platform={platform}
            />
          )
        }

        case 'line': {
          return (
            <LineTokenConnection
              closeConnectModal={closeConnectModal}
              handleAuthCallback={handleAuthCallback}
              platform={platform}
            />
          )
        }
        case 'telegram': {
          return (
            <TelegramBotConnection
              closeConnectModal={closeConnectModal}
              handleAuthCallback={handleAuthCallback}
              platform={platform}
            />
          )
        }
      }
    }
  }
}
