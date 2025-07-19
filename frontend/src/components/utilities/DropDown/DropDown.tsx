import Tippy from '@tippyjs/react'
import { type ReactNode } from 'react'
import { useState } from 'react'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-away.css'
import { roundArrow } from 'tippy.js'
import 'tippy.js/dist/svg-arrow.css'

import css from './DropDown.module.css'
import './static/TippyLightTheme.css'

interface DropdownPropsTypes {
  btnClassName?: string
  children: ReactNode[]
}

export default function DropDown({
  btnClassName = css.dropDownBtn,
  children
}: DropdownPropsTypes): JSX.Element {
  const [visibleDropDown, setVisibleDropDown] = useState(false)

  return (
    <Tippy
      allowHTML
      animation="shift-away"
      appendTo="parent"
      arrow={roundArrow}
      className="dropDownTippy"
      content={children[1]}
      inertia
      interactive
      onClickOutside={() => setVisibleDropDown(false)}
      placement="bottom"
      theme="light"
      visible={visibleDropDown}
    >
      <button className={btnClassName} onClick={() => setVisibleDropDown(prv => !prv)} type="button">
        {children[0]}
      </button>
    </Tippy>
  )
}
