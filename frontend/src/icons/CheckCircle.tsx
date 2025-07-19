import type IconTypes from './IconTypes'

import AntIconWrapper from './AntIconWrapper'

export default function CheckCircle({ className, size = '1em', stroke = 2 }: IconTypes) {
  return (
    <AntIconWrapper>
      <svg
        className={className}
        fill="none"
        height={size}
        in="round"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={stroke}
        viewBox="0 0 24 24"
        width={size}
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    </AntIconWrapper>
  )
}
