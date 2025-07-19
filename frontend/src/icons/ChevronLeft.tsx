import type IconTypes from './IconTypes'

import AntIconWrapper from './AntIconWrapper'

export default function ChevronLeft({ className, size = '1em', stroke = 2 }: IconTypes) {
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
        viewBox="0 0 24 24"
        width={size}
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </AntIconWrapper>
  )
}
