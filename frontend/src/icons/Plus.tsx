import type IconTypes from './IconTypes'

import AntIconWrapper from './AntIconWrapper'

export default function Plus({ className, size = '1em', stroke = 2 }: IconTypes) {
  return (
    <AntIconWrapper>
      <svg
        className={`${'svgIcn'} ${className}`}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={stroke}
        viewBox="0 0 24 24"
        width={size}
      >
        <line x1="12" x2="12" y1="5" y2="19" />
        <line x1="5" x2="19" y1="12" y2="12" />
      </svg>
    </AntIconWrapper>
  )
}
