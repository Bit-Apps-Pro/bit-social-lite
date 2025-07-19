import { __ } from '@common/helpers/i18nWrap'
import { propertiesToUploadFile } from '@pages/ShareNow/helpers/postBoxHelper'
import { type UploadFile } from 'antd'

interface UseWpMediaPickerOptions {
  buttonText?: string
  maxFiles?: number
  mediaTypes: string[]
  onChange: (file: UploadFile, fileList: UploadFile[]) => void
  selectedMediaIds: string[]
  title?: string
}

export const useWpMediaPicker = ({
  buttonText = __('Select Image'),
  maxFiles,
  mediaTypes,
  onChange,
  selectedMediaIds,
  title = __('Media')
}: UseWpMediaPickerOptions) => {
  const openMediaPicker = () => {
    if (typeof wp === 'undefined' || !wp.media) return

    const frame = wp.media({
      button: { text: buttonText },
      library: { type: mediaTypes },
      multiple: 'add',
      title: title
    })

    frame.on('open', () => {
      const selection = frame.state().get('selection')
      selectedMediaIds.forEach(id => {
        const attachment = wp.media.attachment(id)
        attachment.fetch().done(() => {
          selection.add(attachment)
        })
      })
    })

    frame.on('select', () => {
      const selections = frame.state().get('selection').toJSON()

      if (maxFiles && selections.length > maxFiles) {
        alert(`You can only select up to ${maxFiles} images.`)
        return
      }

      const fileList = selections.map(propertiesToUploadFile)
      const file = fileList.at(-1) || ({} as UploadFile)

      onChange(file, fileList)
    })

    frame.open()
  }

  return { openMediaPicker }
}
