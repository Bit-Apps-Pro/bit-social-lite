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

type SwitchNameType = Exclude<keyof ScheduleTemplatesType['instagram'], 'comment' | 'content'>

export default function ProInstagramScheduleTemplate() {
  const [scheduleData, setScheduleData] = useAtom($scheduleData)
  const createScheduleModal = useAtomValue($createScheduleModal)

  const { socialTemplates } = useSocialTemplates()

  const handleText = (value: string, type: 'comment' | 'content') => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.instagram[type] = value
      })
    )
  }

  const instagramPostTypes = ['isFeaturedImage', 'isProductImage', 'isAllImages'] as const

  const handleSwitch = (name: SwitchNameType, value: boolean) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        instagramPostTypes.forEach(type => {
          draftSchedule.templates.instagram[type] = false
        })

        draftSchedule.templates.instagram[name] = value
      })
    )
  }

  useEffect(() => {
    if (!socialTemplates?.instagram || createScheduleModal.type !== 'create') return

    const { comment, content, postingType: currentType } = socialTemplates.instagram

    setScheduleData((prev: ScheduleType) =>
      produce(prev, draft => {
        instagramPostTypes.forEach(type => {
          draft.templates.instagram[type] = false
        })

        draft.templates.instagram[currentType] = true
        draft.templates.instagram.content = content
        draft.templates.instagram.comment = comment
      })
    )
  }, [socialTemplates?.instagram])

  return (
    <>
      <MessageBox
        label={__('Customize post message')}
        onChange={value => handleText(value, 'content')}
        rows={4}
        value={scheduleData.templates.instagram.content}
        wordCount={platformsLimitations.instagram.description.length}
        wrapperClassName="mb-4"
      />
      <MessageBox
        label={__('First comment')}
        onChange={value => handleText(value, 'comment')}
        rows={2}
        value={scheduleData.templates.instagram.comment}
        wordCount={platformsLimitations.instagram.comment.length}
        wrapperClassName="mb-4"
      />

      <Typography.Title level={5}>{__('Media')}</Typography.Title>

      <Space className="mb-3" wrap>
        {instagramPostTypes?.map(type => (
          <Tooltip key={type} title={postingName[type].tooltip}>
            <Checkbox
              checked={scheduleData.templates.instagram[type]}
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
