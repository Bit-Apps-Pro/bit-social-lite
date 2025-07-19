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

type SwitchNameType = Exclude<keyof ScheduleTemplatesType['pinterest'], 'content'>

export default function ProPinterestScheduleTemplate() {
  const [scheduleData, setScheduleData] = useAtom($scheduleData)
  const createScheduleModal = useAtomValue($createScheduleModal)

  const { socialTemplates } = useSocialTemplates()

  const handleMessage = (value: string) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.pinterest.content = value
      })
    )
  }

  const pinterestPostTypes = ['isFeaturedImage', 'isProductImage', 'isAllImages'] as const

  const handleSwitch = (name: SwitchNameType, value: boolean) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        pinterestPostTypes.forEach(type => {
          draftSchedule.templates.pinterest[type] = false
        })

        draftSchedule.templates.pinterest[name] = value
      })
    )
  }

  const handlePostLinkSwitch = (value: boolean) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.pinterest.isLinkCard = value
      })
    )
  }

  useEffect(() => {
    if (!socialTemplates?.pinterest || createScheduleModal.type !== 'create') return

    const { content, isLinkCard, postingType: currentType } = socialTemplates.pinterest

    setScheduleData((prev: ScheduleType) =>
      produce(prev, draft => {
        pinterestPostTypes.forEach(type => {
          draft.templates.pinterest[type] = false
        })

        draft.templates.pinterest[currentType] = true
        draft.templates.pinterest.isLinkCard = isLinkCard
        draft.templates.pinterest.content = content
      })
    )
  }, [socialTemplates?.pinterest])

  return (
    <>
      <MessageBox
        label={__('Customize post message')}
        onChange={handleMessage}
        rows={6}
        value={scheduleData.templates.pinterest.content}
        wrapperClassName="mb-4"
      />

      <Typography.Title level={5}>{__('Media')}</Typography.Title>

      <Space className="mb-3" wrap>
        {pinterestPostTypes?.map(type => (
          <Tooltip key={type} title={postingName[type].tooltip}>
            <Checkbox
              checked={scheduleData.templates.pinterest[type]}
              onChange={e => {
                handleSwitch(type, e.target.checked)
              }}
            >
              {postingName[type].name}
            </Checkbox>
          </Tooltip>
        ))}
      </Space>

      <Typography.Title level={5}>{__('Post Link')}</Typography.Title>

      <Checkbox
        checked={scheduleData.templates.pinterest.isLinkCard}
        onChange={e => {
          handlePostLinkSwitch(e.target.checked)
        }}
      >
        {__('Share the post link on Pinterest')}
      </Checkbox>
    </>
  )
}
