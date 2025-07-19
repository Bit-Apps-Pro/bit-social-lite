import { $appConfig } from '@common/globalStates'
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

type SwitchNameType = Exclude<keyof ScheduleTemplatesType['linkedin'], 'content'>
export default function LinkedinScheduleTemplate() {
  const [scheduleData, setScheduleData] = useAtom($scheduleData)
  const createScheduleModal = useAtomValue($createScheduleModal)

  const { socialTemplates } = useSocialTemplates()

  const { isProClient } = useAtomValue($appConfig)

  const handleMessage = (value: string) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.linkedin.content = value
      })
    )
  }

  const proPostingTypes = ['isFeaturedImage', 'isProductImage', 'isLinkCard', 'isAllImages'] as const
  const freePostingTypes = ['isFeaturedImage', 'isLinkCard'] as const

  const linkedinPostTypes = isProClient ? proPostingTypes : freePostingTypes

  const handleSwitch = (name: SwitchNameType, value: boolean) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        linkedinPostTypes.forEach(type => {
          draftSchedule.templates.linkedin[type] = false
        })

        draftSchedule.templates.linkedin[name] = value
      })
    )
  }

  useEffect(() => {
    if (!socialTemplates?.linkedin || createScheduleModal.type !== 'create') return

    const { content, postingType: currentType } = socialTemplates.linkedin

    if (currentType === 'onlyMessage') return

    setScheduleData((prev: ScheduleType) =>
      produce(prev, draft => {
        linkedinPostTypes.forEach(type => {
          draft.templates.linkedin[type] = false
        })

        draft.templates.linkedin[currentType] = true
        draft.templates.linkedin.content = content
      })
    )
  }, [socialTemplates?.linkedin])

  return (
    <>
      <MessageBox
        label={__('Customize post message')}
        onChange={handleMessage}
        rows={6}
        value={scheduleData.templates.linkedin.content}
        wrapperClassName="mb-4"
      />

      <Typography.Title level={5}>{__('Media')}</Typography.Title>

      <Space className="mb-3" wrap>
        <Space className="mb-3" wrap>
          {linkedinPostTypes?.map(type => (
            <Tooltip key={type} title={postingName[type].tooltip}>
              <Checkbox
                checked={scheduleData.templates.linkedin[type]}
                onChange={e => {
                  handleSwitch(type, e.target.checked)
                }}
              >
                {postingName[type].name}
              </Checkbox>
            </Tooltip>
          ))}
        </Space>
      </Space>
    </>
  )
}
