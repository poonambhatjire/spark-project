// src/app/components/ui/badge.tsx
import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'secondary';
}

export function Badge({ 
  children, 
  variant = 'default', 
  className = '',
  ...props 
}: BadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
  
  const variantClasses = {
    default: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    outline: "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300",
    secondary: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
