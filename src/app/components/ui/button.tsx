import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  ref?: React.RefObject<HTMLButtonElement | null>;
}

export function Button({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '',
  ref,
  ...props 
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-ring disabled:opacity-50 disabled:pointer-events-none"
  
  const variantClasses = {
    default: "bg-red-900 text-white hover:bg-red-800",
    outline: "border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700",
    ghost: "text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700"
  }
  
  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8 text-lg"
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  );
}
