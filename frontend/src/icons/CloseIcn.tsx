import type IconTypes from './IconTypes'

import AntIconWrapper from './AntIconWrapper'

export default function CloseIcn({ className, size = '1em', stroke = 2 }: IconTypes) {
  return (
    <AntIconWrapper>
      <svg
        className={className}
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={stroke}
        viewBox="0 0 30 30"
        width={size}
      >
        <line x1="4" x2="26" y1="3.88" y2="26.12" />
        <line x1="26" x2="4" y1="3.88" y2="26.12" />
      </svg>
    </AntIconWrapper>
  )
}
