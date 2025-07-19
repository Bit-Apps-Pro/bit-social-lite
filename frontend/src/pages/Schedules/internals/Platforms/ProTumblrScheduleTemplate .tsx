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

type SwitchNameType = Exclude<keyof ScheduleTemplatesType['tumblr'], 'content'>

export default function ProTumblrScheduleTemplate() {
  const [scheduleData, setScheduleData] = useAtom($scheduleData)
  const createScheduleModal = useAtomValue($createScheduleModal)

  const { socialTemplates } = useSocialTemplates()

  const handleMessage = (value: string) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.tumblr.content = value
      })
    )
  }

  const tumblrPostTypes = ['isFeaturedImage', 'isProductImage', 'isLinkCard', 'isAllImages'] as const

  const handleSwitch = (name: SwitchNameType, value: boolean) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        tumblrPostTypes.forEach(type => {
          draftSchedule.templates.tumblr[type] = false
        })

        draftSchedule.templates.tumblr[name] = value
      })
    )
  }

  useEffect(() => {
    if (!socialTemplates?.tumblr || createScheduleModal.type !== 'create') return

    const { content, postingType: currentType } = socialTemplates.tumblr

    if (currentType === 'onlyMessage') return

    setScheduleData((prev: ScheduleType) =>
      produce(prev, draft => {
        tumblrPostTypes.forEach(type => {
          draft.templates.tumblr[type] = false
        })

        draft.templates.tumblr[currentType] = true
        draft.templates.tumblr.content = content
      })
    )
  }, [socialTemplates?.tumblr])

  return (
    <>
      <MessageBox
        label={__('Customize post message')}
        onChange={handleMessage}
        rows={6}
        value={scheduleData.templates.tumblr.content}
        wrapperClassName="mb-4"
      />

      <Typography.Title level={5}>{__('Media')}</Typography.Title>

      <Space className="mb-3" wrap>
        {tumblrPostTypes?.map(type => (
          <Tooltip key={type} title={postingName[type].tooltip}>
            <Checkbox
              checked={scheduleData.templates.tumblr[type]}
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
