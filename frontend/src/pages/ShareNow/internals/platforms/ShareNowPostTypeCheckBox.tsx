import { __ } from '@common/helpers/i18nWrap'
import { Checkbox, Tooltip } from 'antd'

interface ShareNowPostTypeCheckBoxType {
  handleCheckBox: (name: 'isAllImages' | 'isLinkCard', value: boolean) => void
  templateData: {
    isAllImages: boolean
    isLinkCard: boolean
  }
  type: string[]
}

export default function ShareNowPostTypeCheckBox({
  handleCheckBox,
  templateData,
  type
}: ShareNowPostTypeCheckBoxType) {
  return (
    <>
      {type.includes('isLinkCard') && (
        <Tooltip title={__('Enable to the link shared as a card')}>
          <Checkbox
            checked={templateData.isLinkCard}
            onChange={e => {
              handleCheckBox('isLinkCard', e.target.checked)
            }}
          >
            {__('Link')}
          </Checkbox>
        </Tooltip>
      )}

      {type.includes('isAllImages') && (
        <Tooltip title={__('Enable to selected image shared')}>
          <Checkbox
            checked={templateData.isAllImages}
            onChange={e => {
              handleCheckBox('isAllImages', e.target.checked)
            }}
          >
            {__('Media')}
          </Checkbox>
        </Tooltip>
      )}
    </>
  )
}
