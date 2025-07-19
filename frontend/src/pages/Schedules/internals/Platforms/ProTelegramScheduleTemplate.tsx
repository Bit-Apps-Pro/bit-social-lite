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

type SwitchNameType = Exclude<keyof ScheduleTemplatesType['telegram'], 'content'>

export default function ProTelegramScheduleTemplate() {
  const [scheduleData, setScheduleData] = useAtom($scheduleData)
  const createScheduleModal = useAtomValue($createScheduleModal)

  const { socialTemplates } = useSocialTemplates()

  const handleText = (value: string, type: 'content') => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.telegram[type] = value
      })
    )
  }

  const telegramPostTypes = ['isFeaturedImage', 'isProductImage', 'isAllImages', 'isLinkCard'] as const

  const handleSwitch = (name: SwitchNameType, value: boolean) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        telegramPostTypes.forEach(type => {
          draftSchedule.templates.telegram[type] = false
        })

        draftSchedule.templates.telegram[name] = value
      })
    )
  }

  useEffect(() => {
    if (!socialTemplates?.telegram || createScheduleModal.type !== 'create') return

    const { content, postingType: currentType } = socialTemplates.telegram

    if (currentType === 'onlyMessage') return

    setScheduleData((prev: ScheduleType) =>
      produce(prev, draft => {
        telegramPostTypes.forEach(type => {
          draft.templates.telegram[type] = false
        })

        draft.templates.telegram[currentType] = true
        draft.templates.telegram.content = content
      })
    )
  }, [socialTemplates?.telegram])

  return (
    <>
      <MessageBox
        label={__('Customize post message')}
        onChange={value => handleText(value, 'content')}
        rows={4}
        value={scheduleData.templates.telegram.content}
        wordCount={platformsLimitations.telegram.content.length}
        wrapperClassName="mb-4"
      />

      <Typography.Title level={5}>{__('Media')}</Typography.Title>

      <Space className="mb-3" wrap>
        {telegramPostTypes?.map(type => (
          <Tooltip key={type} title={postingName[type].tooltip}>
            <Checkbox
              checked={scheduleData.templates.telegram[type]}
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
