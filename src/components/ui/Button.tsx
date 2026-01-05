'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient' | 'theme-primary' | 'theme-secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'default',
      size = 'default',
      isLoading = false,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const { theme, styles } = useTheme();

    const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95';

    const variants = {
      default: 'bg-gray-900 text-white shadow hover:bg-gray-800',
      destructive: 'bg-red-500 text-white shadow-sm hover:bg-red-600',
      outline: 'border border-gray-300 bg-white shadow-sm hover:bg-gray-50',
      secondary: 'bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200',
      ghost: 'hover:bg-gray-100 hover:text-gray-900',
      link: 'text-gray-900 underline-offset-4 hover:underline',
      gradient: 'text-white shadow-lg hover:shadow-xl hover:scale-105',
      'theme-primary': 'text-white shadow-lg hover:shadow-xl',
      'theme-secondary': 'text-white shadow-lg hover:shadow-xl',
    };

    const sizes = {
      default: 'h-10 px-5 py-2.5 text-sm',
      sm: 'h-8 rounded-md px-3.5 text-xs',
      lg: 'h-12 rounded-xl px-7 text-base',
      icon: 'h-10 w-10',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    // Определяем стили в зависимости от variant
    let inlineStyles: React.CSSProperties = {};

    if (variant === 'gradient') {
      inlineStyles = styles.gradientBg;
    } else if (variant === 'theme-primary') {
      inlineStyles = styles.primaryButton;
    } else if (variant === 'theme-secondary') {
      inlineStyles = styles.secondaryButton;
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          widthClass,
          isLoading && 'opacity-70 cursor-not-allowed',
          className
        )}
        style={inlineStyles}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Загрузка...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };