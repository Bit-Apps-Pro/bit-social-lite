import { $createScheduleModal } from '@common/globalStates/$createScheduleModal'
import { $scheduleData } from '@common/globalStates/$scheduleModalData'
import { __ } from '@common/helpers/i18nWrap'
import { type ScheduleTemplatesType, type ScheduleType } from '@pages/Schedules/ScheduleType'
import { propertiesToUploadFile } from '@pages/ShareNow/helpers/postBoxHelper'
import { type Attachment } from '@pages/ShareNow/ShareNowType'
import useSocialTemplates from '@pages/SocialTemplates/data/useSocialTemplates'
import platformsLimitations from '@rootConfig/platformsLimitations.json'
import MessageBox from '@utilities/MessageBox'
import { Button, Checkbox, Radio, Space, Tooltip, Upload, type UploadFile, type UploadProps } from 'antd'
import { Form, Typography } from 'antd'
import { produce } from 'immer'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { LuUpload } from 'react-icons/lu'

const { Title } = Typography
export default function ProTiktokScheduleTemplate() {
  const [scheduleData, setScheduleData] = useAtom($scheduleData)
  const createScheduleModal = useAtomValue($createScheduleModal)

  const { socialTemplates } = useSocialTemplates()

  const changeState: KeyedValueHandler<ScheduleTemplatesType['tiktok']> = (name, value) => {
    setScheduleData((prev: ScheduleType) =>
      produce(prev, draft => {
        draft.templates.tiktok[name] = value
      })
    )
  }

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    const currentState = produce(scheduleData, draft => {
      draft.templates.tiktok.media = fileList
    })

    setScheduleData(currentState)
  }
  const setWpMedia = () => {
    const wpMediaLibrary = [
      'video/mp4',
      'video/quicktime',
      'video/ogg',
      'video/webm',
      'video/x-msvideo',
      'video/x-matroska'
    ]

    if (typeof wp !== 'undefined' && wp.media) {
      const imgSelectionFrame = wp.media({
        button: { text: 'Select Image' },
        library: { type: wpMediaLibrary },
        title: __('Media')
      })

      const previousSelection = scheduleData.templates.tiktok?.media.map(mediaFile => mediaFile.uid)
      imgSelectionFrame.on('open', () => {
        const selection = imgSelectionFrame.state().get('selection')

        previousSelection.forEach(imageId => {
          const attachment = wp.media.attachment(imageId)
          attachment.fetch().done(() => {
            selection.add(attachment)
          })
        })
      })

      imgSelectionFrame.on('select', () => {
        const selections = imgSelectionFrame.state().get('selection').toJSON()
        let fileList: UploadFile[] = []

        fileList = selections.map((selection: Attachment) => propertiesToUploadFile(selection))

        const file = fileList.at(-1) || ({} as UploadFile)

        handleChange({ file, fileList })
      })

      imgSelectionFrame.open()
    }
  }

  useEffect(() => {
    if (!socialTemplates?.tiktok || createScheduleModal.type !== 'create') return

    const { allowComment, content, duet, privacyLevel, stitch } = socialTemplates.tiktok
    setScheduleData((prev: ScheduleType) =>
      produce(prev, draft => {
        draft.templates.tiktok.content = content
        draft.templates.tiktok.allowComment = allowComment
        draft.templates.tiktok.duet = duet
        draft.templates.tiktok.privacyLevel = privacyLevel
        draft.templates.tiktok.stitch = stitch
      })
    )
  }, [socialTemplates?.tiktok])

  return (
    <Form layout="vertical">
      <MessageBox
        label={__('Customize post message')}
        onChange={value => changeState('content', value)}
        rows={4}
        value={scheduleData.templates.tiktok.content}
        wordCount={platformsLimitations.tiktok.description.length}
        wrapperClassName="mb-4"
      />

      <Form.Item htmlFor="textBox" label={<Title level={5}>{__('Media')}</Title>}>
        <Upload
          fileList={scheduleData.templates.tiktok.media}
          listType="picture-card"
          onChange={handleChange}
          openFileDialogOnClick={false}
        >
          <Tooltip placement="right" title={__('Add video')}>
            <Button onClick={setWpMedia} style={{ height: '100%', width: '100%' }}>
              <Space direction="vertical">
                <LuUpload size={20} />
                {__('Upload')}
              </Space>
            </Button>
          </Tooltip>
        </Upload>
      </Form.Item>

      <Form.Item htmlFor="textBox" label={<Title level={5}>{__('Privacy settings')}</Title>}>
        <Radio.Group
          onChange={e => changeState('privacyLevel', e.target.value)}
          options={[
            { label: __('Public to everyone'), value: 'PUBLIC_TO_EVERYONE' },
            { label: __('Mutual follow friends '), value: 'MUTUAL_FOLLOW_FRIENDS' },
            { label: __('Follower of creator'), value: 'FOLLOWER_OF_CREATOR' },
            { label: __('Self only'), value: 'SELF_ONLY' }
          ]}
          value={scheduleData.templates.tiktok.privacyLevel}
        />
      </Form.Item>
      <Form.Item htmlFor="textBox" label={<Title level={5}>{__('Others')}</Title>}>
        <Checkbox
          checked={scheduleData.templates.tiktok.allowComment}
          onChange={() => {
            changeState('allowComment', !scheduleData.templates.tiktok.allowComment)
          }}
        >
          {__('Allow Comment')}
        </Checkbox>
        <Checkbox
          checked={scheduleData.templates.tiktok.duet}
          onChange={() => {
            changeState('duet', !scheduleData.templates.tiktok.duet)
          }}
        >
          {__('Allow Duet')}
        </Checkbox>
        <Checkbox
          checked={scheduleData.templates.tiktok.stitch}
          onChange={() => {
            changeState('stitch', !scheduleData.templates.tiktok.stitch)
          }}
        >
          {__('Allow Stitch')}
        </Checkbox>
      </Form.Item>
    </Form>
  )
}
