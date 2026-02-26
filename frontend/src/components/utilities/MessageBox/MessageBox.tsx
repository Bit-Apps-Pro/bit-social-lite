import { $appConfig } from '@common/globalStates'
import { $isBuyProModalOpen } from '@common/globalStates/$buyPro'
import { __ } from '@common/helpers/i18nWrap'
import useSmartTags, { type SmartTags } from '@pages/Schedules/data/useSmartTags'
import { Button, Col, Flex, Input, Popover, Row, Space, Tooltip, Typography } from 'antd'
import { type TextAreaProps, type TextAreaRef } from 'antd/es/input/TextArea'
import { useAtomValue, useSetAtom } from 'jotai'
import React, { memo, useRef } from 'react'
import { LuCrown, LuTags } from 'react-icons/lu'

import PromptTags from './PromptTags'

interface MessageBoxType extends Omit<TextAreaProps, 'onChange'> {
  label?: React.ReactNode
  onChange?: (value: string) => void
  promptBox?: boolean
  wordCount?: number
  wrapperClassName?: string
}

const { Title } = Typography

function MessageBox({
  label,
  onChange,
  promptBox = true,
  value,
  wordCount,
  wrapperClassName,
  ...props
}: MessageBoxType) {
  const { smartTags } = useSmartTags()

  const inputRef = useRef<TextAreaRef>(null)

  const { isProClient } = useAtomValue($appConfig)
  const setProModalOpen = useSetAtom($isBuyProModalOpen)

  const handleSmartTag = (tagKey: string, type?: string) => {
    if (type === 'pro' && !isProClient) {
      setProModalOpen(true)
      return
    }

    const textarea = inputRef.current?.resizableTextArea?.textArea
    const currentValue = String(value ?? '')
    const tagText = `{${tagKey}}`

    // If textarea ref is missing, append at end
    if (!textarea) {
      onChange?.(`${currentValue} ${tagText}`)
      return
    }

    const { selectionEnd: end, selectionStart: start } = textarea

    const newValue = currentValue.slice(0, start) + tagText + currentValue.slice(end)

    onChange?.(newValue)

    // Move cursor after inserted tag
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(start + tagText.length, start + tagText.length)
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value)
  }

  const renderTagGroup = (
    tags: Record<string, { description: string; key: string; label: string; type: string }>,
    groupTitle?: string
  ) => (
    <>
      {groupTitle && (
        <Title
          level={5}
          style={{
            margin: 0
          }}
        >
          {groupTitle}
        </Title>
      )}
      <Space align="start" direction="vertical" size={0} wrap>
        {Object.values(tags).map(({ description, key, label: tagLabel, type }) => (
          <Tooltip key={key} title={description}>
            <Button className="m-1" onClick={() => handleSmartTag(key, type)} size="small" type="dashed">
              {tagLabel} {!isProClient && type === 'pro' && <LuCrown color="#ff8609" size={18} />}
            </Button>
          </Tooltip>
        ))}
      </Space>
    </>
  )

  const popoverContent = (
    <Space align="start" direction="vertical" size="middle" style={{ width: '100%' }}>
      {(smartTags as SmartTags)?.advance &&
        renderTagGroup((smartTags as SmartTags).advance, __('Advance Tags'))}
      {(smartTags as SmartTags)?.post && renderTagGroup((smartTags as SmartTags).post, __('Post Tags'))}

      {(smartTags as SmartTags)?.product &&
        renderTagGroup((smartTags as SmartTags).product, __('Product Tags'))}
    </Space>
  )

  return (
    <div className={wrapperClassName}>
      <Row align="top" justify="space-between">
        <Col span={10}>{label}</Col>
        <Col span={14}>
          <Flex align="center" css={{ marginBottom: 8 }} justify="end">
            {promptBox && <PromptTags handleSmartTag={handleSmartTag} />}
            <>
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
            </>
          </Flex>
        </Col>
      </Row>
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
