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

type SwitchNameType = Exclude<keyof ScheduleTemplatesType['discord'], 'content'>
export default function ProDiscordScheduleTemplate() {
  const [scheduleData, setScheduleData] = useAtom($scheduleData)
  const createScheduleModal = useAtomValue($createScheduleModal)

  const { socialTemplates } = useSocialTemplates()

  const handleMessage = (value: string) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.discord.content = value
      })
    )
  }

  const discordPostTypes = ['isFeaturedImage', 'isProductImage', 'isLinkCard', 'isAllImages'] as const

  const handleSwitch = (name: SwitchNameType, value: boolean) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        discordPostTypes.forEach(type => {
          draftSchedule.templates.discord[type] = false
        })

        draftSchedule.templates.discord[name] = value
      })
    )
  }

  useEffect(() => {
    if (!socialTemplates?.discord || createScheduleModal.type !== 'create') return

    const { content, postingType: currentType } = socialTemplates.discord

    if (currentType === 'onlyMessage') return

    setScheduleData((prev: ScheduleType) =>
      produce(prev, draft => {
        discordPostTypes.forEach(type => {
          draft.templates.discord[type] = false
        })

        draft.templates.discord[currentType] = true
        draft.templates.discord.content = content
      })
    )
  }, [socialTemplates?.discord])

  return (
    <>
      <MessageBox
        label={__('Customize post message')}
        onChange={handleMessage}
        rows={6}
        value={scheduleData.templates.discord.content}
        wrapperClassName="mb-4"
      />

      <Typography.Title level={5}>{__('Media')}</Typography.Title>

      <Space className="mb-3" wrap>
        {discordPostTypes?.map(type => (
          <Tooltip key={type} title={postingName[type].tooltip}>
            <Checkbox
              checked={scheduleData.templates.discord[type]}
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
