import { __ } from '@common/helpers/i18nWrap'
import platforms from '@config/platforms'
import useAccounts from '@pages/Accounts/data/useAccounts'
import getAccountOptions from '@pages/Accounts/helper/accountHelpers'
import useGroupById from '@pages/Accounts/shared/Group/data/useGroupById'
import useUpdateGroup from '@pages/Accounts/shared/Group/data/useUpdateGroup'
import { Button, Checkbox, Col, Empty, Flex, Modal, notification, Row, Typography } from 'antd'
import { Fragment, useState } from 'react'
import { LuPlus } from 'react-icons/lu'

import GroupAccountCard from './GroupAccountCard'

export default function AddGroupModal({ groupId }: { groupId: number }) {
  const { accounts, isLoadingAccounts } = useAccounts({
    searchAccountsTxt: '',
    selectedMenuTab: { type: 'platform', value: 'all' }
  })

  const { groupAccountIds, isLoadingIds, refetchIds } = useGroupById(groupId)
  const { isLoadingUpdateGroup, updateGroup } = useUpdateGroup()

  const [isOpen, setIsOpen] = useState(false)
  const [selectedAccounts, setSelectedAccounts] = useState(groupAccountIds)

  const handleModalOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    setIsOpen(true)
    setSelectedAccounts(groupAccountIds)
  }
  const handleModalClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    setIsOpen(false)
  }

  const accountOptions = getAccountOptions(accounts)

  const handleSubmit = async () => {
    const response = await updateGroup({ groupData: { accountIds: selectedAccounts }, groupId: groupId })
    if (response.status === 'success') {
      notification.success({
        message: 'Account update successfully',
        placement: 'topRight'
      })
    }
    refetchIds()
    setIsOpen(false)
  }

  const handleCheckbox = (checkedValue: number[]) => {
    setSelectedAccounts(checkedValue)
  }

  return (
    <>
      <Button
        className="bg-slate-50 dark:bg-slate-900"
        icon={<LuPlus />}
        onClick={handleModalOpen}
        title={__('Add to group')}
      />
      <Modal
        loading={isLoadingAccounts || isLoadingIds}
        maskClosable={false}
        okButtonProps={{ loading: isLoadingUpdateGroup }}
        okText={__('Add')}
        onCancel={handleModalClose}
        onOk={handleSubmit}
        open={isOpen}
        title={__('Add to group')}
      >
        {accounts.length ? (
          <Flex vertical>
            <Checkbox.Group
              defaultValue={selectedAccounts}
              name="accountIds"
              onChange={handleCheckbox}
              value={selectedAccounts}
            >
              <Row>
                {accountOptions.map(accountOption => (
                  <Fragment key={accountOption.label}>
                    <Typography.Title key={accountOption.label} level={5}>
                      {platforms[accountOption.label].name}
                    </Typography.Title>

                    {accountOption.options.map(option => (
                      <Col key={option.value} span={24}>
                        <Checkbox value={option.value}>
                          <GroupAccountCard
                            accountType={option.label.accountType}
                            groupId={groupId}
                            id={groupId}
                            image={option.label.icon}
                            name={option.label.name}
                            platform={option.label.platform}
                          />
                        </Checkbox>
                      </Col>
                    ))}
                  </Fragment>
                ))}
              </Row>
            </Checkbox.Group>
          </Flex>
        ) : (
          <>
            <Empty description={__('No accounts found!')} />
          </>
        )}
      </Modal>
    </>
  )
}
