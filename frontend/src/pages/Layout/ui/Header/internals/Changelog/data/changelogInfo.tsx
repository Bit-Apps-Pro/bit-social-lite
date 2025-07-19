import { __ } from '@common/helpers/i18nWrap'

import { type ChangelogInfo } from './changelogInfo.type'

const changelogInfo: ChangelogInfo = {
  '1.4.1': {
    changes: {
      features: {
        label: __('Features'),
        list: [
          'Telegram: Send text messages, images, and clickable links directly to Telegram groups and channels',
          'Google Business Profile: Updated character limits — now supports 1,500 characters for the description'
        ]
      },

      coming: {
        label: __('Upcoming Integrations'),
        list: ['Threads']
      }
    },
    date: 'July 17, 2025'
  }
}

export default changelogInfo
