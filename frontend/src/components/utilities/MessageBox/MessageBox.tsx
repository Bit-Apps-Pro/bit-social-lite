import { $appConfig } from '@common/globalStates'
import { $isBuyProModalOpen } from '@common/globalStates/$buyPro'
import { __ } from '@common/helpers/i18nWrap'
import useSmartTags from '@pages/Schedules/data/useSmartTags'
import { Button, Flex, Input, Popover, Space, Tooltip, Typography } from 'antd'
import { type TextAreaProps } from 'antd/es/input'
import { useAtomValue, useSetAtom } from 'jotai'
import { type ElementRef } from 'react'
import { memo, useRef } from 'react'
import { LuCrown, LuTags } from 'react-icons/lu'

interface MessageBoxType extends Omit<TextAreaProps, 'onChange'> {
  label?: string
  onChange?: (value: string) => void
  wordCount?: number
  wrapperClassName?: string
}

const { Title } = Typography

function MessageBox({ label, onChange, value, wordCount, wrapperClassName, ...props }: MessageBoxType) {
  const { smartTags } = useSmartTags()
  const inputRef = useRef<ElementRef<'textarea'>>(null)

  const { isProClient } = useAtomValue($appConfig)
  const setProModalOpen = useSetAtom($isBuyProModalOpen)

  const handleSmartTag = (tagKey: string, type: string) => {
    if (type === 'pro' && !isProClient) {
      setProModalOpen(true)
      return
    }
    const newValue = `${value} {${tagKey}}`

    if (inputRef.current) {
      inputRef.current.value = newValue
    }

    onChange?.(newValue)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value)
  }

  const popoverContent = (
    <Space align="start" direction="vertical" size={0}>
      {Object.values(smartTags).map(({ description, key, label: tagLabel, type }) => (
        <Tooltip key={key} title={description}>
          <Button block key={key} onClick={() => handleSmartTag(key, type)} size="small" type="text">
            {tagLabel} {!isProClient && type === 'pro' && <LuCrown color="#ff8609" size={18} />}
          </Button>
        </Tooltip>
      ))}
    </Space>
  )

  return (
    <div className={wrapperClassName}>
      <Flex align="center" css={{ marginBottom: 8 }} justify="space-between">
        <Title level={5}>{label}</Title>

        <Popover
          content={popoverContent}
          overlayInnerStyle={{ maxHeight: '60vh', overflow: 'auto' }}
          placement="bottom"
          trigger="click"
        >
          <Button icon={<LuTags />} size="small" type="text">
            {__('Show Smart Tags')}
          </Button>
        </Popover>
      </Flex>

      <Input.TextArea
        maxLength={wordCount}
        onChange={handleChange}
        ref={inputRef}
        showCount
        value={value}
        {...props}
      />
    </div>
  )
}

export default memo(MessageBox)
