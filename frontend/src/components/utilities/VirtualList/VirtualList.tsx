import { type Virtualizer, type VirtualizerOptions } from '@tanstack/react-virtual'
import { elementScroll, useVirtualizer } from '@tanstack/react-virtual'
import { type CSSProperties } from 'react'
import { useCallback, useRef, useState } from 'react'

interface VirtualListType {
  className?: string
  itemCount: number
  itemSizes: number | number[]
  overScanCount: number
  renderItem: (index: number) => JSX.Element
  style?: CSSProperties
  virtualizerRef?: React.RefObject<Virtualizer<never, never>>
}

function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (t - 1) * t * t * t * t
}

export default function VirtualList({
  className,
  itemCount,
  itemSizes,
  overScanCount = 3,
  renderItem,
  style,
  virtualizerRef
}: VirtualListType) {
  let virtualListRef = useRef<null | Virtualizer<never, never>>(null)
  virtualListRef = virtualizerRef || virtualListRef
  const [virtualRowParentRef, setVirtualRowParentRef] = useState<HTMLElement | null>()
  const scrollingRef = useRef<number>()

  const scrollToFunction: VirtualizerOptions<never, never>['scrollToFn'] = useCallback(
    (offset, canSmooth, instance: unknown) => {
      const duration = 1000
      const start = virtualRowParentRef?.scrollTop || 0
      const startTime = Date.now()
      scrollingRef.current = Date.now()

      const run = () => {
        if (scrollingRef.current !== startTime) return
        const now = Date.now()
        const elapsed = now - startTime
        const progress = easeInOutQuint(Math.min(elapsed / duration, 1))
        const interpolated = start + (offset - start) * progress

        if (elapsed < duration) {
          elementScroll(interpolated, canSmooth, instance as Virtualizer<Element, Element>)
          requestAnimationFrame(run)
        } else {
          elementScroll(interpolated, canSmooth, instance as Virtualizer<Element, Element>)
        }
      }

      requestAnimationFrame(run)
    },
    [virtualRowParentRef]
  )

  virtualListRef.current = useVirtualizer({
    count: itemCount,
    estimateSize: Array.isArray(itemSizes) ? i => itemSizes[i] : () => itemSizes,
    getScrollElement: () => virtualRowParentRef as null,
    overscan: overScanCount,
    scrollToFn: scrollToFunction
  })

  const virtualItems = virtualListRef?.current?.getVirtualItems() || []
  const totalSize: number = virtualListRef?.current?.getTotalSize() || 0

  return (
    <div
      className={className}
      ref={setVirtualRowParentRef}
      style={{ ...style, contain: 'strict', height: '100%', overflowY: 'auto', width: '100%' }}
    >
      <div
        style={{
          height: `${totalSize}px`,
          minHeight: virtualItems.length && '70px',
          overflow: 'hidden',
          position: 'relative',
          width: '100%'
        }}
      >
        {virtualItems.map(({ index, key, size, start }) => (
          <div
            data-index={index}
            key={key}
            style={{
              height: `${size}px`,
              left: 0,
              position: 'absolute',
              top: 0,
              transform: `translateY(${start}px)`,
              width: '100%'
            }}
          >
            {renderItem(index)}
          </div>
        ))}
      </div>
    </div>
  )
}
