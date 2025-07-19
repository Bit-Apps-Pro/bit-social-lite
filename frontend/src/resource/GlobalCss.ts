import { type Interpolation, type Theme } from '@emotion/react'

const globalCssInJs = ({ token }: Theme) =>
  ({
    '.ant-form-item-label label': {
      fontWeight: '500 !important'
    },
    '.ant-notification': {
      zIndex: '100300'
    },
    // label font weight
    ':is(.ant-popover, .ant-modal, #bit-apps-root) *::-webkit-scrollbar-thumb': {
      backgroundColor: `${token.colorBorder} !important`,
      borderRadius: '10px',
      width: '15px'
    },
    ':is(.ant-popover, .ant-modal, #bit-apps-root) *::-webkit-scrollbar-track': {
      backgroundColor: `${token.colorBgContainer} !important`,
      borderRadius: '10px'
    },
    // Scrollbar
    ':is(.ant-popover, .ant-popover, .ant-modal, #bit-apps-root) *::-webkit-scrollbar': {
      margin: '10px',
      transition: 'width .2s ease !important',
      width: '7px'
    }
  }) as Interpolation<Theme>
export default globalCssInJs
