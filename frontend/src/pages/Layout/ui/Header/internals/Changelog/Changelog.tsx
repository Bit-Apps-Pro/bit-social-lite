import { $bitSocial } from '@common/globalStates'
import $changelogModal from '@common/globalStates/$changelogModal'
import { __ } from '@common/helpers/i18nWrap'
import request from '@common/helpers/request'
import { Modal, Tag, Typography } from 'antd'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { type ReactNode } from 'react'
import { Fragment } from 'react'
import { LuMoveUpRight } from 'react-icons/lu'

import cls from './Changelog.module.css'
import changelogInfo from './data/changelogInfo'
import { type ChangeTopic } from './data/changelogInfo.type'

const getColor: Record<string, string> = {
  added: 'blue',
  coming: 'red',
  fixed: 'orange',
  improvement: 'green',
  integration: 'purple'
}

export default function Changelog() {
  const [bitSocial, setBitSocial] = useAtom($bitSocial)
  const [isModalOpen, setIsModalOpen] = useAtom($changelogModal)
  const changeLog = changelogInfo[bitSocial.version]

  const handleCancel = async () => {
    setIsModalOpen(false)

    if (bitSocial.version === bitSocial.changelogVersion) return

    const res = await request(
      'changelog-version/update',
      { version: bitSocial.version },
      undefined,
      'POST'
    )

    if (res?.status === 'success') {
      setBitSocial(prev =>
        produce(prev, draft => {
          draft.changelogVersion = bitSocial.version
        })
      )
    }
  }

  if (!changeLog) return

  return (
    <Modal
      footer={false}
      onCancel={handleCancel}
      open={isModalOpen}
      title={__("What's New?")}
      width={440}
    >
      <Typography.Paragraph strong>
        <a href="https://bit-social.com/" rel="noreferrer noopener" target="_blank">
          {__('Version')}: {bitSocial.version} ({changeLog.date}){' '}
          <LuMoveUpRight size={12} style={{ transform: 'translateY(-4px)' }} />
        </a>
      </Typography.Paragraph>

      {Object.entries(changeLog.changes).map(([title, obj]) => (
        <div key={title}>
          <Tag color={getColor[title]}>{obj.label}</Tag>
          {obj.tag && <span>{obj.tag}</span>}
          <ul className={cls.unorderedList}>
            {obj?.list &&
              obj.list.map((temporaryObj: ChangeTopic | ReactNode, index: number) =>
                getChangesList(temporaryObj, `${title}-${index}`)
              )}
          </ul>
        </div>
      ))}

      <Typography.Text>
        {__('For More Details')}
        <a
          href="https://bit-social.com/documentation/changelog/"
          rel="noopener noreferrer"
          target="_blank"
        >
          {__('Click Here')}
          <LuMoveUpRight size={12} style={{ transform: 'translateY(-4px)' }} />
        </a>
      </Typography.Text>
    </Modal>
  )
}

function getChangesList(listObj: ChangeTopic | ReactNode, parentKey = ''): ReactNode {
  if (typeof listObj === 'string') return <li key={parentKey}>{listObj}</li>

  if (Array.isArray(listObj))
    return listObj.map((temporaryObj, index) => getChangesList(temporaryObj, `${parentKey}-${index}`))

  if (typeof listObj === 'object') {
    const { label, list, tag } = listObj as ChangeTopic

    return (
      <Fragment key={parentKey}>
        <li>
          {label}
          {tag && (
            <Tag color="purple" style={{ marginLeft: 5 }}>
              {tag}
            </Tag>
          )}
        </li>

        {list && (
          <ul>
            {list.map((temporaryObj, index) => getChangesList(temporaryObj, `${parentKey}-${index}`))}
          </ul>
        )}
      </Fragment>
    )
  }
}
