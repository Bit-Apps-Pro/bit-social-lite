import type IconTypes from './IconTypes'

import AntIconWrapper from './AntIconWrapper'

export default function RedoIcon({ className, size = '1em', stroke = 2 }: IconTypes) {
  return (
    <AntIconWrapper>
      <svg
        className={`${'svgIcn'} ${className}`}
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={stroke}
        viewBox="0 0 24 24"
        width={size}
      >
        <path d="M16.87 18.31h-8c-2.76 0-5-2.24-5-5s2.24-5 5-5h11" strokeMiterlimit="10" />
        <path d="M17.57 10.81l2.56-2.56-2.56-2.56" />
      </svg>
    </AntIconWrapper>
  )
}
