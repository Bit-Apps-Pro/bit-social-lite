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

type SwitchNameType = Exclude<keyof ScheduleTemplatesType['line'], 'content'>

export default function ProLineScheduleTemplate() {
  const [scheduleData, setScheduleData] = useAtom($scheduleData)
  const createScheduleModal = useAtomValue($createScheduleModal)

  const { socialTemplates } = useSocialTemplates()

  const handleText = (value: string, type: 'content') => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.line[type] = value
      })
    )
  }

  const linePostTypes = ['isFeaturedImage', 'isProductImage', 'isAllImages', 'isLinkCard'] as const

  const handleSwitch = (name: SwitchNameType, value: boolean) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        linePostTypes.forEach(type => {
          draftSchedule.templates.line[type] = false
        })

        draftSchedule.templates.line[name] = value
      })
    )
  }

  useEffect(() => {
    if (!socialTemplates?.line || createScheduleModal.type !== 'create') return

    const { content, postingType: currentType } = socialTemplates.line

    if (currentType === 'onlyMessage') return

    setScheduleData((prev: ScheduleType) =>
      produce(prev, draft => {
        linePostTypes.forEach(type => {
          draft.templates.line[type] = false
        })

        draft.templates.line[currentType] = true
        draft.templates.line.content = content
      })
    )
  }, [socialTemplates?.line])

  return (
    <>
      <MessageBox
        label={__('Customize post message')}
        onChange={value => handleText(value, 'content')}
        rows={4}
        value={scheduleData.templates.line.content}
        wordCount={platformsLimitations.line.content.length}
        wrapperClassName="mb-4"
      />

      <Typography.Title level={5}>{__('Media')}</Typography.Title>

      <Space className="mb-3" wrap>
        {linePostTypes?.map(type => (
          <Tooltip key={type} title={postingName[type].tooltip}>
            <Checkbox
              checked={scheduleData.templates.line[type]}
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
