import SpinnerLoader from '@utilities/SpinnerLoader'
import { type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { useId } from 'react'

import css from './Input.module.css'

interface InputType extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  helperText?: string
  invalidMessage?: string
  isInvalid?: boolean
  isLoading?: boolean
  leadingIcon?: ReactNode
  onBlur?: () => void
  size?: 'lg' | 'md' | 'sm' | 'xs'
  trailingIcon?: ReactNode
  type?: string
  variant?: 'filled' | 'ghost' | 'outline'
}

export default function Input({
  className,
  helperText,
  invalidMessage,
  isInvalid = false,
  isLoading = false,
  leadingIcon,
  onBlur,
  onChange,
  placeholder,
  size = 'md',
  title,
  trailingIcon,
  type = 'text',
  value,
  variant = 'outline',
  ...props
}: InputType) {
  const id = useId()

  return (
    <div className="w-100">
      {title && (
        <label className={css.inputLabel} htmlFor={id}>
          {title}
        </label>
      )}

      <div className={css.inputGroup}>
        {leadingIcon && <span className={`${css.icon} ${css.leadingIcon}`}>{leadingIcon}</span>}

        <input
          id={id}
          value={value}
          {...props}
          className={`${className} ${css.input} ${leadingIcon && css.leadingIconInput} ${
            trailingIcon && css.trailingIconInput
          } ${size && css[size]} ${variant && css[variant]} ${isInvalid && css.invalidInput}`}
          data-testid="inputComponent"
          onBlur={onBlur}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
        />

        {isLoading && <SpinnerLoader className={css.spinnerLoader} size={17} />}

        {trailingIcon && !isLoading && (
          <span className={`${css.icon} ${css.trailingIcon}`}>{trailingIcon}</span>
        )}
      </div>

      {isInvalid && invalidMessage && <p className={`${css.helperText} txt-danger`}>{invalidMessage}</p>}
      {!invalidMessage && helperText && (
        <p className={`${css.helperText} txt-secondary`}>{helperText}</p>
      )}
    </div>
  )
}
