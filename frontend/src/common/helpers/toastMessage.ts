import { type MessageInstance, type MessageType } from 'antd/es/message/interface'

function autoSaveNotify(messageApi: MessageInstance, status: 'error' | 'success'): MessageType {
  return messageApi.open({
    content: status === 'success' ? 'Saved successfully' : 'Something went wrong',
    type: status
  })
}

export { autoSaveNotify }
