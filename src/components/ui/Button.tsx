import type { ButtonHTMLAttributes, ReactNode } from 'react'
import cn from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'outline'
}

const Button = ({ children, disabled, className, variant = 'primary', ...props }: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={cn(
        'w-full py-2.5 rounded text-sm font-medium transition-colors',
        variant === 'primary' && (
          disabled
            ? 'bg-disabled text-muted cursor-not-allowed'
            : 'bg-accent hover:bg-accent-hover text-primary cursor-pointer'
        ),
        variant === 'outline' && (
          disabled
            ? 'border border-border text-muted cursor-not-allowed'
            : 'border border-border text-secondary hover:border-accent hover:text-primary cursor-pointer'
        ),
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
