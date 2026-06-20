import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'dark' | 'interactive';
  as?: 'div' | 'section' | 'article';
}

export const Card: React.FC<CardProps> = ({
  className = '',
  variant = 'default',
  as: Component = 'div',
  children,
  ...props
}) => {
  const baseStyle = "rounded-2xl border transition-all duration-300 overflow-hidden";
  
  const variants = {
    default: "bg-white dark:bg-brand-blue border-slate-200 dark:border-slate-800/80 shadow-sm",
    glass: "glass-card",
    dark: "glass-panel-dark",
    interactive: "bg-white dark:bg-brand-blue/40 border-slate-200 dark:border-slate-800/60 shadow-sm hover:shadow-md hover:border-brand-orange/40 hover:-translate-y-0.5 cursor-pointer"
  };

  return (
    <Component
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-brand-blue-dark/20 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
