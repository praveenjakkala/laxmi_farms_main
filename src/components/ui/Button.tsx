import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            primary:
                'bg-primary-600 hover:bg-primary-700 text-white shadow-warm hover:shadow-lg hover:-translate-y-0.5 focus:ring-primary-500',
            secondary:
                'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500',
            ghost:
                'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
            danger:
                'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg focus:ring-red-500',
        };

        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : leftIcon ? (
                    <span className="mr-2">{leftIcon}</span>
                ) : null}
                {children}
                {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
