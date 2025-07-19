import { type ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function Devtools({ jotai, reactQuery }: { jotai?: boolean; reactQuery?: boolean }) {
  const [DevtoolsComponents, setDevtoolsComponents] = useState<ReactNode | undefined>()

  useEffect(() => {
    if (import.meta.env.DEV) {
      Promise.all([
        jotai ? import('jotai-devtools') : undefined,
        reactQuery ? import('@tanstack/react-query-devtools') : undefined,
        jotai ? import('jotai-devtools/styles.css') : undefined
      ]).then(([jotaiDevtools, reactQueryDevtools]) => {
        const DevelopmentToolsUI = (
          <>
            {jotai && jotaiDevtools ? <jotaiDevtools.DevTools position="bottom-right" /> : undefined}
            {reactQuery && reactQueryDevtools ? (
              <reactQueryDevtools.ReactQueryDevtools initialIsOpen={false} position="bottom" />
            ) : undefined}
          </>
        )
        setDevtoolsComponents(DevelopmentToolsUI)
      })
    }
  }, [jotai, reactQuery])

  if (!import.meta.env.DEV) return

  return DevtoolsComponents ? createPortal(DevtoolsComponents, document.body) : undefined
}
