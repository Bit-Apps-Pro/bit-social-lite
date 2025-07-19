import type IconTypes from './IconTypes'

import AntIconWrapper from './AntIconWrapper'

export default function Dots({ className, size = '1em', stroke = 2 }: IconTypes) {
  return (
    <AntIconWrapper>
      <svg className={className} height={size} strokeWidth={stroke} viewBox="0 0 24 24" width={size}>
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="5" cy="12" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
        </g>
      </svg>
    </AntIconWrapper>
  )
}
