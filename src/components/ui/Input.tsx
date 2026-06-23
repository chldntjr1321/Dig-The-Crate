import type { InputHTMLAttributes } from 'react'
import cn from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Input = ({ label, id, className, ...props }: InputProps) => {
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
      <input
        id={id}
        className={cn(
          'w-full bg-card border border-border rounded px-3 py-2.5 text-sm text-primary',
          'placeholder:text-muted focus:outline-none focus:border-accent transition-colors',
          className
        )}
        {...props}
      />
    </div>
  )
}

export default Input
