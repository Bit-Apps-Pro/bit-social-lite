import $shareNowData from '@common/globalStates/$shareNowData'
import { __ } from '@common/helpers/i18nWrap'
import CronWarning from '@components/CronWarning'
import accountSelect from '@icons/accountSelect.svg'
import PlatformIcon from '@icons/PlatformIcon'
import ConnectAccount from '@pages/Accounts/ConnectAccount'
import useAccounts from '@pages/Accounts/data/useAccounts'
import AccountEmpty from '@pages/Accounts/internals/AccountEmpty'
import useGroups from '@pages/Accounts/shared/Group/data/useGroups'
import { groupsAccountIds } from '@pages/Accounts/shared/Group/helper/groupHelper'
import AccountTree from '@pages/AutoPost/ui/AccountTree'
import { getUniquePlatforms } from '@pages/Schedules/internals/Template'
import { type ScheduleAccountsType } from '@pages/Schedules/ScheduleType'
import isPro from '@plugin-commons/utils/isPro'

import './ShareNow.css'

import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  message,
  notification,
  Popover,
  Row,
  Tabs,
  Typography
} from 'antd'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { type ChangeEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { LuLoaderCircle } from 'react-icons/lu'
import { useSearchParams } from 'react-router'

import platformsLimitations from '../../../../config/platformsLimitations.json'
import useCreateShareNow from './data/useCreateShareNow'
import useShareNow from './data/useShareNow'
import useUpdateShareNow from './data/useUpdateShareNow'
import { checkError } from './helpers/shareNowHelper'
import ShareNowTemplatePlatform from './internals/platforms/ShareNowTemplatePlatform'
import ShareNowScheduleModal from './ShareNowScheduleModal'
import {
  type ErrorsType,
  type PlatformsLimitationsType,
  type PlatformValueType,
  type ShareBoxType,
  type ShareNowType
} from './ShareNowType'

const showNotification = (description: string, status: 'error' | 'success' = 'success') => {
  notification[status]({
    description,
    duration: 3,
    message: 'Share Now'
  })
}

const checkPlatformRequire = (
  statePlatformData: PlatformValueType,
  requireType: 'content' | 'media'
) => {
  const requireValue = statePlatformData[requireType]
  if (!statePlatformData.media.length && !requireValue?.length) {
    return false
  }

  return true
}

const STATUS_DRAFT = 3

export default function ShareBox({ shareNowModalClose, shareNowModalType }: ShareBoxType) {
  const [isScheduleModal, setScheduleModal] = useState(false)
  const [currentTab, setCurrentTab] = useState<string>()
  const [errors, setErrors] = useState<ErrorsType>({})
  const [handleType, setHandleType] = useState<'DRAFT' | 'PUBLISH' | undefined>()

  const [shareNowData, setShareNowData] = useAtom($shareNowData)
  const { createShareNow, isCreateShareNowLoading } = useCreateShareNow()
  const { isUpdateShareNowLoading, updateShareNow } = useUpdateShareNow()
  const { accounts } = useAccounts()
  const { groups } = useGroups()
  const [messageApi, contextHolder] = message.useMessage()

  const [searchParams] = useSearchParams({})
  const pageNumber = Number(searchParams.get('page')) || 1
  const pageLimit = Number(searchParams.get('limit')) || 10

  const { refetchShareNowList } = useShareNow(pageNumber, pageLimit)

  const isError = !!Object.keys(errors).length || false

  const handleScheduleOpen = () => {
    setScheduleModal(true)
  }

  const groupAccountIds = useMemo(() => {
    if (!isPro()) return []
    return groupsAccountIds(groups, shareNowData.accounts?.groupIds)
  }, [groups, shareNowData.accounts?.groupIds])

  const allAccountIds = useMemo(
    () => [...shareNowData.accounts.accountIds, ...groupAccountIds],
    [shareNowData.accounts.accountIds, groupAccountIds]
  )

  const platforms = useMemo(() => getUniquePlatforms(accounts, allAccountIds), [accounts, allAccountIds])

  const platformList = useMemo(() => {
    return platforms.map(name => ({
      children: <ShareNowTemplatePlatform platform={name} />,
      key: name,
      label: (
        <span title={name}>
          <PlatformIcon name={name} size={32} />
        </span>
      )
    }))
  }, [platforms])

  const setAccountIds = (selectedAccount: ScheduleAccountsType) =>
    setShareNowData((prevScheduleData: ShareNowType) =>
      produce(prevScheduleData, draftScheduleData => {
        draftScheduleData.accounts = {
          accountIds: selectedAccount.accountIds,
          groupIds: selectedAccount?.groupIds
        }
      })
    )

  const submitValidation = (state: ShareNowType, platformLimitation: PlatformsLimitationsType) => {
    const result = []
    const { platforms } = state
    const singlePlatform = platforms.length === 1

    if (state.platforms.length > 1) {
      platforms.map(platform => {
        const { requirement } = platformLimitation[platform]

        const isTrue = checkPlatformRequire(state.templates[platform], requirement?.type)

        if (!isTrue) {
          result.push(true)

          return messageApi.open({
            content: requirement?.message,

            type: 'error'
          })
        }
      })
    }

    if (singlePlatform) {
      const platform = platforms[0]

      const { requirement } = platformLimitation[platform]
      const isTrue = checkPlatformRequire(state.templates[platform], requirement?.type)
      if (!isTrue) {
        result.push(true)

        messageApi.open({
          content: requirement?.message,
          type: 'error'
        })
      }
    }
    return (result.length && true) || false
  }

  const formValidation = (state: ShareNowType) => {
    const { name } = state.settings
    if (name === '') {
      messageApi.open({
        content: 'Title empty',
        type: 'error'
      })
      return true
    }

    if (errors) checkError(errors)

    const result = platformsLimitations && submitValidation(state, platformsLimitations)

    if (result) return true

    return false
  }

  const handlePublish = async () => {
    setHandleType('PUBLISH')
    const error = formValidation(shareNowData)

    if (error) {
      setHandleType(undefined)
      return
    }

    checkError(errors)

    if (shareNowModalType === 'edit') {
      const { data, status } = await updateShareNow(shareNowData)
      showNotification(data, status)
    } else {
      const { data, status } = await createShareNow(shareNowData)
      refetchShareNowList()
      showNotification(data, status)
    }

    shareNowModalClose()
  }

  const handleTabActive = (key: string) => {
    setCurrentTab(key)
  }

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setShareNowData((prev: ShareNowType) =>
      produce(prev, draft => {
        draft.settings = { ...draft.settings, name: value }
      })
    )
  }

  const handleDraft = async () => {
    setHandleType('DRAFT')
    const error = formValidation(shareNowData)
    if (error) {
      setHandleType(undefined)
      return
    }

    if (shareNowModalType === 'edit') {
      const { data, status } = await updateShareNow({ ...shareNowData, isDraft: true })
      refetchShareNowList()
      showNotification(data, status)
    } else {
      const { data, status } = await createShareNow({ ...shareNowData, isDraft: true })
      refetchShareNowList()
      showNotification(data, status)
    }

    shareNowModalClose()
  }

  const renderMessages = () =>
    Object.keys(errors).map(platform => {
      const { text } = errors[platform]
      return (
        <div key={platform}>
          {' '}
          <p>
            <b>{platform}</b>: {text}
          </p>
        </div>
      )
    })

  const errorsContent = () => {
    return <div>{renderMessages()}</div>
  }

  useEffect(
    () => () => {
      setErrors({})
    },
    []
  )

  useEffect(() => {
    setShareNowData((prev: ShareNowType) => {
      const prevPlatforms = prev.platforms
      if (
        prevPlatforms.length === platforms.length &&
        prevPlatforms.every((p, i) => p === platforms[i])
      ) {
        return prev
      }
      return produce(prev, draft => {
        draft.platforms = platforms
      })
    })

    setCurrentTab(platforms[0])
  }, [platforms])

  const handlePublishButtonText = () => {
    if (shareNowModalType === 'edit' && shareNowData.status === STATUS_DRAFT) {
      return 'Update & Publish'
    }
    if (shareNowModalType === 'edit') {
      return 'Update'
    }

    if (shareNowData.settings.started_at?.length) {
      return 'Create'
    }

    return 'Publish Now'
  }

  const handleDraftButtonText = () => {
    if (shareNowModalType === 'edit' && shareNowData.status === STATUS_DRAFT) {
      return 'Update draft'
    }

    return 'Draft'
  }

  return (
    <>
      {contextHolder}
      <Row gutter={20}>
        <Col span={7}>
          <Flex className="mb-1" justify="space-between">
            <Typography.Title level={5}> {__('Accounts')} </Typography.Title>
            {accounts.length ? <ConnectAccount /> : ''}
          </Flex>
          {accounts?.length && shareNowData.accounts ? (
            <AccountTree selectedAccount={shareNowData.accounts} setSelectedAccount={setAccountIds} />
          ) : (
            <>
              <AccountEmpty iconSize={40} textLevel={5} />
              <div style={{ textAlign: 'center' }}>
                <ConnectAccount />
              </div>
            </>
          )}
        </Col>
        <Col span={17}>
          <div style={{ minHeight: '100%' }}>
            {platformList && platformList.length ? (
              <>
                <div>
                  <Form layout="vertical">
                    <Form.Item htmlFor="name" label={__('Title')}>
                      <Input
                        id="name"
                        onChange={handleName}
                        placeholder={__('Untitled Share Now')}
                        value={shareNowData.settings?.name}
                      />
                    </Form.Item>
                  </Form>
                </div>

                <Tabs
                  activeKey={currentTab}
                  items={platformList}
                  onChange={handleTabActive}
                  size="small"
                  tabBarGutter={2}
                />

                <Flex align="center" className="mt-3" gap={8} justify="end">
                  {Object.keys(errors).length ? (
                    <Popover
                      content={errorsContent()}
                      defaultOpen
                      title={__('Something went wrong!')}
                      trigger="click"
                    >
                      <Button danger icon={<LuLoaderCircle />} type="primary" />
                    </Popover>
                  ) : (
                    ''
                  )}

                  <div className="pr-2">
                    <CronWarning type="message" />
                  </div>

                  <Button
                    disabled={isError || handleType === 'PUBLISH'}
                    loading={
                      handleType === 'DRAFT' && (isCreateShareNowLoading || isUpdateShareNowLoading)
                    }
                    onClick={handleDraft}
                    type="dashed"
                  >
                    {handleDraftButtonText()}
                  </Button>

                  <Button disabled={isError} onClick={handleScheduleOpen}>
                    {shareNowModalType === 'edit' ? __('Edit Schedule') : __('Setup Schedule')}
                  </Button>

                  <Button
                    disabled={isError || handleType === 'DRAFT'}
                    loading={
                      handleType === 'PUBLISH' && (isCreateShareNowLoading || isUpdateShareNowLoading)
                    }
                    onClick={() => handlePublish()}
                    type="primary"
                  >
                    {handlePublishButtonText()}
                  </Button>
                </Flex>
              </>
            ) : (
              <img alt="account select" className="w-100" src={accountSelect} />
            )}
          </div>
        </Col>
      </Row>

      {isScheduleModal && (
        <ShareNowScheduleModal
          isScheduleModal={isScheduleModal}
          setScheduleModal={setScheduleModal}
          shareNowModalType={shareNowModalType}
        />
      )}
    </>
  )
}
