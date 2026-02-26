import { $appConfig } from '@common/globalStates'
import { $createScheduleModal } from '@common/globalStates/$createScheduleModal'
import { $scheduleData, platformDefaultTemplates } from '@common/globalStates/$scheduleModalData'
import { __ } from '@common/helpers/i18nWrap'
import { postingName } from '@pages/Schedules/helper/postTypeHelper'
import { type ScheduleTemplatesType, type ScheduleType } from '@pages/Schedules/ScheduleType'
import useSocialTemplates from '@pages/SocialTemplates/data/useSocialTemplates'
import { Loading } from '@src/AppRoutes'
import { useWpMediaPicker } from '@src/hooks/useWpMediaPicker'
import ImagePromptNameSelect from '@utilities/ImagePromptNameSelect'
import MessageBox from '@utilities/MessageBox'
import { Button, Checkbox, Image, Space, Tooltip, Typography } from 'antd'
import { produce } from 'immer'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { LuImagePlus, LuX } from 'react-icons/lu'

export default function FacebookScheduleTemplate() {
  const [scheduleData, setScheduleData] = useAtom($scheduleData)
  const createScheduleModal = useAtomValue($createScheduleModal)

  const { isProClient } = useAtomValue($appConfig)
  const { socialTemplates } = useSocialTemplates()

  const handleMessage = (value: string) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.facebook.content = value
      })
    )
  }

  type SwitchNameType = Exclude<
    keyof ScheduleTemplatesType['facebook'],
    'content' | 'customImages' | 'promptImage'
  >

  const proPostingTypes = [
    'isFeaturedImage',
    'isProductImage',
    'isLinkCard',
    'isAllImages',
    'isPromptImage',
    'isCustomImage'
  ] as const
  const freePostingTypes = ['isFeaturedImage', 'isLinkCard'] as const

  const facebookPostTypes = isProClient ? proPostingTypes : freePostingTypes

  const handleSwitch = (name: SwitchNameType, value: boolean) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        const wasPromptImage = draftSchedule.templates.facebook.isPromptImage
        const wasCustomImage = draftSchedule.templates.facebook.isCustomImage

        facebookPostTypes.forEach(type => {
          draftSchedule.templates.facebook[type] = false
        })

        draftSchedule.templates.facebook[name] = value

        // Clear promptImage if changing away from isPromptImage
        if (wasPromptImage && name !== 'isPromptImage') {
          draftSchedule.templates.facebook.promptImage = ''
        }

        // Clear customImages if changing away from isCustomImage
        if (wasCustomImage && name !== 'isCustomImage') {
          draftSchedule.templates.facebook.customImages = []
        }
      })
    )
  }

  const handlePromptChange = (value: string) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.facebook.promptImage = value
      })
    )
  }

  const handleRemoveImage = (index: number) => {
    setScheduleData((prevSchedule: ScheduleType) =>
      produce(prevSchedule, draftSchedule => {
        draftSchedule.templates.facebook.customImages =
          draftSchedule.templates.facebook.customImages.filter((_, i) => i !== index)
      })
    )
  }

  const { openMediaPicker } = useWpMediaPicker({
    buttonText: __('Select Images'),
    maxFiles: 10,
    mediaTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'],
    onChange: (_, fileList) => {
      const imageUrls = fileList.map(file => file.url || '').filter(Boolean)
      setScheduleData((prevSchedule: ScheduleType) =>
        produce(prevSchedule, draftSchedule => {
          draftSchedule.templates.facebook.customImages = imageUrls
        })
      )
    },
    selectedMediaIds: [],
    title: __('Select Custom Images')
  })

  useEffect(() => {
    if (
      !socialTemplates?.facebook ||
      (createScheduleModal.type !== 'create' && scheduleData.templates.facebook)
    )
      return

    const { content, postingType: currentType } = socialTemplates.facebook

    setScheduleData((prev: ScheduleType) =>
      produce(prev, draft => {
        if (!draft.templates.facebook) {
          draft.templates.facebook = platformDefaultTemplates(socialTemplates).facebook
          return
        }
        facebookPostTypes.forEach(type => {
          draft.templates.facebook[type] = false
        })
        if (currentType !== 'onlyMessage') {
          draft.templates.facebook[currentType] = true
        }
        draft.templates.facebook.content = content
      })
    )
  }, [socialTemplates?.facebook, createScheduleModal.type, socialTemplates])

  if (!scheduleData.templates.facebook) {
    return <Loading />
  }

  return (
    <>
      <MessageBox
        label={<Typography.Title level={5}>{__('Customize post message')}</Typography.Title>}
        onChange={handleMessage}
        rows={6}
        value={scheduleData.templates.facebook.content}
        wrapperClassName="mb-4"
      />

      <Typography.Title level={5}>{__('Media')}</Typography.Title>

      <Space className="mb-3" wrap>
        {facebookPostTypes?.map(type => (
          <Tooltip key={type} title={postingName[type].tooltip}>
            <Checkbox
              checked={scheduleData.templates.facebook[type]}
              onChange={e => {
                handleSwitch(type, e.target.checked)
              }}
            >
              {postingName[type].name}
            </Checkbox>
          </Tooltip>
        ))}
      </Space>

      {scheduleData.templates.facebook.isPromptImage && (
        <div className="mb-3">
          <Typography.Text strong>{__('Prompt Name')}</Typography.Text>
          <ImagePromptNameSelect
            onChange={handlePromptChange}
            value={scheduleData.templates.facebook.promptImage}
          />
        </div>
      )}

      {scheduleData.templates.facebook.isCustomImage && (
        <div className="mb-3">
          <Typography.Text strong>{__('Custom Images')}</Typography.Text>
          <div className="mt-2">
            <Button icon={<LuImagePlus size={18} />} onClick={openMediaPicker} type="dashed">
              {__('Select Images')}
            </Button>
            {scheduleData.templates.facebook.customImages?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {scheduleData.templates.facebook.customImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    style={{
                      border: '1px solid #d9d9d9',
                      borderRadius: 8,
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    <Image height={60} src={imageUrl} style={{ objectFit: 'cover' }} width={60} />
                    <Button
                      icon={<LuX size={12} />}
                      onClick={() => handleRemoveImage(index)}
                      shape="circle"
                      size="small"
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        border: 'none',
                        color: '#fff',
                        position: 'absolute',
                        right: 2,
                        top: 2
                      }}
                      type="text"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
