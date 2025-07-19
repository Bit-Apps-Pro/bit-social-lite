import type IconTypes from './IconTypes'

import AntIconWrapper from './AntIconWrapper'

export default function SearchIcon({ className, size = '1em', stroke = 2 }: IconTypes) {
  return (
    <AntIconWrapper>
      <svg
        className={className}
        data-testid="searchIcon"
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={stroke}
        viewBox="0 0 24 24"
        width={size}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" x2="16.65" y1="21" y2="16.65" />
      </svg>
    </AntIconWrapper>
  )
}
