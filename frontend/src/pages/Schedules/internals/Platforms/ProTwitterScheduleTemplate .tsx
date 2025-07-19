import { $createScheduleModal } from '@common/globalStates/$createScheduleModal'
import { $scheduleData } from '@common/globalStates/$scheduleModalData'
import { __ } from '@common/helpers/i18nWrap'
import { postingName } from '@pages/Schedules/helper/postTypeHelper'
import { type ScheduleTemplatesType, type ScheduleType } from '@pages/Schedules/ScheduleType'
import useSocialTemplates from '@pages/SocialTemplates/data/useSocialTemplates'
import MessageBox from '@utilities/MessageBox'
import { Checkbox, Space, Tooltip, Typography } from 'antd'
import { produce } from 'immer'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'

type SwitchNameType = Exclude<keyof ScheduleTemplatesType['twitter'], 'content'>

export default function ProTwitterScheduleTemplate() {
  const [scheduleData, setScheduleData] = useAtom($scheduleData)
  const createScheduleModal = useAtomValue($createScheduleModal)

  const { socialTemplates } = useSocialTemplates()

  const handleMessage = (value: string) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.twitter.content = value
      })
    )
  }

  const twitterPostTypes = ['isFeaturedImage', 'isProductImage', 'isLinkCard', 'isAllImages'] as const

  const handleSwitch = (name: SwitchNameType, value: boolean) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        twitterPostTypes.forEach(type => {
          draftSchedule.templates.twitter[type] = false
        })

        draftSchedule.templates.twitter[name] = value
      })
    )
  }

  useEffect(() => {
    if (!socialTemplates?.twitter || createScheduleModal.type !== 'create') return

    const { content, postingType: currentType } = socialTemplates.twitter

    if (currentType === 'onlyMessage') return

    setScheduleData((prev: ScheduleType) =>
      produce(prev, draft => {
        twitterPostTypes.forEach(type => {
          draft.templates.twitter[type] = false
        })

        draft.templates.twitter[currentType] = true
        draft.templates.twitter.content = content
      })
    )
  }, [socialTemplates?.twitter])

  return (
    <>
      <MessageBox
        label={__('Customize post message')}
        onChange={handleMessage}
        rows={6}
        value={scheduleData.templates.twitter.content}
        wrapperClassName="mb-4"
      />

      <Typography.Title level={5}>{__('Media')}</Typography.Title>

      <Space className="mb-3" wrap>
        {twitterPostTypes?.map(type => (
          <Tooltip key={type} title={postingName[type].tooltip}>
            <Checkbox
              checked={scheduleData.templates.twitter[type]}
              onChange={e => {
                handleSwitch(type, e.target.checked)
              }}
            >
              {postingName[type].name}
            </Checkbox>
          </Tooltip>
        ))}
      </Space>
    </>
  )
}
