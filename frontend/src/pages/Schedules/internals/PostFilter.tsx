import { $appConfig } from '@common/globalStates'
import { $isBuyProModalOpen } from '@common/globalStates/$buyPro'
import { $scheduleData } from '@common/globalStates/$scheduleModalData'
import { __ } from '@common/helpers/i18nWrap'
import useCategories from '@hooks/queries/schedule/useCategories'
import usePostTypes from '@hooks/queries/schedule/usePostTypes'
import { type TimeRangePickerProps } from 'antd'
import { DatePicker, Form, Select, theme, Typography } from 'antd'
import { type BaseOptionType } from 'antd/es/select'
import dayjs from 'dayjs'
import { produce } from 'immer'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { LuCrown } from 'react-icons/lu'

import { type UseFilteredPostsType } from '../data/useFilteredPosts'
import useFilteredPosts from '../data/useFilteredPosts'
import { type ScheduleType } from '../ScheduleType'

const { Title } = Typography

const publishDateOptions = [
  { label: __('All times'), value: '0' },
  { label: __('Today'), value: '1' },
  { label: __('last 7 days'), value: '7' },
  { label: __('last 15 days'), value: '15' },
  { label: __('last 30 days'), value: '30' },
  { label: __('last 90 days'), value: '90' },
  { label: __('last 180 days'), value: '180' },
  { label: __('last 365 days'), value: '365' },
  { label: __('custom date range'), value: '-1' }
]

function searchPost(input: string, option: { label: string; value: number }) {
  return option.label.toLowerCase().includes(input.toLowerCase())
}

const handleFilterOption = (input: string, option?: BaseOptionType): boolean =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

export default function PostFilter() {
  const { token } = theme.useToken()
  const [scheduleData, setScheduleData] = useAtom($scheduleData)
  const { RangePicker } = DatePicker
  const { loadingPostType, postTypes } = usePostTypes()
  const [filteredPosts, setFilteredPosts] = useState<UseFilteredPostsType>([])
  const { loadingPostFilter, postFilter } = useFilteredPosts()
  const { categoriesAndTags, isLoadingCategories } = useCategories(
    scheduleData.post_filters.post_type || ''
  )

  const { isProClient } = useAtomValue($appConfig)

  const setProModalOpen = useSetAtom($isBuyProModalOpen)

  const postTypeOptions =
    postTypes &&
    Object.values<{ label: string; name: string }>(postTypes).map(postType => ({
      label: (
        <>
          {postType.label}{' '}
          {postType.name !== 'post' && !isProClient && <LuCrown color="#ff8609" size={16} />}
        </>
      ),
      value: postType.name
    }))

  const categoriesAndTagsOptions = categoriesAndTags
    ? Object.keys(categoriesAndTags).map(key => ({
        label: key,
        options: categoriesAndTags[key].map(item => ({
          label: item.name,
          value: item.id
        }))
      }))
    : []

  const changeState = (name: string, value: boolean | number | number[] | string | string[]) => {
    setScheduleData((prev: ScheduleType) =>
      produce(prev, draft => {
        draft.post_filters = { ...draft.post_filters, [name]: value }
      })
    )
  }

  const handleChange = (name: string) => (value: string) => {
    if (name === 'filter_by_days') {
      if (value === '0') {
        changeState('custom_date_range', '')
      } else {
        const today = dayjs()
        let daysToSubtract = Number.parseInt(value, 10)
        if (value === '-1' || value === '1') daysToSubtract = 0
        const lastDays = today.subtract(daysToSubtract, 'day')
        changeState('custom_date_range', [lastDays.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')])
      }
    }

    if (!isProClient && name === 'post_type' && value !== 'post') {
      setProModalOpen(true)
      return
    }

    changeState(name, value)
  }

  const onChangeTimeRange =
    (name: string) => (_: TimeRangePickerProps['value'], formatString: [string, string]) => {
      changeState('filter_by_days', '-1')
      changeState(name, formatString)
    }

  const handlePostFilterByIdChange = (value: number[]) => {
    changeState('specific_postIds', value)
  }

  const postCounter = async () => {
    const res = await postFilter(scheduleData.post_filters)
    setFilteredPosts(res?.data || [])
  }

  useEffect(() => {
    postCounter()
  }, [scheduleData.post_filters])

  return (
    <>
      <Form layout="vertical">
        <Form.Item label={__('By the published time of the posts')} required>
          <Select
            onChange={handleChange('filter_by_days')}
            options={publishDateOptions}
            placeholder={__('Select publish date')}
            value={scheduleData.post_filters.filter_by_days}
          />
          {scheduleData.post_filters.filter_by_days !== '0' &&
            scheduleData.post_filters.custom_date_range && (
              <RangePicker
                allowClear={false}
                onChange={onChangeTimeRange('custom_date_range')}
                style={{ marginTop: 8 }}
                value={[
                  dayjs(scheduleData.post_filters.custom_date_range[0], 'YYYY-MM-DD'),
                  dayjs(scheduleData.post_filters.custom_date_range[1], 'YYYY-MM-DD')
                ]}
              />
            )}
        </Form.Item>
        <Form.Item label={__('By post type')}>
          <Select
            allowClear
            loading={loadingPostType}
            onChange={handleChange('post_type')}
            options={postTypeOptions}
            placeholder={__('Select post type')}
            value={scheduleData.post_filters.post_type}
          />
        </Form.Item>
        <Form.Item label={__('By the post category and tag')}>
          <Select
            allowClear
            filterOption={handleFilterOption}
            loading={isLoadingCategories}
            onChange={handleChange('categories_and_tags')}
            options={categoriesAndTagsOptions}
            placeholder={__('Select category or tag')}
            showSearch
            value={scheduleData.post_filters.categories_and_tags}
          />
        </Form.Item>

        <Form.Item label={__('Select Specific Post')}>
          <Select
            allowClear
            filterOption={(input, option) => {
              if (option) {
                return searchPost(input, option)
              }
              return false
            }}
            loading={loadingPostFilter}
            mode="multiple"
            onChange={handlePostFilterByIdChange}
            options={filteredPosts}
            placeholder={__('Post ID: Post Title')}
            showSearch
            style={{ width: '100%' }}
            value={scheduleData.post_filters.specific_postIds}
          />
        </Form.Item>
      </Form>

      <Title
        css={{
          backgroundColor: token.colorBgElevated,
          bottom: 0,
          marginBottom: '0 !important',
          paddingTop: 6,
          position: 'sticky'
        }}
        level={5}
      >
        {__('Posts matched by current filters')}: {filteredPosts?.length}
      </Title>
    </>
  )
}
