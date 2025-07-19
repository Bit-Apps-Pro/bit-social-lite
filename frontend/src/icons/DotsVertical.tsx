import type IconTypes from './IconTypes'

import AntIconWrapper from './AntIconWrapper'

export default function DotsVertical({ className, size, stroke = 2 }: IconTypes) {
  return (
    <AntIconWrapper>
      <svg className={className} height={size} viewBox="0 0 24 24" width={size}>
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={stroke}
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="19" r="1" />
          <circle cx="12" cy="5" r="1" />
        </g>
      </svg>
    </AntIconWrapper>
  )
}
