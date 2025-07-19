import css from './SpinnerLoader.module.scss'

interface SpinnerLoaderType {
  className?: string
  color?: 'light' | 'primary'
  size: number
  stroke?: number
}

export default function SpinnerLoader({
  className,
  color = 'light',
  size,
  stroke = 3
}: SpinnerLoaderType) {
  return (
    <div className={`${className}`} data-testid="spinnerLoader" style={{ height: size, width: size }}>
      <div
        className={`${css.loading} ${color !== 'light' && css[color]}`}
        style={{ borderWidth: stroke, height: size, width: size }}
      />
    </div>
  )
}
