import type { InputHTMLAttributes, ReactNode } from 'react'
import cn from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  rightElement?: ReactNode
}

const Input = ({ label, id, className, rightElement, ...props }: InputProps) => {
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
          className={cn(
            'w-full bg-field border border-border rounded px-3 py-2.5 text-sm text-primary appearance-none',
            'placeholder:text-muted focus:outline-none focus:border-accent transition-colors',
            rightElement && 'pr-10',
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
    </div>
  )
}

export default Input
