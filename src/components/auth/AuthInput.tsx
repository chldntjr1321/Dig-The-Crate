import type { InputHTMLAttributes, ReactNode, Ref } from 'react'
import cn from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  rightElement?: ReactNode
  errorMessage?: string
  ref?: Ref<HTMLInputElement>
}

const AuthInput = ({
  label,
  id,
  className,
  rightElement,
  errorMessage,
  ref,
  ...props
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium text-secondary tracking-widest uppercase"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          ref={ref}
          className={cn(
            'w-full bg-field border border-border rounded px-3 py-2.5 text-sm text-primary appearance-none',
            'placeholder:text-muted focus:outline-none focus:border-accent transition-colors',
            rightElement && 'pr-10',
            errorMessage && 'border-red-400 focus:border-red-400',
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>
      {errorMessage && <p className="text-xs text-red-400">{errorMessage}</p>}
    </div>
  )
}

export default AuthInput
