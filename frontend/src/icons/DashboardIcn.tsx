import type IconTypes from './IconTypes'

import AntIconWrapper from './AntIconWrapper'

export default function DashboardIcn({ className, size, stroke = 2 }: IconTypes) {
  return (
    <AntIconWrapper>
      <svg
        className={className}
        fill="none"
        height={size}
        stroke="currentColor"
        strokeWidth={stroke}
        viewBox="0 0 21 21"
        width={size}
      >
        <rect height="7.24" rx="2" width="7.24" x="1" y="1" />
        <rect height="19" rx="2" width="7.24" x="12.76" y="1" />
        <rect height="7.24" rx="2" width="7.24" x="1" y="12.76" />
      </svg>
    </AntIconWrapper>
  )
}
