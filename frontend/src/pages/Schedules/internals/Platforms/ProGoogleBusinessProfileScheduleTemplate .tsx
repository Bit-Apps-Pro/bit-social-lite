import { $createScheduleModal } from '@common/globalStates/$createScheduleModal'
import { $scheduleData } from '@common/globalStates/$scheduleModalData'
import { __ } from '@common/helpers/i18nWrap'
import { type ScheduleTemplatesType, type ScheduleType } from '@pages/Schedules/ScheduleType'
import useSocialTemplates from '@pages/SocialTemplates/data/useSocialTemplates'
import { postingName } from '@src/pages/Schedules/helper/postTypeHelper'
import MessageBox from '@utilities/MessageBox'
import { Checkbox, Space, Tooltip, Typography } from 'antd'
import { produce } from 'immer'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'

type SwitchNameType = Exclude<keyof ScheduleTemplatesType['googleBusinessProfile'], 'button' | 'content'>

export default function ProGoogleBusinessProfileScheduleTemplate() {
  const [scheduleData, setScheduleData] = useAtom($scheduleData)
  const createScheduleModal = useAtomValue($createScheduleModal)

  const { socialTemplates } = useSocialTemplates()

  const handleMessage = (value: string) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.googleBusinessProfile.content = value
      })
    )
  }

  const googleBusinessProfilePostTypes = [
    'isFeaturedImage',
    'isProductImage',
    'isLinkCard',
    'isAllImages'
  ] as const

  const handleSwitch = (name: SwitchNameType, value: boolean) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        googleBusinessProfilePostTypes.forEach(type => {
          draftSchedule.templates.googleBusinessProfile[type] = false
        })

        draftSchedule.templates.googleBusinessProfile[name] = value
      })
    )
  }

  useEffect(() => {
    if (!socialTemplates?.googleBusinessProfile || createScheduleModal.type !== 'create') return

    const { content, postingType: currentType } = socialTemplates.googleBusinessProfile

    if (currentType === 'onlyMessage') return

    setScheduleData((prev: ScheduleType) =>
      produce(prev, draft => {
        googleBusinessProfilePostTypes.forEach(type => {
          draft.templates.googleBusinessProfile[type] = false
        })

        draft.templates.googleBusinessProfile[currentType] = true
        draft.templates.googleBusinessProfile.content = content
      })
    )
  }, [socialTemplates?.googleBusinessProfile])

  return (
    <>
      <MessageBox
        label={__('Customize post message')}
        onChange={handleMessage}
        rows={6}
        value={scheduleData.templates.googleBusinessProfile.content}
        wrapperClassName="mb-4"
      />

      <Typography.Title level={5}>{__('Media')}</Typography.Title>

      <Space className="mb-3" wrap>
        {googleBusinessProfilePostTypes?.map(type => (
          <Tooltip key={type} title={postingName[type].tooltip}>
            <Checkbox
              checked={scheduleData.templates.googleBusinessProfile[type]}
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
