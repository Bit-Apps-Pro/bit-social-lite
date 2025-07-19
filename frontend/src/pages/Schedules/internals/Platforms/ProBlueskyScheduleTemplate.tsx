import { $createScheduleModal } from '@common/globalStates/$createScheduleModal'
import { $scheduleData } from '@common/globalStates/$scheduleModalData'
import { __ } from '@common/helpers/i18nWrap'
import { type ScheduleTemplatesType, type ScheduleType } from '@pages/Schedules/ScheduleType'
import useSocialTemplates from '@pages/SocialTemplates/data/useSocialTemplates'
import platformsLimitations from '@rootConfig/platformsLimitations.json'
import { postingName } from '@src/pages/Schedules/helper/postTypeHelper'
import MessageBox from '@utilities/MessageBox'
import { Checkbox, Space, Tooltip, Typography } from 'antd'
import { produce } from 'immer'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'

type SwitchNameType = Exclude<keyof ScheduleTemplatesType['bluesky'], 'comment' | 'content'>

export default function ProBlueskyScheduleTemplate() {
  const [scheduleData, setScheduleData] = useAtom($scheduleData)
  const createScheduleModal = useAtomValue($createScheduleModal)

  const { socialTemplates } = useSocialTemplates()

  const handleText = (value: string, type: 'comment' | 'content') => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.bluesky[type] = value
      })
    )
  }

  const blueskyPostTypes = ['isFeaturedImage', 'isProductImage', 'isAllImages', 'isLinkCard'] as const

  const handleSwitch = (name: SwitchNameType, value: boolean) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        blueskyPostTypes.forEach(type => {
          draftSchedule.templates.bluesky[type] = false
        })

        draftSchedule.templates.bluesky[name] = value
      })
    )
  }

  useEffect(() => {
    if (!socialTemplates?.bluesky || createScheduleModal.type !== 'create') return

    const { comment, content, postingType: currentType } = socialTemplates.bluesky

    setScheduleData((prev: ScheduleType) =>
      produce(prev, draft => {
        blueskyPostTypes.forEach(type => {
          draft.templates.bluesky[type] = false
        })

        draft.templates.bluesky[currentType] = true
        draft.templates.bluesky.content = content
        draft.templates.bluesky.comment = comment
      })
    )
  }, [socialTemplates?.bluesky])

  return (
    <>
      <MessageBox
        label={__('Customize post message')}
        onChange={value => handleText(value, 'content')}
        rows={4}
        value={scheduleData.templates.bluesky.content}
        wordCount={platformsLimitations.bluesky.content.length}
        wrapperClassName="mb-4"
      />
      <MessageBox
        label={__('First comment')}
        onChange={value => handleText(value, 'comment')}
        rows={2}
        value={scheduleData.templates.bluesky.comment}
        wordCount={platformsLimitations.bluesky.comment.length}
        wrapperClassName="mb-4"
      />

      <Typography.Title level={5}>{__('Media')}</Typography.Title>

      <Space className="mb-3" wrap>
        {blueskyPostTypes?.map(type => (
          <Tooltip key={type} title={postingName[type].tooltip}>
            <Checkbox
              checked={scheduleData.templates.bluesky[type]}
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
