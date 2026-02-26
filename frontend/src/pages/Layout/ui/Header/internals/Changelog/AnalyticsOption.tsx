import { $bitSocial } from '@common/globalStates'
import $changelogModal from '@common/globalStates/$changelogModal'
import { __ } from '@common/helpers/i18nWrap'
import request from '@common/helpers/request'
import useTracking from '@plugin-commons/components/SupportPage/data/useTracking'
import useTrackingUpdate from '@plugin-commons/components/SupportPage/data/useTrackingUpdate'
import { Button, Divider, Flex, Typography } from 'antd'
import { produce } from 'immer'
import { useAtom, useSetAtom } from 'jotai'
import { LuMoveUpRight } from 'react-icons/lu'

const { Paragraph, Title } = Typography

export default function AnalyticsOption() {
  const [bitSocial, setBitSocial] = useAtom($bitSocial)
  const setIsModalOpen = useSetAtom($changelogModal)

  const { tracking } = useTracking()
  const { updateTracking } = useTrackingUpdate()

  const updateAnalyticsPreference = async (value: boolean) => {
    updateTracking(value)
    setIsModalOpen(false)

    if (bitSocial.version === bitSocial.changelogVersion) return

    const res = await request(
      'changelog-version/update',
      { version: bitSocial.version },
      undefined,
      'POST'
    )

    if (res?.status === 'success') {
      setBitSocial(prev =>
        produce(prev, draft => {
          draft.changelogVersion = bitSocial.version
        })
      )
    }
  }

  if (tracking?.allowTracking) return

  return (
    <>
      <Divider />
      <Title className="text-center" level={5}>
        {__('Opt-In For Plugin Improvement')}
      </Title>
      <Paragraph type="secondary">
        {__(
          'Accept and continue to help improve the plugin with usage data. You can skip or change your preference anytime.'
        )}
        <br />
        <Typography.Link
          href="https://bit-social.com/terms-and-conditions-bit-social/"
          rel="noopener noreferrer"
          target="_blank"
        >
          {__('Terms and conditions')}
          <LuMoveUpRight style={{ transform: 'translateY(-2px)' }} />
        </Typography.Link>
      </Paragraph>

      <Flex className="mt-2" justify="space-between">
        <Button onClick={() => updateAnalyticsPreference(false)} type="dashed">
          {__('Skip')}
        </Button>

        <Button onClick={() => updateAnalyticsPreference(true)} type="primary">
          {__('Accept and Continue')}
        </Button>
      </Flex>
    </>
  )
}
