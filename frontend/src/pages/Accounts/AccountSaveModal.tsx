import { $accountConnect, $appConfig } from '@common/globalStates'
import { accountConnectState } from '@common/globalStates/$accountConnect'
import { __ } from '@common/helpers/i18nWrap'
import platforms from '@config/platforms'
import PlatformIcon from '@icons/PlatformIcon'
import { Alert, Card, Flex, Modal, notification, Skeleton, Space, Typography } from 'antd'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import { LuCrown } from 'react-icons/lu'

import {
  type AccountConnectDetailsType,
  type AccountDataType,
  type AccountDetailsType
} from './AccountsType'
import useSaveAccount from './data/useSaveAccount'
import useVerifyAccount from './data/useVerifyAccount'
import AccountSaveFooter from './internals/AppConnectCard/AccountSaveFooter'
import AccountConnectCard from './internals/AppConnectCard/ui/AccountConnectCard'

export default function AccountSaveModal() {
  const [accountConnect, setAccountConnect] = useAtom($accountConnect)
  const { isProClient } = useAtomValue($appConfig)

  const { isSavingAccount, saveAccount } = useSaveAccount()
  const { isVerifyAccountLoading, verifyAccount } = useVerifyAccount()

  const [connectAccountId, setAccountConnectId] = useState<string | undefined>()

  const handleCancel = () => {
    setAccountConnect(accountConnectState)
  }

  const accountDetails = useMemo(() => {
    if (Array.isArray(accountConnect?.details)) {
      return accountConnect.details.map((account: AccountConnectDetailsType) => {
        const { details } = account.account
        const {
          account_id: accountId,
          account_name: accountName,
          icon: accountIcon
        } = JSON.parse(details)

        const accountInfo: AccountDetailsType = {
          accountDetails: account.account,
          accountIcon,
          accountId,
          accountName,
          isConnected: account.isConnected,
          verifyUrl: account.verifyUrl
        }
        return accountInfo
      })
    }

    return []
  }, [accountConnect?.details])

  const handleConnect = async (accountData: AccountDataType, verifyUrl?: string) => {
    setAccountConnectId(accountData.account_id)
    let accountDetails = { ...accountData }
    if (verifyUrl) {
      const verifyRequest = { data: accountDetails, url: verifyUrl }
      const res = await verifyAccount(verifyRequest)

      if (res.status === 'error') {
        setAccountConnectId(undefined)
        return notification.error({
          description: res.data.message,
          message: `Account Save Failed`
        })
      }

      accountDetails = res.data.accountDetails
    }
    const res = await saveAccount(accountDetails)
    setAccountConnectId(undefined)

    if (res.status === 'error') {
      return notification.error({
        description: res.data.message,
        message: `Account Save Failed`
      })
    }
    if (res.status === 'success') {
      const updateAccountData = accountConnect?.details?.map(
        (connectData: AccountConnectDetailsType) => {
          const accountId = connectData.account.account_id
          if (String(accountId) === String(res.data.account.account_id)) {
            return { ...connectData, isConnected: true }
          }
          return connectData
        }
      )

      setAccountConnect(prev => ({ ...prev, details: updateAccountData }))

      notification.success({
        message: `Account Save Successfully`
      })
    }
  }

  const platformName = accountConnect.platform && platforms[accountConnect.platform].name

  useEffect(() => {
    function handle(event: BeforeUnloadEvent) {
      event.preventDefault()
      setAccountConnect(accountConnectState)
    }

    window.addEventListener('beforeunload', handle, { capture: true })
    return () => {
      window.removeEventListener('beforeunload', handle, { capture: true })
    }
  }, [])

  return (
    <Modal
      footer={false}
      maskClosable={false}
      onCancel={handleCancel}
      open={accountConnect.isModalOpen}
      styles={{
        body: {
          maxHeight: '70vh',
          overflowY: 'scroll',
          padding: '0 8px'
        }
      }}
      title={
        accountConnect.loading ? (
          <Space>
            <Skeleton.Avatar active shape="circle" size="large" />
            <Skeleton.Input active size="small" />
          </Space>
        ) : (
          <Flex align="center" gap="small">
            <PlatformIcon name={accountConnect.platform} size={30} />
            <Typography.Text style={{ fontSize: '18px', textTransform: 'capitalize' }}>
              {platformName}
            </Typography.Text>
          </Flex>
        )
      }
    >
      <Space className="w-100 py-2" direction="vertical">
        {accountConnect.loading && !accountConnect.status
          ? Array.from({ length: 3 })
              .fill(0)
              .map((_, i) => (
                <Card className="w-100" key={`key-${i + 9}`} size="small">
                  <Space className="w-100" size="large">
                    <Skeleton.Avatar active shape="circle" size="large" />
                    <Skeleton.Input active block size="small" style={{ width: '260px' }} />
                    <Skeleton.Button active />
                  </Space>
                </Card>
              ))
          : (platformName === 'LinkedIn' && !isProClient ? (
              <Flex gap={10} vertical>
                <Typography.Title level={5}>{__('Profile')}</Typography.Title>
                {accountDetails &&
                  accountDetails.length &&
                  accountDetails.map(account => (
                    <AccountConnectCard
                      accountType={account.accountDetails.details}
                      connectAccountId={connectAccountId}
                      handleConnect={() => handleConnect(account.accountDetails, account.verifyUrl)}
                      icon={account.accountIcon}
                      id={account.accountId}
                      isConnected={account.isConnected}
                      isLoading={isSavingAccount || isVerifyAccountLoading}
                      key={account.accountId}
                      name={account.accountName}
                    />
                  ))}
                <Typography.Title level={5}>
                  {__('Page')} <LuCrown color="#ff8609" size={20} />
                </Typography.Title>
                <Card className="w-100" size="small">
                  <Space className="w-100" size="large">
                    <Skeleton.Avatar shape="circle" size="large" />
                    <Skeleton.Input block size="small" style={{ width: '260px' }} />
                    <Skeleton.Button />
                  </Space>
                </Card>
                <Typography.Text strong>{__('Linkedin Page feature on pro')}</Typography.Text>
              </Flex>
            ) : (
              accountDetails &&
              accountDetails.length &&
              accountDetails.map(account => (
                <AccountConnectCard
                  accountType={account.accountDetails.details}
                  connectAccountId={connectAccountId}
                  handleConnect={() => handleConnect(account.accountDetails, account.verifyUrl)}
                  icon={account.accountIcon}
                  id={account.accountId}
                  isConnected={account.isConnected}
                  isLoading={isSavingAccount || isVerifyAccountLoading}
                  key={account.accountId}
                  name={account.accountName}
                />
              ))
            )) || ''}

        {accountConnect.status === 'success' && !accountConnect.details?.length && (
          <Typography.Title level={5}>
            {platformName === 'Pinterest' ? __('Board Not Found') : __('Account Not Found')}
          </Typography.Title>
        )}

        {accountConnect.status === 'error' && (
          <Flex vertical>
            <Typography.Title level={5}> {__('Account connect failed')}</Typography.Title>

            <Alert description={accountConnect.message} type="error" />
          </Flex>
        )}
      </Space>
      {accountConnect.status && platformName ? (
        <AccountSaveFooter count={accountDetails?.length} platform={platformName} />
      ) : (
        <Typography.Title level={5}>Fetching data, please wait...</Typography.Title>
      )}
    </Modal>
  )
}
