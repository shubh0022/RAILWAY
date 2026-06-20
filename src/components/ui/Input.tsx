import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, helperText, error, leftIcon, rightIcon, containerClassName = '', id, required, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const hasError = !!error;
    const hasHelper = !!helperText && !error;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label 
            htmlFor={inputId} 
            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            {label}
            {required && <span className="text-accent-red ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : (hasHelper ? helperId : undefined)}
            className={`
              w-full py-2.5 text-base rounded-xl transition-all duration-200 outline-none
              bg-white dark:bg-brand-blue/30 border
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              text-slate-900 dark:text-slate-100
              ${leftIcon ? 'pl-11' : 'pl-4'}
              ${rightIcon ? 'pr-11' : 'pr-4'}
              ${hasError 
                ? 'border-accent-red ring-2 ring-accent-red/20' 
                : 'border-slate-300 dark:border-slate-800 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20'}
              ${className}
            `}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-4 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p 
            id={errorId} 
            className="text-xs font-medium text-accent-red flex items-center gap-1 mt-0.5"
            role="alert"
          >
            <span aria-hidden="true">⚠️</span> {error}
          </p>
        )}
        
        {!error && helperText && (
          <p 
            id={helperId} 
            className="text-xs text-slate-500 dark:text-slate-400 mt-0.5"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
