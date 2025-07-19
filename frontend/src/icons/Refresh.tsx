import { SyncOutlined } from '@ant-design/icons'

export default function Refresh({ spin }: { spin: boolean }) {
  return <SyncOutlined spin={spin} />
}
