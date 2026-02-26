/* eslint-disable perfectionist/sort-objects */
import { __ } from '@common/helpers/i18nWrap'

import { type ChangelogInfo } from './changelogInfo.type'

const changelogInfo: ChangelogInfo = {
  '1.13.0': {
    changes: {
      features: {
        label: __('Features'),
        list: [
          'WP scheduled posts: Added a new post order option starts from the oldest posts and continues to the latest (including upcoming posts)',
          'Added a new Smart Tag: {post_date} for inserting the post publish date'
        ]
      },
      improvement: {
        label: __('Improvements'),
        list: [
          'Improved hashtag formatting: Previous (#new #year) Now (#newYear)',
          'Trimmed Threads topic text to 50 characters to prevent posting errors'
        ]
      },
      fixed: {
        label: __('Fixed'),
        list: ['Few minor bug fixes & improvements']
      }

      // coming: {
      //   label: __('Upcoming feature'),
      //   list: ['AI integration']
      // }
    },
    date: 'February 18, 2026'
  }
}

export default changelogInfo
