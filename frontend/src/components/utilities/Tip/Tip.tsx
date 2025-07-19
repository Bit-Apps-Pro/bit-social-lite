// import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-away.css'

// import 'tippy.js/dist/svg-arrow.css'
import './static/TipLightTheme.css'

import { type TippyProps } from '@tippyjs/react'
import Tippy from '@tippyjs/react'
import { roundArrow } from 'tippy.js'

interface TipPropsTypes {
  children: JSX.Element[]
  isArrow?: boolean
  target?: TippyProps['singleton']
}

export default function Tip({ children, isArrow = true, target }: TipPropsTypes) {
  return (
    <Tippy
      allowHTML
      animation="shift-away"
      arrow={isArrow && roundArrow}
      // theme="light"
      className="bf-tooltip"
      content={children[1]}
      inertia
      interactive
      placement="bottom"
      singleton={target}
    >
      {children[0]}
    </Tippy>
  )
}
