// import {
//   type Attachment,
//   type ErrorsType,
//   type ShareNowTemplatesType,
//   type ShareNowType
// } from '@pages/ShareNow/ShareNowType'
// import { type UploadFile } from 'antd'

import { type UploadFile } from 'antd'

import { type Attachment } from '../ShareNowType'

// export function mediaList(
//   shareNowData: ShareNowType,
//   errors: ErrorsType,
//   currentTab: keyof ShareNowTemplatesType
// ): UploadFile[] {
//   if (shareNowData.templates[currentTab]?.media?.length) {
//     return shareNowData.templates[currentTab]?.media.map(mediaUrl => ({
//       uid: mediaUrl,
//       name: mediaUrl,
//       url: mediaUrl,
//       status: errors[currentTab]?.media?.includes(mediaUrl) ? 'error' : undefined
//     }))
//   }
//   return []
// }

const propertiesToUploadFile = (attachment: Attachment): UploadFile => ({
  name: attachment.filename,
  uid: attachment.id,
  url: attachment.url
})

export { propertiesToUploadFile }
